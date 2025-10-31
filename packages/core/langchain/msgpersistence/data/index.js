import { chain } from "@chatapp/chains";
import {
	START,
	END,
	MessagesAnnotation,
	StateGraph,
	MemorySaver,
} from "@langchain/langgraph/web";

// Kodflödet är aiApp anropas, workflow/StateGraph går igång, callModel körs och chain/AI anropas inuti callModel

const callModel = async (state, config) => {
	const { thread_id } = config.configurable;
	console.log(`thread_id: ${thread_id}`);

	console.log(state.messages);

	// Chatthistoriken kommer från StateGraph via "state"
	// Den historik som hämtas beror på thread_id som skickas in när "aiApp.invoke" körs
	const chatHistory = state.messages.map((message) => {
		// Behöver "skala bort" all metadata från historiken så enbart "role" och "content" blir kvar
		const role =
			message.constructor.name === "HumanMessage" ? "user" : "assistant";

		const content = message.content;

		return { role, content };
	});

	// Hämtar frågan som skickas in när "aiApp.invoke" körs
	const question = state.messages.at(-1).content;

	chatHistory.pop();

	// ----- Anropar AI ----
	// Skickar med frågan och chatthistoriken
	const answer = await chain.invoke({
		question: question,
		chat_history: chatHistory,
	});

	// "messages" returneras till StateGraph/workflow och lagras där tillsammans med alla tidigare frågor och svar
	// aiApp returnerar slutligen en array av objekt med alla meddelanden
	return {
		messages: [{ role: "assistant", content: answer }],
	};
};

// StateGraph hjälper att lagra data åt ens AI.
// StateGraph håller koll på vilken data som hör till vilken session genom den "thread_id" som skickas in när "aiApp" anropas.
const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const memory = new MemorySaver();
export const aiApp = workflow.compile({ checkpointer: memory });
