
const list = [];
let active_duels = [];


const game_width = 320;
const game_height = 480;
const MP_gen_per_sec = 10;
const kii_add_per_sec = 30;

const user_radius = 30;
const user_left_limit = user_radius;
const user_right_limit = game_width - user_radius;


function check_dead(){	
	const dead_list = [];

	for(let name in this.users){
		if(this.users[name].HP <= 0){
			dead_list.push(name);			
		}
	}

	if(dead_list[0]){
		this.dead = dead_list[0]; 
		return dead_list[0];
	}else{
		return null;
	}
}

const update = function(prev_now,now){
	const frame_len = now - prev_now;
	// console.log("frame len : " + frame_len); //#ball traks
	// console.log("this.next_update_after : " + this.next_update_after); //#ball traks

	for(let username in this.users){
		const user = this.users[username];

		user.MP += MP_gen_per_sec * (frame_len/1000);
		user.MP = (user.MP>100)?100:user.MP;

		const input = user.input;

		const vel = 12;

		if(input.lr_state){
			if(input.lr_state === "right"){
				user.x += vel;
			}else{
				user.x -= vel;
			}
		}

		if(input.bg_touch){

			console.log(JSON.stringify(input.bg_touch));

			user.kii += kii_add_per_sec * (frame_len/1000);
			user.kii = (user.kii>user.MP)?user.MP:user.kii;
			user.prev_bg_touch = input.bg_touch;

		}else{
			if(user.kii > 0){

				// console.log(">>"); //#ball traks
				// console.log("pushing ball !!!"); //#ball traks
				// console.log(">>"); //#ball traks

				const last_touch = user.prev_bg_touch;
				
				const deltaX = last_touch.x-user.x;
				const deltaY = (480 - last_touch.y)-30;

				const rad = Math.atan2(deltaY,deltaX);
				
				const idx = user.ball_idx++;
				const x = user.x;
				const y = 30
				const xVel = 0.5*(user.kii/100)*Math.cos(rad);
				const yVel = 0.5*(user.kii/100)*Math.sin(rad); 

				user.MP -= user.kii;

				const crit_t_start = now + 430/yVel; 
				const crit_t_end = now + 460/yVel;

				user.balls.push({idx,x,y,xVel,yVel,crit_t_start,crit_t_end});

				user.kii = 0;
			}
		}

		// console.log(">> balls " + username); ////#ball traks
		// console.log(JSON.stringify(user.balls)); ////#ball traks
		// console.log(">>"); //#ball traks

		let opponent = this.users[this.opponent_of[username]];
		opponent_x = 320 - opponent.x;

		user.balls = user.balls.filter((ball)=>{ 
			ball.x += ball.xVel * frame_len; 
			ball.y += ball.yVel * frame_len; 

			// console.log(">> ball " + ball.idx + " has moved to " + ball.x +" / " + ball.y);	 //#ball traks

			if( prev_now<ball.crit_t_end && ball.crit_t_start < now ){
				if( ball.x -20 < opponent_x && opponent_x <  ball.x + 20 ){
					opponent.HP -= 10;
					ball.hit = true;
				}
			}

			return (ball.y < 480)&&(!ball.hit)
		});
	} 


	if(this.check_dead()){
		this.state = "finished";
		for(let k in this.users){
			const conn = connections.get_by_username(k)
			if(conn.username === this.dead){
				conn._consumable.duel_result = {status:"U have LOST !!"}
			}else{
				conn._consumable.duel_result = {status:"U have WON !!"}
			}
			conn.set_wait();
		}

	}
}


duels = {};

duels.update_active = function(prev_now,now){
	active_duels = active_duels.filter((duel)=>{
		if(duel.state !== "finished"){
			return true;
		}else{
			for(let username in duel.users){
				connections.get_by_username(username).duel = null;
			}
		}
	});

	active_duels.forEach((duel)=>{
		duel.update(prev_now,now);
		const duel_obj = {duel};
		for(let username in duel.users){
			let conn = connections.get_by_username(username)
			if(conn){conn.sendUTF(JSON.stringify(duel_obj));}
		}
	});
}

duels.new = function(usernames) {
	// body...
	const now = Date.now();
	const duel_id = list.length;
	const duel = {};
	duel.duel_id = duel_id;
	duel.state = "ready";
	duel.prev_now = now;

	duel.users = {};
	
	usernames.forEach((username)=>{
		const user = {};
		duel.users[username] = user;
		user.x = 160;
		user.HP = 100;
		user.MP = 0;
		user.kii = 0;
		user.ball_idx = 0;
		user.input = {};
		user.balls = [];
	})

	duel.opponent_of = {}
	duel.opponent_of[usernames[0]] = usernames[1];
	duel.opponent_of[usernames[1]] = usernames[0];

	list.push(duel);
	active_duels.push(duel);
	duel.update = update;
	duel.check_dead = check_dead;
	return duel;
}

