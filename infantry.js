var PLAYER_SIZE = 10;
var PLAYER_SPEED = 100;

var Infantry = function () {
	var obj = Kinematic();

	obj.r = PLAYER_SIZE;

	obj.health = 100;
	obj.color = "#009999";
	obj.walkSpeed = PLAYER_SPEED;
	obj.enemies = [];

	obj.gun = Gun();
	obj.gun.parent = obj;

	obj.draw = function () {
		var ctx = Game.ctx;
		ctx.save();
		ctx.strokeStyle = obj.color;
		ctx.translate(obj.x, obj.y);
		ctx.rotate(obj.rot);
		ctx.beginPath();
		ctx.arc(0, 0, PLAYER_SIZE, 0, 2 * Math.PI, false);
		ctx.lineTo(0, 0);
		ctx.stroke();
		ctx.restore();
	};

	obj.takeDamage = function (damage) {
		obj.health -= damage;
		if (obj.health <= 0) {
			obj.respawn();
		}
	};

	obj.respawn = function () { };

	return obj;
};
