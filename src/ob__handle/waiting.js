module.exports = function(connection,packet) {
	let _consumable = connection._consumable;
	
	//pre-commit-change : now waiting_room response is waiters
	_consumable.waiters = connections.get_waiters();
	
}