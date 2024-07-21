import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageSelectableImage,
} from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: "Imagen base",
      info: {
        alt: "Imagen base",
        imageUrl:
          "http://localhost:3000/gpt/image-generation/1720630998743.png",
      },
    },
  ]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  //* Función para generar una variación de la imagen original 
  const handleVariation = async() => {
    setIsLoading(true);

    // TODO: Use case para generar variacion de la imagen original
    const res = await imageVariationUseCase(
      originalImageAndMask.original as string
    );
    setIsLoading(false); 
    
    if (!res) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: "Variación",
        isGpt: true,
        info: {
          imageUrl: res.url,
          alt: res.alt,
        },
      },
    ]);
  }

  const handlePost = async (text: string) => {
    setIsLoading(true);

    setMessages((prevMessages) => [...prevMessages, { text, isGpt: false }]);

    const {original, mask} = originalImageAndMask

    // TODO: Use case para generar la imagen
    const imageInfo = await imageGenerationUseCase(text,original,mask);
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
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={originalImageAndMask.original ?? originalImageAndMask.mask}
            alt="Imagen Original"
          />
          <button onClick={handleVariation} className="btn-primary mt-2">
            Generar variación
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/* Mensaje de bienvenida */}
            <GptMessage text="¿Qué imagen deseas generar hoy?" />

            {messages.map((message, index) =>
              message.isGpt ? (
                // Mensaje de GPT
                // <GptMessageImage
                <GptMessageSelectableImage
                  key={index}
                  text={message.text}
                  imageUrl={message.info?.imageUrl as string}
                  alt={message.info?.alt as string}
                  onImageSelected={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      original: message.info?.imageUrl as string,
                      mask: maskImageUrl,
                    })
                  }
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
    </>
  );
};
