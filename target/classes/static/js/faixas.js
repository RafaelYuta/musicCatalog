async function carregarFaixas() {
    const lista = document.getElementById("listaFaixas");
    lista.innerHTML = "<p>Carregando faixas...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/faixa`);
        if (!response.ok) throw new Error("Erro ao buscar faixas");

        const faixas = await response.json();
        if (faixas.length === 0) {
            lista.innerHTML = "<p>Nenhuma faixa cadastrada.</p>";
            return;
        }

        let html = "<table>";
        html += "<tr><th>Nome</th><th>Disco</th><th>Gêneros</th></tr>";
        faixas.forEach(faixa => {
            const disco = faixa.disco || "Nenhum disco"; // Corrigido para usar o valor direto retornado do backend
            const generos = (faixa.generos || []).join(", ") || "Nenhum gênero";

            html += `
                <tr>
                    <td>${faixa.name}</td>
                    <td>${disco}</td>
                    <td>${generos}</td>
                </tr>
            `;
        });
        html += "</table>";

        lista.innerHTML = html;
    } catch (error) {
        lista.innerHTML = `<p>Erro ao carregar faixas: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarFaixas);
