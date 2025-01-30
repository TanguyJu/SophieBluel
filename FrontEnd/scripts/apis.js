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
    try {
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
    
    } catch(error) {
        throw new Error("L'email ou le mot de passe est incorrect");
    }
}

