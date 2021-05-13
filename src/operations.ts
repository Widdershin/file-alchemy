import type { Operation } from "./app";

export const operations: Operation[] = [
  {
    module: "imagemagick",
    name: "resize",
    type: /image\/.*/,
    args: [
      { name: "Width", type: "number", default: 512 },
      { name: "Height", type: "number", default: 512 },
    ],
  },
  {
    module: "imagemagick",
    name: "blur",
    type: /image\/.*/,
    args: [
      { name: "Radius", type: "number", default: 1 },
      { name: "Sigma", type: "number", default: 5 },
    ],
  },
  {
    module: "imagemagick",
    name: "sharpen",
    type: /image\/.*/,
    args: [
      { name: "Radius", type: "number", default: 1 },
      { name: "Sigma", type: "number", default: 5 },
    ],
  },
  {
    module: "imagemagick",
    name: "autoOrient",
    type: /image\/.*/,
    args: [],
  },
  {
    module: "imagemagick",
    name: "modulate",
    type: /image\/.*/,
    args: [
      { name: "Brightness", type: "number", default: 100 },
      { name: "Saturation", type: "number", default: 100 },
      { name: "Hue", type: "number", default: 100 },
    ],
  },
  {
    module: "base64",
    name: "base64Encode",
    type: /.*/,
    args: [],
  },
  {
    module: "hash-wasm",
    name: "md5",
    type: /.*/,
    args: [],
  },
  {
    module: "hash-wasm",
    name: "sha1",
    type: /.*/,
    args: [],
  },
  {
    module: "hash-wasm",
    name: "sha256",
    type: /.*/,
    args: [],
  },
];
