import { useState } from "react";
import { chain } from "@chatapp/chains";

export const useChatLogic = () => {
	const [messages, setMessages] = useState([]);
	const [isAiThinking, setIsAiThinking] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);
		const formJson = Object.fromEntries(formData.entries());
		if (!formJson) return;

		const question = formJson.question;

		setIsAiThinking(true);
		setMessages((prev) => [...prev, { text: question, role: "user" }]);

		// ----- Anropar AI -----
		const answer = await chain.invoke({ question });

		setMessages((prev) => [
			...prev,
			{
				role: "assistant",
				text: answer || "Det blev något fel. Försök igen senare.",
			},
		]);
		setIsAiThinking(false);
	};

	return { handleSubmit, isAiThinking, messages };
};
