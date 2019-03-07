const module_ = {};
module.exports = module_;

let model = {}
model.list = [];
model.updated = 0;


waiting_room = {}

waiting_room.put = function(username_robj) {
	// body...
	model.list.push(username_robj)
}

waiting_room.del = function(username) {
	// body...
	model.list = model.list.filter((elm)=>elm.username!==username);
}

waiting_room.del_by_username = function(username) {
	// body...
	model.list = model.list.filter((elm)=>elm.username!==username);
}

waiting_room.del_by_conn_id = function(conn_id) {
	// body...
	model.list = model.list.filter((elm)=>elm.conn_id!==conn_id);
};

['put','del','del_by_username','del_by_conn_id'].forEach((elm)=>{
	const original = waiting_room[elm];

	waiting_room[elm] = function(...args){
		const length = model.list.length;
		original(...args);	
		if(model.list.length !== length){
			model.updated++;
		}
	}
})



waiting_room.find_by_conn_id = function(conn_id) {
	return model.list.find((elm)=> elm.conn_id === conn_id );	
}

waiting_room.find_by_username = function(username) {
	return model.list.find((elm)=> elm.username === username );	
}

waiting_room.model = function() {
	// body...
	return model;	
}

waiting_room.all = function() {
	// body...
	return model.list;	
}