// Função para alternar o tema e salvar a preferência
function mudarTema() {
    document.documentElement.classList.toggle('dark');

    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Funções da gaveta (sem alterações)
function abrirGaveta() {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");
    sombra.classList.remove("invisible", "opacity-0");
    gaveta.classList.remove("invisible", "opacity-0");
}

function fecharGaveta() {
    const sombra = document.querySelector("#sombra");
    const gaveta = document.querySelector("#gaveta");
    sombra.classList.add("invisible", "opacity-0");
    gaveta.classList.add("invisible", "opacity-0");
}

// Função para carregar tarefas que respeita o dark mode
function carregarTarefas(tarefas) {
    const listaDeTarefas = document.querySelector("#lista-de-tarefas");
    listaDeTarefas.innerHTML = ""; // Limpa a lista antes de adicionar

    const tarefasHtml = tarefas.map(tarefa => {
        // O HTML do card já tem as classes dark: então não precisa de lógica aqui
        return `
            <div class="bg-white dark:bg-gray-800 shadow rounded p-4 border border-gray-200 dark:border-gray-700">
                <h3 class="font-bold text-gray-800 dark:text-white">${tarefa.titulo}</h3>
                <p class="text-[14px] text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">${tarefa.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-[10px] text-gray-400 dark:text-gray-500">${tarefa.data}</span>
                    <div class="flex gap-3 fill-gray-600 dark:fill-gray-400">
                        <box-icon name='pencil'></box-icon>
                        <box-icon name='trash'></box-icon>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    listaDeTarefas.innerHTML = tarefasHtml;
}

// Função para buscar os dados (sem alterações)
function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        .then(resposta => resposta.json())
        .then(json => {
            carregarTarefas(json);
        });
}

// Inicia a busca de tarefas ao carregar a página
buscarTarefas();