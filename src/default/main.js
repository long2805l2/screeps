var util = require('util');
var task = require('task');
var role = require('role');

const WORKER_1 = [WORK, CARRY, MOVE, MOVE];

let main = {};

main.spawn = {};

main.spawn.loop = function (spawn)
{
	let memory = spawn.memory;
	if (!memory.ready)
		main.spawn.init (spawn);

	main.spawn.task (spawn);
};

main.spawn.init = function (spawn)
{
	let memory = spawn.memory;
	if (memory.ready)
		return;

	memory.jobs = {
		energy: [],
		build: [],
		upgrade: []
	};

	memory.plan = {
		creeps: {
			worker: 6,
		},
		roads: [[spawn.pos, spawn.room.controller.pos]],
		building: []
	};

	memory.task = {};

	memory.sources = util.room.enegry (spawn.room);
	for (let i in memory.sources)
	{
		let slot = memory.sources [i];
		memory.plan.roads.push ([spawn.pos, slot.pos]);
		break;
	}
	
	memory.ready = true;
};

main.spawn.plan = function (spawn)
{};

main.spawn.task = function (spawn)
{
	let room = spawn.room;
	let memory = spawn.memory;
	let plan = memory.plan; 
	
	let all = [];
	let idle = [];
	for (let i in Game.creeps)
	{
		let creep = Game.creeps [i];
		if (creep.spawning)
			continue;
			
		if (creep.room !== room)
			continue;

		if (creep.memory.job.length === 0)
			idle.push (creep);

		all.push (creep.id);
	}
	
	if (!spawn.spawning)
	{
		if (plan.creeps.worker > all.length)
		if (spawn.energy >= util.creep.price (...WORKER_1))
			spawn.spawnCreep(WORKER_1, "worker_" + all.length, { memory: { role: "worker", job: [] } });
	}

	if (idle.length > 0)
	{
		main.spawn.refill (spawn, idle);
	}
};

main.spawn.build = function (spawn, idle)
{};

main.spawn.refill = function (spawn, idle)
{
	let memory = spawn.memory;
	for (let i in memory.sources)
	{
		let source = memory.sources [i];
		if (source.worker)
			continue;

		let creep = idle.shift ();
		if (creep)
		{
			creep.memory.job = [
				["harvest", source.id],
				["transfer", spawn.id]
			];
			source.worker = creep.id;
		}

		if (idle.length === 0)
			break;
	}
}

module.exports.loop = function ()
{
	for (let spawnId in Game.spawns)
	{
		let spawn = Game.spawns[spawnId];
		main.spawn.loop (spawn);
	}

	for (var i in Game.creeps)
	{
		let creep = Game.creeps [i];
		if (creep.spawning)
			continue;
		
		let job = creep.memory.job;
		if (job.length === 0)
			continue;
			
		let currentJob = creep.memory.job [0];
		let task = currentJob [0];
		let targetId = currentJob [1];

		let complete = false;
		switch (task)
		{
			case "harvest":		complete = role.harvest (creep, targetId);	break;
			case "transfer":	complete = role.transfer (creep, targetId);	break;
			case "build":		complete = role.build (creep, targetId);	break;
			case "harvest":		complete = role.upgrade (creep, targetId);	break;
		}

		if (complete)
			creep.memory.job.push (creep.memory.job.shift ());
	}
}