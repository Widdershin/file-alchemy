import { makeRenderer } from "./renderer";
import { h } from "snabbdom";
import type { VNode } from "snabbdom";

declare const loadjs: any;

type State = {
  files: FileList | null;
  operations: OperationState[];
};

type Operation = {
  module: "imagemagick";
  name: string;
  type: RegExp;
  args: Argument[];
};

type Argument = { name: string } & { type: "number"; default: number };
type ArgState = { arg: Argument; value: number };

type OperationState = {
  operation: Operation;
  args: ArgState[];
} & (
  | { state: "loading" | "initializing" | "ready" | "running"; output: null }
  | { state: "complete"; output: Blob }
);

function App(mountpoint: Element) {
  const state: State = {
    files: null,
    operations: [],
  };

  const render = makeRenderer(mountpoint, view);

  render(state);
}

const operations: Operation[] = [
  {
    module: "imagemagick",
    name: "resize",
    type: /image\/.*/,
    args: [
      { name: "width", type: "number", default: 512 },
      { name: "height", type: "number", default: 512 },
    ],
  },
];

function view(state: State, rerender: () => void): VNode {
  const moduleCache = new Map<string, any>();

  function runOperation(mod: any, operationState: OperationState) {
    const file = (state.files || [])[0];

    if (!file) {
      return;
    }

    mod[operationState.operation.name](
      file,
      ...operationState.args.map((arg) => arg.value)
    ).then((ab: Blob) => {
      operationState.state = "complete";
      operationState.output = ab;
      rerender();
    });

    rerender();
  }

  function selectOperation(operation: Operation) {
    const operationState: OperationState = {
      operation,
      state: "loading",
      output: null,
      args: operation.args.map((arg) => ({
        arg,
        value: arg.default,
      })),
    };

    state.operations.push(operationState);

    if (moduleCache.has(operation.module)) {
      operationState.state = "ready";
      runOperation(moduleCache.get(operation.module), operationState);
    } else {
      loadjs([`./build/modules/${operation.module}.js`], (mod: any) => {
        moduleCache.set(operation.module, mod);

        operationState.state = "initializing";
        rerender();

        mod.initialize().then(() => {
          operationState.state = "ready";
          runOperation(mod, operationState);
          rerender();
        });
      });
    }

    rerender();
  }

  return h("body", [
    h("h1", "File Alchemy"),
    h("section.content", [
      h("div.box", [
        h("h2", "Input"),
        h("input", {
          attrs: { type: "file", multiple: true },
          on: {
            change: function (ev: any) {
              state.files = ev.target.files;
              rerender();
            },
          },
        }),
        h("ul", renderFiles(state.files)),
      ]),
      ...state.operations.map((op) => renderOperationState(op)),
      renderOperations(state.files, selectOperation),
    ]),
  ]);
}

function renderFiles(files: FileList | null): VNode[] {
  if (!files) {
    return [];
  }

  const output: VNode[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const objectURL = URL.createObjectURL(file);

    const image = h("img", { props: { src: objectURL } });

    output.push(
      h("li", [`${file.name} - ${file.type} - ${renderSize(file.size)}`, image])
    );
  }

  return output;
}

function renderOperations(
  files: FileList | null,
  selectOperation: (o: Operation) => void
): VNode {
  function renderOperation(operation: Operation): VNode {
    return h(
      "li",
      { on: { click: () => selectOperation(operation) } },
      operation.name
    );
  }

  return h("div.box", [
    h("h2", "Add Operation"),
    h("ul", operations.map(renderOperation)),
  ]);
}

function renderOperationState(operationState: OperationState): VNode {
  const operation = operationState.operation;

  if (!operation) {
    return h("div");
  }

  let image = h("div");

  if (operationState.output) {
    const objectURL = URL.createObjectURL(operationState.output);

    image = h("img", { props: { src: objectURL } });
  }

  function renderArgument(argState: ArgState, index: number): VNode {
    const argument = argState.arg;
    const updateArgValue = (ev: any) => {
      argState.value = parseInt(ev.target.value, 10) || argState.value;
    };

    return h("div.argument", [
      h("div.label", argument.name),
      h("input", {
        on: { change: updateArgValue },
        props: { value: argState.value },
      }),
    ]);
  }

  return h("div.box", [
    h("h2", operation.name),
    h("p", operationState.state),
    ...operationState.args.map(renderArgument),
    image,
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

App(document.body);
