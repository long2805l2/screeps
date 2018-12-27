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
	let newTask = task.check (spawn);
	let oldTask = spawn.memory.task;

	let all = {};
	for (let id in newTask)
	{
		let list = {};
		let requests = newTask [id];

		let old = oldTask [id];
		if (old)
		{
			for (let i in requests)
			{
				let request = requests [i];
				list [request] = {};
			}
		}
		else
		{
			for (let i in requests)
			{
				let request = requests [i];
				list [request] = {};
			}
		}

		all [id] = list;
	}
};

task.refill = function (spawn)
{
	let all = [];
	let room = spawn.room;

	if (spawn.energy < spawn.energyCapacity)
		all.push (spawn.id);

	return all;
}

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
}

task.upgrade = function (spawn)
{
	let all = [];
	let room = spawn.room;

	if (room.controller.level < 8)
		all.push (room.controller.id);

	return all;
}

module.exports = task;