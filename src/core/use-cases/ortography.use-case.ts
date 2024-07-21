import { OrthographyResponse } from "../../interfaces";

export const ortographyUseCase = async(prompt: string) => { 
  try {
    const res = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error('No se pudo realizar la corrección ortográfica');
    
    const data = (await res.json()) as OrthographyResponse;
    
    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    return {
      ok: false,
      userScore: 0,
      errors: [] as string[],
      message: "No se pudo realizar la corrección ortográfica",
    };
  }
}