import {
  MainDOMSource,
  makeDOMDriver,
  h,
  div,
  input,
  h1,
  h2,
  ul,
  li,
  section,
  select,
  option,
  img,
  VNode,
} from "@cycle/dom";
import { run } from "@cycle/run";
import xs from "xstream";
import type { MemoryStream, Stream } from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import dropRepeats from "xstream/extra/dropRepeats";

import { operations } from "./operations";

declare const loadjs: any;

type Sources = {
  DOM: MainDOMSource;
  Operations: OperationSources;
};

type Sinks = {
  DOM: Stream<VNode>;
  Operations: OperationSinks;
};

type State = {
  files: FileList | null;
  operations: OperationState[];
  results: OperationCache;
  draggingFiles: boolean;
};

export type Operation = {
  module: ModuleName;
  name: string;
  type: RegExp;
  args: Argument[];
};

type OperationSinks = Stream<OperationDriverInput>;
type OperationDriverInput = {
  input: File | null;
  operations: OperationState[];
};
type OperationCache = WeakMap<OperationState, OperationResult>;
type OperationResult =
  | { state: "loading" }
  | { state: "initializing" }
  | { state: "ready" }
  | { state: "running" }
  | { state: "complete"; output: Blob; text: string };
type OperationSources = MemoryStream<OperationCache>;

type Option = { label: string; value: any };
type Argument = { name: string } & (
  | { type: "number"; default: number }
  | { type: "option"; values: Option[] }
);
type ArgState = { arg: Argument; value: number };

type OperationState = {
  operation: Operation;
  args: ArgState[];
};

type Module =
  | { state: "loading" }
  | { state: "initializing" }
  | { state: "ready"; exports: any };
type ModuleName = "imagemagick" | "base64" | "hash-wasm";
type ModuleCache = Map<ModuleName, Module>;
type ModuleSinks = Stream<Set<ModuleName>>;
type ModuleSources = Stream<ModuleCache>;

const timesCircleIcon = makeIcon(
  require("@fortawesome/free-solid-svg-icons/faTimesCircle")
);

function makeIcon({ svgPathData }: { svgPathData: string }): VNode {
  return h("svg.icon", { attrs: { viewBox: "0 0 512 512" } }, [
    h("path", { attrs: { d: svgPathData } }),
  ]);
}

function App(sources: Sources): Sinks {
  const state: State = {
    files: null,
    operations: [],
    results: new WeakMap(),
    draggingFiles: false,
  };

  const droppedFiles$ = sources.DOM.select(".file-drop")
    .events("drop")
    .map((event) => {
      event.preventDefault();

      return Array.from(event?.dataTransfer?.items || []).map((item) =>
        item.getAsFile()
      );
    });

  const dragOver$ = sources.DOM.select(".file-drop")
    .events("dragover")
    .map((event) => (state: State): State => {
      event.preventDefault();
      state.draggingFiles = true;
      return state;
    });

  const updateOperationResultCache$ = sources.Operations.map(
    (operationCache) =>
      (state: State): State => {
        state.results = operationCache;

        return state;
      }
  );

  const pickedFiles$ = sources.DOM.select(".file-selection")
    .events("change")
    .map((ev: any) => ev.target.files);

  const setFiles$ = xs
    .merge(pickedFiles$, droppedFiles$)
    .map((files) => (state: State): State => {
      state.files = files;
      state.draggingFiles = false;
      return state;
    });

  const addOperation$ = sources.DOM.select(".select-operation")
    .events("click")
    .map((ev: any) => ev.target.operation)
    .map((operation: Operation) => (state: State): State => {
      const operationState: OperationState = {
        operation,
        args: operation.args.map((arg: Argument): ArgState => {
          if (arg.type === "number") {
            return {
              arg,
              value: arg.default,
            };
          }

          if (arg.type === "option") {
            return {
              arg,
              value: 0,
            };
          }

          throw new Error("Unknown arg type" + arg);
        }),
      };

      state.operations = state.operations.concat(operationState);

      return state;
    });

  const deleteOperation$ = sources.DOM.select(".delete-operation")
    .events("click")
    .map((ev: any) => parseInt(ev.currentTarget.dataset.index, 10) || 0)
    .debug("index")
    .map((index) => (state: State): State => {
      const operations = state.operations.slice();

      operations.splice(index, 1);

      state.operations = operations.map((op, i) =>
        i >= index ? { ...op } : op
      );

      return state;
    });

  const changeOperationArg$ = sources.DOM.select(".arg-input")
    .events("change")
    .map((ev: any) => [
      ev.target.dataset.operationIndex,
      ev.target.dataset.argIndex,
      ev.target.value,
    ])
    .map(([opIndex, argIndex, newValue]) => (state: State): State => {
      opIndex = parseInt(opIndex, 10);

      const operation = state.operations[opIndex];

      if (!operation) {
        console.log("bad operation index");
        return state;
      }

      const arg = operation.args[argIndex];

      if (!arg) {
        console.log("bad arg index");
        return state;
      }

      newValue = parseInt(newValue, 10);

      if (typeof newValue !== "number" || Number.isNaN(newValue)) {
        if (arg.arg.type === "number") {
          newValue = arg.arg.default;
        } else {
          newValue = 0;
        }
      }

      state.operations = state.operations.map((op, index) => {
        if (index === opIndex) {
          return {
            ...op,
            args: op.args.map((a) =>
              a === arg ? { ...a, value: newValue } : a
            ),
          };
        }

        if (index > opIndex) {
          return { ...op }; // new object, new calculation
        }

        return op;
      });

      return state;
    });

  const update$: Stream<(s: State) => State> = xs.merge(
    setFiles$,
    addOperation$,
    updateOperationResultCache$,
    changeOperationArg$,
    deleteOperation$,
    dragOver$
  );

  const state$ = update$.fold((s, r) => r(s), state);
  const operations$: OperationSinks = state$.map((state) => ({
    input: (state.files || [])[0] as File | null,
    operations: state.operations,
  }));

  return {
    DOM: state$.map(view),
    Operations: operations$.compose(
      dropRepeats(
        (a, b) => a.input === b.input && JSON.stringify(a) === JSON.stringify(b)
      )
    ),
  };
}

function view(state: State): VNode {
  const moduleCache = new Map<string, any>();

  return h("main", [
    h1("File Alchemist"),
    h("section.content", [
      div(".box.file-drop", [
        h2("Input"),
        div(".box-content", [
          div(".left", [
            div(".instructions", state.draggingFiles ? "Drop that shit" : "Drag and drop a file here"),
            // input(".file-selection", {
            //   attrs: { type: "file", multiple: false },
            // }),
            ...renderFiles(state.files),
          ]),
          div(".right", renderPreviews(state.files)),
        ]),
      ]),
      ...state.operations.map((op, index) =>
        renderOperationState(op, index, state.results)
      ),
      renderOperations(state.files),
    ]),
  ]);
}

function renderFiles(files: FileList | null): VNode[] {
  if (!files) {
    return [];
  }

  return [
    div(
      ".file-names",
      Array.from(files).map((file) =>
        div(".file", [
          div(".filename", file.name),
          div(".file-details", `${file.type} (${renderSize(file.size)})`),
        ])
      )
    ),
  ];
}

function renderPreviews(files: FileList | null): VNode[] {
  if (!files) {
    return [];
  }

  return [
    div(
      ".images",
      Array.from(files).map((file) =>
        img({
          attrs: { decoding: "async" },
          props: { src: URL.createObjectURL(file) },
        })
      )
    ),
  ];
}

function renderOperations(files: FileList | null): VNode {
  function renderOperation(operation: Operation, index: number): VNode {
    // TODO - this is heinous
    return li(".select-operation", { props: { operation } }, operation.name);
  }

  return div(".box", [
    h2("Add Operation"),
    h("ul", operations.map(renderOperation)),
  ]);
}

function renderOperationState(
  operationState: OperationState,
  index: number,
  results: OperationCache
): VNode {
  const operation = operationState.operation;

  if (!operation) {
    return h("div");
  }

  let preview = h("div");

  const operationResult = results.get(operationState) || { state: "loading" };

  if (operationResult.state === "complete") {
    const objectURL = URL.createObjectURL(operationResult.output);

    const type = operationResult.output.type;

    if (type.startsWith("text/") || type.endsWith(";base64")) {
      preview = h("pre.base64", operationResult.text);
    } else if (
      type.startsWith("image/") &&
      !type.startsWith("image/vnd.adobe.photoshop")
    ) {
      preview = h("img", {
        attrs: { decoding: "async" },
        props: { src: objectURL },
      });
    } else {
      preview = h(
        "a.download-link",
        {
          attrs: { href: objectURL },
        },
        "Download"
      );
    }
  }

  function renderArgument(argState: ArgState, argIndex: number): VNode {
    const argument = argState.arg;

    let inputEl = div();

    if (argument.type === "number") {
      inputEl = input(".arg-input", {
        dataset: {
          argIndex: argIndex.toString(),
          operationIndex: index.toString(),
        },
        attrs: { type: "number", value: argState.value },
        props: { value: argState.value },
      });
    }

    if (argument.type === "option") {
      inputEl = select(
        ".arg-input",
        {
          dataset: {
            argIndex: argIndex.toString(),
            operationIndex: index.toString(),
          },
          attrs: { type: "number", value: argState.value },
          props: { value: argState.value },
        },
        argument.values.map((value, index) =>
          option({ attrs: { value: index.toString() } }, value.label)
        )
      );
    }

    return div(".argument", [div(".label", argument.name), inputEl]);
  }

  let state = operationResult.state || "unknown";

  if (operationResult.state === "complete") {
    state += ` (${renderSize(operationResult.output.size)})`;
  }

  const boxContent = [];

  if (operationState.args.length > 0) {
    boxContent.push(div(".left", [...operationState.args.map(renderArgument)]));
  }

  boxContent.push(div(".right", [preview]));

  return div(".box", [
    div(
      ".module-name",
      { class: { complete: operationResult.state === "complete" } },
      [
        div(".module-state", state),
        div(".delete-operation", { dataset: { index: index.toString() } }, [
          timesCircleIcon,
        ]),
      ]
    ),
    h2(operation.name),
    div(".box-content", boxContent),
  ]);
}

function renderSize(size: number) {
  const sizeInKB = size / 1024;

  if (sizeInKB < 1024) {
    return `${Math.ceil(sizeInKB)} kB`;
  }

  const sizeInMB = sizeInKB / 1024;

  if (sizeInMB < 1024) {
    return `${Math.ceil(sizeInMB)} MB`;
  }
}

function modulesDriver(requiredModules$: ModuleSinks): ModuleSources {
  return xs.createWithMemory({
    start(listener) {
      const moduleCache = new Map();
      listener.next(moduleCache);

      function updateCache(name: ModuleName, value: Module) {
        moduleCache.set(name, value);

        listener.next(moduleCache);
      }

      requiredModules$.addListener({
        next(requiredModules) {
          for (const moduleName of requiredModules) {
            if (!moduleCache.has(moduleName)) {
              updateCache(moduleName, { state: "loading" });

              loadjs([`./build/modules/${moduleName}.js`], (mod: any) => {
                updateCache(moduleName, { state: "initializing" });

                mod.initialize().then(() => {
                  updateCache(moduleName, { state: "ready", exports: mod });
                });
              });
            }
          }
        },
        error(err: Error) {
          console.log(err);
        },
        complete() {},
      });
    },

    stop() {},
  });
}

// takes a stream of operation states
// and should probably take the source blobs as well
//
// this driver is going to do our heavy lifting
//
// load the modules
//
// once a module is loaded, initialize it
// whenever a module changes state, we should probably cascade through the calcs
type NullSingleton = {};
const NULL_SINGLETON: NullSingleton = {};

function operationsDriver(operations$: OperationSinks): OperationSources {
  return xs.createWithMemory({
    start(listener) {
      const moduleCache$ = modulesDriver(
        operations$.map(
          ({ operations }) =>
            new Set(operations.map((opState) => opState.operation.module))
        )
      ).remember();

      const operationResultCaches = new WeakMap<
        File | NullSingleton,
        OperationCache
      >();

      operationResultCaches.set(NULL_SINGLETON, new WeakMap());

      function getOperationResult(
        input: File | null,
        key: OperationState
      ): OperationResult {
        const upperCacheKey = input || NULL_SINGLETON;

        let operationResultCache = operationResultCaches.get(upperCacheKey);

        if (!operationResultCache) {
          return { state: "loading" };
        }

        return operationResultCache.get(key) || { state: "loading" };
      }

      function updateCache(
        input: File | null,
        name: OperationState,
        value: OperationResult
      ) {
        const upperCacheKey = input || NULL_SINGLETON;

        let operationResultCache = operationResultCaches.get(upperCacheKey);

        if (!operationResultCache) {
          operationResultCache = new WeakMap<OperationState, OperationResult>();

          operationResultCaches.set(upperCacheKey, operationResultCache);
        }

        operationResultCache.set(name, value);

        listener.next(operationResultCache);
      }

      function process([{ input, operations }, moduleCache]: [
        OperationDriverInput,
        ModuleCache
      ]) {
        console.log("process", input);
        let previousResult = input as Blob | null;

        for (const operationState of operations) {
          const moduleName = operationState.operation.module;

          const module = moduleCache.get(moduleName);

          if (!module) {
            updateCache(input, operationState, { state: "loading" });
            previousResult = null;
            continue;
          }

          if (module.state === "loading" || module.state === "initializing") {
            updateCache(input, operationState, { state: module.state });
            previousResult = null;
            continue;
          }

          const exports = module.exports;
          const currentResult = getOperationResult(input, operationState);

          if (
            currentResult.state === "loading" ||
            currentResult.state === "initializing"
          ) {
            updateCache(input, operationState, { state: "ready" });
          }

          const result = getOperationResult(input, operationState);

          if (result.state === "ready" && previousResult) {
            updateCache(input, operationState, { state: "running" });

            module.exports[operationState.operation.name](
              previousResult,
              ...operationState.args.map((arg) => {
                if (arg.arg.type === "number") {
                  return arg.value;
                }

                if (arg.arg.type === "option") {
                  return arg.arg.values[arg.value].value;
                }
              })
            ).then((output: Blob) => {
              output.text().then((text) => {
                updateCache(input, operationState, {
                  state: "complete",
                  output,
                  text,
                });
                process([{ input, operations }, moduleCache]);
              });
            });
          }

          if (result.state === "complete") {
            previousResult = result.output;
          } else {
            previousResult = null;
          }
        }
      }

      xs.combine(operations$, moduleCache$).addListener({
        next: process,
        error(err: Error) {
          console.error(err);
        },
        complete() {},
      });
    },

    stop() {},
  });
}

const drivers = {
  DOM: makeDOMDriver(document.body),
  Operations: operationsDriver,
};

run(App, drivers);
