async function carregarGeneros() {
    const lista = document.getElementById("listaGeneros");
    lista.innerHTML = "<p>Carregando gêneros...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/genero`);
        if (!response.ok) throw new Error("Erro ao buscar gêneros");

        const generos = await response.json();
        if (generos.length === 0) {
            lista.innerHTML = "<p>Nenhum gênero cadastrado.</p>";
            return;
        }

        let html = "<table>";
        html += "<tr><th>Gênero</th><th>Discos</th><th>Faixas</th><th>Artistas</th><th>Ações</th></tr>";
        generos.forEach(genero => {
            const discos = (genero.discos || []).join(", ") || "Nenhum disco";
            const faixas = (genero.faixas || []).join(", ") || "Nenhuma faixa";
            const artistas = (genero.artistas || []).join(", ") || "Nenhum artista";

            html += `
                <tr>
                    <td>${genero.genero}</td>
                    <td>${discos}</td>
                    <td>${faixas}</td>
                    <td>${artistas}</td>
                    <td>
                        <button onclick="editarGenero(${genero.id})">Editar</button>
                        <button onclick="excluirGenero(${genero.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
        html += "</table>";

        lista.innerHTML = html;
    } catch (error) {
        lista.innerHTML = `<p>Erro ao carregar gêneros: ${error.message}</p>`;
    }
}

function mostrarFormularioGenero() {
    const formulario = document.getElementById("formularioGenero");
    formulario.style.display = "block";
    document.getElementById("formularioTitulo").textContent = "Adicionar Gênero";
    document.getElementById("nomeGenero").value = "";
    document.getElementById("generoId").value = "";
}

function cancelarFormularioGenero() {
    const formulario = document.getElementById("formularioGenero");
    formulario.style.display = "none";
}

async function salvarGenero(event) {
    event.preventDefault();

    const id = document.getElementById("generoId").value;
    const nomeGenero = document.getElementById("nomeGenero").value;

    const url = id ? `${API_BASE_URL}/genero/atualizar/${id}` : `${API_BASE_URL}/genero/criar`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genero: nomeGenero })
        });

        if (!response.ok) throw new Error("Erro ao salvar gênero");

        alert(id ? "Gênero atualizado com sucesso!" : "Gênero criado com sucesso!");
        cancelarFormularioGenero();
        carregarGeneros();
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

async function editarGenero(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/genero/${id}`);
        if (!response.ok) throw new Error("Gênero não encontrado");

        const genero = await response.json();
        mostrarFormularioGenero();
        document.getElementById("formularioTitulo").textContent = "Editar Gênero";
        document.getElementById("nomeGenero").value = genero.genero;
        document.getElementById("generoId").value = genero.id;
    } catch (error) {
        alert(`Erro ao carregar gênero: ${error.message}`);
    }
}


async function excluirGenero(id) {
    if (!confirm("Tem certeza que deseja excluir este gênero?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/genero/deletar/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir gênero");

        alert("Gênero excluído com sucesso!");
        carregarGeneros();
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

function mostrarFormularioAtrelar(generoId) {
    const formulario = document.getElementById("formularioAtrelar");
    formulario.style.display = "block";
    document.getElementById("generoAtrelar").value = generoId;
    carregarGenerosDropdown();
}

function cancelarAtrelar() {
    const formulario = document.getElementById("formularioAtrelar");
    formulario.style.display = "none";
}

async function carregarGenerosDropdown() {
    const generoSelect = document.getElementById("generoAtrelar");
    try {
        const response = await fetch(`${API_BASE_URL}/genero`);
        if (!response.ok) throw new Error("Erro ao buscar gêneros");

        const generos = await response.json();
        generoSelect.innerHTML = "<option value=''>Selecione um gênero</option>";
        generos.forEach(genero => {
            const option = document.createElement("option");
            option.value = genero.id;
            option.textContent = genero.genero;
            generoSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar gêneros:", error.message);
    }
}

async function carregarElementosAtrelar() {
    const tipo = document.getElementById("tipoAtrelar").value;
    const elementoSelect = document.getElementById("elementoAtrelar");
    let url;

    switch (tipo) {
        case "disco":
            url = `${API_BASE_URL}/disco`;
            break;
        case "faixa":
            url = `${API_BASE_URL}/faixa`;
            break;
        case "artista":
            url = `${API_BASE_URL}/artista`;
            break;
        default:
            elementoSelect.innerHTML = "<option value=''>Selecione um tipo primeiro</option>";
            return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar elementos");

        const elementos = await response.json();
        elementoSelect.innerHTML = "<option value=''>Selecione</option>";
        elementos.forEach(elemento => {
            const option = document.createElement("option");
            option.value = elemento.id;
            option.textContent = elemento.titulo || elemento.name || "Sem título";
            elementoSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar elementos:", error.message);
    }
}

async function atrelarGenero(event) {
    event.preventDefault();

    const generoId = document.getElementById("generoAtrelar").value;
    const elementoId = document.getElementById("elementoAtrelar").value;
    const tipo = document.getElementById("tipoAtrelar").value;

    if (!generoId || !elementoId || !tipo) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const url = `${API_BASE_URL}/genero/${generoId}/vincular-${tipo}/${elementoId}`;

    try {
        const response = await fetch(url, { method: "PUT" });
        if (!response.ok) throw new Error("Erro ao atrelar gênero");

        alert("Gênero atrelado com sucesso!");
        cancelarAtrelar();
        carregarGeneros();
    } catch (error) {
        alert(`Erro ao atrelar gênero: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", carregarGeneros);
