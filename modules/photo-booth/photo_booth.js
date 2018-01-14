'use strict';
const errorMessage = document.querySelector('.error_message');
errorMessage.style.setProperty('--errorMes', 'hidden');

const takePhotoBtn = document.querySelector('.take-photo');
takePhotoBtn.style.setProperty('--takePhotoVis', 'hidden');
takePhotoBtn.addEventListener('click', getPhoto);

const rePhotoBtn = document.querySelector('.rephoto');
rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
rePhotoBtn.addEventListener('clock', rePhoto);

const audio = document.createElement('audio');
audio.textContent = 'Ваш браузер не умеет воспроизводить звуки';
audio.src = 'modules/photo-booth/audio/click.mp3';

const photobooth = document.querySelector('.photobooth');
photobooth.style.setProperty('--bgPosPhoto', '0');

const cameraWindow = document.createElement('video');
cameraWindow.style.setProperty('--videoVis', 'hidden');

photobooth.addEventListener('click', accessRequest);
photobooth.appendChild(cameraWindow);

let streamRec;
function accessRequest(event) {
	if (event.target.classList.contains('take-photo')) {
		return;
	}
	navigator.mediaDevices
	.getUserMedia({video: true, audio: false})
		.then((stream) => {
		cameraWindow.style.setProperty('--videoVis', 'visible');
		streamRec = stream;
		takePhotoBtn.style.setProperty('--takePhotoVis', 'visible');
		cameraWindow.src = URL.createObjectURL(stream);
	})
	.catch(() => {
		errorMessage.style.setProperty('--errorMes', 'visible');
		errorMessage.textContent = 'Не удалось получить доступ к камере';
	});
}

function getPhoto() {
	audio.play();
	takePhotoBtn.style.setProperty('--takePhotoVis', 'hidden');
	rePhotoBtn.style.setProperty('--rephotoVis', 'visible');
	const canvas = document.createElement('canvas');
	photobooth.appendChild(canvas);
	const ctx = canvas.getContext('2d');
	canvas.width = cameraWindow.videoWidth;
	canvas.height = cameraWindow.videoHeight;
	ctx.drawImage(cameraWindow, 0, 0);
	const img = document.createElement('img');
	img.src = canvas.toDataURL();
	streamRec.getTracks().forEach(track => track.stop());
	cameraWindow.style.visibility = 'hidden';
}
