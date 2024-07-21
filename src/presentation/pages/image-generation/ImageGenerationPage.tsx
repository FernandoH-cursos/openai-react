import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageImage,
} from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para generar la imagen
    const imageInfo = await imageGenerationUseCase(text);
    setIsLoading(false);

    // TODO: Añadir el mensaje de isGpt en true
    if (!imageInfo) {
      return setMessages((prevMessages) => [
        ...prevMessages,
        { text: "No se pudo generar la imagen", isGpt: true },
      ]);
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="¿Qué imagen deseas generar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              // Mensaje de GPT
              <GptMessageImage
                key={index}
                imageUrl={message.info?.imageUrl as string}
                alt={message.info?.alt as string}
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
