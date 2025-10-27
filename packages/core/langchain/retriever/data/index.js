import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

// llama3.2 verkar inte vara menad för att varken embedda dokument eller för att hämta dem, utan enbart för textgenerering.
// Använder nomic-embed-text:latest istället då den är gjord för att embedda och hämta dokument.
// Har vector_length 768
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text:latest" });
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const vectorstore = new SupabaseVectorStore(embeddings, {
	client: supabaseClient,
	tableName: "documents",
	queryName: "match_faq_documents",
});

export const retrieveDocuments = vectorstore.asRetriever(10);
