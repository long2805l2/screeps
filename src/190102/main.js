var spawn = require('spawn');

var main = {};

main.loop = function ()
{
	for (let spawnId in Game.spawns)
		spawn.loop (spawnId);
};

module.exports.loop = main.loop;