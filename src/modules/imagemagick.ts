import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm";
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format";
import { Percentage } from "@imagemagick/magick-wasm/percentage";

export async function initialize() {
  return initializeImageMagick();
}

export async function resize(
  image: Blob,
  width: number,
  height: number
): Promise<Blob> {
  return image.arrayBuffer().then((buffer) => {
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      ImageMagick.read(data, (image) => {
        image.resize(width, height);

        image.write((data) => {
          const blob = new Blob([data], { type: "image/png" });
          resolve(blob);
        }, MagickFormat.Png);
      });
    });
  });
}

export async function blur(image: Blob, a: number, b: number): Promise<Blob> {
  return image.arrayBuffer().then((buffer) => {
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      ImageMagick.read(data, (image) => {
        image.blur(a, b);

        image.write((data) => {
          const blob = new Blob([data], { type: "image/png" });
          resolve(blob);
        }, MagickFormat.Png);
      });
    });
  });
}

export async function sharpen(
  image: Blob,
  a: number,
  b: number
): Promise<Blob> {
  return image.arrayBuffer().then((buffer) => {
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      ImageMagick.read(data, (image) => {
        image.sharpen(a, b);

        image.write((data) => {
          const blob = new Blob([data], { type: "image/png" });
          resolve(blob);
        }, MagickFormat.Png);
      });
    });
  });
}

export async function autoOrient(image: Blob): Promise<Blob> {
  return image.arrayBuffer().then((buffer) => {
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      ImageMagick.read(data, (image) => {
        image.autoOrient();

        image.write((data) => {
          const blob = new Blob([data], { type: "image/png" });
          resolve(blob);
        }, MagickFormat.Png);
      });
    });
  });
}

export async function modulate(
  image: Blob,
  brightness: number,
  saturation: number,
  hue: number
): Promise<Blob> {
  return image.arrayBuffer().then((buffer) => {
    const data = new Uint8Array(buffer);

    return new Promise((resolve, reject) => {
      ImageMagick.read(data, (image) => {
        image.modulate(
          new Percentage(brightness),
          new Percentage(saturation),
          new Percentage(hue)
        );

        image.write((data) => {
          const blob = new Blob([data], { type: "image/png" });
          resolve(blob);
        }, MagickFormat.Png);
      });
    });
  });
}
