const apiKey = "";
const userInputElement = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.querySelector('.chat-container');

let messages = [];

const addMessage = (role, content) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', role);
    messageElement.innerText = content;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Preload the system message but do not display it initially
const systemMessage = "You are a college admission counselor of Thadomal Shahani Engineering College located in Mumbai";

// Send the system message as the first message
messages.push({ role: 'system', content: systemMessage });

sendButton.addEventListener('click', async () => {
    const userInput = userInputElement.value.trim();
    if (userInput === '') return;

    addMessage('user', userInput);
    userInputElement.value = '';

    messages.push({ role: 'user', content: userInput });

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: messages,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const assistantReply = data.choices[0].message.content;
            addMessage('assistant', assistantReply);
            messages.push({ role: 'assistant', content: assistantReply });
        } else {
            addMessage('assistant', 'Error occurred while processing your request.');
        }
    } catch (error) {
        addMessage('assistant', 'Error occurred while processing your request.');
        console.error('Error:', error);
    }
});

userInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});