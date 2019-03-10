module.exports = function(connection,packet,res_obj) {
	
	const duel = connection._static.duel;
	duel.users[connection.username].input = packet;
	duel.update();

}