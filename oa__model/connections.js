

let idx = 0;

let waiter_conn_id_mapping_by_username = {};
waiter_conn_id_mapping_by_username.__updated = 0;

let mapping_by_conn_id = {}
let mapping_by_username = {};
let list = [];

connections = {};

const set_username = function(username){
	if(this.username){
		throw err;
	}

	mapping_by_username[username] = this;
	this.username = username;
}

const set_duel = function(duel){
	waiter_conn_id_mapping_by_username.__updated++;
	delete waiter_conn_id_mapping_by_username[this.username];
	this._static.duel = duel;
}

const set_wait = function(){
	waiter_conn_id_mapping_by_username.__updated++;
	waiter_conn_id_mapping_by_username[this.username] = this.conn_id;
}

const is_waiting = function(){
	let conn_id = waiter_conn_id_mapping_by_username[this.username];
	if(conn_id === this.conn_id){
		return true;
	}else{
		return false;
	}
}

connections.put = function(conn) {
	// body...
	let conn_id = 'conn'+(idx++);
	connections[conn_id] = conn;
	conn.conn_id = conn_id;

    conn._consumable = {}
    conn._static = {}

	conn.set_username = set_username;
	conn.set_duel = set_duel;
	conn.set_wait = set_wait;
	conn.is_waiting = is_waiting;
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