const textarea = document.querySelector("#chat");
const input = document.querySelector("#chat-input");
const send_btn = document.querySelector("#send-button");
const end_chat_btn = document.querySelector("#end-chat-button");

const params = new URLSearchParams(window.location.search);
const chatId = params.get("chat_id");
let first_name;

input.onkeydown = function(e) {
    if (e.key == "Enter") {
        sendChat();
    }
}

send_btn.onclick = function() {
    sendChat();
}

end_chat_btn.onclick = async function() {
    let response = await fetch("http://localhost:3000/end_chat", {
        method: "POST",
        body: JSON.stringify({chat_id: chatId}),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (response.status === 200) {
        window.location.href = "/";
    }
}

async function sendChat() {
    const message = input.value;
    textarea.value += "You: " + message + "\r\n\n";
    input.value = "";

    data = {
        chat_id: chatId,
        message: message,
    };

    let response = await fetch("http://localhost:3000/update_chat", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (response.status === 200) {
        responseData = await response.json();
        textarea.value += `${first_name}: ${responseData.message}\r\n\n`;
    }
}

(async function(chatId) {
    const postParams = {
        method: "POST",
        body: JSON.stringify({ chat_id: chatId }),
        headers: {
            "Content-type": "application/json"
        }
    };

    const matchInfo = await fetch("http://localhost:3000/match_information", postParams);

    if (matchInfo.status === 200) {
        const matchData = await matchInfo.json();
        first_name = matchData.first_name;

        document.getElementById("display-fullname").textContent = `You were matched with: ${matchData.first_name} ${matchData.last_name}`;
        document.getElementById("display-funfacts").textContent = `Fun facts about ${matchData.first_name}`;
        document.getElementById("display-email").textContent = matchData.email;
        document.getElementById("display-major").textContent = matchData.major;
        document.getElementById("display-year").textContent = matchData.year;
        document.querySelector("#display-why strong").textContent = `Why ${matchData.first_name}?`;
        document.getElementById("display-explanation").textContent = matchData.explanation;
        document.getElementById("display-icebreaker").textContent = `"${matchData.icebreaker}"`;
    }

    const chatHistory = await fetch("http://localhost:3000/chat_history", postParams);

    if (chatHistory.status === 200) {
        const responseData = await chatHistory.json();

        responseData.forEach((message) => {
            if (message.is_user) 
                textarea.value += `You: ${message.text}\r\n\n`;
            else 
                textarea.value += `${first_name}: ${message.text}\r\n\n`;
        });
    }
})(chatId);