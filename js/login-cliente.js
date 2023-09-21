let email = document.getElementById('email');
let senha = document.getElementById('senha');
let btnEntrar = document.getElementById('btn-entrar');


btnEntrar.addEventListener('click', () => {

    let userEmail = email.value;

    let userSenha = senha.value;

    if(!userEmail || !userSenha){
        Swal.fire({
            icon: 'error',
            text: 'Os campos de e-mail e senha são obrigatórios!'
        });

        return;
    }

    autenticar(userEmail, userSenha);
});

function autenticar(email, senha){
   const urlBase = `http://localhost:3400`;

   fetch(`${urlBase}/login`, {
    method:'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, senha})
   })
   .then(response => response = response.json())
   .then(response => {

       if(!!response.mensagem){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: (response.mensagem),
          });
        return;

       }else{

        salvarToken(response.token);
        salvarUsuario(response.usuario);
        
        mostrarLoading();

        setTimeout(() =>{
            window.open('controle-clientes.html', '_self');
        }, 5000)
        
       }
    });
}

function mostrarLoading(){
    const divLoading = document.querySelector('#loading');
    divLoading.style.display = 'flex';
    divLoading.style.margin = 'auto';
                   
    const divBoxlogin = document.querySelector('div.caixa-login')
    divBoxlogin.style.display = 'none';
}