const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// STATIC
app.use(express.static(path.join(__dirname, 'public')));

const bot = 'Biscord Bot';

io.on('connection', socket => {
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', msg);
    });

    socket.on('joinRoom', (username, room) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // CONNECTION
        socket.emit('message', formatMessage(bot, 'Welcome to Biscord!'));
        
        // BROADCAST 
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.usename} has joined the chat`));
    });

        //DISCONNECT
        socket.on('disconnect', () => {
            io.emit('message', formatMessage('USER', 'A user has left the chat'));
        });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log('PORT ', PORT));
