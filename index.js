var PORT = process.env.PORT ||5000
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
var user = 0;
io.on('connection', (socket) => {
    user++;
    socket.broadcast.emit('hi');
    console.log('a user connected '+user);
    setTimeout(function(){
        socket.emit('chat message', 'selamat datang !!');
    }, 5000)
    socket.on('disconnect', () => {
      user--;
      console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('chat-stream', (msg) => {
        //console.log('stream', msg)
        io.emit('chat-stream', msg);
    })

});
io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

http.listen(PORT, () => {
  console.log('listening on *:5000');
});