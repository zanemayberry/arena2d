var Map = function () {
	var obj = Entity();

	// ZANETODO: use walls to precompute collision surfaces
	// Then, we can do line intersections against wall segments
	// and circle intersections against edges.
	// Then, we have a function that takes a directed line segment
	// and returns the point at which collision occurs.
	obj.walls = [
		{x0: 0, y0: 3, x1: 60, y1: 10},
		{x0: 60, y0: 10, x1: 90, y1: 20},
		{x0: 90, y0: 20, x1: 400, y1: 300},
		{x0: 200, y0: 200, x1: 100, y1: 300},
		{x0: 10, y0: 30, x1: 2, y1: 20},
	];

	obj.circles = [
		{x: 200, y: 300, r: 50},
	];

	obj.lineColliders = [];
	obj.circleColliders = [];

	// Initialize colliders
	_.each(obj.walls, function (wall) {
		var x0 = wall.x0;
		var y0 = wall.y0;
		var x1 = wall.x1;
		var y1 = wall.y1;

		var deltaX = x1 - x0;
		var deltaY = y1 - y0;

		var invMagnitude = 1 / Math.hypot(deltaX, deltaY);
		var diffSign = -1 * Math.sign(deltaY) * Math.sign(deltaX);
		var normX = diffSign * Math.abs(deltaY) * invMagnitude * PLAYER_SIZE;
		var normY = Math.abs(deltaX) * invMagnitude * PLAYER_SIZE;

		var l0x = x0 + normX;
		var l0y = y0 + normY;

		var l1x = x0 - normX;
		var l1y = y0 - normY;

		obj.lineColliders.push({x0: l0x, y0: l0y, x1: l0x + deltaX, y1: l0y + deltaY});
		obj.lineColliders.push({x0: l1x, y0: l1y, x1: l1x + deltaX, y1: l1y + deltaY});

		obj.circleColliders.push({x: x0, y: y0, r: PLAYER_SIZE});
		obj.circleColliders.push({x: x1, y: y1, r: PLAYER_SIZE});
	});

	_.each(obj.circles, function (circle) {
		obj.circleColliders.push({x: circle.x, y: circle.y, r: circle.r + PLAYER_SIZE});
	});

	obj.draw = function () {
		var ctx = Game.ctx;
		ctx.save();
		ctx.translate(obj.x, obj.y);
		ctx.strokeStyle = "#000000";

		_.each(obj.walls, function (wall) {
			ctx.beginPath();
			ctx.moveTo(wall.x0, wall.y0);
			ctx.lineTo(wall.x1, wall.y1);
			ctx.stroke();
		});

		_.each(obj.circles, function (circles) {
			ctx.beginPath();
			ctx.arc(circles.x, circles.y, circles.r, 0, 2 * Math.PI, false);
			ctx.stroke();
		});

		// ctx.strokeStyle = "#FF00FF";
		// _.each(obj.lineColliders, function (coll) {
		// 	ctx.beginPath();
		// 	ctx.moveTo(coll.x0, coll.y0);
		// 	ctx.lineTo(coll.x1, coll.y1);
		// 	ctx.stroke();
		// });

		// _.each(obj.circleColliders, function (coll) {
		// 	ctx.beginPath();
		// 	ctx.arc(coll.x, coll.y, coll.r, 0, 2 * Math.PI, false);
		// 	ctx.stroke();
		// });

		ctx.restore();
	};

	obj.update = function () {

	};

	// Given a line, return all that could have possibly collided with that line
	// ZANETODO: filter out some of these...
	obj.getLineColliders = function (line) {
		return obj.lineColliders;
	};

	obj.getCircleColliders = function (line) {
		return obj.circleColliders;
	};

	obj.getWalls = function (line) {
		return obj.walls;
	};

	obj.getCircles = function (line) {
		return obj.circles;
	};

	return obj;
};
