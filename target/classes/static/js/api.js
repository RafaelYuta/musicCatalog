const API_BASE_URL = "http://localhost:8080";

async function fetchApi(endpoint, method = "GET", body = null) {
    const headers = { "Content-Type": "application/json" };
    const options = { method, headers };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
    }
    return response.json();
}
