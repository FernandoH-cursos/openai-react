import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
}

//* 'autoFocus' permite que el campo de entrada obtenga automáticamente el foco cuando se carga la página. 
//* 'autoComplete' permite que el navegador complete automáticamente el valor del campo de entrada.
//* 'autoCorrect' permite que el navegador corrija automáticamente el valor del campo de entrada.
//* 'spellCheck' permite que el navegador verifique automáticamente la ortografía del valor del campo de entrada. 
export const TextMessageBox = ({
  onSendMessage,
  placeholder,
  disableCorrections = false,
}: Props) => {
  // Guarda el mensaje que el usuario está escribiendo 
  const [message, setMessage] = useState("");

  // Enviía el mensaje al padre y limpia el campo de entrada 
  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;

    onSendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            autoFocus
            name="message"
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder} 
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? "true" : "false"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="ml-4">
        <button className="btn-primary">
          <span className="mr-2">Enviar</span>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>
    </form>
  );
};
