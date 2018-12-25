/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util');
 * mod.thing == 'a thing'; // true
 */
const NEARLY = [
	{x: -1, y: -1}, {x:  0, y: -1}, {x:  1, y: -1}, 
	{x: -1, y:  0},                 {x:  1, y:  0}, 
	{x: -1, y:  1}, {x:  0, y:  1}, {x:  1, y:  1}
];
var util = {};

util.room = {};
util.room.enegry = function (spawnName)
{
	let currentRoom = Game.spawns [spawnName].room;
	let sources = currentRoom.find(FIND_SOURCES);
	let data = [];
	for (let id in sources)
	{
		let source = sources [id];
		let pos = source.pos;
		let roomName = pos.roomName;
		let roomTerrain = Game.map.getRoomTerrain(roomName);
		
		for (let n in NEARLY)
		{
			let o = NEARLY [n];
			let p = new RoomPosition(pos.x + o.x, pos.y + o.y, pos.roomName);
			let t = roomTerrain.get(p.x, p.y);
			if (t !== 0)
				continue;
				
			data.push ({
				id: source.id,
				pos: p,
			});
		}
	}
	return data;
};

util.room.build = {};
util.room.build.road = function (spawnName, a, b)
{
	let currentRoom = Game.spawns [spawnName].room;
	var chemin = a.findPathTo(b);
	for (var i = 0; i < chemin.length; i++)
	{
		// let result =
		currentRoom.createConstructionSite(chemin[i].x, chemin[i].y, STRUCTURE_ROAD);
		// console.log ("plan", STRUCTURE_ROAD, chemin[i].x, chemin[i].y, result);
	}
};

util.spawn = {};
util.spawn.energy = function (spawnName)
{
	if (spawnName in Game.spawns)
		return Game.spawns [spawnName].energy;
	return 0;
};

util.creep = {};
util.creep.price = function (...bodies)
{
	let value = 0;
	for (let i in bodies)
	{
		let part = bodies [i];
		let p = BODYPART_COST [part];
		
		if (p)
			value += p;
	}
	return value;
};

util.creep.create = function (spawnName, creepBody, creepName, creepOti = {})
{
	let energy = util.spawn.energy (spawnName);
	let cost = util.creep.price (...creepBody);
	let result = Game.spawns[spawnName].spawnCreep(creepBody, creepName, creepOti);
	// console.log (spawnName, "create", energy, cost, result);
	return result;
};

module.exports = util;