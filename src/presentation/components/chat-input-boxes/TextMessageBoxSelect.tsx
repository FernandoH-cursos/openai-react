import { FormEvent, useState } from "react";

interface Props {
  onSendMessage: (message: string,selectedOption: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  options: Option[];
}

interface Option{
  id: string; 
  text: string;
}

export const TextMessageBoxSelect = ({
  onSendMessage,
  placeholder,
  options,
  disableCorrections = false,
}: Props) => {
  // Guarda el mensaje que el usuario está escribiendo
  const [message, setMessage] = useState("");
  // Guarda la opción seleccionada por el usuario
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Enviía el mensaje al padre y limpia el campo de entrada
  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim().length === 0) return;
    if (selectedOption === '') return;

    onSendMessage(message,selectedOption);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
    >
      <div className="flex-grow">
        <div className="flex">
          <input
            type="text"
            autoFocus
            name="message"
            className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? "true" : "false"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <select
            name="select"
            className="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Seleccione</option>
            {options.map(({ id, text }) => (
              <option key={id} value={id}>
                {text}
              </option>
            ))}
          </select>
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
