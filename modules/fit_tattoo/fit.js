
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
			if (!event.target.classList.contains('tattoo_to_fit')) {
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
		minX = fitBlock.offsetLeft;
		minY = fitBlock.offsetTop;
		maxX = minX + fitBlock.offsetWidth - movedTattoo.offsetWidth;
		maxY = minY + fitBlock.offsetHeight - movedTattoo.offsetHeight;
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
		return false;
	} else if (event.target.classList.contains('droppedImg')) {
		event.preventDefault();
	} else {
		return;
	}
}

function dragTattoo(event) {
	if (!movedTattoo) {
		return;
	} 
	event.preventDefault();
	const k = event.clientY - tattooBottom;
	if (isResize) {
		movedTattoo.style.height = tattooHeight + k + 'px';
		movedTattoo.style.width =  tattooWidth + k * tattooWidth / tattooHeight + 'px';
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
