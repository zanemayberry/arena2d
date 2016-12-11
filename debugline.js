var DebugLine = function (x0, y0, x1, y1, screenTime) {
	var obj = Entity();

	obj.createdTime = Date.now();
	obj.x0 = x0 || 0;
	obj.y0 = y0 || 0;
	obj.x1 = x1 || 0;
	obj.y1 = y1 || 0;
	obj.color = "#9900FF";
	obj.screenTime = screenTime || 50;

	obj.draw = function () {
		var delta = Game.tick - obj.createdTime;
		if (delta > obj.screenTime) {
			Game.removeEntity(obj);
			return;
		}
		var ctx = Game.ctx;
		ctx.save();
		ctx.globalAlpha = 1 - (delta / obj.screenTime);
		ctx.strokeStyle = obj.color;
		ctx.beginPath();
		ctx.moveTo(obj.x0, obj.y0);
		ctx.lineTo(obj.x1, obj.y1);
		ctx.stroke();
		ctx.restore();
	};

	return obj;
};
