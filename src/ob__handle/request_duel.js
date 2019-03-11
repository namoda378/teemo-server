module.exports = function(connection,packet) {
	let _consumable = connection._consumable;
	//l0gt("consume","\t connection identity : " + connection.identity);
	
	if(!connection.username){
		_consumable.request_duel = {status:"failed - login first"};
	}else if(packet.username === connection.username){
		_consumable.request_duel = {status:"failed - cannot duel yourself"};
	}else{
		let opponent_conn = connections.get_by_username(packet.username);
		if(opponent_conn){

			if(opponent_conn.is_waiting()){

				l0g(` ${connection.username} has asked ${packet.username} out`);
				if(!opponent_conn._consumable['received_request_duel']){
					opponent_conn._consumable['received_request_duel'] = {username:connection.username}
					packet.request_duel = {status:"success - requested duel"};
				}else{
					_consumable.request_duel = {status:"failed - opponent is getting other requests"};
				}
			}else{

				_consumable.request_duel = {status:"failed - opponent is dueling"};
				
			}

		}else{

			_consumable.request_duel = {status:"failed - opponent is not connected"};
		
		}
	}
	
}