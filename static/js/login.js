const request_btn = document.querySelector("#request-button");
const edit_email_btn = document.querySelector("#edit-email-button");
const continue_btn = document.querySelector("#continue-button");
const connect_btn = document.querySelector("#connect-button");

const email_box = document.querySelector("#login-box");
const code_box = document.querySelector("#code-box");
const intro_box = document.querySelector("#intro-box");
const email_display = document.querySelector("#entered-email-value");
const email_input_form = document.getElementById('email-form');

const about_input_form = document.getElementById('about-form');

request_btn.addEventListener("click", (e) => {
    requestHandler();
});

email_input_form.onkeydown = function(e) {
    if (e.key == "Enter") {
        requestHandler();
    }
}

edit_email_btn.addEventListener("click", (e) => {
    email_box.style.display = "flex";
    code_box.style.display = "none";
    email_input_form.value = "";
});

continue_btn.addEventListener("click", (e) => {
    continueHandler();
});

connect_btn.addEventListener("click", (e) => {
    connectHandler();
});

async function requestHandler() {
    email_value = email_input_form.value;
    console.log(email_value);

    data = {
        email: email_value,
    };

    let response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (response.status === 200) {
        const responseData = await response.json();

        if (responseData["email"]) {
            console.log(responseData);

            document.getElementById("display-name").textContent = responseData.full_name;
            document.getElementById("display-email").textContent = responseData.email;
            document.getElementById("display-major").textContent = responseData.major;
            document.getElementById("display-year").textContent = responseData.year;

            email_box.style.display = "none";
            code_box.style.display = "flex";
            email_display.innerText = email_value;
        }
        else {
            // Notify no user found.
        }
    }
}

async function continueHandler() {
    let response = await fetch("http://localhost:3000/check_match", {
        method: "POST",
        body: JSON.stringify({email: document.getElementById("display-email").textContent}),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (response.status === 200) {
        responseData = await response.json();
        console.log(responseData);
        if (responseData["chat_id"])
            window.location.href = `/chat?chat_id=${encodeURIComponent(responseData["chat_id"])}`;
    }

    code_box.style.display = "none";
    intro_box.style.display = "flex";
}

async function connectHandler() {
    data = {
        email: document.getElementById("display-email").textContent,
        about: about_input_form.value,
    };

    let response = await fetch("http://localhost:3000/connect", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    });

    if (response.status === 200) {
        responseData = await response.json();
        console.log(responseData);
        if (responseData["chat_id"])
            window.location.href = `/chat?chat_id=${encodeURIComponent(responseData["chat_id"])}`;
    }
}