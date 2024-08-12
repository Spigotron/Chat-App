from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super-secret-key'
socketio = SocketIO(app)
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    if room not in rooms:
        rooms[room] = []
    message = f"<b>{username}</b> has entered the room."
    rooms[room].append(message)
    send(message, to=room)
    emit('initial_messages', rooms[room], to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    message = f"<b>{username}</b> has left the room."
    rooms[room].append(message)
    send(message, to=room)

@socketio.on('send_chat_message')
def handle_chat_message(data):
    username = data.get('username')
    message = data.get('message')
    room = data.get('room')
    output = f"<b>{username}</b>: {message}"
    rooms[room].append(output)
    send(output, to=room)

if __name__ == "__main__":
    socketio.run(app, debug=True)