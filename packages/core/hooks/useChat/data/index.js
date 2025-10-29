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
		const response = await aiApp.invoke(
			{ messages: [{ role: "user", content: question }] },
			threadConfig
		);

		// Returneras ett objekt med nyckeln messages
		// messages innehåller en array av objekt, då både med de prompts som skickats in samt de svar AI ger tillbaka.
		// Delas upp mellan HumanMessage och AIMessage. AIMessage är sist.
		console.log(response);
		const aiAnswer = response.messages[response.messages.length - 1];

		setMessages((prev) => [
			...prev,
			{
				role: "assistant",
				text: aiAnswer.content || "Det blev något fel. Försök igen senare.",
			},
		]);
		setIsAiThinking(false);
	};

	return { handleSubmit, isAiThinking, messages };
};
