
export const prosConsUseCase = async (prompt: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_GPT_API}/pros-cons-discusser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!res.ok) throw new Error("No se puedo realizar la comparación");

    const {id} = (await res.json()) as {id: string};

    return id;
  } catch (error) {
    return {
      ok: false,
      content: "No se puedo realizar la comparación",
    };
  }
};
