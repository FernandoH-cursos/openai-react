import { useState } from "react";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";

import { prosConsUseCase } from "../../../core/use-cases";


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async(text: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para responder con los pros y contras de un texto
    const {ok,content} = await prosConsUseCase(text);

    // TODO: Añadir el mensaje de isGpt en true si se pudo realizar la comparación
    if (!ok) return;
      
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: content,
        isGpt: true,
      },
    ]);

    setIsLoading(false);

    // console.log({ ok, content });
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="Puedes escribir lo que sea que quieres que compare y te de mis puntos de vista." />

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
