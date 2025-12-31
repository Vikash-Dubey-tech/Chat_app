const socket = io(); // Connects to the server

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// 1. Listen for 'message' event from server (Real-time)
socket.on('message', (message) => {
  outputMessage(message);
  // Scroll down to the newest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// 2. Listen for 'output-messages' (History loading)
socket.on('output-messages', (messages) => {
    console.log("Frontend received:", messages); // Check browser console
    if(messages.length){
        messages.forEach(message => {
            outputMessage(message);
        });
    }
});

// 3. Message Submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get text from input
  const username = document.getElementById('username').value;
  const msg = document.getElementById('msg').value;

  // Emit message to server
  socket.emit('chatMessage', { username: username, text: msg });

  // Clear input
  document.getElementById('msg').value = '';
  document.getElementById('msg').focus();
});

// Helper function to insert HTML into DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');

  // HANDLE TIME: DB sends a full ISO string, real-time might send nothing
  // If message.time exists, convert it. If not, use 'Just now' or current time.
  const timeDisplay = message.time ? new Date(message.time).toLocaleTimeString() : new Date().toLocaleTimeString();
  const textContent = message.text || message.msg || message.content || "Error: No Text Found";
  
  div.innerHTML = `<p class="meta">${message.username} <span>${timeDisplay}</span></p>
  <p class="text">
    ${textContent}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}