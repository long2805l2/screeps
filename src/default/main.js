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
			worker: { count: 6, body: WORKER_1 },
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
	
	if (plan.creeps.worker.count > 0)
	{
		if (!spawn.spawning)
		{
			if (spawn.energy >= util.creep.price (...plan.creeps.worker.body))
			{
				plan.creeps.worker.count -= 1;
				spawn.spawnCreep(plan.creeps.worker.body, "worker_" + plan.creeps.worker.count, { memory: { role: "worker", job: [] } });
			}
		}
	}

	task.update (spawn);
};

module.exports.loop = function ()
{
	for (let spawnId in Game.spawns)
	{
		let spawn = Game.spawns[spawnId];
		main.spawn.loop (spawn);
		
		let task = spawn.memory.task;
		for (let customerId in task)
		{
			let requests = task [customerId];
			for (let type in requests)
			{
				let workers = requests [type];
				for (let i in workers)
				{
					let workerId = workers [i];
					let worker = Game.getObjectById (workerId);

					let currentJob = worker.memory.job [0];
					let task = currentJob [0];
					let targetId = currentJob [1];
			
					let complete = role [task] ? role [task] (worker, targetId) : false;
					if (complete)
					{
						switch (task)
						{
							case "harvest":		
								spawn.memory.sources [targetId] += 1;
								break;
						}

						worker.memory.job.shift ();
					}
				}
			}
		}
	}
}