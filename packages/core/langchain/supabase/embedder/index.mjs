import { readFile } from "fs/promises";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";

import "dotenv/config";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

import { OllamaEmbeddings } from "@langchain/ollama";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
	const text = await readFile(
		`${process.cwd()}/TechNova AB FAQ & Policydokument.txt`,
		"utf-8"
	);

	const text_splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 200,
		separators: ["\n\n", "\n", " ", ""],
		chunkOverlap: 50,
	});

	const splittedText = await text_splitter.createDocuments([text]);
	const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);
	await SupabaseVectorStore.fromDocuments(
		splittedText,
		new OllamaEmbeddings({ model: "nomic-embed-text:latest" }),
		{ client: supabaseClient, tableName: "technova_documents" }
	);
} catch (error) {
	console.log(error);
}
