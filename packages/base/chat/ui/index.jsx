import "./index.css";
import { Message } from "@chatapp/message";
import { useChatLogic } from "@chatapp/use-chat-logic";

export const Chat = () => {
	const { handleSubmit, isAiThinking, messages } = useChatLogic();

	const messageComponents = messages.map((message, index) => {
		return <Message text={message.text} role={message.role} key={index} />;
	});

	return (
		<section className='chat'>
			<section className='chat__messages'>
				{messageComponents}

				{/* Tre punkter som är animerade att röra sig som en våg under tiden som AI:n tänker */}
				{isAiThinking && (
					<p className='chat__thinking-animation'>
						<span>.</span>
						<span>.</span>
						<span>.</span>
					</p>
				)}
			</section>
			<form className='chat__form' action='post' onSubmit={handleSubmit}>
				<label className='chat__label' htmlFor='textId'>
					TechNova Chat bot
				</label>
				<section className='chat__input-container'>
					{/* Textinput */}
					<input className='chat__input' type='text' name='text' id='textId' />
					<button className='chat__btn'>Skicka</button>
				</section>
			</form>
		</section>
	);
};
