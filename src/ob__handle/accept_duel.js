module.exports = function(connection,packet) {
	
	const username = connection.username;	
	const opponent_username = packet.username;
	const conn = connection;
	const opponent_conn = connections.get_by_username(packet.username)

	if(opponent_conn){

		if(opponent_conn.is_waiting()){

			l0g(` ${username} and ${opponent_username} entering duel !!!`);
			
			const duel = duels.new([username,opponent_username]);
			conn.set_duel(duel);
			opponent_conn.set_duel(duel);
		}

	}
}