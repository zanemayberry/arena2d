var basedir = "sounds/";

var Sound = {
	ak: new Audio(basedir + "ak.wav"),
	play: function (name) {
		var s = Sound[name];
		s.pause();
		s.currentTime = 0;
		s.play();
	}
};
