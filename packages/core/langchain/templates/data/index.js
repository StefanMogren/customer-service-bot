import {
	ChatPromptTemplate,
	SystemMessagePromptTemplate,
	HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

import { MessagesPlaceholder } from "@langchain/core/prompts";

export const standaloneQuestionTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		`Summera om den givna prompten så den blir kortfattad, tydlig och enkel att förstå.`
	),
	HumanMessagePromptTemplate.fromTemplate("{question}"),
]);

export const answerChatTemplate = ChatPromptTemplate.fromMessages([
	SystemMessagePromptTemplate.fromTemplate(
		`Du är en chatbot på en webbsida till företaget TechNova. Du får enbart svara på frågor som användare har angående företaget samt om dess leveranspolicy. Du ska även visa vilken del av dokumentet du hittade ditt svar.
		Dokumentet om företaget har du här {context}.
		Kontaktinformation till TechNova är kundtjänst: support@technova.se, telefon: 08–555 321 90, öppettider: Måndag–fredag, 09:00–17:00
		Om användaren ställer en fråga som inte har med TechNova, deras leveranspolicy eller kontaktinformation att göra så svarar du ej på frågan utan istället beklagar med att du bara kan svara på frågor angående TechNova och deras leveranspolicy.
		`
	),
	new MessagesPlaceholder("chat_history"),
	HumanMessagePromptTemplate.fromTemplate("{question}"),
]);
