var util = require('util');
var role = require('role');

const S1 = "Spawn1";
const CREEP_1 = [WORK, WORK, CARRY, MOVE];
const SOURCES = util.room.enegry (S1);
var init = false;
var jobs = {
	energy: [],
	build: [],
	upgrade: []
};

module.exports.loop = function ()
{
	if (!init)
	{
		let spawn = Game.spawns[S1];
		for (let sid in SOURCES)
		{
			let source = Game.getObjectById (sid);
			util.room.build.road (S1, spawn.pos, source.pos);
		}
		
		util.room.build.road (S1, spawn.pos, spawn.room.controller.pos);
		
		init = true;
	}
	
	let all = [];
	let idle = [];
	for (let i in Game.creeps)
	{
		let creep = Game.creeps [i];
		if (creep.memory.job === "idle")
			idle.push (creep);
			
		all.push (i);
	}
	
	if(idle.length === 0)
	{
		util.creep.create (S1, CREEP_1, "worker_" + all.length,
		{
			memory: {
				role: "unknow",
				job: "idle",
				targetId: null
			}
		});
	}
	else
	{
		let creepids = jobs.energy;
		if (creepids.length < 3)
		{
			let creep = idle.shift ();
			creep.memory.job = "harvest";
			// jobs.energy.push (creep.id);
		}
	}
	
	for (var i in Game.creeps)
	{
		let creep = Game.creeps [i];
		if (creep.memory.job === "harvest")
		{
			role.harvest (creep);
		}
	}
}