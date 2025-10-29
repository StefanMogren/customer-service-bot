import "./index.css";
import { Message } from "@chatapp/message";
import { useChatLogic } from "@chatapp/use-chat-logic";
import { Loading } from "@chatapp/loading";
import { v4 as uuid } from "uuid";

const threadConfig = { configurable: { thread_id: uuid() } };

export const Chat = () => {
	const { handleSubmit, isAiThinking, messages } = useChatLogic();

	const messageComponents = messages.map((message, index) => {
		return <Message text={message.text} role={message.role} key={index} />;
	});

	return (
		<section className='chat'>
			<section className='chat__messages'>
				{/* ----- Alla chattmeddelanden ----- */}
				{messageComponents}

				{/* Tre punkter som är animerade att röra sig som en våg under tiden som AI:n tänker */}
				{isAiThinking && <Loading />}
			</section>

			{/* ----- Formuläret ----- */}
			<form
				className='chat__form'
				action='post'
				onSubmit={() => handleSubmit(event, threadConfig)}
				id='chatForm'>
				<label className='chat__label' htmlFor='questionId'>
					TechNova Chat bot
				</label>
				<section className='chat__input-container'>
					{/* ----- Input-fältet ----- */}
					<input
						className='chat__input'
						type='text'
						name='question'
						id='questionId'
					/>
					<button className='chat__btn'>Skicka</button>
				</section>
			</form>
		</section>
	);
};
