
const fitBlock = document.querySelector('.tattoo_fitting_room');

const controlsPanel = fitBlock.querySelector('.control_panel');
controlsPanel.addEventListener('click', makeToChangeImg);

const controlBanners = controlsPanel.querySelectorAll('.control_panel_banner');
const buttons = controlsPanel.querySelectorAll('button');

const imgSendStatus = document.querySelector('.img_send_mess');
imgSendStatus.style.setProperty('--sendMessVis', 'hidden');

const shiftMess = document.querySelector('.shift_key_mess');
shiftMess.style.setProperty('--shiftMessage', 'hidden');

const tattooToFit = document.querySelector('.tattoo_to_fit');

function showShiftKey() {
	shiftMess.style.setProperty('--shiftMessage', 'visible');
	setTimeout(() => {
		shiftMess.style.setProperty('--shiftMessage', 'hidden');
	}, 5000);
}

let isFirstMove = true;
let movedTattoo = null;
let shiftX, shiftY;
const minX = 0;
const minY = 0;
let maxX, maxY;
let isResize;

function dragTattooStart(event) {
	if (event.target.classList.contains('tattoo_to_fit')) {
		if (isFirstMove) {
			setTimeout(() => {
				showShiftKey();
			}, 2000);
			isFirstMove = false;
		}
		fittingMessage.style.setProperty('--fittingMessage', 'hidden');
		const bounds = event.target.getBoundingClientRect();
		shiftX = bounds.right;
		shiftY = bounds.bottom;
		shiftZeroX = bounds.left;
		shiftZeroY = bounds.top;
		movedTattoo = event.target;
		maxX = minX + fitBlock.offsetWidth - movedTattoo.offsetWidth;
		maxY = minY + fitBlock.offsetHeight - movedTattoo.offsetHeight;
		if (event.clientX < shiftX && 
			event.clientY < shiftY &&
			event.clientX > shiftZeroX + 30 &&
			event.clientY > shiftZeroY + 30) {
			isResize = true;
		}
		return false;
	} else {
		return;
	}
}

function dragTattoo(event) {
	if (movedTattoo) {
		event.preventDefault();
		fittingMessage.style.setProperty('--fittingMessage', 'hidden');
		let x = event.clientX;
		let y = event.clientY;
		if (isResize) {
			movedTattoo.style.width = `${y}px`;
			movedTattoo.style.height = `${y}px`;
		} else {
			x = Math.min(x, maxX);
			y = Math.min(y, maxY);
			x = Math.max(x, minX);
			y = Math.max(y, minY);
			movedTattoo.style.left = `${x}px`;
			movedTattoo.style.top = `${y}px`;
		}
	} else {
		return;
	}
}

function droptattoo(event) {
	if (movedTattoo) {
		fitTattooImage.appendChild(movedTattoo);
		movedTattoo = null;
		isResize = false;
	}
}

function returnStartSize(event) {
	if (event.target.classList.contains('tattoo_fitting_room') || event.target.classList.contains('droppedImg')) {
		movedTattoo.style.width = '300px';
		movedTattoo.style.height = '400px';
	}
}

document.addEventListener('mousedown', dragTattooStart);
document.addEventListener('mousemove', dragTattoo);
document.addEventListener('mouseup', droptattoo);
document.addEventListener('dblclick', returnStartSize);

Array.from(controlBanners).forEach(el => {
	el.style.setProperty('--controlsBannerVis', 'hidden');
});

buttons.forEach(el => {
	el.addEventListener('mouseover', event => {
		event.target
			.parentElement
			.querySelector('p')
			.style.setProperty('--controlsBannerVis', 'visible');
	});
	el.addEventListener('mouseout', event => {
		event.target
			.parentElement
			.querySelector('p')
			.style.setProperty('--controlsBannerVis', 'hidden');
	});
});

function makeToChangeImg(event) {
	if (!(event.target.tagName === 'BUTTON')) {
		return;
	}
	if (event.target.classList.contains('exit_fitting')) {
		exitFitting();
		return;
	}
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const img1 = fitTattooField.querySelector('.droppedImg');
	const img2 = fitTattooField.querySelector('.tattoo_to_fit');
	const tattooCoord = img2.getBoundingClientRect();
	canvas.width = img1.width;
	canvas.height = img1.height;
	ctx.drawImage(img1, 0, 0);
	ctx.drawImage(img2, tattooCoord.left, tattooCoord.top, img2.width, img2.height);
	if (event.target.classList.contains('send_to_server')) {
		sendImg(canvas);
		exitFitting();
		showSendStatus();
		return;
	} else {
		const img = document.createElement('img');
		img.src = canvas.toDataURL();
		const link = document.createElement('a');
		link.download = 'tattoo.jpg';
		link.href = img.src;
		link.click();
	}
}

function sendImg(canvas) {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://neto-api.herokuapp.com/photo-booth', true);
	canvas.toBlob(blob => {
		const imgToSend = new FormData();
		imgToSend.append('image', blob);
		xhr.send(imgToSend); 
	}); 
}

function exitFitting() {
	const img = fitBlock.querySelector('.droppedImg');
	const tattoo = fitBlock.querySelector('.tattoo_to_fit');
	dropField.appendChild(img);
	tattoo.parentElement.removeChild(tattoo);
	fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
	cameraWindow.style.setProperty('--videoVis', 'hidden');
	rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
}

function showSendStatus() {
	imgSendStatus.style.setProperty('--sendMessVis', 'visible');
	let start = null;
	let timer = null;
	let alfa = 1;
	function tick(timestamp) {
		start = start || timestamp;
		const elapsedTime = timestamp - start;
		alfa -= 0.005;
		imgSendStatus.style.setProperty('--statusBGAlfa', alfa);
		if (alfa < 0.01) {
			imgSendStatus.style.setProperty('--sendMessVis', 'hidden');
			return cancelAnimationFrame(timer);
		}
		timer = requestAnimationFrame(tick);
	}
	tick();
}
