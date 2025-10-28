import { useState } from "react";
import { chain } from "@chatapp/chains";
import { aiApp } from "@chatapp/msg-persistence";
import { threadConfig } from "@chatapp/config";

export const useChatLogic = () => {
	const [messages, setMessages] = useState([]);
	const [isAiThinking, setIsAiThinking] = useState(false);

	// ----- Hanterar submit från formuläret -----
	const handleSubmit = async (event) => {
		event.preventDefault();

		// ----- Hanterar datan från formuläret -----
		const formData = new FormData(event.target);
		const formJson = Object.fromEntries(formData.entries());

		// Erhållet från W3School. Resettar mitt formulär baserat på ID
		document.getElementById("chatForm").reset();
		if (!formJson) return;

		const question = formJson.question;

		setIsAiThinking(true);
		setMessages((prev) => [...prev, { text: question, role: "user" }]);

		// console.log(question);

		// ----- Anropar AI -----
		// const answer = await chain.invoke({ question });
		// Ska typ byta chain.invoke mot app.invoke
		const answer = await aiApp.invoke({ messages: question }, threadConfig);

		console.log(answer);

		setMessages((prev) => [
			...prev,
			{
				role: "assistant",
				text: answer?.response || "Det blev något fel. Försök igen senare.",
			},
		]);
		setIsAiThinking(false);
	};

	return { handleSubmit, isAiThinking, messages };
};
