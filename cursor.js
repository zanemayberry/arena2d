var Cursor = function () {
	var obj = Entity();

	obj.x = 0;
	obj.y = 0;
	obj.color = "#000000";
	obj.size = 10;

	obj.update = function () {
		if (Game.mouseState) {
			obj.x = Game.mouseState.pageX - .5 * Game.width + Game.camera.x;
			obj.y = Game.mouseState.pageY - .5 * Game.height + Game.camera.y;
		}
	};

	obj.draw = function () {
		var ctx = Game.ctx;
		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = obj.color;
		ctx.translate(obj.x, obj.y);
		ctx.beginPath();
		ctx.moveTo(-obj.size, 0);
		ctx.lineTo(obj.size, 0);
		ctx.moveTo(0, -obj.size);
		ctx.lineTo(0, obj.size);
		ctx.stroke();
		ctx.restore();
	};

	return obj;
};
