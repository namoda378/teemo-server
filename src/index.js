
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
        let tmp = now + 50;
        next_update_msgs_after = tmp - (tmp%50);
    }

    prev_now = now;
}, 50);


const net = require('net');

const server = net.createServer();




server.on('connection', socket => {
    console.log('new client arrived');
    
    connections.put(socket);

    socket.setEncoding('utf8');

    socket.on("error",(error,a,b,c)=>{
        console.log(error);
        console.log(a);
        console.log(b);
        console.log(c);
    
    }).on('data',(data)=>{
        
        socket.add_buff(data);

        const req_obj_s = socket.get_req_obj_s();
        if(req_obj_s && req_obj_s.length > 0){

            //console.log(" got more than one full req_obj_s ")

            req_obj_s.forEach((req_obj)=>{

                //console.log("     req_obj : " + JSON.stringify(req_obj) )
                
                if(!socket.username && req_obj.has_username && !connections.get_by_username(req_obj.has_username.username)){
                    //console.log("setting socket : " + socket.conn_id + " 's username to "+ req_obj.has_username.username);
                    socket.set_username(req_obj.has_username.username);
                }

                ["enter","request_duel","waiting","accept_duel","duel_input"].forEach((reqname)=>{
                    if(req_obj[reqname] && handle[reqname]){
                        handle[reqname](socket,req_obj[reqname]);
                        // l0g("reqname "+reqname+" exists in req_obj","rrcyc")
                    }else{
                        // l0g("reqname "+reqname+" does NOT exist in req_obj","rrcyc")
                    }
                });

            });
        }


    }).on('close',()=>{
        connections.del(socket);
    });

}).on('error',error =>{

  console.log(error);

})

server.listen(8080);


// wsServer.on('request', function(request) {
//     if (!originIsAllowed(request.origin)) {
//       // Make sure we only accept requests from an allowed origin
//       request.reject();
//       console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//       return;
//     }

//     //console.log(JSON.stringify(request));

//     request["requestedProtocols"].push('echo-protocol');

//     var connection = request.accept('echo-protocol', request.origin);
//     connections.put(connection);
//     connections.identity = "i am a connection";

//     console.log((new Date()) + ' Connection accepted.');


//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             //console.log('Received Message: ' + message.utf8Data);
//             let req_obj = null;
//             try {
//                 req_obj = JSON.parse(message.utf8Data);
//             } catch(e) {
//                 l0g("@@rrc01 req_str cannot be parsed to JSON ","rrcyc");
//                 connection.sendUTF('{"msg":"ecode-101"}')
//                 return;
//             }

//             if(!connection.username && req_obj.has_username && !connections.get_by_username(req_obj.has_username.username)){
//                 connection.set_username(req_obj.has_username.username);
//             }

//             ["enter","request_duel","waiting","accept_duel","duel_input"].forEach((reqname)=>{
//                 if(req_obj[reqname] && handle[reqname]){
//                     handle[reqname](connection,req_obj[reqname]);
//                     // l0g("reqname "+reqname+" exists in req_obj","rrcyc")
//                 }else{
//                     // l0g("reqname "+reqname+" does NOT exist in req_obj","rrcyc")
//                 }
//             });
//         }
//     });


//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. conn_id : '+connection.conn_id);
//         connections.del(connection)
//     });
// });
