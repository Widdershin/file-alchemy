import { initializeImageMagick, ImageMagick } from "@imagemagick/magick-wasm";
import { MagickFormat } from "@imagemagick/magick-wasm/magick-format";

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
