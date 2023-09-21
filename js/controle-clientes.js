const URL = 'http://localhost:3400/clientes';
let editando = false;

let listaClientes = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaCliente = document.querySelector('table>tbody');
let modalCliente = new bootstrap.Modal(document.getElementById("modal-cliente"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    telefone: document.getElementById('telefone'),
    cpf: document.getElementById('cpf'),
    dataCadastro: document.getElementById('dataCadastro')
}

btnAdicionar.addEventListener('click', () =>{
    editando = false;
    tituloModal.textContent = "Adicionar cliente"
    limparModal();
    modalCliente.show();
});

btnSalvar.addEventListener('click', () => {

    let cliente = obterCliente();

    if(!cliente.cpfOuCnpj || !cliente.email){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Os campos de E-mail e CPF são obrigatórios!',
          })
        return;
    }

    (editando) ? atualizarBackEnd(cliente) : adicionarBackEnd(cliente);

});

btnCancelar.addEventListener('click', () => {
    modalCliente.hide();
});

function obterCliente(){

    return new Cliente({
        id: formModal.id.value,
        email: formModal.email.value,
        nome: formModal.nome.value,
        cpfOuCnpj: formModal.cpf.value,
        telefone: formModal.telefone.value,
        dataCadastro: (formModal.dataCadastro.value) 
                ? new Date(formModal.dataCadastro.value).toISOString()
                : new Date().toISOString()
    });
}
 
function puxarClientes() {

    fetch(URL, {
        method: 'GET',
        headers :{
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(clientes => {
            listaClientes = clientes;
            preencherTabela(clientes);
        })
        .catch()
}

function editarCliente(id){
    editando = true;
    tituloModal.textContent = "Editar cliente"

    let cliente = listaClientes.find(cliente => cliente.id == id);
    
    atualizarModal(cliente);

    modalCliente.show();
}

function atualizarModal(cliente){

    formModal.id.value = cliente.id;
    formModal.nome.value = cliente.nome;
    formModal.cpf.value = cliente.cpfOuCnpj;
    formModal.email.value = cliente.email;
    formModal.telefone.value = cliente.telefone;
    formModal.dataCadastro.value = cliente.dataCadastro.substring(0,10);
}

function limparModal(){

    formModal.id.value ="";
    formModal.nome.value = "";
    formModal.cpf.value = "";
    formModal.email.value = "";
    formModal.telefone.value = "";
    formModal.dataCadastro.value = "";
}

function excluirCliente(id){

    let cliente = listaClientes.find(c => c.id == id);

    if(confirm("Deseja realmente excluir o cliente " + cliente.nome + "?")){
        excluirBackEnd(cliente);
    }
    
}

function criarLinha(cliente) {
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdCPF = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdTelefone = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdBotoes = document.createElement('td');


    tdId.textContent = cliente.id;
    tdNome.textContent = cliente.nome;
    tdCPF.textContent = cliente.cpfOuCnpj;
    tdEmail.textContent = cliente.email;
    tdDataCadastro.textContent = new Date(cliente.dataCadastro).toLocaleDateString();
    tdTelefone.textContent = cliente.telefone;

    tdBotoes.innerHTML = `<button onclick="editarCliente(${cliente.id})" class="btn btn-outline-primary btn-sm mr-3">
                             Editar
                         </button>
                         <button onclick="excluirCliente(${cliente.id})" class="btn btn-outline-danger btn-sm mr-3">
                             Excluir
                         </button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdCPF);
    tr.appendChild(tdEmail);
    tr.appendChild(tdTelefone);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdBotoes);

    tabelaCliente.appendChild(tr);
}

function preencherTabela(clientes) {

    tabelaCliente.textContent = "";

    clientes.forEach(cliente => {
        criarLinha(cliente);
    });
}

function adicionarBackEnd(cliente){

    cliente.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(response => {

        let novoCliente = new Cliente(response);
        listaClientes.push(novoCliente);

        preencherTabela(listaClientes)

        modalCliente.hide();
        Swal.fire({
            icon: 'success',
            title: 'Cliente adicionado com sucesso.',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}


function atualizarBackEnd(cliente){

    fetch(`${URL}/${cliente.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(() => {
        atualizarCliente(cliente, false);
        modalCliente.hide();

        Swal.fire({
            icon: 'success',
            title: 'Cliente atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function excluirBackEnd(cliente){

    fetch(`${URL}/${cliente.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(() => {
        atualizarCliente(cliente, true);
        modalCliente.hide();
        Swal.fire({
            icon: 'success',
            title: 'Cliente excluido com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarCliente(cliente, removerCliente){

    let indice = listaClientes.findIndex((c) => c.id == cliente.id);

    (removerCliente) 
        ? listaClientes.splice(indice, 1)
        : listaClientes.splice(indice, 1, cliente);

    preencherTabela(listaClientes);
}

puxarClientes();
