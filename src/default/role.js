var role = {};

role.harvest = function (creep)
{
	let target = Game.getObjectById (creep.memory.energyId);
	if (creep.carry.energy < creep.carryCapacity)
	{
		if (creep.harvest(target) == ERR_NOT_IN_RANGE)
			role.moveTo (creep, target);
	}
	else
	{
		creep.memory.job = "idle";
		creep.memory.energyId = null;
	}
};

role.transfer = function (creep)
{
	let target = Game.getObjectById (creep.memory.targetId);
	creep.memory.incomplete = target.energy < target.energyCapacity;
	if (creep.memory.incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
		else
			role.findEnergy (creep);
	}
	else
	{
		creep.role = "unknow";
		creep.memory.job = "idle";
		creep.memory.targetId = null;
	}
}

role.build = function (creep)
{
	let target = Game.getObjectById (creep.memory.targetId);
	creep.memory.incomplete = target.progress < target.progressTotal;
	if (creep.memory.incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.build(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
		else
			role.findEnergy (creep);
	}
	else
	{
		creep.role = "unknow";
		creep.memory.job = "idle";
		creep.memory.targetId = null;
	}
};

role.upgrade = function (creep)
{
	let target = Game.getObjectById (creep.memory.targetId);
	creep.memory.incomplete = target.progress < target.progressTotal;
	if (creep.memory.incomplete)
	{
		if (creep.carry.energy > 0)
		{
			if (creep.upgradeController(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
				role.moveTo (creep, target);
		}
		else
			role.findEnergy (creep);
	}
	else
	{
		creep.role = "unknow";
		creep.memory.job = "idle";
		creep.memory.targetId = null;
	}
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