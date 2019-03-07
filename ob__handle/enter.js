dtag['enter'] = true

module.exports = function(connection,packet,res_obj) {
	let found_bc = waiting_room.find_by_conn_id(connection.conn_id)
	let found_bu = waiting_room.find_by_username(packet.username)
	if(found_bu){
		l0g("enter : found_bu");
		res_obj.enter = {status:"failed"}
	}else if(found_bc){
		l0g("enter : found_bc");
		waiting_room.del_by_conn_id(connection.conn_id);
		waiting_room.put({conn_id:connection.conn_id,username:packet.username});
		res_obj.enter = {status:"success",username:packet.username}
		connection.username = packet.username;
	}else{	
		l0g("enter : found_none");
		waiting_room.put({conn_id:connection.conn_id,username:packet.username});
		res_obj.enter = {status:"success",username:packet.username}
		connection.username = packet.username;
	}

}