// Helpful utility functions
var utils = {
	distance: function (obj0, obj1) {
		var deltaX = obj1.x - obj0.x;
		var deltaY = obj1.y - obj0.y;
		return Math.hypot(deltaX, deltaY);
	},
	distanceToPoint: function (obj0, x, y) {
		var deltaX = x - obj0.x;
		var deltaY = y - obj0.y;
		return Math.hypot(deltaX, deltaY);
	},
	angle: function (obj0, obj1) {
		var deltaX = obj1.x - obj0.x;
		var deltaY = obj1.y - obj0.y;
		return Math.atan2(deltaY, deltaX);
	},
	angle1: function (obj, xField, yField) {
		return Math.atan2(obj[yField], obj[xField]);
	},
	angleLine: function (line) {
		var deltaX = line.x1 - line.x0;
		var deltaY = line.y1 - line.y0;
		return Math.atan2(deltaY, deltaX);
	},
	projection: function (line0, line1) {
		var ret = {
			x0: line0.x0,
			y0: line0.y0,
			x1: line0.x0,
			y1: line0.y0,
		};

		var deltaX0 = line0.x1 - line0.x0;
		var deltaY0 = line0.y1 - line0.y0;
		var deltaX1 = line1.x1 - line1.x0;
		var deltaY1 = line1.y1 - line1.y0;

		// ZANETODO: instead of angle stuff, should be
		// able to dot product the individual dimensions...
		var theta0 = utils.angleLine(line0);
		var theta1 = utils.angleLine(line1);
		var theta = theta0 - theta1;

		var mag0 = Math.hypot(deltaX0, deltaY0);
		var mag1 = Math.hypot(deltaX1, deltaY1);

		var dot = mag0 * Math.cos(theta);

		if (mag1 == 0) {
			return ret;
		}

		var ratio = dot / mag1;
		ret.x1 += deltaX1 * ratio;
		ret.y1 += deltaY1 * ratio;

		return ret;
	},
	circleCutoff: function (obj, xField, yField, r) {
		var magnitude = Math.hypot(obj[xField], obj[yField]);

		if (magnitude < r) {
			return;
		}

		var ratio = r / magnitude;
		obj[xField] *= ratio;
		obj[yField] *= ratio;
	},
	lineLineIntersect: function (line0, line1) {
		var x1 = line0.x0;
		var x2 = line0.x1;
		var x3 = line1.x0;
		var x4 = line1.x1;
		var y1 = line0.y0;
		var y2 = line0.y1;
		var y3 = line1.y0;
		var y4 = line1.y1;

		var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
		if (denom == 0) {
			return undefined;
		}

		var invDenom = 1 / denom;

		var numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
		var numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

		var uA = numA * invDenom;
		var uB = numB * invDenom;

		if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
			return undefined;
		}

		return {
			x: x1 + uA * (x2 - x1),
			y: y1 + uA * (y2 - y1),
		};
	},
	lineCircleIntersect: function (line, circle) {
		var deltaX = line.x1 - line.x0;
		var deltaY = line.y1 - line.y0;

		var lineMagnitude = Math.hypot(deltaX, deltaY);

		if (lineMagnitude == 0) {
			return undefined;
		}

		var dx = deltaX / lineMagnitude;
		var dy = deltaY / lineMagnitude;

		var toCircleX = circle.x - line.x0;
		var toCircleY = circle.y - line.y0;

		var t = dx * toCircleX + dy * toCircleY;

		var closestX = (t * dx) + line.x0;
		var closestY = (t * dy) + line.y0;

		var dist = Math.hypot(circle.x - closestX, circle.y - closestY);

		if (dist > circle.r) {
			return undefined;
		}

		t -= Math.sqrt(circle.r * circle.r - dist * dist); // I don't believe this...

		if (t < 0 || t > lineMagnitude) {
			return undefined;
		}

		var ret = {
			x: (t * dx) + line.x0,
			y: (t * dy) + line.y0,
		};

		return ret;
	},
	intersectMany: function (obj, others, func, epsilon) {
		var closestDist = Infinity;
		var closestPoint = {};
		var closestObj = undefined;

		var epsilonX = Math.sign(obj.x0 - obj.x1) * epsilon || 0;
		var epsilonY = Math.sign(obj.y0 - obj.y1) * epsilon || 0;

		_.each(others, function (other) {
			var intersect = func(obj, other);
			if (intersect !== undefined) {
				var dist = utils.distanceToPoint(intersect, obj.x0, obj.y0);
				if (dist < closestDist) {
					closestDist = dist;
					closestObj = other;
					closestPoint.x = intersect.x;
					closestPoint.y = intersect.y;
				}
			}
		});

		if (closestDist == Infinity) {
			return undefined;
		}

		var norm = undefined;
		if (func === utils.lineLineIntersect) {
			norm = utils.projection(obj, closestObj)
		}

		obj.x1 = closestPoint.x + epsilonX;
		obj.y1 = closestPoint.y + epsilonY;

		return {
			obj: closestObj,
			norm: norm,
		}
	},
	randUniform0Base: function () {
		return 2 * Math.random() - 1;
	},
};
