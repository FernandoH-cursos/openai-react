
export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!res.ok) throw new Error("No se pudo realizar la generación de audio");

    //* 'blob' permite convertir la respuesta en un archivo de audio
    const audioFile = await res.blob();
    //* 'createObjectURL' permite crear una URL para el archivo de audio y así poder reproducirlo
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message: "No se pudo realizar la generación de audio",
    };
  }
};
