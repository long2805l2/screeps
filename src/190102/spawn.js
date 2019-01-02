var spawn = {};

//list source, slot
//list road need build
//list worker must have
spawn.init = function (obj)
{
	let room = obj.room;

	let road = [];
	road.push (room.controller.pos);
	
	let sources = room.find(FIND_SOURCES);
	let slot = [];

	for (let id in sources)
	{
		let source = sources [id];
		let pos = source.pos;
		let count = 0;

		var area = room.lookForAtArea(LOOK_TERRAIN, pos.y - 1, pos.x - 1, pos.y + 1, pos.x + 1, true);
		for (let i in area)
		{
			let terrain = area [i];
			if (terrain.terrain === "plain")
			{
				slot.push ({source: source.id, slot: count++, x: terrain.x, y: terrain.y});
				road.push (new RoomPosition(terrain.x, terrain.y, room.name));
			}
		}
	}

	let plan = {};
	for (let i in road)
	{
		let b = road [i];
		var chemin = obj.pos.findPathTo(b);
		for (let j in chemin)
		{
			let id = chemin[j].x + "_" + chemin[j].y;
			if (plan [id])
				plan [id] += 1;
			else
				plan [id] = 1;
		}
	}
	
	obj.memory.sources = slot;
	obj.memory.road = road;
	obj.memory.plan = plan;
};

spawn.taskUpdate = function (obj)
{

};

spawn.loop = function (id)
{
	let obj = Game.spawns[id];
	if (!obj)
		return;

	if (!obj.memory.ready)
		spawn.init (obj);

	obj.memory = spawn.taskUpdate (obj);
};

module.exports = spawn;