async function carregarArtistasComDiscosEGeneros() {
    const listaArtistasGeneros = document.getElementById("listaArtistasGeneros");
    listaArtistasGeneros.innerHTML = "<p>Carregando artistas...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/artista`);
        if (!response.ok) throw new Error("Erro ao carregar artistas");

        const artistas = await response.json();
        if (artistas.length === 0) {
            listaArtistasGeneros.innerHTML = "<p>Nenhum artista encontrado.</p>";
            return;
        }

        let html = "<table>";
        html += "<tr><th>Artista</th><th>Discos</th><th>Gêneros</th></tr>";

        artistas.forEach(artista => {
            const discos = artista.discos ? artista.discos.map(disco => disco.titulo).join(", ") : "Nenhum disco";
            const generos = artista.generos ? artista.generos.map(genero => genero.genero).join(", ") : "Nenhum gênero";

            html += `
                <tr>
                    <td>${artista.name}</td>
                    <td>${discos}</td>
                    <td>${generos}</td>
                </tr>
            `;
        });

        html += "</table>";
        listaArtistasGeneros.innerHTML = html;
    } catch (error) {
        listaArtistasGeneros.innerHTML = `<p>Erro ao carregar artistas: ${error.message}</p>`;
    }
}

async function buscar(event) {
    event.preventDefault();

    const tituloBusca = document.getElementById("tituloBusca").value;
    const artistaBusca = document.getElementById("artistaBusca").value;
    const generoBusca = document.getElementById("generoBusca").value;

    const listaDiscos = document.getElementById("listaDiscos");
    const listaArtistas = document.getElementById("listaArtistas");
    const listaGeneros = document.getElementById("listaGeneros");

    listaDiscos.innerHTML = "<p>Carregando discos...</p>";
    listaArtistas.innerHTML = "<p>Carregando artistas...</p>";
    listaGeneros.innerHTML = "<p>Carregando gêneros...</p>";

    try {
        const discosResponse = await fetch(`${API_BASE_URL}/disco?titulo=${tituloBusca}`);
        const discos = await discosResponse.json();

        let htmlDiscos = "<table>";
        htmlDiscos += "<tr><th>Título</th><th>Artista</th><th>Gêneros</th></tr>";

        discos.forEach(disco => {
            const artista = disco.artista ? disco.artista.name : "Sem artista";
            const generos = disco.generos ? disco.generos.map(g => g.genero).join(", ") : "Sem gênero";

            htmlDiscos += `
                <tr>
                    <td>${disco.titulo}</td>
                    <td>${artista}</td>
                    <td>${generos}</td>
                </tr>
            `;
        });
        htmlDiscos += "</table>";
        listaDiscos.innerHTML = htmlDiscos;

        const artistasResponse = await fetch(`${API_BASE_URL}/artista?nome=${artistaBusca}`);
        const artistas = await artistasResponse.json();

        let htmlArtistas = "<table>";
        htmlArtistas += "<tr><th>Artista</th><th>Discos</th><th>Gêneros</th></tr>";

        artistas.forEach(artista => {
            const discos = artista.discos ? artista.discos.map(d => d.titulo).join(", ") : "Nenhum disco";
            const generos = artista.generos ? artista.generos.map(g => g.genero).join(", ") : "Nenhum gênero";

            htmlArtistas += `
                <tr>
                    <td>${artista.name}</td>
                    <td>${discos}</td>
                    <td>${generos}</td>
                </tr>
            `;
        });
        htmlArtistas += "</table>";
        listaArtistas.innerHTML = htmlArtistas;

        const generosResponse = await fetch(`${API_BASE_URL}/genero?genero=${generoBusca}`);
        const generos = await generosResponse.json();

        let htmlGeneros = "<table>";
        htmlGeneros += "<tr><th>Gênero</th><th>Discos</th><th>Artistas</th></tr>";

        generos.forEach(genero => {
            const discos = genero.discos ? genero.discos.map(d => d.titulo).join(", ") : "Nenhum disco";
            const artistas = genero.artistas ? genero.artistas.map(a => a.name).join(", ") : "Nenhum artista";

            htmlGeneros += `
                <tr>
                    <td>${genero.genero}</td>
                    <td>${discos}</td>
                    <td>${artistas}</td>
                </tr>
            `;
        });
        htmlGeneros += "</table>";
        listaGeneros.innerHTML = htmlGeneros;

    } catch (error) {
        listaDiscos.innerHTML = `<p>Erro ao carregar discos: ${error.message}</p>`;
        listaArtistas.innerHTML = `<p>Erro ao carregar artistas: ${error.message}</p>`;
        listaGeneros.innerHTML = `<p>Erro ao carregar gêneros: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarArtistasComDiscosEGeneros();
});
