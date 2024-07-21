import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
} from "../../components";
import { translateTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async(text: string,selectedOption: string) => {
    setIsLoading(true);

    const newMessage = `Traduce: "${text}" al idioma ${selectedOption}`;
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, isGpt: false },
    ]);

    // TODO: Use case para traducir el texto
    const {message,ok} = await translateTextUseCase(text, selectedOption);
    if (!ok) return;

    // TODO: Añadir el mensaje de isGpt en true
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: message,
        isGpt: true,
      },
    ]);

    setIsLoading(false);

  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="¿Qué quieres que traduzca hoy?" />

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

      <TextMessageBoxSelect
        onSendMessage={handlePost}
        placeholder="Escribe aquí lo que deseas"
        options={languages}
        disableCorrections
      />
    </div>
  );
};
