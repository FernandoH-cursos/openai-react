export const createThreadUseCase = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/create-thread`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const {id} = await res.json() as {id: string};
    // console.log(data);

    return id;
  } catch (error) {
    throw new Error("Error creating thread");
  }
}