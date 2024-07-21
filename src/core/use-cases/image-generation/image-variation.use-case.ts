type GeneratedImage = Image | null;

interface Image {
  url: string;
  alt: string;
}

export const imageVariationUseCase = async (
  originalImage: string
): Promise<GeneratedImage> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/image-variation`, {
      method: "POST",
      body: JSON.stringify({ baseImage: originalImage }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { url, revisedPrompt: alt } = await res.json();
    // console.log({ url, alt });

    return { url, alt };
  } catch (error) {
    console.log(error);
    return null;
  }
};
