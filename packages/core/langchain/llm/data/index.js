import { ChatOllama } from "@langchain/ollama";
// import { getMenuTool } from "@chatapp/get-menu-tool";

export const llm = new ChatOllama({
	// model: "llama3.1:8b",
	model: "llama3.2:latest",
	temperature: 0,
});

// export const llmWithTools = llm.bindTools([getMenuTool]);
