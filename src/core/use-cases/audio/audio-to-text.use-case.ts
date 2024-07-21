import { AudioToTextResponse } from "../../../interfaces";

export const audioToTextUseCase = async (audioFile: File, prompt?: string) => {
  console.log({ audioFile, prompt });
  try {
    //* Crear un FormData para enviar el archivo de audio y el prompt al servidor de GPT para convertirlo a texto
    const formData = new FormData();
    formData.append("file", audioFile);
    if (prompt) {
      formData.append("prompt", prompt);
    }

    const response = await fetch(
      `${import.meta.env.VITE_GPT_API}/audio-to-text`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = (await response.json()) as AudioToTextResponse;
    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);

    return null;
  }
};
