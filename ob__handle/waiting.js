module.exports = function(context,packet,res_obj) {
	
	res_obj.waiters = connections.get_waiters();
	
}