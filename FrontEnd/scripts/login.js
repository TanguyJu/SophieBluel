import { postLogin } from "./apis.js";

function errorMessage(message) {
    let section = document.getElementById("login");
    let spanError = document.getElementById("errorMessage");

    if (!spanError) {
        spanError = document.createElement("div");
        spanError.id = "errorMessage";
        section.appendChild(spanError);
    }

    spanError.innerText = message;
};

async function handleLogin(event) {
    event.preventDefault();
    try {
        const loginData = JSON.stringify({
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        });

        const token = await postLogin(loginData);

        window.sessionStorage.setItem("token", token);
        window.location.href = "index.html";
    }
    catch (error) {
        errorMessage(error);
    }
};

const formLogin = document.querySelector(".login-form");
formLogin.addEventListener("submit", handleLogin);