import { fetchWorks, fetchCategories } from './apis.js';

function displayWorks(works, categoryId) {
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    let displayedWorks = [...works];
    let token = sessionStorage.getItem("token");

    if(token != null){

        const loginId = document.getElementById("loginId");
        const logoutId = document.getElementById("logoutId");
        const editionMode = document.getElementById("editionMode");

        editionMode.classList.remove("hidden");
        logoutId.classList.remove("hidden");
        loginId.classList.add("hidden");

        logoutId.addEventListener("click", function() {
            sessionStorage.removeItem("token");
            location.reload();
        });

        if (categoryId && categoryId !== "all") {
            displayedWorks = works.filter(function(work) {
                return parseInt(work.category.id) === parseInt(categoryId)
            });
        }
    
        return displayedWorks.map(function(work) {
            const cardElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
    
            const titleElement = document.createElement("figcaption");
            titleElement.innerText = work.title;
    
            divGallery.appendChild(cardElement);
            cardElement.appendChild(imageElement);
            cardElement.appendChild(titleElement);
        });

    }else{
    if (categoryId && categoryId !== "all") {
        displayedWorks = works.filter(function(work) {
            return parseInt(work.category.id) === parseInt(categoryId)
        });
    }

    return displayedWorks.map(function(work) {
        const cardElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;

        divGallery.appendChild(cardElement);
        cardElement.appendChild(imageElement);
        cardElement.appendChild(titleElement);
    });
}};

function displayFilters(categories, works) {
    const categoriesToDisplay = [...categories];
    categoriesToDisplay.unshift({ id: "all", name: "Tous" });
    let token = sessionStorage.getItem("token");

    if(token != null){
        const modif = document.getElementById("modif");
        modif.classList.remove("hidden");
    }else{

    return categoriesToDisplay.map(function(category) {
        const button = document.createElement("button");
        const filters = document.querySelector(".filters");

        button.setAttribute("data-id", category.id);
        button.innerText = category.name;

        button.addEventListener("click", function() {
            displayWorks(works, button.dataset.id);
        });

        filters.appendChild(button);
    });
}};

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

function listenerLogin() {
    const formLogin = document.querySelector(".login-form");
    formLogin.addEventListener("submit", function(event){
        event.preventDefault();

        const loginData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        };

        const login = JSON.stringify(loginData);

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        "Accept": "application/json",
            },
            body: login
        })
        .then(response => {
            if (!response.ok) {
              throw new Error("L'email ou le mot de passe est incorrect");
            }
            return response.json(); 
          })
          .then(data => {

          if (data.token){
            window.sessionStorage.setItem("token", data.token);
            window.location.href = "index.html"
          }
            })

          .catch(error => {
            errorMessage(error);
          });

    });
};

async function main() {
    const categories = await fetchCategories();
    const works = await fetchWorks();

    displayWorks(works);
    displayFilters(categories, works);
    
}
main();
listenerLogin();