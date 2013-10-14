var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var users = {};

server.listen(process.env.PORT, process.env.IP);


//server.listen(process.env.PORT);
  
app.get("/", function(req, res) {
    res.sendfile(__dirname + "/index.html");
    console.log("!!!!!!!!!!app.get");
});

io.sockets.on("connection", function(socket) {
  console.log("socket connect");
    socket.on("new user", function(data, callback) {
        if (data in users) {
            callback(false);
        }
        else {
            callback(true);
            socket.nickname = data;
            users[data] = socket;
            updateNicknames();

        }
    });

    function updateNicknames() {
        io.sockets.emit("username", Object.keys(users));
    }

    socket.on("send message", function(data) {
        io.sockets.emit("new message", {
            msg: data,
            nick: socket.nickname
        });
    });

    socket.on("disconnect", function(data) {
        if (!socket.nickname) return;
        delete users(socket.nickname);
        updateNicknames();
    });
});