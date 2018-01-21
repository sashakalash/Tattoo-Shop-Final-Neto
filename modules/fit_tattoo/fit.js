
const fitBlock = document.querySelector('.tattoo_fitting_room');
let movedTattoo = null;
let shiftX = 0;
let shiftY = 0;

const controlsBtns = fitBlock.querySelector('.control_panel');
controlsBtns.addEventListener('click', makeToChangeImg);
const controlBanners = controlsBtns.querySelectorAll('p');
const buttons = control.querySelectorAll('button');

const imgSendStatus = document.querySelector('.img_send_mess');
imgSendStatus.style.setProperty('--sendMessVis', 'hidden');

document.addEventListener('mousedown', event => {
	if (event.target.classList.contains('img_choose')) {
		fittingMessage.style.setProperty('--fittingMessage', 'hidden');
		movedTattoo = event.target;
		const bounds = event.target.getBoundingClientRect();
		shiftX = event.pageX - bounds.left - window.pageXOffset;
		shiftY = event.pageY - bounds.top - window.pageYOffset;
	} else {
		event.preventDefault();
	}
});

document.addEventListener('mousemove', event => {
	if (movedTattoo) {
		event.preventDefault();
		if (event.shiftKey) {
			movedTattoo.style.width = event.pageX / 2 + 'px';
			movedTattoo.style.height = event.pageY / 2 + 'px';
		} else {
			movedTattoo.style.left = event.clientX - shiftX + 'px';
			movedTattoo.style.top = event.clientY - shiftY + 'px';
		}
	} 
});

document.addEventListener('mouseup', event => {
	if (movedTattoo) {
		fitTattooImage.appendChild(movedTattoo);
		movedTattoo = null;
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
		alfa -= 0.01;
		imgSendStatus.style.setProperty('--statusBGAlfa', alfa);
		if (alfa < 0) {
			imgSendStatus.style.setProperty('--sendMessVis', 'hidden');
			return cancelAnimationFrame(timer);
		}
		timer = requestAnimationFrame(tick);
	}
	tick();
}
