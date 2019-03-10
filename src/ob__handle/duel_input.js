module.exports = function(connection,packet) {
	const duel = duels.get_by_username(connection.username)
	if(duel){
		duel.users[connection.username].input = packet;
	}else{
		connection._consumable.duel = {state:"finished"};	
	}
}