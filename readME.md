# Projeto Gerenciador de Tarefas

Este é um projeto de um simples gerenciador de tarefas (To-Do List) que permite criar, visualizar, editar, deletar e pesquisar tarefas. A aplicação consome uma API local para persistir os dados e possui funcionalidades como tema escuro (dark mode) e um design responsivo.

## ✨ Funcionalidades

* **CRUD completo:** Crie, leia, atualize e delete tarefas.
* **Tema Escuro:** Alterne entre os modos claro e escuro.
* **Pesquisa Dinâmica:** Filtre tarefas pelo título em tempo real.
* **Interface Responsiva:** O layout se adapta a diferentes tamanhos de tela, com uma experiência otimizada para mobile.
* **Painel Lateral (Gaveta):** Formulários de criação e edição aparecem em um painel lateral para uma experiência de usuário fluida.

## 🚀 Tecnologias Utilizadas

* **HTML5:** Estrutura da página.
* **Tailwind CSS (via CDN):** Estilização da interface.
* **JavaScript (Vanilla):** Lógica da aplicação e manipulação do DOM.
* **Boxicons:** Biblioteca de ícones.
* **API REST local (pré-requisito):** O projeto se comunica com um backend rodando em `http://localhost:8000`.

## ⚙️ Como Funciona o Código

O código é dividido em duas partes principais: o `index.html`, que estrutura a página, e o `js/index.js`, que contém toda a lógica da aplicação.

### Variável Global

* `let lista = []`: Um array que serve como um "cache" local. Ele armazena a lista de tarefas buscada da API para que funções como a pesquisa possam ser executadas rapidamente, sem a necessidade de novas requisições ao servidor.

### Funções de Manipulação da Interface (UI)

* `mudarTema()`: Alterna o tema da aplicação. Ele verifica se o elemento `<html>` (com `id="root"`) possui a classe `dark`. Se sim, a remove; se não, a adiciona.
* `abrirGaveta(editar = false)`: Torna o painel lateral (gaveta) e o fundo escurecido (sombra) visíveis. Recebe um parâmetro booleano `editar`:
    * Se `false` (padrão), exibe o formulário de **criação** de tarefa.
    * Se `true`, exibe o formulário de **edição**.
* `fecharGaveta()`: Esconde o painel lateral e a sombra, adicionando as classes de invisibilidade do Tailwind.
* `mostrarInput()` / `esconderInput()`: Gerenciam a visibilidade e o comportamento do campo de pesquisa em dispositivos móveis, melhorando a experiência do usuário em telas menores.

---

### Funções de Comunicação com a API (CRUD)

O projeto usa a `fetch API` para se comunicar com o backend.

* `buscarTarefas()`: Faz uma requisição `GET` para `http://localhost:8000/tarefas`. Ao receber os dados, atualiza a variável global `lista` e chama a função `carregarTarefas()` para renderizar os itens na tela. É chamada assim que a página carrega.
* `criarTarefa(event)`: É acionada pelo envio do formulário de criação. Usa o método `POST` para enviar os dados de uma nova tarefa (capturados pela função `capturarDados`) para a API. `event.preventDefault()` impede que a página seja recarregada.
* `editarTarefa(event)`: Acionada pelo formulário de edição. Usa o método `PUT` para atualizar uma tarefa existente. O ID da tarefa é pego de um campo oculto no formulário.
* `deletarTarefa(idDaTarefa)`: Pede uma confirmação do usuário. Se confirmada, envia uma requisição `DELETE` para a API, usando o ID da tarefa para especificar qual item deve ser removido.

---

### Funções de Renderização e Dados

* `carregarTarefas(tarefas)`: É a função responsável por exibir as tarefas na tela.
    1.  Primeiro, ela limpa o conteúdo atual da `<div id="lista-de-tarefas">`.
    2.  Depois, usa `tarefas.map()` para percorrer o array de tarefas e gerar dinamicamente o HTML de cada card de tarefa, inserindo-o na página.
* `preencherFormulario(idDaTarefa)`: É chamada quando o ícone de edição de uma tarefa é clicado. Ela encontra a tarefa correspondente no array `lista` e preenche os campos do formulário de edição com os dados daquela tarefa.
* `pesquisar(palavra)`: Filtra o array `lista` com base no texto digitado pelo usuário. A filtragem não diferencia maiúsculas de minúsculas (`toLowerCase()`). Em seguida, chama `carregarTarefas()` passando apenas a lista de tarefas filtradas para atualizar a exibição.
* `capturarDados(idDeUmFormulario)`: Uma função auxiliar que extrai todos os dados de um formulário, converte-os em um objeto JavaScript e adiciona a data atual no formato `AAAA-MM-DD`.
* `formatarData(data)`: Converte a string de data vinda da API para um formato mais legível (`DD/MM/AAAA`).

## 📋 Pré-requisitos para Rodar o Projeto

1.  **Servidor Local (Backend):** Você precisa ter um servidor rodando em `http://localhost:8000` com um endpoint `/tarefas` que suporte os seguintes métodos HTTP:
    * `GET /tarefas`: Retorna a lista de tarefas.
    * `POST /tarefas`: Cria uma nova tarefa.
    * `PUT /tarefas/:id`: Atualiza uma tarefa existente.
    * `DELETE /tarefas/:id`: Deleta uma tarefa.
2.  **Navegador Web:** Basta abrir o arquivo `index.html` em qualquer navegador moderno.
