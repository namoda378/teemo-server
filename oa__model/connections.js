

let idx = 0;
let waiter_mapping_by_conn_id = {};
let mapping_by_conn_id = {}
let mapping_by_username = {};
let list = [];

connections = {};

const set_username = function(username){
	mapping_by_username[username] = this;
	this.username = username;
}

const set_duel = function(duel){
	delete waiting_conn_id_mapping_by_username[this.username];
	this.duel = duel;
}

const set_wait = function(){
	waiting_conn_id_mapping_by_username[this.username] = this.conn_id; 
}

connections.put = function(conn) {
	// body...
	let conn_id = 'conn'+(idx++);
	connections[conn_id] = conn;
	conn.conn_id = conn_id;

	conn.set_username = set_username;
	conn.set_duel = set_duel;
	conn.set_wait = set_wait;
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
}