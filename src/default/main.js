var roomController = require('room.controller');

module.exports.loop = function ()
{
	var rooms = {};

	for (let id in Game.rooms)
	{
		var room = Game.rooms [id];
		rooms [room.id] = {
			room: Game.rooms [id],
			structures: [],
			creeps: [],
		};
	}

	for (let id in Game.structures)
	{
		var structure = Game.structures [id];
		if (!structure.my)
			continue;

		rooms [structure.room.id].structures.push (structure);
	}

	for (let id in Game.creeps)
	{
		var creep = Game.creeps [id];
		if (!creep.my)
			continue;
		
		rooms [creep.room.id].creeps.push (creep);
	}

	for (let id in rooms)
		roomController.run (rooms [id]);
}