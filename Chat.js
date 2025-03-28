document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('message-input');
    const sendBtn = document.querySelector('.send-btn');
    const messagesContainer = document.getElementById('messages');
    const greeting = document.getElementById('greeting');
    const suggestions = document.getElementById('suggestions');
    const typingText = document.getElementById('typing-text');
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    const aiName = "Suhu";
    let chatStarted = false;

    // Typing animation for initial text
    const fullText = "Hey, how can I help?";
    let index = 0;
    const typeInterval = setInterval(() => {
        typingText.textContent = fullText.slice(0, index);
        index++;
        if (index > fullText.length) clearInterval(typeInterval);
    }, 100);

    // Handle message sending
    function sendMessage(message) {
        if (message.trim() === "") return;

        // Hide greeting and suggestions when chat starts
        if (!chatStarted) {
            greeting.style.display = 'none';
            suggestions.style.display = 'none';
            chatStarted = true;
            input.focus();
        }

        // User message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.innerHTML = `
            <div>${message}</div>
            <span class="icon">👤</span>
        `;
        messagesContainer.appendChild(userMsg);

        // Show loading state
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message loading';
        loadingMsg.innerHTML = `
            <span class="text-xs font-medium px-2">${aiName}</span>
            <div class="flex items-center gap-2">
                <span class="animate-spin">⏳</span>
                Typing...
            </div>
        `;
        messagesContainer.appendChild(loadingMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            messagesContainer.removeChild(loadingMsg);
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai';
            aiMsg.innerHTML = `
                <span class="icon">🧠</span>
                <div>I am ${aiName}, and this is a simulated response.</div>
            `;
            messagesContainer.appendChild(aiMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500);

        input.value = '';
    }

    // Event Listeners
    sendBtn.addEventListener('click', () => sendMessage(input.value));

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input.value);
        }
    });

    suggestionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const message = btn.getAttribute('data-message');
            input.value = message;
            sendMessage(message);
        });
    });
});