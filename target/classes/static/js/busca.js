async function buscar(event) {
    event.preventDefault();

    const titulo = document.getElementById("tituloBusca").value;
    const artista = document.getElementById("artistaBusca").value;
    const genero = document.getElementById("generoBusca").value;

    const url = new URL(`${API_BASE_URL}/genero/buscar`);
    const params = {};

    if (titulo) params.titulo = titulo;
    if (artista) params.artista = artista;
    if (genero) params.genero = genero;

    if (Object.keys(params).length > 0) {
        url.search = new URLSearchParams(params).toString();
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao buscar discos");

        const dados = await response.json();
        exibirResultados(dados);

    } catch (error) {
        console.error("Erro ao buscar:", error.message);
        alert(`Erro na busca: ${error.message}`);
    }
}



function exibirResultados(dados) {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = '';

    if (dados && dados.length > 0) {
        const discosDiv = document.createElement("div");
        discosDiv.innerHTML = "<h3>Discos Encontrados</h3>";

        const tabelaDiscos = document.createElement("table");
        tabelaDiscos.innerHTML = "<tr><th>Título</th><th>Gêneros</th><th>Artistas</th></tr>";

        dados.forEach(genero => {
            genero.discos.forEach(disco => {
                const linha = document.createElement("tr");

                const generos = Array.isArray(disco.generos) && disco.generos.length > 0 ? disco.generos.join(", ") : "Sem gênero";
                const artistas = Array.isArray(disco.artistas) && disco.artistas.length > 0 ? disco.artistas.join(", ") : "Sem artistas";

                linha.innerHTML = `
                    <td>${disco.titulo}</td>
                    <td>${generos}</td>
                    <td>${artistas}</td>
                `;
                tabelaDiscos.appendChild(linha);
            });
        });

        discosDiv.appendChild(tabelaDiscos);
        resultadosDiv.appendChild(discosDiv);
    } else {
        resultadosDiv.innerHTML += "<p>Nenhum disco encontrado.</p>";
    }

    if (dados && dados.length > 0) {
        const artistasDiv = document.createElement("div");
        artistasDiv.innerHTML = "<h3>Artistas Encontrados</h3>";

        const tabelaArtistas = document.createElement("table");
        tabelaArtistas.innerHTML = "<tr><th>Nome</th><th>Gêneros</th></tr>";

        dados.forEach(genero => {
            genero.artistas.forEach(artista => {
                const linha = document.createElement("tr");

                const generos = Array.isArray(artista.generos) && artista.generos.length > 0 ? artista.generos.join(", ") : "Sem gênero";

                linha.innerHTML = `
                    <td>${artista.name}</td>
                    <td>${generos}</td>
                `;
                tabelaArtistas.appendChild(linha);
            });
        });

        artistasDiv.appendChild(tabelaArtistas);
        resultadosDiv.appendChild(artistasDiv);
    } else {
        resultadosDiv.innerHTML += "<p>Nenhum artista encontrado.</p>";
    }
}