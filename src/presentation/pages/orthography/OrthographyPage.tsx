import { useState } from "react";
import {
  GptMessage,
  GptOrtographyMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";

import { ortographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para enviar el texto a OpenAI
    const { ok, errors, message, userScore } = await ortographyUseCase(text);

    // TODO: Añadir el mensaje de isGpt en true
    if (!ok) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "No se puedo realizar la correción", isGpt: true },
      ]);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: message,
          isGpt: true,
          info: { errors, message, userScore },
        },
      ]);
    }


    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo con las correcciones" />

          {messages.map((message, index) =>
            message.isGpt ? (
              // Mensaje de GPT
              <GptOrtographyMessage
                key={index}
                errors={message.info!.errors}
                message={message.info!.message}
                userScore={message.info!.userScore}
              />
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
