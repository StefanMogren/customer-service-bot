import {
	ChatPromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

import { MessagesPlaceholder } from "@langchain/core/prompts";

export const standaloneQuestionTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		`Omformulera den givna frågan till en fristående fråga som är tydlig och enkel att förstå.`
	),
	HumanMessagePromptTemplate.fromTemplate("{question}"),
]);

export const answerChatTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		`Du är en chatbot på en webbsida till företaget TechNova. Du svarar på frågor som användare har angående företaget samt om dess leveranspolicy.
		Dokumentet om företaget har du här {context}.
		Om du inte kan få ut svaret från dokumenten beklagar du att du inte kan svara på användarens fråga.`
	),
	new MessagesPlaceholder("chat_history"),
	HumanMessagePromptTemplate.fromTemplate("{question}"),
]);
