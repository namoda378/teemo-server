module.exports = function(connection,packet,res_obj) {
	
	if(packet.username === connection.username){
		packet.request_duel = {status:"failed - cannon duel yourself"};
	}else{
		let oponent = waiting_room.find_by_username(packet.username);
		if(oponent){
			l0g(` ${connection.username} has asked ${packet.username} out`);
			if(!connections[oponent.conn_id]._consumable['received_request_duel']){
				connections[oponent.conn_id]._consumable['received_request_duel'] = {username:connection.username}
			} 
		}
	}
	
}