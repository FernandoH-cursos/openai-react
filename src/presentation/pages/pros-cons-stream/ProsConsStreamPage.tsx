import { useRef, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";

import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  //* 'abortController' permite abortar una solicitud fetch en caso de que el componente sea desmontado antes 
  //* de que la solicitud se complete.
  const abortController = useRef(new AbortController());
  //*  'isRunning' permite saber si una solicitud esta en curso o no
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      //* Abortar la solicitud anterior si existe una
      abortController.current.abort();

      //* Crear un nuevo AbortController() para la nueva solicitud ya que el anterior fue abortado 
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para responder con los pros y contras de un texto con stream
    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);

    //* Establecer el mensaje de GPT como un mensaje vacío
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "",
        isGpt: true,
      },
    ]);

    //* Leer los mensajes del servidor en tiempo real
    for await (const text of stream) {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1].text = text;

        return newMessages;
      });
    }

    isRunning.current = false;
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              // Mensaje de GPT
              <GptMessage key={index} text={message.text} />
            ) : (
              // Mensaje del usuario
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>
      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        disableCorrections
      />
    </div>
  );
};
