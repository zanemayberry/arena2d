var Hero = function () {
	var obj = Infantry();

	obj.color = '#FF0000';
	obj.accel = .02;

	var setInputDir = function () {
		var targetVx = 0;
		var targetVy = 0;

		var speed = obj.walkSpeed;
		if (Game.actions.has(Actions.HERO_WALK)) {
			speed = obj.walkSpeed / 2;
		}

		if (Game.actions.has(Actions.HERO_UP)) {
			targetVy -= speed;
		}
		if (Game.actions.has(Actions.HERO_LEFT)) {
			targetVx -= speed;
		}
		if (Game.actions.has(Actions.HERO_DOWN)) {
			targetVy += speed;
		}
		if (Game.actions.has(Actions.HERO_RIGHT)) {
			targetVx += speed;
		}

		var a = obj.accel;
		obj.vx = a * targetVx + (1 - a) * obj.vx;
		obj.vy = a * targetVy + (1 - a) * obj.vy;

		utils.circleCutoff(obj, "vx", "vy", PLAYER_SPEED);
	};

	var setInputRotation = function () {
		obj.rot = utils.angle(obj, Game.cursor);
	};

	var kinematicUpdate = obj.update;

	obj.update = function () {
		if (Game.actions.has(Actions.HERO_RESPAWN)) {
			obj.respawn();
		}

		setInputDir();
		setInputRotation();
		kinematicUpdate();
		Game.camera.x = obj.x;
		Game.camera.y = obj.y;
	};

	obj.respawn = function () {
		obj.x = 100;
		obj.y = 100;
		obj.health = 100;
	};

	return obj;
};
