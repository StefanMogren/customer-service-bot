import "./index.css";
import { Message } from "@chatapp/message";
import { FetchMenu } from "@chatapp/fetch-menu";
import { getMenuTool } from "@chatapp/get-menu-tool";
import { llm, llmWithTools } from "@chatapp/llm";

import { useState } from "react";
import { ChatOllama } from "@langchain/ollama";
import { BufferMemory } from "langchain/memory";
import { MessagesPlaceholder } from "@langchain/core/prompts";

import { RunnableSequence } from "@langchain/core/runnables";

import { retrieveDocuments } from "@chatapp/retriever";

// Frågade ChatGPT angående hur man inkluderar egna instruktioner för ens AI. Den föreslog då att använda nedanstående tre PromptTemplates.
import {
	PromptTemplate,
	ChatPromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

import { ConversationChain } from "langchain/chains";

// BufferMemory är den som håller koll på vad som är memoryKey och inputKey
/* const memory = new BufferMemory({
	memoryKey: "chat_history",
	returnMessages: true,
	inputKey: "question",
});
 */
// ChatGPT's förslag för hur man inkluderar instruktioner för ens AI.
// Man delar upp promptarna mellan hur AI:n ska agera och vad användaren säger.

/* const classifyPrompt = PromptTemplate.fromTemplate(
	`Klassifiera följande fråga i en av kategorierna:
		- information om kaffemenyn
		- beställning av kaffe och/eller bakelser
		- varken om kaffemenyn, kaffe eller bakelser
		
		Fråga: {question}
		Kategori:`
);
 */
const answerTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		`Du är en chatbot på en webbsida till företaget TechNova. Du svarar på frågor som användare har angående företaget samt om leveranspolicys.`
	),
	// new MessagesPlaceholder("chat_history"),
	HumanMessagePromptTemplate.fromTemplate("{question}"),
]);

/* const convoChain = new ConversationChain({
	llm: llm,
	prompt: answerChatPrompt,
	memory,
});
 */
export const Chat = () => {
	const [messages, setMessages] = useState([]);
	const [isAiThinking, setIsAiThinking] = useState(false);

	/* 	const getChatHistory = async () => {
		const historyMessages = await memory.chatHistory.getMessages();
		console.log(historyMessages);

		return historyMessages.map((message) => {
			return {
				text: message.content,
				role: message.getType() === "human" ? "user" : "assistant",
			};
		});
	}; */

	/* 	const combineDocuments = (docs) => {
		return docs.map((doc) => doc.pageContent).join("\n\n");
	}; */

	const handleSubmit = async (event) => {
		event.preventDefault();
		// Skapar ett objekt med "name" som nyckelnamnet för respektive input och innehållet som värde
		const formData = new FormData(event.target);
		const formJson = Object.fromEntries(formData.entries());
		formJson.role = "user";
		console.log(formJson);
		const question = formJson.text;

		setMessages((prevState) => {
			return [...prevState, { role: "user", text: question }];
		});

		// const result = await llmWithTools.invoke("question");

		// console.log(result);

		// ----- Här börjar anropet till AI -----
		const chain = RunnableSequence.from([
			async (question) => {
				const context = await retrieveDocuments.invoke(question);
				console.log(combineDocuments(context));

				return { context: combineDocuments(context), question };
			},

			async ({ context, question }) => {
				return await llm.invoke(
					await answerTemplate.format({ context, question })
				);
			},
		]);

		setIsAiThinking(true);
		// const answer = await chatBot.invoke(question);
		const answer = await chain.invoke(question);
		console.log(answer);

		setMessages((prevState) => {
			return [...prevState, { role: "assistant", text: answer.content }];
		});
		setIsAiThinking(false);
		// console.log(answer);

		// const chatHistory = await getChatHistory();
		// console.log(chatHistory);
		// setMessages(chatHistory);
	};

	const messageComponents = messages.map((message, index) => {
		return <Message text={message.text} role={message.role} key={index} />;
	});

	return (
		<section className='chat'>
			<section className='chat__messages'>
				{messageComponents}

				{/* Tre punkter som är animerade att röra sig som en våg under tiden som AI:n tänker */}
				{isAiThinking && (
					<p className='chat__thinking-animation'>
						<span>.</span>
						<span>.</span>
						<span>.</span>
					</p>
				)}
			</section>
			<form className='chat__form' action='post' onSubmit={handleSubmit}>
				<label className='chat__label' htmlFor='textId'>
					Wayward Ratonga story bot
				</label>
				<section className='chat__input-container'>
					{/* Textinput */}
					<input className='chat__input' type='text' name='text' id='textId' />
					<button className='chat__btn'>Skicka</button>
				</section>
			</form>
		</section>
	);
};
