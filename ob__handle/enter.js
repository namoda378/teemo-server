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

module.exports = function(connection,packet,res_obj) {
	let found_bu = connections.get_by_username(packet.username)
	if(!packet.username || forbidden_first_chars[packet.username[0]]){
		res_obj.enter = {status:"failed : a name should start with a-z or 0-9"}
	}else if(found_bu && found_bu !== connection){
		res_obj.enter = {status:"failed : there is another connection using that name"}
	}else{
		if(found_bu){
			res_obj.enter = {status:"success : already using that username ",username:packet.username}
		}else{
			connection.set_username(packet.username);
			connection.set_wait();
			res_obj.enter = {status:"success : initial set username ",username:packet.username}
		}
	} 
}