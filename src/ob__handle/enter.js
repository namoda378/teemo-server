dtag['enter'] = true

forbidden_first_chars ={
	"_":true,
	"@":true,
	"#":true,
	"$":true,
	"%":true,
	"^":true,
	"&":true,
	"*":true,
	" ":true
}

module.exports = function(connection,packet) {
	let _consumable = connection._consumable;

	let found_bu = connections.get_by_username(packet.username)
	if(!packet.username || forbidden_first_chars[packet.username[0]]){
		_consumable.enter = {status:"failed : a name should start with a-z or 0-9"}
			// l0gt("consume","\t consume d 63 ");
	}else if(found_bu && found_bu !== connection){
		_consumable.enter = {status:"failed : there is another connection using that name"}
			// l0gt("consume","\t consume d 64 ");
	}else{
		if(found_bu){
			// l0gt("consume","\t consume d 65 ");
			_consumable.enter = {status:"success : already using that username ",username:packet.username}
		}else{
			connection.set_username(packet.username);
			connection.set_wait();

			// l0gt("consume","\t consume d 66 ");
			_consumable.enter = {status:"success : initial set username ",username:packet.username}
			// l0gt("consume",JSON.stringify(connection._consumable));
			// l0gt("consume","conn_id : " + connection.conn_id);
		}
	} 
}