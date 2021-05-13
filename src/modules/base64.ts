export async function initialize() {}

export async function base64Encode(data: Blob): Promise<Blob> {
  const reader = new FileReader();
  reader.readAsDataURL(data);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      const result = reader.result as string;

      const blob = new Blob([result.split(",")[1]], {
        type: data.type + ";base64",
      });

      resolve(blob);
    };
  });
}
