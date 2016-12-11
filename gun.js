var Gun = function () {
	var obj = Entity();

	obj.fireTime = 100; // ms between shots
	obj.lastFired = 0;
	obj.fullAuto = true;
	obj.triggerReleased = true; // has the trigger been released between shots?
	obj.parent = undefined;
	obj.dist = 1000;
	obj.damage = 30;

	obj.inaccResting = .005;
	obj.inaccFiring = .15;
	obj.inaccRunning = .25;

	obj.fireResetTime = 1000;
	obj.pastShots = [];

	obj.fire = function () {
		if (obj.fullAuto && !obj.triggerReleased) {
			obj.lastFired += obj.fireTime;
		}
		else {
			obj.lastFired = Game.tick;
		}

		obj.triggerReleased = false;

		var parent = obj.parent;

		var timeCutoff = Game.tick - obj.fireResetTime;
		obj.pastShots = _.filter(obj.pastShots, function (shot) {
			return shot > timeCutoff;
		});
		obj.shotFactor = _.reduce(obj.pastShots, function (memo, shot) {
			return memo + shot - timeCutoff;
		}, 0);
		var maxTimePenalty = .5 * obj.fireResetTime * obj.fireResetTime / obj.fireTime;
		var firingPart = utils.randUniform0Base() * obj.inaccFiring * obj.shotFactor / maxTimePenalty;
		obj.pastShots.push(Game.tick);

		var restingPart = utils.randUniform0Base() * obj.inaccResting;

		var speed = Math.hypot(parent.vx, parent.vy);
		var runningPart = utils.randUniform0Base() * speed / PLAYER_SPEED * obj.inaccRunning;

		// var inacc = 0;
		var inacc = firingPart + restingPart + runningPart;

		var rot = parent.rot + inacc;
		var x0 = parent.x;
		var y0 = parent.y;

		var x1 = x0 + Math.cos(rot) * obj.dist;
		var y1 = y0 + Math.sin(rot) * obj.dist;

		// ZANETODO: use a passer object to
		// avoid creating a bunch of new objects
		var shot = {
			x0: x0,
			y0: y0,
			x1: x1,
			y1: y1,
		};

		Game.shotBuffer.push({
			x0: x0,
			y0: y0,
			x1: x1,
			y1: y1,
		});
		obj.shoot(shot, []);
	};

	obj.shoot = function (shot) {
		Sound.play("ak");

		var walls = Game.map.getWalls(shot);
		var circles = Game.map.getCircles(shot).concat(obj.parent.enemies);

		utils.intersectMany(shot, walls, utils.lineLineIntersect);
		var intersect = utils.intersectMany(shot, circles, utils.lineCircleIntersect);

		if (intersect && intersect.obj && intersect.obj.takeDamage) {
			intersect.obj.takeDamage(obj.damage);
		}

		var debugLine = DebugLine(shot.x0, shot.y0, shot.x1, shot.y1, 50);
		Game.addEntity(debugLine);
	};

	obj.update = function () {
		if (Game.actions.has(Actions.GUN_FIRE)) {
			var delta = Game.tick - obj.lastFired;

			if (delta < obj.fireTime) {
				return;
			}

			if (!obj.fullAuto && !obj.triggerReleased) {
				return;
			}

			obj.fire();
		}
		else {
			obj.triggerReleased = true;
		}
	};

	return obj;
};
