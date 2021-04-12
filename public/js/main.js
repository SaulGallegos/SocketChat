const chatMessages = document.querySelector('.chat-messages');

const socket = io();


// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join Room
socket.emit('joinRoom', {username, room});


//Message from Server
socket.on('message', msg => {
    outputMessage(msg);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//
const chatForm = document.querySelector('#chat-form');
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = document.querySelector('#msg').value;
    // Emitting message to the server
    socket.emit('chatMessage', msg);

    // Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Message to DOM
const outputMessage = msg => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
		<p class="text">
			${msg.text}
		</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}
