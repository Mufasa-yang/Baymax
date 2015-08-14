var net = require('net');

var HOST = '67.207.152.102';
var PORT = 8888;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('pi is connected!');

});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    
    console.log('DATA: ' + data);
    str = String(data);
    var data1 = str.split(':')[0];;
    var data2 = str.split(':')[1];;
    console.log("data1 : : : " + data1);
    console.log("data2 : : : " + data2);
    if(data1 == 'run_client_python_script'){
      console.log("get run ! ! ~~" + data2);
      var python = require('child_process').spawn(
        'python',
        // second argument is array of parameters, e.g.:
        ["mufasa_test_1.py", data2]
      );
    }
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});