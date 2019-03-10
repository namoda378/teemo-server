
// Scream server example: "hi" -> "HI!!!"

console.log("index.js")

const testFolder = './';
const fs = require('fs');

fs.readdir(testFolder, (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
});

//^ forin o1__globals
//> require("./{{ erb -rei ~.+\.js~ -xf }}");
require("./o1__globals/dtag");
require("./o1__globals/require_v");
//$

//^ forin .
//> const {{ eb-1b -xf }} = require("./{{ erb -rei ~o3.+\.js~ -xf }}");
const reqname_to_priority = require("./o3__funcs/reqname_to_priority");
const l0g = require("./o3__funcs/l0g");
//$




//^ forin .
//> require("./{{ erb -rei ~\w+__model/.+\.js~ -xf }}");
require("./oa__model/connections");
require("./oa__model/duels");
//$



const handle = {}
//^ forin .
//> handle['{{ eb-1b -xf }}'] = require("./{{ erb -rei ~\w+__handle/.+\.js~ -xf }}");
handle['accept_duel'] = require("./ob__handle/accept_duel");
handle['enter'] = require("./ob__handle/enter");
handle['request_duel'] = require("./ob__handle/request_duel");
handle['waiting'] = require("./ob__handle/waiting");
handle['duel_input'] = require("./ob__handle/duel_input");
//$


var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}




let prev_now = Date.now();
let next_update_active_duels_after = prev_now;
let next_update_msgs_after = prev_now;

setInterval(()=>{
    const now = Date.now();
    
    if(now > next_update_active_duels_after){
        duels.update_active(prev_now,now);
        let tmp = now + 50;
        next_update_active_duels_after = tmp - (tmp%50);
    }

    if(now > next_update_msgs_after){
        connections.consume();
        let tmp = now + 500;
        next_update_msgs_after = tmp - (tmp%500);
    }

    prev_now = now;
}, 50);


wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    //console.log(JSON.stringify(request));

    request["requestedProtocols"].push('echo-protocol');

    var connection = request.accept('echo-protocol', request.origin);
    connections.put(connection);
    connections.identity = "i am a connection";

    console.log((new Date()) + ' Connection accepted.');


    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            //console.log('Received Message: ' + message.utf8Data);
            let req_obj = null;
            try {
                req_obj = JSON.parse(message.utf8Data);
            } catch(e) {
                l0g("@@rrc01 req_str cannot be parsed to JSON ","rrcyc");
                connection.sendUTF('{"msg":"ecode-101"}')
                return;
            }

            if(!connection.username && req_obj.has_username){
                connection.set_username(req_obj.has_username.username);
            }

            ["enter","model","movement","shoot","request_duel","waiting","accept_duel","duel_input"].forEach((reqname)=>{
                if(req_obj[reqname] && handle[reqname]){
                    handle[reqname](connection,req_obj[reqname]);
                    // l0g("reqname "+reqname+" exists in req_obj","rrcyc")
                }else{
                    // l0g("reqname "+reqname+" does NOT exist in req_obj","rrcyc")
                }
            });
        }
    });


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. conn_id : '+connection.conn_id);
        connections.del(connection)
    });
});
