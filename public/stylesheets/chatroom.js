const socket = io('http://localhost:5100')
const messageContainer = document.getElementById('container3');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('typebox');

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    if(position == 'center')
        messageElement.classList.add('joining');
    else{
        messageElement.classList.add('container2');
        if(position === 'right')
            messageElement.classList.add('darker');
    }
    messageContainer.append(messageElement);
}

var name = urlParams['name'];

appendMessage('You joined',`center`);
console.log('inchat name'+name);
socket.emit('user-joined', name);

socket.on('user-connected', name => {
  appendMessage(`${name} joined the chat`, `center`);
})

socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, `left`);
  })

socket.on('user-disconnected', name => {
  appendMessage(`${name} left the chat`, `center`);
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value;
  appendMessage(`You: ${message}`, `right`);
  socket.emit('send', message);
  messageInput.value = '';
})

