import { makeRenderer } from "./renderer";
import { h } from "snabbdom";
import type { VNode } from "snabbdom";

type State = {
  files: FileList | null;
};

function App(mountpoint: Element) {
  const state: State = { files: null };

  const render = makeRenderer(mountpoint, view);

  render(state);
}

function view(state: State, rerender: () => void): VNode {
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
      renderOperations(state.files),
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
    output.push(
      h("li", `${file.name} - ${file.type} - ${renderSize(file.size)}`)
    );
  }

  return output;
}

function renderOperations(files: FileList | null): VNode {
  return h("div.box", [h("h2", "Operations")]);
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
