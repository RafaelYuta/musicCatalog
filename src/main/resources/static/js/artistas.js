async function carregarArtistas() {
    const lista = document.getElementById("listaArtistas");
    lista.innerHTML = "<p>Carregando artistas...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/artista`);
        if (!response.ok) throw new Error("Erro ao buscar artistas");
        const artistas = await response.json();

        if (artistas.length === 0) {
            lista.innerHTML = "<p>Nenhum artista cadastrado.</p>";
            return;
        }

        let html = "<table>";
        html += "<tr><th>Nome</th><th>Discos</th><th>Gêneros</th><th>Ações</th></tr>";
        artistas.forEach(artista => {
            const discos = (artista.discos || []).join(", ") || "Nenhum disco";
            const generos = (artista.generos || []).join(", ") || "Nenhum gênero";

            html += `
                <tr>
                    <td>${artista.name}</td>
                    <td>${discos}</td>
                    <td>${generos}</td>
                    <td>
                        <button onclick="editarArtista(${artista.id})">Editar</button>
                        <button onclick="excluirArtista(${artista.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
        html += "</table>";

        lista.innerHTML = html;
    } catch (error) {
        console.error(error); // Exiba o erro no console para depuração
        lista.innerHTML = `<p>Erro ao carregar artistas: ${error.message}</p>`;
    }
}


function mostrarFormularioCriar() {
    const formulario = document.getElementById("formularioArtista");
    formulario.style.display = "block";
    document.getElementById("formularioTitulo").textContent = "Adicionar Artista";
    document.getElementById("nome").value = "";
    document.getElementById("artistaId").value = "";
}

function cancelarFormulario() {
    const formulario = document.getElementById("formularioArtista");
    formulario.style.display = "none";
}

async function salvarArtista(event) {
    event.preventDefault();

    const id = document.getElementById("artistaId").value;
    const nome = document.getElementById("nome").value;

    const url = id ? `${API_BASE_URL}/artista/atualizar/${id}` : `${API_BASE_URL}/artista/criar`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nome })
        });

        if (!response.ok) throw new Error("Erro ao salvar artista");

        alert(id ? "Artista atualizado com sucesso!" : "Artista criado com sucesso!");
        cancelarFormulario();
        carregarArtistas();
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

async function editarArtista(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/artista/${id}`);
        if (!response.ok) throw new Error("Artista não encontrado");

        const artista = await response.json();
        mostrarFormularioCriar();
        document.getElementById("formularioTitulo").textContent = "Editar Artista";
        document.getElementById("nome").value = artista.name;
        document.getElementById("artistaId").value = artista.id;
    } catch (error) {
        alert(`Erro ao carregar artista: ${error.message}`);
    }
}

async function excluirArtista(id) {
    if (!confirm("Tem certeza que deseja excluir este artista?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/artista/deletar/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir artista");

        alert("Artista excluído com sucesso!");
        carregarArtistas();
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", carregarArtistas);
