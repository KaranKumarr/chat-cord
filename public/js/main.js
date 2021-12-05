const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get users and room
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
        outputUsers(users);
});

// Message from server
socket.on('message', message => {
   
    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    // Emitting a message to the server
    socket.emit('chatMessage', msg);

    // Clear Input
    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add Room Name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add Users To DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
};