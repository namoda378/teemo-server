var ws = require("nodejs-websocket")
 
// Scream server example: "hi" -> "HI!!!"

console.log("index.js")


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
require("./oa__model/waiting_room");
//$



const handle = {}
//^ forin .
//> handle['{{ eb-1b -xf }}'] = require("./{{ erb -rei ~\w+__handle/.+\.js~ -xf }}");
handle['shoot'] = require("./ob__handle/shoot");
handle['movement'] = require("./ob__handle/movement");
handle['accept_duel'] = require("./ob__handle/accept_duel");
handle['duel'] = require("./ob__handle/duel");
handle['model'] = require("./ob__handle/model");
handle['enter'] = require("./ob__handle/enter");
handle['request_duel'] = require("./ob__handle/request_duel");
handle['waiting'] = require("./ob__handle/waiting");
//$

function received_movement(context,packet,response){

}



function received(context,object,a){



}



dtag['rrcyc'] = false;

let conn_idx = 0;

var server = ws.createServer(function (conn) {
    console.log("New connection")
    const conn_id = 'conn'+(conn_idx++);
    conn.conn_id = conn_id;
    conn._consumable = {}
    conn._static = {}
    connections[conn_id] = conn;
    connections.put()

    conn.on("text", function (str) {
        console.log("Received "+str)
        let req_obj = null;
        try {
            req_obj = JSON.parse(str);
        } catch(e) {
            l0g("@@rrc01 req_str cannot be parsed to JSON ","rrcyc");
            conn.sendText('{"msg":"ecode-101"}')
            return;
        }

        

        // req_list.sort((a,b)=>{
        //     return reqname_to_priority(a.reqnames)-reqname_to_priority(b.reqnames)
        // })

        // const context = {};
        
        // req_list.forEach((packet)=>{
        //     handle(context,packet,res_obj)
        // })
        const res_obj = {};

        ["enter","model","movement","shoot","request_duel","waiting","accept_duel","duel_input"].forEach((reqname)=>{
            if(req_obj[reqname] && handle[reqname]){
                handle[reqname](conn,req_obj[reqname],res_obj);
                l0g("reqname "+reqname+" exists in req_obj","rrcyc")
            }else{
                l0g("reqname "+reqname+" does NOT exist in req_obj","rrcyc")
            }
        })

        const _consumable = conn._consumable;
        for(let k in _consumable){
            res_obj[k] = _consumable[k];
        }
        conn._consumable = {};

        const _static = conn._static;
        for(let k in _static){
            res_obj[k] = _static[k];
        }

        conn.sendText(JSON.stringify(res_obj));
    })
    conn.on("close", function (code, reason) {
        console.log(`connection of conn_id : ${conn_id}  closed`)
        connections.del(conn)
        waiting_room.del_by_conn_id(conn.conn_id)
    })
}).listen(8080)
