import * as hash from "hash-wasm";

export async function initialize() {}

export async function md5(data: Blob): Promise<Blob> {
  const arrayBuffer = await data.arrayBuffer();
  const signature = await hash.md5(new Uint8Array(arrayBuffer));

  const blob = new Blob([signature], { type: "text/plain" });

  return blob;
}

export async function sha1(data: Blob): Promise<Blob> {
  const arrayBuffer = await data.arrayBuffer();
  const signature = await hash.sha1(new Uint8Array(arrayBuffer));

  const blob = new Blob([signature], { type: "text/plain" });

  return blob;
}

export async function sha256(data: Blob): Promise<Blob> {
  const arrayBuffer = await data.arrayBuffer();
  const signature = await hash.sha256(new Uint8Array(arrayBuffer));

  const blob = new Blob([signature], { type: "text/plain" });

  return blob;
}
