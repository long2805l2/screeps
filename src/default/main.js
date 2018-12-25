var util = require('util');
var role = require('role');

const WORKER_1 = [WORK, WORK, CARRY, MOVE];

module.exports.loop = function ()
{
	for (let spawnId in Game.spawns)
	{
		let spawn = Game.spawns[spawnId];
		let memory = spawn.memory;
		if (memory.ready)
			continue;

		memory.jobs = {
			energy: [],
			build: [],
			upgrade: []
		};

		memory.sources = util.room.enegry (spawnId);
		// for (let i in memory.sources)
		// {
		// 	let slot = memory.sources [i];
		// 	util.room.build.road (spawnId, spawn.pos, slot.pos);
			// console.log ("build road", JSON.stringify (spawn.pos), JSON.stringify (slot.pos));
		// 	break;
		// }
		
		util.room.build.road (spawnId, spawn.pos, spawn.room.controller.pos);
		
		memory.ready = true;
	}
	
	for (let spawnId in Game.spawns)
	{
		let spawn = Game.spawns[spawnId];
		console.log ("spawn", spawnId, spawn.id);
		let room = spawn.room;
		let memory = spawn.memory;
		
		let all = [];
		let idle = [];
		for (let i in Game.creeps)
		{
			let creep = Game.creeps [i];
			if (creep.room !== room)
				continue;
			
			if (creep.memory.job === "idle")
				idle.push (creep);
				
			all.push (i);
		}
		
		if(idle.length === 0)
		{
			util.creep.create ("Spawn1", WORKER_1, "worker_" + all.length,
			{
				memory: {
					role: "worker",
					job: "transfer",
					targetId: spawn.id
				}
			});
		}
		else
		{
			let creepids = memory.jobs.energy;
			if (creepids.length < 3)
			{
				let creep = idle.shift ();
				creep.memory.job = "transfer";
				memory.jobs.energy.push (creep.id);
			}
		}
	}
	
	for (var i in Game.creeps)
	{
		let creep = Game.creeps [i];
		switch (creep.memory.job)
		{
			case "harvest":		role.harvest (creep);	break;
			case "transfer":	role.transfer (creep);	break;
			case "build":		role.build (creep);		break;
			case "harvest":		role.upgrade (creep);	break;
		}
	}
}