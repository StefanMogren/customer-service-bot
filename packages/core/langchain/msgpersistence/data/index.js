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

const callModel = async (state) => {
	const answer = await chain.invoke(state.messages);
	// const answer = await chain.invoke({ question });
	return { messages: answer };
};

const workflow = new StateGraph(MessagesAnnotation)
	.addNode("model", callModel)
	.addEdge(START, "model")
	.addEdge("model", END);

const memory = new MemorySaver();
export const aiApp = workflow.compile({ checkpointer: memory });
