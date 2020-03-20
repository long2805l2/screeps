var spawn_controller = {};
spawn_controller.run = function (spawn_obj, room_obj)
{
	spawn_controller.creep_create (spawn_obj, room_obj, [CARRY, WORK, MOVE]);
};

spawn_controller.creep_create = function (spawn_obj, room_obj, bodie_part, name, memory)
{
	if (spawn_obj.spawning)
		return;

	var controller = spawn_obj.room.controller;
	var controller_lv = controller.level;
	var creep_limit = CONTROLLER_STRUCTURES.spawn [controller_lv];
	var creep_in_room = room_obj.creeps.length;
	
	//if (creep_in_room < creep_limit)
	{
		var cost = spawn_controller.creep_price (...bodie_part);
		var energy = spawn_obj.store.getCapacity (RESOURCE_ENERGY);
		if (energy < cost)
			return;
		
		spawn_obj.spawnCreep (bodie_part, "worker_" + creep_in_room);
	}
}

spawn_controller.creep_price = function (...bodie_part)
{
	let value = 0;
	for (let i in bodie_part)
	{
		let part = bodie_part [i];
		let p = BODYPART_COST [part];
		
		if (p)
			value += p;
	}
	return value;
};

module.exports = spawn_controller;