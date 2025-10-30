import { chain } from "@chatapp/chains";
import {
	START,
	END,
	MessagesAnnotation,
	StateGraph,
	MemorySaver,
} from "@langchain/langgraph/web";
// @langchain/langgraph använder sig av async_hooks vilket uppenbarligen inte kan köras på webbläsare.
// Måste använda @langchain/langgraph/web istället

// Kod för att kunna ha flera konversationer igång samtidigt med olika användare.
// https://js.langchain.com/docs/tutorials/chatbot/#message-persistence

// Flödet är att "aiApp" anropas på hemsidan
// "aiApp" är kompilerad med "StateGraph" via variablen "workflow"
// Den nod som läggs till i "workflow" erhålls från variabeln "callModel"
// "callModel" får sin data från det som skickas in när "aiApp" anropas
// "chain" aropas inuti "callModel" för att få svar från AI om frågan som skickas in

const callModel = async (state, config) => {
	// state.messages är en array med alla tidigare prompts för den här sessionen.
	// Jag måste plocka ut den senaste prompten för att kunna skicka med den till chain.
	console.log(state.messages);

	const chatHistory = state.messages.map((message) => {
		// const key = message.constructor.name;

		const role =
			message.constructor.name === "HumanMessage" ? "user" : "assistant";

		const content = message.content;

		return { role, content };
	});

	console.log(chatHistory);

	const question = state.messages.at(-1).content;
	console.log(question);
	// const messages = [...state.messages]

	// console.log(config.configurable.thread_id);
	const { thread_id } = config.configurable;

	console.log(thread_id);

	const answer = await chain.invoke(
		{ question: question, chat_history: chatHistory }

		/* 		{
			configurable: {
				sessionId: thread_id,
			},
		} */
	);
	console.log(answer);

	return {
		messages: [{ role: "assistant", content: answer }],
	};
};

const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const memory = new MemorySaver();
export const aiApp = workflow.compile({ checkpointer: memory });
