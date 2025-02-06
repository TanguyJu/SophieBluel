import { deleteWork, fetchWorks, fetchCategories, postWork } from './apis.js';
import { displayWorks as updateMainGallery } from './main.js';

let works = await fetchWorks();
let modal = null;
let modal2 = null;

// Function to open modals

export async function openModal(event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute("href"));
    target.style.display = null;
    target.removeAttribute("aria-hidden");
    modal = target;
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
    displayWorks();

    document.getElementById("addPhotoBtn").addEventListener("click", function (event) {
        event.preventDefault();

        document.querySelector("#modal1").style.display = "none";
        modal2 = document.querySelector("#modal2");
        modal2.style.display = null;
        modal2.removeAttribute("aria-hidden");
        populateCategories();
        modal2.querySelector("form").addEventListener("submit", handleFormSubmit);
        document.querySelector("#image").addEventListener("change", previewImage);
        modal2.addEventListener("click", closeModal);
        modal2.querySelector(".js-modal-close").addEventListener("click", closeModal);
        modal2.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);

        document.querySelector(".js-back-btn").addEventListener("click", function(event) {
            event.preventDefault();
        
            document.querySelector("#modal2").style.display = "none"; 
            const modal1 = document.querySelector("#modal1"); 
            modal1.style.display = null;
            modal1.removeAttribute("aria-hidden");
        });
    });
};

// Function to close modals

async function closeModal(event) {
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;

    if (modal2 === null) return;
    event.preventDefault();
    modal2.style.display = "none";
    modal2.setAttribute("aria-hidden", "true");
    modal2.removeEventListener("click", closeModal);
    modal2.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal2.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal2 = null;
};

function stopPropagation(event) {
    event.stopPropagation();
};

// Function to display image in modal

function displayWorks() {
    const divGallery = document.querySelector(".modal-gallery");
    divGallery.innerHTML = "";
    return works.map(function (work) {
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

        closeElement.addEventListener("click", removeWork);
    });
};

// Function to delete projects in MainGallery and in ModalGallery

async function removeWork(event) {
    event.preventDefault();

    const button = event.target.closest(".delete-btn");
    const workId = button.getAttribute("data-id");

    try {
        await deleteWork(workId);
        works = works.filter(work => work.id != workId);
        displayWorks();
        updateMainGallery(works);
    } catch (error) {
        console.error("Erreur:", error);
    };
};

// Function to display the categories in the modal

async function populateCategories() {
    const categories = await fetchCategories();
    const categorySelect = document.querySelector("#category");

    categorySelect.innerHTML = "";

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Function to submit the adding projects form

async function handleFormSubmit(event) {
    event.preventDefault();

    clearErrorMessages();

    const titleInput = document.querySelector("#title");
    const imageInput = document.querySelector("#image");
    const categoryInput = document.querySelector("#category");
    let hasError = false;


    if (!titleInput.value) {
        displayErrorMessage("title-error", "Veuillez entrer un titre.");
        hasError = true;
    }

    if (!imageInput.files.length) {
        displayErrorMessage("image-error", "Veuillez sélectionner une image.");
        hasError = true;
    } else {
        const file = imageInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSizeInBytes = 4 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            displayErrorMessage("image-error", "Le fichier doit être au format JPG ou PNG.");
            hasError = true;
        }

        if (file.size > maxSizeInBytes) {
            displayErrorMessage("image-error", "La taille du fichier ne doit pas dépasser 4 Mo.");
            hasError = true;
        }
    }

    if (!categoryInput.value) {
        displayErrorMessage("category-error", "Veuillez sélectionner une catégorie.");
        hasError = true;
    }

    if (hasError) return;

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("image", imageInput.files[0]);
    formData.append("category", categoryInput.value);

    try {
        const newWork = await postWork(formData);
        works.push(newWork);
        displayWorks();
        updateMainGallery(works);

        event.target.reset();
        const previewImage = document.querySelector(".image-preview");
        previewImage.innerHTML = "";
        previewImage.style = "display: none;";
        document.querySelector(".upload-box").removeAttribute("style");
        closeModal(event);
    } catch (error) {
        displayErrorMessage("image-error", "Erreur lors de l'ajout du projet : " + error.message);
    }
}

// Function to preview the new image

function previewImage(event) {
    const file = event.target.files[0];

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgPreview = document.querySelector(".image-preview");
            const uploadBox = document.querySelector(".upload-box");


            imgPreview.innerHTML = "";

            uploadBox.style = "display: none;";
            imgPreview.style = "display: flex;";
            const imgElement = document.createElement("img");
            imgElement.id= "image";
            imgElement.src = e.target.result;
            imgElement.alt = "Aperçu de l'image";

            imgPreview.appendChild(imgElement);
        };

        reader.readAsDataURL(file);
    } else {
        displayErrorMessage("image-error", "Le fichier doit être au format JPG ou PNG.");
        event.target.value = "";
    }
}

// Function to display Error message

function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Function to clear Error message

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(element => element.textContent = "");
}

