module.exports = function(context,packet,res_obj) {
	
	//pre-commit-change : now waiting_room response is waiters
	res_obj.waiters = connections.get_waiters();
	
}