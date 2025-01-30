import { fetchWorks, fetchCategories } from './apis.js';
import { openModal } from './modal.js';

function displayWorks(works, categoryId) {
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    let displayedWorks = [...works];
    const token = sessionStorage.getItem("token");

    if (token != null) {
        const loginId = document.getElementById("loginId");
        const logoutId = document.getElementById("logoutId");
        const editionMode = document.getElementById("editionMode");

        editionMode.classList.remove("hidden");
        logoutId.classList.remove("hidden");
        loginId.classList.add("hidden");

        logoutId.addEventListener("click", function () {
            sessionStorage.removeItem("token");
            location.reload();
        });
    }

    if (categoryId && categoryId !== "all") {
        displayedWorks = works.filter(function (work) {
            return parseInt(work.category.id) === parseInt(categoryId)
        });
    }

    return displayedWorks.map(function (work) {
        const cardElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = work.title;

        divGallery.appendChild(cardElement);
        cardElement.appendChild(imageElement);
        cardElement.appendChild(titleElement);
    });
};

function displayFilters(categories, works) {
    const token = sessionStorage.getItem("token");

    if (token != null) {
        const modif = document.getElementById("modif");
        modif.classList.remove("hidden");
    } else {
        const categoriesToDisplay = [...categories];
        categoriesToDisplay.unshift({ id: "all", name: "Tous" });

        return categoriesToDisplay.map(function (category) {
            const button = document.createElement("button");
            const filters = document.querySelector(".filters");

            button.setAttribute("data-id", category.id);
            button.innerText = category.name;

            button.addEventListener("click", function () {
                displayWorks(works, button.dataset.id);
            });

            filters.appendChild(button);
        });
    }
};

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);
});



async function main() {
    const categories = await fetchCategories();
    const works = await fetchWorks();

    displayWorks(works);
    displayFilters(categories, works);

}

main();