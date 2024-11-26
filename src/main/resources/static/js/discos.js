async function buscar(event) {
    event.preventDefault();

    const tituloBusca = document.getElementById("tituloBusca").value.toLowerCase().trim();
    const artistaBusca = document.getElementById("artistaBusca").value.toLowerCase().trim();
    const generoBusca = document.getElementById("generoBusca").value.toLowerCase().trim();

    try {
        const response = await fetch(`${API_BASE_URL}/disco`);
        if (!response.ok) throw new Error("Erro ao buscar discos");

        const discos = await response.json();
        if (discos.length === 0) {
            document.getElementById("listaDiscos").innerHTML = "<p>Nenhum disco encontrado.</p>";
            return;
        }

        // Filtra discos com base nos critérios de pesquisa
        const discosFiltrados = discos.filter(disco => {
            const tituloMatch = disco.titulo.toLowerCase().includes(tituloBusca);
            const artistaMatch = disco.artista && disco.artista.toLowerCase().includes(artistaBusca);
            const generoMatch = disco.generos && disco.generos.some(genero => genero.toLowerCase().includes(generoBusca));
            
            // A pesquisa será válida se pelo menos um campo (título, artista ou gênero) for uma correspondência
            return (tituloBusca === "" || tituloMatch) && 
                   (artistaBusca === "" || artistaMatch) && 
                   (generoBusca === "" || generoMatch);
        });

        // Se não houver discos que correspondem aos filtros
        if (discosFiltrados.length === 0) {
            document.getElementById("listaDiscos").innerHTML = "<p>Nenhum disco encontrado com os critérios fornecidos.</p>";
            return;
        }

        // Exibe a lista de discos filtrados
        let html = "<table>";
        html += "<tr><th>Título</th><th>Ano</th><th>Artista</th><th>Gêneros</th><th>Quantidade de Faixas</th><th>Capa</th></tr>";
        discosFiltrados.forEach(disco => {
            const generos = (disco.generos || []).join(", ") || "Nenhum gênero";
            const artista = disco.artista || "Nenhum artista";
            const quantidadeFaixas = disco.faixas ? disco.faixas.length : 0;

            html += `
                <tr>
                    <td>${disco.titulo}</td>
                    <td>${disco.ano}</td>
                    <td>${artista}</td>
                    <td>${generos}</td>
                    <td>${quantidadeFaixas} faixas</td>
                    <td>
                        ${disco.image ? `<img src="${disco.image}" alt="Capa" width="50">` : "Sem capa"}
                    </td>
                </tr>
            `;
        });
        html += "</table>";

        document.getElementById("listaDiscos").innerHTML = html;
    } catch (error) {
        document.getElementById("listaDiscos").innerHTML = `<p>Erro ao realizar busca: ${error.message}</p>`;
    }
}


async function carregarDiscos() {
    const lista = document.getElementById("listaDiscos");
    lista.innerHTML = "<p>Carregando discos...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/disco`);
        if (!response.ok) throw new Error("Erro ao buscar discos");

        const discos = await response.json();
        if (discos.length === 0) {
            lista.innerHTML = "<p>Nenhum disco cadastrado.</p>";
            return;
        }

        let html = "<table>";
        html += "<tr><th>Título</th><th>Ano</th><th>Artista</th><th>Gêneros</th><th>Quantidade de Faixas</th><th>Capa</th></tr>";
        discos.forEach(disco => {
            const generos = (disco.generos || []).join(", ") || "Nenhum gênero";
            const artista = disco.artista || "Nenhum artista";
            const quantidadeFaixas = disco.faixas ? disco.faixas.length : 0;

            html += `
                <tr>
                    <td>${disco.titulo}</td>
                    <td>${disco.ano}</td>
                    <td>${artista}</td>
                    <td>${generos}</td>
                    <td>${quantidadeFaixas} faixas</td>
                    <td>
                        ${disco.image ? `<img src="${disco.image}" alt="Capa" width="50">` : "Sem capa"}
                    </td>
                </tr>
            `;
        });
        html += "</table>";

        lista.innerHTML = html;
    } catch (error) {
        lista.innerHTML = `<p>Erro ao carregar discos: ${error.message}</p>`;
    }
}

function mostrarFormularioFaixas() {
    const formulario = document.getElementById("formularioFaixas");
    formulario.style.display = "block";
    carregarDiscosDropdownFaixas();
}

function cancelarFormularioFaixas() {
    const formulario = document.getElementById("formularioFaixas");
    formulario.style.display = "none";
}

function adicionarNovaFaixa() {
    const container = document.getElementById("novaFaixasContainer");
    const input = document.createElement("input");
    input.type = "text";
    input.className = "novaFaixa";
    input.placeholder = "Nome da faixa";
    container.appendChild(input);
}

async function carregarDiscosDropdownFaixas() {
    const selectDiscos = document.getElementById("discoIdFaixas");
    try {
        const response = await fetch(`${API_BASE_URL}/disco`);
        if (!response.ok) throw new Error("Erro ao buscar discos");
        
        const discos = await response.json();
        selectDiscos.innerHTML = '<option value="">Selecione um disco</option>';
        discos.forEach(disco => {
            const option = document.createElement("option");
            option.value = disco.id;
            option.textContent = disco.titulo;
            selectDiscos.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar discos no dropdown:", error.message);
    }
}

async function criarEAtrelarFaixas(event) {
    event.preventDefault();

    const discoId = document.getElementById("discoIdFaixas").value;
    const faixasInputs = document.querySelectorAll("#novaFaixasContainer .novaFaixa");
    const faixas = Array.from(faixasInputs)
        .map(input => input.value.trim())
        .filter(value => value !== "");

    if (!discoId || faixas.length === 0) {
        alert("Selecione um disco e adicione pelo menos uma faixa.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/disco/${discoId}/adicionar-faixas`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(faixas.map(name => ({ name }))),
        });

        if (!response.ok) throw new Error("Erro ao criar e atrelar faixas");

        alert("Faixas criadas e atreladas ao disco com sucesso!");
        cancelarFormularioFaixas();
        carregarDiscos();
    } catch (error) {
        alert(`Erro ao criar e atrelar faixas: ${error.message}`);
    }
}


function mostrarFormularioDisco() {
    const formulario = document.getElementById("formularioDisco");
    formulario.style.display = "block";
    document.getElementById("formularioTitulo").textContent = "Adicionar Disco";
    document.getElementById("titulo").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("imagem").value = "";
    document.getElementById("discoId").value = "";
}

function cancelarFormulario() {
    const formulario = document.getElementById("formularioDisco");
    formulario.style.display = "none";
}

async function salvarDisco(event) {
    event.preventDefault();

    const id = document.getElementById("discoId").value;
    const titulo = document.getElementById("titulo").value;
    const ano = document.getElementById("ano").value;
    const imagem = document.getElementById("imagem").files[0];

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("ano", ano);
    if (imagem) formData.append("image", imagem);

    const url = id ? `${API_BASE_URL}/disco/atualizar/${id}` : `${API_BASE_URL}/disco/criar`;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            body: formData,
        });

        if (!response.ok) throw new Error("Erro ao salvar disco");

        alert(id ? "Disco atualizado com sucesso!" : "Disco criado com sucesso!");
        cancelarFormulario();
        carregarDiscos();
    } catch (error) {
        alert(`Erro ao salvar disco: ${error.message}`);
    }
}

async function editarDisco(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/disco/${id}`);
        if (!response.ok) throw new Error("Disco não encontrado");

        const disco = await response.json();
        mostrarFormularioDisco();
        document.getElementById("formularioTitulo").textContent = "Editar Disco";
        document.getElementById("titulo").value = disco.titulo;
        document.getElementById("ano").value = disco.ano;
        document.getElementById("discoId").value = disco.id;
    } catch (error) {
        alert(`Erro ao carregar disco: ${error.message}`);
    }
}

async function excluirDisco(id) {
    if (!confirm("Tem certeza que deseja excluir este disco?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/disco/deletar/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir disco");

        alert("Disco excluído com sucesso!");
        carregarDiscos();
    } catch (error) {
        alert(`Erro ao excluir disco: ${error.message}`);
    }
}

function mostrarFormularioAtrelacao() {
    const formulario = document.getElementById("formularioAtrelacao");
    formulario.style.display = "block";
    carregarDiscosDropdown();
    carregarArtistasDropdown();
}

function cancelarAtrelacao() {
    const formulario = document.getElementById("formularioAtrelacao");
    formulario.style.display = "none";
}

async function carregarDiscosDropdown() {
    const selectDiscos = document.getElementById("discoIdAtrelacao");
    try {
        const response = await fetch(`${API_BASE_URL}/disco`);
        if (!response.ok) throw new Error("Erro ao buscar discos");
        
        const discos = await response.json();
        selectDiscos.innerHTML = '<option value="">Selecione um disco</option>';
        discos.forEach(disco => {
            const option = document.createElement("option");
            option.value = disco.id;
            option.textContent = disco.titulo;
            selectDiscos.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar discos no dropdown:", error.message);
    }
}

async function carregarArtistasDropdown() {
    const selectArtistas = document.getElementById("artistaIdAtrelacao");
    try {
        const response = await fetch(`${API_BASE_URL}/artista`);
        if (!response.ok) throw new Error("Erro ao buscar artistas");
        
        const artistas = await response.json();
        selectArtistas.innerHTML = '<option value="">Selecione um artista</option>';
        artistas.forEach(artista => {
            const option = document.createElement("option");
            option.value = artista.id;
            option.textContent = artista.name;
            selectArtistas.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar artistas no dropdown:", error.message);
    }
}

async function atrelarDiscoArtista(event) {
    event.preventDefault();

    const discoId = document.getElementById("discoIdAtrelacao").value;
    const artistaId = document.getElementById("artistaIdAtrelacao").value;

    if (!discoId || !artistaId) {
        alert("Por favor, selecione um disco e um artista.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/disco/${discoId}/vincular-artista/${artistaId}`, {
            method: "PUT"
        });

        if (!response.ok) throw new Error("Erro ao atrelar disco ao artista");

        alert("Disco atrelado ao artista com sucesso!");
        cancelarAtrelacao();
        carregarDiscos();
    } catch (error) {
        alert(`Erro ao atrelar disco ao artista: ${error.message}`);
    }
}

document.addEventListener("DOMContentLoaded", carregarDiscos);
