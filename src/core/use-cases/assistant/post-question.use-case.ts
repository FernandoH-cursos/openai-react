import { QuestionResponse } from "../../../interfaces";

export const postQuestionUseCase = async (threadId: string,question: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/user-question`,
      {
        method: "POST",
        body: JSON.stringify({ threadId, question }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const replies = (await res.json()) as QuestionResponse[];

    return replies;
  } catch (error) {
    throw new Error("Error creating thread");
  }
};
