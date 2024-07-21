import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBoxSelect,
  GptMessageAudio,
} from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: "text";
}

interface AudioMessage {
  text: string;
  audio: string;
  isGpt: boolean;
  type: "audio";
}

type Message = TextMessage | AudioMessage;

const displaimer = `## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

export const TextToAudioPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, selectedVoice: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text, isGpt: false, type: "text" },
    ]);

    // TODO: Use case para generar el texto a audio
    const { ok, message, audioUrl } = await textToAudioUseCase(
      text,
      selectedVoice
    );
    // console.log({ ok, message, audioUrl });

    setIsLoading(false);

    if (!ok) return;

    // TODO: Añadir el mensaje de isGpt en true
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: `${selectedVoice} - ${message}`,
        audio: audioUrl!,
        isGpt: true,
        type: "audio",
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Mensaje de bienvenida */}
          <GptMessage text={displaimer} />

          {messages.map((message, index) =>
            message.isGpt ? (
              message.type === "audio" ? (
                // Audio de GPT
                <GptMessageAudio
                  key={index}
                  text={message.text}
                  audio={message.audio}
                />
              ) : (
                // Mensaje de GPT
                <GptMessage key={index} text={message.text} />
              )
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
        options={voices}
      />
    </div>
  );
};
