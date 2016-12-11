var Hud = function () {
	var obj = Entity();

	obj.draw = function () {
		var ctx = Game.ctx;
		ctx.save();
		ctx.fillStyle = "#FF0000";
		ctx.translate(Game.camera.x - .5 * Game.width, Game.camera.y - .5 * Game.height + 28);
		ctx.font = "30px Arial";
		ctx.fillText(Game.hero.health, 0, 0);
		ctx.restore();
	};

	return obj;
};
