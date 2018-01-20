'use strict';
const chat = document.querySelector('#chat');
const chatTitleToClick = document.querySelector('.chat-title');
const newMessageForm = chat.querySelector('.message-box');
const inputMessForm = chat.querySelector('.message-input');
const sendMessBtn = chat.querySelector('.message-submit');
const messagesContent = chat.querySelector('.messages-content');
const chatStatus = chat.querySelector('.chat-status');

const messagesTemplates = chat.querySelector('.messages-templates');
const messageLoading = messagesTemplates.querySelector('div.message loading');
const messageUser= messagesTemplates.querySelector('.message-personal');
const messageStatus = messagesTemplates.querySelector('.message-status');
let wsConnect;

function wsOpen() {
	messagesContent.setAttribute('style', 'overflow-y:scroll');

	if (!messagesContent.querySelector('.message-status')) {
		messagesContent.appendChild(messageStatus.cloneNode(true));		
	}

	const messageStatusToRemove = messagesContent.querySelector('.message-status');
	const connectionChat = new WebSocket('wss://neto-api.herokuapp.com/chat');
	wsConnect = connectionChat;
	connectionChat.addEventListener('open', () => {
	messageStatusToRemove.parentElement.removeChild(messageStatusToRemove);
	chatStatus.textContent = chatStatus.dataset.online;
	sendMessBtn.disabled = false;
	inputMessForm.disabled = false;
});

	const messageAnotherUser = Array.from(document.querySelectorAll('.message'))
	.find(el => {
		if (!(el.classList.contains('loading') || 
            el.classList.contains('message-personal') || 
            el.classList.contains('message-status'))) {
			return el.cloneNode(true);
		}
	});
	
	connectionChat.addEventListener('message', (event) => {
		if (event.data === '...') {
			messagesContent.appendChild(messageLoading).cloneNode(true);
		}
		const date = new Date();
		messageAnotherUser.querySelector('.message-text').textContent = event.data;
		messageAnotherUser.querySelector('.timestamp').textContent = date.getHours() + ':' + date.getMinutes();
		messagesContent.appendChild(messageAnotherUser.cloneNode(true));
	});

	connectionChat.addEventListener('error', (error) => {
		console.log(error);
	});

	newMessageForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const date = new Date();
		connectionChat.send(inputMessForm.value);
		messageUser.querySelector('.message-text').textContent = inputMessForm.value;
		messageUser.querySelector('.timestamp').textContent = date.getHours() + ':' + date.getMinutes();
		messagesContent.appendChild(messageUser.cloneNode(true));
		inputMessForm.value = '';
	});

	connectionChat.addEventListener('close', () => {
		chatStatus.textContent = chatStatus.dataset.offline;
		sendMessBtn.disabled = true;
		inputMessForm.disabled = true;
		messagesContent.appendChild(messageStatus.cloneNode(true));	
	});

	window.addEventListener('beforeunload', () => {
		connectionChat.close(1000);
	});
}

chat.style.setProperty('--Top', '133%');
chat.style.setProperty('--Left', '75%');
let isFirstCallingChat = true;

function chatAnimation(condition = 'open') {
	let start = null;
	let timer = null;
	let top = 135;
	let bottom = 60;
	function tick(timestamp) {
		start = start || timestamp;
		const elapsedTime = timestamp - start;
		if (condition === 'open') {
			top -= 3;
			if (top < bottom) {
				return cancelAnimationFrame(timer);
			}
			chat.style.setProperty('--Top', `${top}%`);
		} else {
			bottom += 3;
			if (top < bottom) {
				return cancelAnimationFrame(timer);
			}
			chat.style.setProperty('--Top', `${bottom}%`);
		}
		timer = requestAnimationFrame(tick);
	}
	tick();
}


chatTitleToClick.addEventListener('click', () => {
	if (isFirstCallingChat) {
		chatAnimation();
		wsOpen();
		isFirstCallingChat = false;
	} else {
		chatAnimation('close');
		wsConnect.close(1000);
		const messageStatusToRemove = messagesContent.querySelector('.message-status');
		if (messageStatusToRemove) {
			messageStatusToRemove.parentElement.removeChild(messageStatusToRemove);
		}	
		isFirstCallingChat = true;
	}
});
