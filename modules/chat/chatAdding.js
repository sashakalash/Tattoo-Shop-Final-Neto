'use strict';
const fragment = document.createDocumentFragment();
const chatBlock = document.createElement('div');
chatBlock.classList.add('chat');
chatBlock.textContent = `<div class="chat-title">
<h1>Онлайн-консультант</h1>
<h2 class="chat-status" data-online="в сети" data-offline="не в сети">не в сети</h2>
<figure class="avatar">
<img src="modules/chat/garold.jpg">
</figure>
</div>
<div class="messages">
<div class="messages-templates">
<div class="message loading">
    <figure class="avatar"><img src="modules/chat/garold.jpg" /></figure>
    <span></span>
</div>
<div class="message">
    <figure class="avatar"><img src="modules/chat/garold.jpg" /></figure>
    <span class="message-text">Привет!</span>
    <div class="timestamp">12:56</div>
</div>
<div class="message message-personal">
    <span class="message-text">Привет</span>
    <div class="timestamp">12:56</div>
</div>
<div class="message message-status">
    <span class="message-text">Пользователь не в сети</span>
</div>
</div>
<div class="messages-content">
</div>
</div>
<form class="message-box" action="/404/" method="POST">
<input type="text" class="message-input" placeholder="Ваше сообщение …">
<button disabled type="submit" class="message-submit">Отправить</button>
</form>`;

fragment.appendChild(chatBlock);
document.addEventListener('DOMContentLoaded', () => {
    console.log('ok')
    document.appendChild(fragment);
});
