



//^ forin .
//> require("./{{ erb -rei ~\w+__model/.+\.js~ -xf }}");
require("./oa__model/connections");
require("./oa__model/duels");
//$


let v_time = 1000000000000;
Date.now = function(argument) {
	return v_time;
}; 


const duel = duels.new(['dog','cat']);


duel.update()


const input_packs = [
	{
		v_tic:2,
		dog:{lr_state:null},
		cat:{}
	},{
		v_tic:10,
		dog:{lr_state:null},
		cat:{bg_touch:{x:160,y:200}}
	},{
		v_tic:20,
		dog:{lr_state:null},
		cat:{bg_touch:null}
	},{
		v_tic:5,
		dog:{lr_state:null},
		cat:{bg_touch:{x:160,y:200}}
	},{
		v_tic:20,
		dog:{lr_state:null},
		cat:{bg_touch:null}
	}


]


const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let v_tic = 0;
let next_input_pack_v_tic = input_packs[0].v_tic;
let input_packs_pointer = 0;

function ask(){
	rl.question('Press Enter', (answer) => {
			v_time += 50 + Math.floor((Math.random() * 50) + 1);; 
			v_tic++;
			console.log("v_tic : " + v_tic);
			console.log("v_time : " + v_time);


			if(v_tic == next_input_pack_v_tic){
				let input_pack = input_packs[input_packs_pointer++];
				console.log("\n	applying input_pack \n" + input_packs_pointer);
				["dog","cat"].forEach((elm)=>{
					duel.users[elm].input = input_pack[elm];
				});
				next_input_pack_v_tic += input_packs[input_packs_pointer].v_tic;
			}

			duel.update();
			console.log(JSON.stringify(duel));
			ask();
		});
}

ask();