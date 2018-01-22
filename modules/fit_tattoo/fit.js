
const fitBlock = document.querySelector('.tattoo_fitting_room');

const controlsPanel = fitBlock.querySelector('.control_panel');
controlsPanel.addEventListener('click', makeToChangeImg);

const controlBanners = controlsPanel.querySelectorAll('.control_panel_banner');
const buttons = controlsPanel.querySelectorAll('button');

const imgSendStatus = document.querySelector('.img_send_mess');
imgSendStatus.style.setProperty('--sendMessVis', 'hidden');


const shiftMess = document.querySelector('.shift_key_mess');
shiftMess.style.setProperty('--shiftMessage', 'hidden');

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
let shift;

document.addEventListener('mousedown', event => {
	if (event.target.classList.contains('img_choose')) {
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
		movedTattoo = event.target;
		maxX = minX + fitBlock.offsetWidth - movedTattoo.offsetWidth;
		maxY = minY + fitBlock.offsetHeight - movedTattoo.offsetHeight;
		if ((event.clientX > shiftX - 30 && 
			event.clientX < shiftX + 30) || 
			(event.clientY > shiftY - 30 &&
			event.clientY < shiftY + 30)) {
			shift = true;
		}
		return false;
	} else {
		return;
	}
});


document.addEventListener('mousemove', event => {
	if (movedTattoo) {
		event.preventDefault();
		if (shift) {
			const regExp = /\d+/; 
			const width =  +regExp.exec(movedTattoo.style.width)[0];
			const height = +regExp.exec(movedTattoo.style.heigth)[0];
			if (event.clientX > shiftX) {
				movedTattoo.style.width =  (width + event.clientX  - shiftX) / 2 + 'px';
			} else {
				movedTattoo.style.width = (width - shiftX - event.clientX) / 2 + 'px';
			}
			if (event.clientY > shiftY) {
				movedTattoo.style.height = (height + event.clientY - shiftY) / 2 + 'px';
			} else {
				movedTattoo.style.height = (height - shiftY - event.clientY) / 2 + 'px';
			}
		} else {
			let x = event.clientX;
			let y = event.clientY;
			x = Math.min(x, maxX);
			y = Math.min(y, maxY);
			x = Math.max(x, minX);
			y = Math.max(y, minY);
			movedTattoo.style.left = `${x}px`;
			movedTattoo.style.top = `${y}px`;
		}
	} 
});

document.addEventListener('mouseup', event => {
	if (movedTattoo) {
		fitTattooImage.appendChild(movedTattoo);
		movedTattoo = null;
		shift = false;
	}
});

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
	if (event.target.classList.contains('control_panel_banner')) {
		return;
	}
	if (event.target.classList.contains('exit_fitting')) {
		exitFitting();
		return;
	}
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const img1 = fitTattooField.querySelector('.droppedImg');
	const img2 = fitTattooField.querySelector('.img_choose');
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
	fittingMessage.style.setProperty('--fittingMessage', 'hidden');
	const img = fitBlock.querySelector('.droppedImg');
	const tattoo = fitBlock.querySelector('.img_choose');
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
