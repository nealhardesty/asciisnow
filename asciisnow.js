#!/usr/bin/env node

// npm install ncurses

var config = {
	'refresh':20,
	'flakeFactor':2
};

var nc = require('ncurses');
var w = new nc.Window();
var flakes = [];
var numFlakes = w.width * config.flakeFactor;
var tmo;

w.on('inputChar', function() {
	clearInterval(tmo);
	w.close();
});

nc.showCursor = false;
nc.colorPair(0,nc.colors.WHITE, nc.colors.BLUE);
w.erase();

function initFlake(flake) {
		flake.col = Math.random() * w.width; 
		flake.row = 0;
		flake.vertSpeed = 0.3 + (Math.random() / 4);
		flake.horzSpeed = 0.5 - Math.random();
		flake.char = Math.random() > 0.65 ? '*' : '.';
		if(flake.char == '*') {
			//flake.vertSpeed += Math.random() / 3;
			flake.vertSpeed *= 1.5;
		}
}

function move() {
	for(var i=0;i<numFlakes;i++) {
		flakes[i].row += flakes[i].vertSpeed;
		flakes[i].col += flakes[i].horzSpeed;
		if(flakes[i].row > w.height || flakes[i].col < 0 || flakes[i].col > w.width) {
			initFlake(flakes[i]);
		}
	}
}

function draw() {
	for(var i=0;i<numFlakes;i++) {
		w.addstr(Math.round(flakes[i].row), Math.round(flakes[i].col), flakes[i].char);
	}
}

for(var i=0;i<numFlakes;i++) {
	flakes[i] = { };
	initFlake(flakes[i]);
	flakes[i].row = Math.random() * w.height;
}
draw();


tmo = setInterval(function() {
	w.erase();
	move();
	draw();
	w.refresh();
},config.refresh);
