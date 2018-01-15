'use strict';
const errorMessage = document.querySelector('.error_message');
errorMessage.style.setProperty('--errorMes', 'hidden');

const takePhotoBtn = document.querySelector('.take-photo');
takePhotoBtn.style.setProperty('--takePhotoVis', 'hidden');
takePhotoBtn.addEventListener('click', getPhoto);

const rePhotoBtn = document.querySelector('.rephoto');
rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
rePhotoBtn.addEventListener('clock', accessRequest);

const audio = document.createElement('audio');
audio.textContent = 'Ваш браузер не умеет воспроизводить звуки';
audio.src = 'modules/photo-booth/audio/click.mp3';

const photobooth = document.querySelector('.photobooth');
photobooth.style.setProperty('--bgPosPhoto', '0');

const cameraWindow = document.createElement('video');
cameraWindow.style.setProperty('--videoVis', 'hidden');

photobooth.addEventListener('click', accessRequest);
photobooth.appendChild(cameraWindow);

const canvas = document.createElement('canvas');
photobooth.appendChild(canvas);
canvas.style.setProperty('--canvasDisp', 'none');
const ctx = canvas.getContext('2d');


function readyToPhoto() {
	
}

let streamRec;
function accessRequest(event) {
	if (event.target.classList.contains('take-photo')) {
		return;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	takePhotoBtn.style.setProperty('--takePhotoVis', 'visible');
	rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
	navigator.mediaDevices
	.getUserMedia({video: true, audio: false})
		.then((stream) => {
		cameraWindow.style.setProperty('--videoVis', 'visible');
		streamRec = stream;
		takePhotoBtn.style.setProperty('--takePhotoVis', 'visible');
		photobooth.style.setProperty('--bgPosPhoto', '300px');
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
	canvas.style.setProperty('--canvasDisp', 'block');
	canvas.width = cameraWindow.videoWidth;
	canvas.height = cameraWindow.videoHeight;
	ctx.drawImage(cameraWindow, 0, 0);
	const img = document.createElement('img');
	img.src = canvas.toDataURL();
	streamRec.getTracks().forEach(track => track.stop());
	cameraWindow.style.visibility = 'hidden';
	cameraWindow.src = URL.revokeObjectURL(streamRec);
}
