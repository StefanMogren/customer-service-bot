import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { client } from "@chatapp/supabase-client";

const embeddings = new OllamaEmbeddings({
	model: "nomic-embed-text:latest",
});

const vectorStore = new SupabaseVectorStore(embeddings, {
	client: client,
	tableName: "technova_documents",
	queryName: "match_faq_documents",
});

export const retrieveDocuments = vectorStore.asRetriever(4);
