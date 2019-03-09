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


dtag['rrcyc'] = false;

var server = ws.createServer(function (conn) {
    console.log("New connection")
    connections.put(conn);

    conn.on("error",function(err){
        console.log(err);
    });
    
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
        console.log(`connection of conn_id : ${conn.conn_id}  closed`)
        connections.del(conn)
    })
}).listen(8080)
