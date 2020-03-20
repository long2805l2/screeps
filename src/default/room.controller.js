var spawnController = require('spawn.controller');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');

var room_controller = 
{
	init:function ()
	{

	},

	run:function (room_obj)
	{
		var room = room_obj.room;
		var tasks = [];

		for (let i in room_obj.structures)
		{
			var structure_obj = room_obj.structures [i];
			var type = structure_obj.structureType;
			switch (type)
			{
				case STRUCTURE_SPAWN:
				{
					spawnController.run (structure_obj, room_obj);
					break;
				}
				// case STRUCTURE_EXTENSION:
				// case STRUCTURE_ROAD:
				// case STRUCTURE_WALL:
				// case STRUCTURE_RAMPART:
				// case STRUCTURE_KEEPER_LAIR:
				// case STRUCTURE_PORTAL:
				// case STRUCTURE_CONTROLLER:
				// case STRUCTURE_LINK:
				// case STRUCTURE_STORAGE:
				// case STRUCTURE_TOWER:
				// case STRUCTURE_OBSERVER:
				// case STRUCTURE_POWER_BANK:
				// case STRUCTURE_POWER_SPAWN:
				// case STRUCTURE_EXTRACTOR:
				// case STRUCTURE_LAB:
				// case STRUCTURE_TERMINAL:
				// case STRUCTURE_CONTAINER:
				// case STRUCTURE_NUKER:
				// case STRUCTURE_FACTORY:
				// case STRUCTURE_INVADER_CORE:
			}
		}

		for (let i in room_obj.creeps)
		{
			var creep_obj = room_obj.creeps [i];
			if (roleHarvester.run (creep_obj)) continue;
			if (roleUpgrader.run (creep_obj)) continue;
		}
	}
};

module.exports = room_controller;