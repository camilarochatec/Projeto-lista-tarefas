https://www.figma.com/design/Li7a6enOrOMSkSB3mlG9In/Refor%C3%A7oDev-ToDo?node-id=1-2&t=G8WcrdMRWliwO6Gg-0


Meu sistema funciona com três partes principais:

1.  **HTML (`index.html`):** A estrutura visual da página. Contém o `div` (`#lista-de-tarefas`) onde as tarefas aparecem e o formulário (`#formCriar`) dentro da gaveta, que é usado tanto para criar quanto para editar.
2.  **API (o `db.json`):** Um servidor local (`http://localhost:8000`) que guarda os dados das tarefas. Meu JavaScript conversa com essa API para buscar, criar, editar e deletar informações.
3.  **JavaScript (`index.js`):** A inteligência da aplicação. Ele busca os dados da API, cria os cards de tarefa, controla a "gaveta" do formulário e envia os comandos de criação, edição e exclusão de volta para a API. A função `fetch` é a ferramenta principal para essa comunicação.

-----

### \#\# 📝 Criando uma Nova Tarefa

Este é o fluxo mais simples.

1.  **Abrir o Formulário:** O usuário clica no botão **"Nova tarefa"**, que chama a função `abrirGaveta()`. Ela simplesmente remove as classes `invisible` e `opacity-0` da gaveta (`#gaveta`) e da sombra (`#sombra`), tornando o formulário visível.

2.  **Enviar os Dados:** O usuário preenche o título e a descrição e clica no botão "Criar". Isso dispara o evento `onsubmit` do formulário `<form id="formCriar">`, que chama a função `salvarTarefa(event)`.

3.  **Dentro de `salvarTarefa(event)`:**

      * `event.preventDefault()`: Impede que a página recarregue, que é o comportamento padrão de um formulário.
      * `const id = form.dataset.id;`: Ele verifica se o formulário tem um `data-id`. **Para uma nova tarefa, esse `id` não existe (`undefined`)**.
      * **Bloco `else` é executado:** Como o `id` é `undefined`, o código entra no `else`.
      * `fetch("http://localhost:8000/tarefas", ...)`: Ele faz uma requisição para a API usando o método **`POST`**. `POST` é o padrão para criar um novo registro.
      * `body: JSON.stringify(dados)`: Ele envia os dados do formulário (capturados pela função `capturarDados`) no corpo da requisição, em formato JSON.
      * `.then(() => { ... })`: Após a API confirmar que a tarefa foi criada, seu código fecha a gaveta e chama `buscarTarefas()` para recarregar a lista e mostrar a tarefa recém-criada na tela.

-----

### \#\# ✏️ Editando uma Tarefa (Processo em Duas Etapas)

A edição é mais inteligente, pois reutiliza o mesmo formulário da criação. A chave aqui é o atributo `data-id`.

#### Etapa 1: Preparar o Formulário para Edição

1.  **Clicar no Ícone:** Quando a lista de tarefas é carregada, cada card tem um ícone de lápis com `onclick="prepararFormularioParaEditar(${tarefa.id})"`. O usuário clica neste ícone.

2.  **Dentro de `prepararFormularioParaEditar(idDaTarefa)`:**

      * `fetch(...)`: A função primeiro busca na API os dados **apenas da tarefa específica** que será editada, usando o `id` dela.
      * **Preencher os Campos:** Ela pega o título e a descrição recebidos da API e os coloca nos campos `<input>` e `<textarea>` do formulário.
      * **O Passo Crucial:** A linha `document.querySelector("#formCriar").dataset.id = idDaTarefa;` **guarda o ID da tarefa que está sendo editada diretamente no elemento do formulário**. Isso é como "marcar" o formulário, dizendo "agora você está em modo de edição".
      * `abrirGaveta()`: Por fim, a gaveta é aberta, já com os dados da tarefa preenchidos e com o `id` guardado "nos bastidores".

#### Etapa 2: Salvar a Alteração

1.  **Enviar os Dados:** O usuário altera o que quiser no formulário e clica no mesmo botão de antes (que ainda diz "Criar", mas agora tem outra função). Isso chama a mesma função `salvarTarefa(event)`.

2.  **Dentro de `salvarTarefa(event)`:**

      * `const id = form.dataset.id;`: Desta vez, quando o código verifica o `data-id` do formulário, **ele encontra o ID que foi guardado na etapa anterior**.
      * **Bloco `if (id)` é executado:** Como a variável `id` agora tem um valor, o código entra no `if`.
      * `fetch(\`.../tarefas/${id}\`, ...)` : A requisição  `fetch`  é feita, mas agora usando o método ** `PUT` **.  `PUT`é o padrão para atualizar um registro existente. A URL também inclui o`id\` para que a API saiba exatamente qual tarefa atualizar.
      * `.then(() => { ... })`: Assim como na criação, após a API confirmar a atualização, a gaveta é fechada e a lista de tarefas é recarregada com os dados atualizados.

> **Observação:** Seu código possui uma função `editarTarefa`, mas ela não parece ser usada. A lógica de edição está corretamente centralizada na função `salvarTarefa`.

-----

### \#\# 🗑️ Deletando uma Tarefa

Este é o processo mais direto.

1.  **Clicar no Ícone:** O usuário clica no ícone da lixeira (`trash`) em uma tarefa, que chama `deletarTarefa(${tarefa.id})`, passando o ID da tarefa a ser excluída.

2.  **Dentro de `deletarTarefa(idDaTarefa)`:**

      * `fetch(\`.../tarefas/${idDaTarefa}\`, ...)` : A função faz uma requisição  `fetch\` para a URL da tarefa específica.
      * `method: "delete"`: Ela usa o método **`DELETE`**, que instrui a API a remover o registro com aquele `id`.

> **Ponto de Melhoria:** Note que, após a chamada `fetch` para deletar, seu código não faz nada. A tarefa é deletada no servidor, mas **não some da tela** até que a página seja recarregada. Para corrigir isso, você deveria recarregar a lista de tarefas após a exclusão, assim como faz ao criar e editar:
>
> ```javascript
> function deletarTarefa(idDaTarefa){
>     fetch(`http://localhost:8000/tarefas/${idDaTarefa}`, {
>         method: "delete",
>     }).then(() => {
>         // Adicione esta linha para atualizar a tela:
>         buscarTarefas(); 
>     })
> }
> ```

