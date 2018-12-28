var task = {};
task.REFILL = "REFILL";

task.check = function (spawn)
{
	let all = {};
	let check = ["refill", "build", "upgrade"];
	for (let c in check)
	{
		let temp = task [check [c]] (spawn);
		for (let i in temp)
		{
			let id = temp [i];
			if (all [id])
				all [id].push (c);
			else
				all [id] = [check [c]];
		}
	}
	return all;
};

task.update = function (spawn)
{
	let idle = task.creep.idle (spawn);
	let newTask = task.check (spawn);
	let oldTask = spawn.memory.task;

	/// newTask.customerId.requestList
	/// oldTask.customerId.requestType.workerId.process

	for (let customerId in oldTask)
	{
		let requests = oldTask [customerId];
		for (let type in requests)
		{
			let workers = requests [type];
			let update = [];
			for (let i in workers)
			{
				let workerId = workers [i];
				let worker = Game.getObjectById (workerId);
			
				console.log ("update", "check", type, workerId, worker ? worker.memory.job.length : "null");
				if (worker && worker.memory.job.length > 0)
					update.push (workerId);
			}

			console.log ("update", type, "length", update.length);
			requests [type] = update.length > 0 ? update : null;
		}
	}

	let all = {};
	for (let customerId in newTask)
	{
		let update = {};
		if (oldTask [customerId])
			update = oldTask [customerId];

		let requests = newTask [customerId];
		for (let i in requests)
		{
			let type = requests [i];
			if (type in update)
				continue;

			if (idle.length > 0)
			{
				let workerId = idle.shift ();
				task.creep [type] (spawn, workerId, customerId);
				update [type] = [workerId];
			}
		}

		all [customerId] = update;
	}

	spawn.memory.task = all;
};

task.refill = function (spawn)
{
	let all = [];
	let room = spawn.room;

	if (spawn.energy < spawn.energyCapacity)
		all.push (spawn.id);

	return all;
};

task.build = function (spawn)
{
	let all = [];
	let room = spawn.room;

	let targets = room.find(FIND_CONSTRUCTION_SITES);
	for (let i in targets)
	{
		let target = targets [i];
		all.push (target.id);
	}

	return all;
};

task.upgrade = function (spawn)
{
	let all = [];
	let room = spawn.room;

	if (room.controller.level < 8)
		all.push (room.controller.id);

	return all;
};

task.creep = {};
task.creep.idle = function (spawn)
{
	let room = spawn.room;
	let idle = [];
	for (let i in Game.creeps)
	{
		let creep = Game.creeps [i];
		if (creep.spawning)
			continue;
			
		if (creep.room !== room)
			continue;

		if (creep.memory.job.length === 0)
			idle.push (creep.id);
	}
	return idle;
};

task.creep.refill = function (spawn, creepId, targetId)
{
	let creep = Game.getObjectById (creepId);
	let sourceId = null;

	for (let id in spawn.memory.sources)
	{
		if (spawn.memory.sources [id] > 0)
		{
			spawn.memory.sources [id] -= 1;
			sourceId = id;
			break;
		}
	}

	if (sourceId)
		creep.memory.job = [
			["harvest", sourceId],
			["transfer", targetId]
		];
};

task.creep.build = function (spawn, creepId, targetId)
{
	let creep = Game.getObjectById (creepId);
	let sourceId = null;

	for (let id in spawn.memory.sources)
	{
		if (spawn.memory.sources [id] > 0)
		{
			spawn.memory.sources [id] -= 1;
			sourceId = id;
			break;
		}
	}

	creep.memory.job = [
		["harvest", sourceId],
		["build", targetId]
	];
};

task.creep.upgrade = function (spawn, creepId, targetId)
{
	let creep = Game.getObjectById (creepId);
	let sourceId = null;

	for (let id in spawn.memory.sources)
	{
		if (spawn.memory.sources [id] > 0)
		{
			spawn.memory.sources [id] -= 1;
			sourceId = id;
			break;
		}
	}

	creep.memory.job = [
		["harvest", sourceId],
		["upgrade", targetId]
	];
};

module.exports = task;