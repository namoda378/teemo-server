module.exports = function(connection,packet,res_obj) {
	
	const duel = connection.duel;
	duel.users[connection.username].input = packet;

}