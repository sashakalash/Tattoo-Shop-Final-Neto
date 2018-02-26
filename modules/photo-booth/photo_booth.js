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

const photobooth = document.querySelector('.make-photo');
photobooth.style.setProperty('--bgPosPhoto', '0');

const cameraWindow = document.createElement('video');
cameraWindow.style.setProperty('--videoVis', 'hidden');

photobooth.addEventListener('click', accessRequest);
photobooth.appendChild(cameraWindow);

const canvas = document.createElement('canvas');
photobooth.appendChild(canvas);
canvas.style.setProperty('--canvasDisp', 'none');
const ctx = canvas.getContext('2d');

const photoBoxBanner = photobooth.querySelector('.box_banner');
photoBoxBanner.style.setProperty('--photoBannerVis', 'visible');

let streamRec;
function accessRequest(event) {
  if (event.target.classList.contains('take-photo')) {
    return;
  }
  if (canvas.classList.contains('true')) {
    canvas.classList.remove('true');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  navigator.mediaDevices
  .getUserMedia({video: true, audio: false})
    .then((stream) => {
      rePhotoBtn.style.setProperty('--rephotoVis', 'hidden');
      photoBoxBanner.style.setProperty('--photoBannerVis', 'hidden');
      cameraWindow.style.setProperty('--videoVis', 'visible');
      streamRec = stream;
      try {
        cameraWindow.srcObject = stream;
      } catch(err) {
        cameraWindow.src = URL.createObjectURL(stream);
      }
      takePhotoBtn.style.setProperty('--takePhotoVis', 'visible');
  })
  .catch((err) => {
    console.log(err);
    errorMessage.style.setProperty('--errorMes', 'visible');
    errorMessage.textContent = 'Не удалось получить доступ к камере';
    setTimeout(() => {
      errorMessage.style.setProperty('--errorMes', 'hidden');
    }, 2000);
  });
}

function getPhoto() {
  audio.play();
  const droppedImg = document.querySelector('.droppedImg');
  if (droppedImg) {
    droppedImg.parentElement.removeChild(droppedImg);
    dropBanner.style.setProperty('--dropBannerVis', 'visible');
    dropPic.style.setProperty('--dropPic', 'visible');
  }
  takePhotoBtn.style.setProperty('--takePhotoVis', 'hidden');
  canvas.style.setProperty('--canvasDisp', 'block');
  canvas.width = cameraWindow.videoWidth;
  canvas.height = cameraWindow.videoHeight;
  canvas.classList.add('true');
  ctx.drawImage(cameraWindow, 0, 0);
  const img = document.createElement('img');
  img.src = canvas.toDataURL();
  img.addEventListener('load', () => rePhotoBtn.style.setProperty('--rephotoVis', 'visible'));
  streamRec.getTracks().forEach(track => track.stop());
  cameraWindow.style.setProperty('--videoVis', 'hidden');
  cameraWindow.src = URL.revokeObjectURL(streamRec);
}
