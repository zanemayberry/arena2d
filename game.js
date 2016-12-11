var Actions = {
	HERO_UP: 0,
	HERO_LEFT: 1,
	HERO_DOWN: 2,
	HERO_RIGHT: 3,
	HERO_WALK: 4,
	GUN_FIRE: 5,
	HERO_RESPAWN: 6,
};

var Game = {
	width: screen.width,
	height: screen.height,
	tick: Date.now(),
	delta: 0,
	ctx: $('#game-canvas')[0].getContext('2d'),
	// offsetLeft: $('#game-canvas').offset().left,
	// offsetTop: $('#game-canvas').offset().top,
	entities: {},
	map: Map(),
	hero: Hero(),
	enemy: Infantry(),
	cursor: Cursor(),
	hud: Hud(),
	keymap: {
		1: Actions.GUN_FIRE,// Left click
		// 3: ,// Right click
		87: Actions.HERO_UP, // W
		65: Actions.HERO_LEFT, // A
		83: Actions.HERO_DOWN, // S
		68: Actions.HERO_RIGHT, // D
		16: Actions.HERO_WALK, // Shift
		82: Actions.HERO_RESPAWN,
	},
	actions: new Set(),
	camera: {
		x: 0,
		y: 0,
	},
	mouseState: undefined,
	shotBuffer: [],
};

$('#game-canvas').attr("width", Game.width);
$('#game-canvas').attr("height", Game.height);

Game.addEntity = function (entity) {
	Game.entities[entity.id] = entity;
};

Game.removeEntity = function (entity) {
	delete Game.entities[entity.id];
};

Game.initState = function () {
	Game.hero.x = 100;
	Game.hero.y = 100;
	Game.hero.enemies = [Game.enemy];

	Game.enemy.x = 0;
	Game.enemy.y = 150;
	Game.enemy.enemies = [Game.hero];

	Game.addEntity(Game.map);
	Game.addEntity(Game.hero);
	Game.addEntity(Game.enemy);
	Game.addEntity(Game.cursor);
	Game.addEntity(Game.hero.gun);
	Game.addEntity(Game.hud);
};

Game.draw = function () {
	window.requestAnimationFrame(Game.draw);
	Game.ctx.clearRect(0, 0, Game.width, Game.height);
	Game.ctx.save();
	Game.ctx.translate(.5 * Game.width - Game.camera.x, .5 * Game.height - Game.camera.y);
	_.each(Game.entities, function (entity) {
		entity.draw();
	});
	Game.ctx.restore();
};

Game.update = function () {
	var curTick = Date.now();
	Game.delta = (curTick - Game.tick) / 1000;
	Game.tick = curTick;
	_.each(Game.entities, function (entity) {
		entity.update();
	});
};

Game.networkSend = function () {
	var data = "" + Game.hero.x + "," + Game.hero.y + "," + Game.hero.rot;
	_.each(Game.shotBuffer, function (shot) {
		data = data + "," + shot.x0 + "," + shot.y0 + "," + shot.x1 + "," + shot.y1;
	});
	Game.shotBuffer = [];
	Network.broadcast(data);
};

Game.dataReceived = function (data) {
	var tokens = data.split(",");
	Game.enemy.x = parseFloat(tokens[0]);
	Game.enemy.y = parseFloat(tokens[1]);
	Game.enemy.rot = parseFloat(tokens[2]);
	var i = 3;
	if (tokens[i]) {
		var shot = {
			x0: parseFloat(tokens[i]),
			y0: parseFloat(tokens[i + 1]),
			x1: parseFloat(tokens[i + 2]),
			y1: parseFloat(tokens[i + 3]),
		};
		i += 4;
		Game.enemy.gun.shoot(shot);
	}
};

Game.start = function () {
	Game.initState();
	setInterval(Game.update, 1000 / 200);
	setInterval(Game.networkSend, 1000 / 30);
	window.requestAnimationFrame(Game.draw);
};

$("#game-canvas").mousemove(function (e) {
	Game.mouseState = e;
});

$("#game-canvas").mousedown(function (e) {
	var action = Game.keymap[e.which];
	if (action !== undefined) {
		Game.actions.add(action);
	}
});

$("#game-canvas").mouseup(function (e) {
	var action = Game.keymap[e.which];
	if (action !== undefined) {
		Game.actions.delete(action);
	}
});

$(document).keydown(function (e) {
	var action = Game.keymap[e.which];
	if (e.which === 192) { // tilde
		$("#game-canvas")[0].webkitRequestFullscreen();
	}
	if (action !== undefined) {
		Game.actions.add(action);
	}
});

$(document).keyup(function (e) {
	var action = Game.keymap[e.which];
	if (action !== undefined) {
		Game.actions.delete(action);
	}
});

Game.start();
