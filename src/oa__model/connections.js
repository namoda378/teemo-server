

let idx = 0;

let waiter_conn_id_mapping_by_username = {};
waiter_conn_id_mapping_by_username.__updated = 0;

let mapping_by_conn_id = {}
let mapping_by_username = {};
let list = [];

connections = {};

const set_username = function(username){

	let was_waiting = false;
	if(this.username){
		const prev_username = this.username;
		delete waiter_conn_id_mapping_by_username[prev_username];
		delete mapping_by_username[prev_username];
	}
	this.username = username;

	mapping_by_username[username] = this;
	if(!duels.get_by_username(username)){
		waiter_conn_id_mapping_by_username[username] = this.conn_id;
	}
}

const set_duel = function(duel){
	waiter_conn_id_mapping_by_username.__updated++;
	delete waiter_conn_id_mapping_by_username[this.username];
	this.consume_interval = 1;
}

const set_wait = function(){
	waiter_conn_id_mapping_by_username.__updated++;
	waiter_conn_id_mapping_by_username[this.username] = this.conn_id;
	this.consume_interval = 10;
}

const is_waiting = function(){
	let conn_id = waiter_conn_id_mapping_by_username[this.username];
	if(conn_id === this.conn_id){
		return true;
	}else{
		return false;
	}
}

const add_buff = function(data){
	let splits = data.split("\n");
	this.buff.push(splits[0]); 
	if(splits.length > 1){
		const full_packet = this.buff.join("");
		this.full_packet_s.push(full_packet);
		console.log("pushing full packet : " + full_packet ); //#buffering
		
		for(let i = 1;i<splits.length-1 ; i ++){
			if(splits[i].length > 2){
				this.full_packet_s.push(splits[i]);
				console.log("pushing full packet splits[i] : " + splits[i] ); //#buffering
			}
		}
		
		this.buff = [];
		this.buff.push(splits[splits.length-1]);
	}
}

const get_req_obj_s = function(){
	const full_packet_s = this.full_packet_s;
	this.full_packet_s = [];

	return full_packet_s.map((elm)=>{
		    let req_obj = null;
		    try {
                req_obj = JSON.parse(elm);
            } catch(e) {
            	console.log(e);
            	req_obj = {};
            }
            return req_obj; 
	});	
}


const send_obj = function(obj){
	this.write(JSON.stringify(obj)+'\n');
}

connections.put = function(conn) {
	// body...
	l0gt("consume","connections.put is called");

	let conn_id = 'conn'+(idx++);
	mapping_by_conn_id[conn_id] = conn;
	conn.conn_id = conn_id;

    conn._consumable = {}

    conn.time_left_next_consume = 1;
    conn.consume_interval = 10;
    conn.buff = [];
    conn.full_packet_s = [];

	conn.set_username = set_username;
	conn.set_duel = set_duel;
	conn.set_wait = set_wait;
	conn.is_waiting = is_waiting;
	conn.send_obj = send_obj;
	conn.add_buff = add_buff;
	conn.get_req_obj_s = get_req_obj_s;


	
}

connections.get_waiters = function(){
	return waiter_conn_id_mapping_by_username;
}

connections.get_by_username = function(username){
	return mapping_by_username[username];
}

connections.get_by_conn_id = function(conn_id){
	return mapping_by_conn_id[conn_id];
}

connections.del_by_username = function(username){
	const conn = mapping_by_username[username];
	if(conn){
		delete mapping_by_username[username]
		delete mapping_by_conn_id[conn.conn_id]; 
	}
}

connections.del = function(conn){
	delete mapping_by_conn_id[conn.conn_id];
	delete mapping_by_username[conn.username];
	if(waiter_conn_id_mapping_by_username[conn.username]){
		delete waiter_conn_id_mapping_by_username[conn.username];
	}
}

connections.consume = function(){
	//l0gt("consume","consuming msgs")
	for(let conn_id in mapping_by_conn_id){
		// l0gt("consume","\t aaaaaa conn_id : " + conn_id);
		const conn = mapping_by_conn_id[conn_id];

		conn.time_left_next_consume--;
		if(conn.time_left_next_consume <= 0){
			conn.time_left_next_consume = conn.consume_interval;
		}else{
			continue;
		}


		// l0gt("consume","\t connection identity : " + conn.identity);
		const _consumable = conn._consumable;
        
        const res_obj = {};
        let count = 0;
        for(let k in _consumable){
            res_obj[k] = _consumable[k];
			count ++ ;
			// l0gt("consume","\tconsuming msg : " + k)
        }

        if(count > 0){
        	conn.send_obj(res_obj);
        	conn._consumable = {};
        }
	}
}