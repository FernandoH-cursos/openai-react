import { useEffect, useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
} from "../../components";
import { createThreadUseCase, postQuestionUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setthreadId] = useState<string>();

  //* Obtener el threadId y si no existe crear uno
  useEffect(() => {
    const threadId = localStorage.getItem("threadId");

    if (threadId) {
      setthreadId(threadId);
    } else {
      //* Use case para crear un thread
      createThreadUseCase().then((id) => {
        setthreadId(id);
        localStorage.setItem("threadId", id);
      });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Número de thread ${threadId}`, isGpt: true },
      ]);
    }
  },[threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    // TODO: Use case para enviar la pregunta y obtener la respuesta del asistente
    const replies = await postQuestionUseCase(threadId, text);

    setIsLoading(false);

    // TODO: Añadir el mensaje de isGpt en true
    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, isGpt: reply.role === "assistant",info: reply },
        ]);
        
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text="Buen día, soy Sam, ¿en qué puedo ayudarte?" />

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
