import { fetchWorks } from './apis.js';

const works = await fetchWorks();

let modal = null;

export async function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    modal = target;
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    displayedWorks(works)
};

async function closeModal(event) {
    if (modal === null)
        return;
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
};

function stopPropagation(event) {
    event.stopPropagation();
};

function displayedWorks(works) {
    const divGallery = document.querySelector(".modal-gallery");
    divGallery.innerHTML = "";
    let displayedWorks = [...works];
    return displayedWorks.map(function (work) {
        const cardElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const closeElement = document.createElement("button");
        closeElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        closeElement.setAttribute("class", "delete-btn");
        closeElement.setAttribute("type", "submit");
        closeElement.setAttribute("data-id", work.id);
        imageElement.src = work.imageUrl;

        divGallery.appendChild(cardElement);
        cardElement.appendChild(closeElement);
        cardElement.appendChild(imageElement);

        closeElement.addEventListener("click", deleteWork);
    });
};

async function deleteWork(event) {
    event.preventDefault();

    const button = event.target.closest(".delete-btn");
    const btnId = button.getAttribute("data-id");
    const token = sessionStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:5678/api/works/${btnId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
        }

        button.closest("figure").remove();

        const galleryImage = document.querySelector(`.gallery img[src="${button.nextElementSibling.src}"]`);
        if (galleryImage) {
            galleryImage.closest("figure").remove();
        }

    } catch (error) {
        console.error("Erreur:", error);
    };
};

