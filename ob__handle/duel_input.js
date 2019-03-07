module.exports = function(connection,packet,res_obj) {
	

	const lr_state = packet.lr_state;
	if(lr_state){
		if(lr_state === "left"){
			connection._static.duel.users[connection.username].pos -= 12
		}else{
			connection._static.duel.users[connection.username].pos += 12
		}
	}
}