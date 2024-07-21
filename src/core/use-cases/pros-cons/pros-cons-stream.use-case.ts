
export const prosConsStreamUseCase = async(prompt: string) => { 
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        // TODO: abortSignal
      }
    );

    if (!res.ok) throw new Error('No se puedo realizar la comparación');
    
    //* Este 'reader' es para leer el stream de la respuesta del servidor, deberás usarlo para leer los mensajes que te envía el servidor
    //* y mostrarlos en el chat. Devuelve un ReadableStreamDefaultReader que puedes usar para leer los mensajes del servidor. Si no 
    //* puedes generar el reader, devuelve null. 
    const reader = res.body?.getReader();
    if (!reader) {
      console.log("No se puedo generar el reader");
      return null;
    }

    return reader;
    /* 
    //* Este decoder es para decodificar los mensajes que te envía el servidor. Deberás usarlo para decodificar los mensajes que te 
    //* envía el servidor. 
    const decoder = new TextDecoder();
    console.log(reader);
    //* Sirve como flag para saber si se está leyendo o no el stream. 
    const isReading = true;

    //* Este text es para almacenar los mensajes que te envía el servidor. Deberás usarlo para almacenar 
    //* los mensajes que te envía el servidor.
    let text = "";

    //* Este while es para leer los mensajes que te envía el servidor. Deberás usarlo para leer los mensajes que te envía el servidor.
    while (isReading) {
      //* 'reader.read()' es para leer un mensaje del servidor. Deberás usarlo para leer un mensaje del servidor.
      //* 'done' es para saber si ya terminó de leer los mensajes del servidor y 'value' es el mensaje que te envía el servidor.
      const { done, value } = await reader.read();
      if (done) break;

      //* 'decoder.decode()' es para decodificar el mensaje que te envía el servidor. Se le especifica el mensaje y
      //* un objeto con la propiedad 'stream' en true.
      const decodedChunk = decoder.decode(value, { stream: true });
      
      text += decodedChunk;

      console.log(text);
    } 
    */
    
    
  } catch (error) {
    console.log(error);
    return null;
  }
}