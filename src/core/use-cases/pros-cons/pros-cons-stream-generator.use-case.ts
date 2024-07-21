export async function* prosConsStreamGeneratorUseCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        //* 'signal' es un propiedad que nos sirve para transmitir la cancelacion de la peticion si esta se aborta
        signal: abortSignal,
      }
    );

    if (!res.ok) throw new Error("No se puedo realizar la comparación");

    const reader = res.body?.getReader();
    if (!reader) {
      console.log("No se puedo generar el reader");
      return null;
    }

    const decoder = new TextDecoder();
    const isReading = true;

    let text = "";

    while (isReading) {
      const { done, value } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });

      text += decodedChunk;


      yield text;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
