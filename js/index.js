// falta terminar
function mudarTema() {
    const header = document.querySelector("#header");
    if (header.classList.contains("bg-white")) {
        header.classList.remove("bg-white", "text-black", "fill-black");
        header.classList.add("bg-black", "text-white", "fill-white");
    } else {
        header.classList.remove("bg-black", "text-white", "fill-white");
        header.classList.add("bg-white", "text-black", "fill-black");
    }
}

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

function buscarTarefas() {
    fetch("http://localhost:8000/tarefas")
        .then(resposta => resposta.json())
        .then(json => {
            carregarTarefas(json);
        })
}

buscarTarefas();

function carregarTarefas(tarefas) {
    const listaDeTarefas = document.querySelector("#lista-de-tarefas");
    tarefas.map(tarefa => {
        listaDeTarefas.innerHTML += `
            <div class="bg-white shadow rounded p-4">
                <h3 class="font-bold">${tarefa.titulo}</h3>
                <p class="text-[14px] text-gray-500 line-clamp-3 mb-4">${tarefa.descricao}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-[10px]">${formatarData(tarefa.data)}</span>
                    <div class="flex gap-3">
                        <box-icon name='pencil' onclick="prepararFormularioParaEditar(${tarefa.id})"></box-icon>
                        <box-icon name='trash' onclick="deletarTarefa(${tarefa.id})"></box-icon>
                    </div>
                </div>
            </div>
        `;
    })
}

function salvarTarefa(event) {
    event.preventDefault(); // Previne o recarregamento da página

    const form = document.querySelector("#formCriar");
    const id = form.dataset.id; // Pega o ID que guardamos. Será undefined se for uma nova tarefa.
    const dados = capturarDados("#formCriar");

    if (id) {
        // Se existe um ID, estamos editando (método PUT)
        fetch(`http://localhost:8000/tarefas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        }).then(() => {
            fecharGaveta();
            buscarTarefas(); // Atualiza a lista na tela
        });

    } else {
        // Se não existe um ID, estamos criando (método POST)
        fetch("http://localhost:8000/tarefas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        }).then(() => {
            fecharGaveta();
            buscarTarefas(); // Atualiza a lista na tela
        });
    }
}

//para fazer o editar primeiro tem q buscar os dados 
//função assincrona é algo q sai da pilha de execuç. muito importante em awaits e apis. para q continue as minhas tarefas.
async function prepararFormularioParaEditar(idDaTarefa) {
    // 1. Busca os dados da tarefa específica na API
    const resposta = await fetch(`http://localhost:8000/tarefas/${idDaTarefa}`);
    const tarefa = await resposta.json();

    // 2. Preenche os campos do formulário com os dados da tarefa
    document.querySelector("#titulo").value = tarefa.titulo;
    document.querySelector("#descricao").value = tarefa.descricao;

    // 3. Guarda o ID da tarefa em um lugar que a função de salvar possa ver
    //    Usaremos o próprio formulário para isso com `data-id`
    document.querySelector("#formCriar").dataset.id = idDaTarefa;

    // 4. Abre a gaveta para que o usuário possa editar
    abrirGaveta();
}

function deletarTarefa(idDaTarefa) {
    event.preventDefault();
    let confirmou = confirm("Deseja realmente deletar esta tarefa?");
    if(confirmou){
        fetch(`http://localhost:8000/tarefas/${idDaTarefa}`, {
        method: "delete",
        // para atualizar a tela
    }).then(() => {
        buscarTarefas();
    })
    }
}

function capturarDados(idDeUmFormulario) {
    let form = document.querySelector(idDeUmFormulario);
    let formData = new FormData(form);
    let dados = Object.fromEntries(formData.entries());
    let data = new Date();
    dados.data = data.toLocaleDateString().split('/').reverse().join('-');
    return dados;
}

function formatarData(data){
    let dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString();
}
// -----------------------------------------------------------------------------
//obs.: não esqueça de colocar no html o novo form e chamar a função.
// modo de fazer a)
