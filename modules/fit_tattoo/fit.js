
const fitBlock = document.querySelector('.tattoo_fitting_room');

const controlsPanel = fitBlock.querySelector('.control_panel');
controlsPanel.addEventListener('click', makeToChangeImg);

const controlBanners = controlsPanel.querySelectorAll('.control_panel_banner');
const buttons = controlsPanel.querySelectorAll('button');

const imgSendStatus = document.querySelector('.img_send_mess');
imgSendStatus.style.setProperty('--sendMessVis', 'hidden');

const fittingMessage = document.querySelector('.fitting_mess_push');
fittingMessage.style.setProperty('--fittingMessVis', 'hidden');
fittingMessage.style.setProperty('--fittingMessPos', '500');

function fittingMessageAnimation() {
	fittingMessage.style.setProperty('--fittingMessVis', 'visible');
	let start = null;
	let timer = null;
	let left = 0;
	
	function tick(timestamp) {
		start = start || timestamp;
		const elapsedTime = timestamp - start;
		fittingMessage.style.setProperty('--fittingMessPos', `${left}px`);
		left -= 3;
		if (left < 200) {
			left = 500;
		}
		fitBlock.addEventListener('mousedown', (event) => {
			if (!(event.target.classList.contains('tattoo_to_fit') || event.target.classList.contains('exit_fitting'))) {
				return;
			}
			fittingMessage.style.setProperty('--fittingMessVis', 'hidden');
			return cancelAnimationFrame(timer);
		});
		timer = requestAnimationFrame(tick);
	}
	tick();
}


function showKey(event) {
	const tattooToFit = document.querySelector('.tattoo_to_fit');
	if (event.target.classList.contains('tattoo_to_fit')) {
		if (event.type === 'mouseover') {
			event.target.style.setProperty('--border', 'dashed');
		} else if (event.type === 'mouseout') {
			event.target.style.setProperty('--border', 'none');
		}
	}
}

let isFirstMove = true;
let movedTattoo = null;
let shiftX = 0, shiftY = 0;
let minX, minY, maxX, maxY;
let tattooBottom, tattooHeight, tattooWidth;
let isResize = false;

document.addEventListener('mousedown', dragTattooStart);
document.addEventListener('mousemove', dragTattoo);
document.addEventListener('mouseup', dropTattoo);
document.addEventListener('mouseover', showKey);
document.addEventListener('mouseout', showKey);

function dragTattooStart(event) {
	if (event.target.classList.contains('tattoo_to_fit')) {
		fittingMessage.style.setProperty('--fittingMessage', 'hidden');
		const bounds = event.target.getBoundingClientRect();
		movedTattoo = event.target;
		const droppedImg = document.querySelector('.droppedImg');
		const canvas = document.querySelector('canvas');
		let photoImg;
		if (droppedImg) {
			photoImg = droppedImg;
		} else {
			photoImg = canvas;
		}
		
	
		minX = photoImg.offsetLeft;
		minY = photoImg.offsetTop;
		maxX = minX + photoImg.offsetWidth - movedTattoo.offsetWidth;
		maxY = minY + photoImg.offsetHeight - movedTattoo.offsetHeight;
		shiftX = event.clientX - bounds.left;
		shiftY = event.clientY - bounds.top;

		if ((event.clientX > bounds.right - 30 && 
			event.clientX < bounds.right) && 
			(event.clientY > bounds.bottom - 30 &&
			event.clientY < bounds.bottom)) {
			isResize = true;
			tattooBottom = bounds.bottom;
			tattooWidth = bounds.width;
			tattooHeight = bounds.height;
		}
		
	} else if (event.target.classList.contains('droppedImg')) {
		event.preventDefault();
	} else {
		return;
	}
	return false;
}

function dragTattoo(event) {
	if (!movedTattoo) {
		return;
	} 
	event.preventDefault();
	const k = event.clientY - tattooBottom;
	const coeff = tattooWidth / tattooHeight; 
	if (isResize) {
		movedTattoo.style.height = tattooHeight + k < 35? '35px': `${tattooHeight + k}px`;
		movedTattoo.style.width =  tattooWidth + k * coeff < 35? `${35 * coeff}px`: `${tattooWidth + k * coeff}px`;
	} else {
		x = event.clientX - shiftX;
		y = event.clientY - shiftY;
		x = Math.min(x, maxX);
		y = Math.min(y, maxY);
		x = Math.max(x, minX);
		y = Math.max(y, minY);
		movedTattoo.style.left = `${x}px`;
		movedTattoo.style.top = `${y}px`;
	}
	return false;
}

function dropTattoo(event) {
	if (movedTattoo) {
		fitTattooImage.appendChild(movedTattoo);
		movedTattoo = null;
		isResize = false;
	} else {
		return;
	}
}

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
	const img = fitTattooField.querySelector('.droppedImg');
	const photo = fitTattooField.querySelector('canvas');
	const tattoo = fitTattooField.querySelector('.tattoo_to_fit');
	const tattooCoord = tattoo.getBoundingClientRect();
	if (img) {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
	} else {
		canvas.width = photo.width;
		canvas.height = photo.height;
		ctx.drawImage(photo, 0, 0);
	}
	console.log(tattoo, tattooCoord.left, tattooCoord.top, tattoo.width, tattoo.height)
	ctx.drawImage(tattoo, tattooCoord.left, tattooCoord.top, tattoo.width, tattoo.height);
	if (event.target.classList.contains('send_to_server')) {
		sendImg(canvas);
		exitFitting();
		showSendStatus();
		return;
	} else {
		const link = document.createElement('a');
		link.download = 'tattoo.jpg';
		link.href = canvas.toDataURL();
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
	const canvas = fitBlock.querySelector('canvas');
	if (img) {
		dropField.appendChild(img);
	} else if (canvas.classList.contains('true')) {
		canvas.parentElement.removeChild(canvas);
	}
	tattoo.parentElement.removeChild(tattoo);
	fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
	photoBoxBanner.style.setProperty('--photoBannerVis', 'visible');
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
