var http = require('http');
var url = require('url');
var fs = require('fs');
var server;
var path = require('path');

server = http.createServer(function (req, res) {
  var filePath = '.' + req.url;
  if (filePath == './')
    filePath = './kiilor_home.html';
    
  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }
  
  fs.exists(filePath, function(exists) {
  
    if (exists) {
      fs.readFile(filePath, function(error, content) {
        if (error) {
          res.writeHead(500);
          res.end();
        }
        else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    }
    else {
      res.writeHead(404);
      res.end();
    }
  });
}),

send404 = function (res) {
  res.writeHead(404); 
  res.write('404'); 
  res.end(); 
};

server.listen(8080);

// var io = require('/Users/Eli/node_modules/socket.io').listen(server);
var io = require('/home/eli/Nodejs/node_modules/socket.io').listen(server);

// --- -  - - - - - - -

var net = require('net');

var HOST = '67.207.152.102';
var PORT = 8888;
var client_sock;

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function (sock) {
    client_sock = sock;
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function (data) {
        
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        // Write the data back to the socket, the client will receive it as data from the server
        sock.write('You said: "' + data + '"');
        
    });
    
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });     
}).listen(PORT, HOST);

//- - - - - -  - - - - - - - - -

io.sockets.on('connection', function (socket) {

  console.log("Connection " + socket.id + " accepted.");

  // now that we have our connected 'socket' object, we can 
  // define its event handlers 
  socket.on('message', function (message) { 
    console.log("Received message: " + message + " - from client " + socket.id); 
  });

  socket.on('disconnect', function () { 
    console.log("Connection " + socket.id + " terminated."); 
  });

  socket.on('python_called', function (data) { 
    console.log("", data);
  });

  socket.on('client_python', function (data) { 
    if(client_sock){
      console.log("(((((client_python)))))", data);
      client_sock.write('run_client_python_script:'+data);
    }else{
      console.log("roomba-end server is not running");
    }
  });

});
