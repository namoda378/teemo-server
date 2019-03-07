module.exports = function(connection,packet,res_obj) {
	
	const username = connection.username;	
	const oponent_username = packet.username;

	const oponent_waiting_room_obj = waiting_room.find_by_username(oponent_username);

	if(oponent_waiting_room_obj){
		l0g(` ${username} and ${oponent_username} entering duel !!!`);

		const oponent_conn = connections[oponent_waiting_room_obj.conn_id];

		const duel = duels.new([username,oponent_username]);
		oponent_conn._static.duel = duel; 
		connection._static.duel = duel; 	

	}
}