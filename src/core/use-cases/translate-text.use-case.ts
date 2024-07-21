import { TranslateResponse } from "../../interfaces";

export const translateTextUseCase = async (prompt: string, lang: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/translate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, lang }),
      }
    );

    if (!res.ok) return alert("No se pudo realizar la traducción del texto");

    const {message} = (await res.json()) as TranslateResponse;

    return {
      ok: true,
      message,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: "Ha ocurrido un error al intentar traducir el texto",
    };
  }
};