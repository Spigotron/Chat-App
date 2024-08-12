console.log('Hello from main.js!')

const socket = io()

socket.on('message', (msg) => {
    let msgElement = document.createElement('li')
    msgElement.className = 'list-group-item'
    msgElement.innerHTML = msg
    let messages = document.getElementById('messages')
    messages.append(msgElement)
})

socket.on('initial_messages', (messages) => {
    let messageList = document.getElementById('messages')
    messageList.innerHTML = '';
    messages.forEach(msg => {
        let msgElement = document.createElement('li')
        msgElement.className = 'list-group-item'
        msgElement.innerHTML = msg
        messageList.append(msgElement)
    })
})

let loggedInUser = null;
let currentRoom = null;

const usernameForm = document.getElementById('username-form');

usernameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let newUser = e.target.username.value
    if (!newUser){
        console.warn('Username cannot be blank')
        return
    }
    loggedInUser = newUser
    let welcome = document.getElementById('welcome-banner')
    welcome.innerText = 'Welcome to the Secret Chat, ' + loggedInUser +  "!"
    document.getElementById('usernameRow').style.display = 'none';
    document.getElementById('roomRow').style.display = 'block';
})

const roomForm = document.getElementById('room-form');

roomForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let room = e.target.room.value
    if (!room){
        console.warn('Room cannot be blank')
        return
    }
    currentRoom = room
    socket.emit('join', {username: loggedInUser, room: currentRoom})
    document.getElementById('room-name').innerText = currentRoom
    document.getElementById('roomRow').style.display = 'none';
    document.getElementById('messageRow').style.display = 'block';
})

const chatForm = document.getElementById('send-chat')

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let message = e.target.message.value
    let messageData = {
        message: message,
        username: loggedInUser,
        room: currentRoom
    }
    socket.emit('send_chat_message', messageData)
    e.target.message.value = '';
})