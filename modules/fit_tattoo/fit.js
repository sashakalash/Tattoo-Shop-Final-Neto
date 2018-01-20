
const fitBlock = document.querySelector('.tattoo_fitting_room');
let movedTattoo = null;
let shiftX = 0;
let shiftY = 0;

const controls = document.querySelector('.controls');
const sendBtn = document.querySelector('.send_to_server');
const exitFittingBtn = document.querySelector('.exit_fitting');
const downloadBtn = document.querySelector('.download');
controls.addEventListener('click', makeToChangeImg);

const controlBanners = controls.querySelectorAll('p');

const buttons = controls.querySelectorAll('button');

const status = document.querySelector('.fitting_message_status');
status.style.setProperty('--statusVis', 'hidden');

document.addEventListener('mousedown', event => {
	if (event.target.classList.contains('img_choose')) {
		fittingMessage.style.setProperty('--fittingMessage', 'hidden');
		event.target.style.position = 'absolute';
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

for (const button of buttons) {
	button.addEventListener('mouseover', event => {
		event.target
			.parentElement.querySelector('p')
			.style.setProperty('--controlsBannerVis', 'visible');
	});
	button.addEventListener('mouseout', event => {
		event.target
			.parentElement.querySelector('p')
			.style.setProperty('--controlsBannerVis', 'hidden');
	});
}

function makeToChangeImg(event) {
	if (event.target.classList.contains('exit_fitting')) {
		exitFitting();
	}
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const img1 = fitTattooField.querySelector('.imgToFit');
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
	const imgs = fitTattooImage.querySelectorAll('img');
	const tattoo = fitTattooTattoo.querySelector('img');
	if (tattoo) {
		fitTattooTattoo.removeChild(tattoo);
	}
	Array.from(imgs).forEach(img => {
		fitTattooImage.removeChild(img);
	});
	fitTattooField.style.setProperty('--fitTattooVisible', 'hidden');
	cameraWindow.style.setProperty('--videoVis', 'hidden');
	rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
	boxBanner.style.visibility = 'visible';
	banner.style.visibility = 'visible';
	dropPic.style.setProperty('--dropPic', 'visible');
}

function showSendStatus() {
	status.style.setProperty('--statusVis', 'visible');
	let start = null;
	let timer = null;
	let alfa = 1;
	function tick(timestamp) {
		start = start || timestamp;
		const elapsedTime = timestamp - start;
		alfa -= 0.01;
		status.style.setProperty('--statusBGAlfa', alfa);
		if (alfa < 0) {
			status.style.setProperty('--statusVis', 'hidden');
			return cancelAnimationFrame(timer);
		}
		timer = requestAnimationFrame(tick);
	}
	tick();
}
