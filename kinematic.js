var Kinematic = function () {
	var obj = Entity();

	obj.x = 0;
	obj.y = 0;
	obj.rot = 0;
	obj.vx = 0;
	obj.vy = 0;
	obj.ax = 0;
	obj.ay = 0;

	obj.update = function () {
		var deltaX = obj.vx * Game.delta;
		var deltaY = obj.vy * Game.delta;

		// ZANETODO: Iteratively follow lines to get smooth effect...
		// Don't just stop when hitting a wall.
		// ZANETODO: use a passer object to avoid garbage collection
		var move = {
			x0: obj.x,
			y0: obj.y,
			x1: obj.x + deltaX,
			y1: obj.y + deltaY,
		};

		var lineColliders = Game.map.getLineColliders(move);
		var circleColliders = Game.map.getCircleColliders(move);

		// ZANETODO: fix need for epsilons (was .001)

		utils.intersectMany(move, circleColliders, utils.lineCircleIntersect);
		var intersect = utils.intersectMany(move, lineColliders, utils.lineLineIntersect);
		if (intersect != undefined) {
			move = intersect.norm;
			utils.intersectMany(move, lineColliders, utils.lineLineIntersect);
		}

		obj.x = move.x1;
		obj.y = move.y1;
		obj.vx += obj.ax * Game.delta;
		obj.vy += obj.ay * Game.delta;
	};

	return obj;
};
