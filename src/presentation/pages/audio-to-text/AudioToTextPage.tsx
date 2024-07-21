import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxFile,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

function getGptMessage(duration: number, text: string){
  return `
## El texto es:
__Duración:__ ${Math.round(duration)} segundos
## El texto es:
${text}
`;
}

function getSegmentMessage(start: number, end: number, text: string){
  return `
__De ${Math.round(start)} a ${Math.round(end)} segundos:__
${text}
`;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async(text: string,audioFile: File) => {
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para convertir audio a texto
    const response = await audioToTextUseCase(audioFile, text);
    if (!response) return;

    setIsLoading(false);

    // TODO: Añadir el mensaje de isGpt en true
    const gptMessage = getGptMessage(response.duration, response.text);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: gptMessage, isGpt: true },
    ]);

    for (const segment of response.segments) {
      const segmentMessage = getSegmentMessage(segment.start, segment.end, segment.text);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: segmentMessage, isGpt: true },
      ]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="Hola, ¿Qué audio quieres generar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              // Mensaje de GPT
              <GptMessage key={index} text={message.text} />
            ) : (
              // Mensaje del usuario
              <MyMessage key={index} text={message.text === '' ? "Transcribe el audio": message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        accept="audio/*"
        disableCorrections
      />
    </div>
  );
};
