const BASE_URL = 'http://localhost:5678/api';

export async function fetchWorks() {
    const response = await fetch(`${BASE_URL}/works`);
    return await response.json();
}

export async function fetchCategories() {
    const response = await fetch(`${BASE_URL}/categories`);
    return await response.json();
}

export async function postLogin() {
    
}