
const list = [];





duels = {};

duels.new = function(usernames) {
	// body...
	const duel_id = list.length;
	const duel = {};
	duel.duel_id = duel_id;
	duel.state = "ready";
	duel.next_update_after = 0;

	duel.users = {};

	usernames.forEach((username)=>{
		const user = {};
		duel.users[username] = user;
		user.pos = 160;
		user.HP = 100;
		user.MP = 0;
		user.kii = 0;
		user.input = {};
		user.balls = [];
	})

	list.push(duel);
	return duel;
}


const update = function(){

}