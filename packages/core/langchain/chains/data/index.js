import {
	RunnableSequence,
	RunnablePassthrough,
} from "@langchain/core/runnables";
import { retrieveDocuments } from "@chatapp/retriever";
import {
	standaloneQuestionTemplate,
	answerChatTemplate,
} from "@chatapp/templates";
import { combineDocuments } from "@chatapp/combinedocuments";
import { llm } from "@chatapp/llm";

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ConversationChain } from "langchain/chains";

import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory({
	memoryKey: "chat_history",
	returnMessages: true,
	inputKey: "question",
});

// Gör om användarens prompt till en fristående och enkel fråga.
const stanaloneQuestionChain = RunnableSequence.from([
	standaloneQuestionTemplate,
	llm,
	new StringOutputParser(),
]);

const retrieverChain = RunnableSequence.from([
	(data) => {
		return data.standaloneQuestion;
	},
	retrieveDocuments,
	combineDocuments,
]);

/* const answerChain = RunnableSequence.from([
	answerChatTemplate,
	llm,
	// memory,
	new StringOutputParser(),
]); */

const conversationChain = new ConversationChain({
	llm,
	prompt: answerChatTemplate,
	memory,
});

export const chain = RunnableSequence.from([
	{
		standaloneQuestion: stanaloneQuestionChain,
		originalQuestion: new RunnablePassthrough(),
	},
	{
		context: retrieverChain,
		question: ({ originalQuestion }) => originalQuestion.question,
	},
	conversationChain,
]);
