'use strict';
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const PI = Math.PI;
const snowArr = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const starsSum = Math.round(getRand(300, 500));
const img = document.createElement('img');
img.src = './snow.png';
const pattern = ctx.createPattern(img);

function getRand(min, max) {
	return Math.random() * (max - min) + min;
}

function nextPointOne(x, y, time) {
	return {
		x: x + Math.sin((50 + x + (time / 10)) / 100) * 3,
		y: y + Math.sin((45 + x + (time / 10)) / 100) * 4
	};
}

function nextPointTwo(x, y, time) {
	return {
		x: x + Math.sin((x + (time / 10)) / 100) * 5,
		y: y + Math.sin((10 + x + (time / 10)) / 100) * 2
	};
}

class getObj {
	constructor (xPos = Math.round(getRand(0, canvas.width)), 
		yPos = Math.round(getRand(0, canvas.height)),
		size = getRand(0.1, 0.6),
		speed = getRand(-0.2, 0.2),
		startX = 0,
		startY = 0) {
		this.x = xPos;
		this.y = yPos;
		this.startX = startX;
		this.startY = startY;		
		this.size = size;
		this.rotateSpeed = speed;
	} 
	
	getSnowStar() {
		ctx.beginPath();
		ctx.fillStyle = pattern;
		ctx.fillRect(this.x, this.y, 12 * this.size / 2, 2 * PI);
		ctx.stroke();
		return this;
	}
}

function getStaticBackground() {
	for (let i = 0; i <= starsSum; i++) {
			const snowStar = new getObj;
			snowArr.push(snowStar.getSnowStar());	
	}	
}

getStaticBackground();

// function getNewBackground(array, isCircle) {
// 	let startX, startY;
// 	for (let i = 0; i < array.length; i++) {
// 		const item = array[i];
// 		const func = item.timeFunc;
// 		if (item.startX === 0) {
// 			startX = item.x;
// 			startY = item.y;
// 		} else {
// 			startX = item.startX;
// 			startY = item.startY;
// 		}
// 		const newCoord = func(startX, startY, Date.now());
// 		const x = newCoord.x;
// 		const y = newCoord.y;
// 		const size = item.size;
// 		const angle = item.angle;
// 		const speed = item.speed;
// 		const newItem = new getObj(x, y, size, angle, speed, func, startX, startY);
// 		newItem.getCircle();
// 		array.splice(i, 1, newItem);
// 	}
// }

// setInterval(() => {
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);	
// 	getNewBackground();
// }, 50);

