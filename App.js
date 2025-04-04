// // const app =require('express')();
// // const http = require('http').Server(app);
// // const path = require('path');
// // const io = require('socket.io')(http);

// // app.get('/',function(req,res){
// //     var options ={
// //         root:path.join(__dirname)
// //     }
// //     var fileName='index.html';
// //     res.sendFile(fileName,options);
// // });

// // users=[];

// // io.on('connection',function(socket){

// //     socket.on('setUserName',function(data){
// //         console.log(data+'user connected');

// //     if(users.indexOf(data) > -1){
// //         socket.emit('userExists',data+'username is already in use! PLEASE another use name' )
// //     }
// //     else{
// //         users.push(data);
// //         socket.emit('setUser',{username:data});
// //     }
// //     });

// //     socket.on('msg',function(data){
// //         io.sockets.emit('newmsg',data);
// //     })
// // });

// // http.listen(3000,function(){
// //     console.log("Server started");
// // });




// const app = require('express')();
// const http = require('http').Server(app);
// const path = require('path');
// const io = require('socket.io')(http);
// const os = require('os'); // Added to get network interfaces

// app.get('/',function(req,res){
//     var options = {
//         root: path.join(__dirname)
//     }
//     var fileName = 'index.html';
//     res.sendFile(fileName, options);
// });

// // Function to get the local IP address
// function getLocalIP() {
//     const interfaces = os.networkInterfaces();
//     for (const name of Object.keys(interfaces)) {
//         for (const iface of interfaces[name]) {
//             // Skip over non-IPv4 and internal (loopback) interfaces
//             if (iface.family === 'IPv4' && !iface.internal) {
//                 return iface.address;
//             }
//         }
//     }
//     return '0.0.0.0'; // Default fallback
// }

// const localIP = getLocalIP();
// users = [];

// io.on('connection',function(socket){
//     console.log('A user connected');
    
//     // Emit the server's IP to the client for display purposes
//     socket.emit('serverIP', { ip: localIP, port: 3000 });

//     socket.on('setUserName',function(data){
//         console.log(data + ' user connected');

//         if(users.indexOf(data) > -1){
//             socket.emit('userExists', data + ' username is already in use! PLEASE use another name')
//         }
//         else{
//             users.push(data);
//             socket.emit('setUser', {username: data});
//         }
//     });

//     socket.on('msg',function(data){
//         io.sockets.emit('newmsg', data);
//     });
// });

// // Listen on all network interfaces (0.0.0.0) instead of just localhost
// http.listen(3000, '0.0.0.0', function(){
//     console.log(`Server started on http://${localIP}:3000`);
//     console.log("Share this address with others on the same WiFi network to connect");
// });



const app = require('express')();
const http = require('http').Server(app);
const path = require('path');
const io = require('socket.io')(http);
const os = require('os'); // Added to get network interfaces

app.get('/',function(req,res){
    var options = {
        root: path.join(__dirname)
    }
    var fileName = 'index.html';
    res.sendFile(fileName, options);
});

// Function to get the local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (loopback) interfaces
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0'; // Default fallback
}

const localIP = getLocalIP();
users = [];

io.on('connection',function(socket){
    console.log('A user connected');
    
    // Emit the server's IP to the client for display purposes
    socket.emit('serverIP', { ip: localIP, port: 3000 });

    socket.on('setUserName',function(data){
        console.log(data + ' user connected');

        if(users.indexOf(data) > -1){
            socket.emit('userExists', data + ' username is already in use! PLEASE use another name')
        }
        else{
            users.push(data);
            socket.emit('setUser', {username: data});
            // Notify others that a new user has joined
            socket.broadcast.emit('userJoined', data);
        }
    });

    socket.on('msg',function(data){
        // Add timestamp to messages
        data.time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        io.sockets.emit('newmsg', data);
    });
});

// Listen on all network interfaces (0.0.0.0) instead of just localhost
http.listen(3000, '0.0.0.0', function(){
    console.log(`Server started on http://${localIP}:3000`);
    console.log("Share this address with others on the same WiFi network to connect");
});