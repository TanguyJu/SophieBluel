const BASE_URL = 'http://localhost:5678/api';

export async function fetchWorks() {
    const response = await fetch(`${BASE_URL}/works`);
    return await response.json();
}

export async function fetchCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    return await response.json();
}

export async function postLogin(body) {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body
    });
    
    const data = await response.json();
    
    if (!data || !data.token) {
        throw new Error("L'email ou le mot de passe est incorrect");
    }
    return data.token;
}

export async function deleteWork(workId) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/works/${workId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
    }
    return;
}

export async function postWork(formData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/works`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du projet.");
    }

    return await response.json();
}