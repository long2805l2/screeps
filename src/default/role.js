var role = {};

role.harvest = function (creep, targetId)
{
	let target = Game.getObjectById (targetId);
	let incomplete = creep.carry.energy < creep.carryCapacity;
	if (incomplete)
	{
		if (creep.harvest(target) == ERR_NOT_IN_RANGE)
			role.moveTo (creep, target);
	}
	return !incomplete;
};

role.transfer = function (creep, targetId)
{
	let target = Game.getObjectById (targetId);
	let incomplete = creep.carry.energy > 0 && target.energy < target.energyCapacity;
	
	if (incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
	}
	return !incomplete;
}

role.build = function (creep, targetId)
{
	let target = Game.getObjectById (targetId);
	let incomplete = target.progress < target.progressTotal;
	if (incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.build(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
	}
	return !incomplete;
};

role.upgrade = function (creep, targetId)
{
	let target = Game.getObjectById (targetId);
	let incomplete = target.progress < target.progressTotal;
	console.log ("role.upgrade", targetId, target.progress, target.progressTotal)
	if (incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.upgradeController(target) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
	}
	return !incomplete;
};

role.moveTo = function (creep, target)
{
	creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
};

role.findEnergy = function (creep)
{
	if (creep.memory.energyId)
	{
		creep.memory.job = "harvert";
		return;
	}

	creep.memory.job = "idle";
	creep.memory.energyId = null;

	let room = creep.room;
	let memory = room.memory;
	let sources = memory.sources;
	console.log ("find sources", sources.length);
	
	for (let sid in sources)
	{
		let slot = sources [sid];
		console.log ("check sources", sid, slot.worker);
		if (slot.worker)
			continue;

		slot.worker = creep.id;
		creep.memory.job = "harvert";
		creep.memory.energyId = slot.id;
		break;
	}

	if (creep.memory.energyId)
		role.harvest (creep);
};

module.exports = role;