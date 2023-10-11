//*Variáveis------------------------
const btn_cadastro = document.querySelector('#cadastrar-bttn')
if(document.querySelector('#data')){
    const age = document.querySelector('#data')
}else{
    var age = false
}
let nome="nome"
const allInputs = [...document.querySelectorAll("form>*")]
//*---------------------------------

if(document.querySelector('input[type=password]')){
  var inputSenha = document.querySelector('input[type=password]')}

let retornoUser=[...document.querySelectorAll("form>aside>ul>li")]
console.log(retornoUser)

function validarSenha(senha) {
  let retornoUser=[...document.querySelectorAll("form>aside>ul>li")]
  // Verifica se a senha tem pelo menos 8 caracteres
  if (senha.length < 8) {
    return false;
  }

  // Verifica se a senha contém pelo menos um número
  if (!/[0-9]/.test(senha)) {
    return false;
  }

  // Verifica se a senha contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(senha)) {
    return false;
  }

  // Verifica se a senha contém pelo menos uma letra minúscula
  if (!/[a-z]/.test(senha)) {
    return false;
  }

  // Verifica se a senha contém pelo menos um símbolo (caractere especial)
  if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(senha)) {
    return false;
  }

  // Se todas as condições foram atendidas, a senha é válida
  return true;
}
let senhaValue=inputSenha.value

inputSenha.addEventListener("input",(senha)=>{
  console.log(senha.target.value)
  let valor = senha.target.value
  let retornoUser=[...document.querySelectorAll("form>aside>ul>li")]
  // Verifica se a senha tem pelo menos 8 caracteres
  if (valor.length > 8) {
    retornoUser[0].classList.add("ok")
  }else{
    retornoUser[0].classList.remove("ok")
  }

  //Verifica se a senha contém pelo menos uma letra maiúscula
  if (!/[A-Z]/.test(valor)) {
    retornoUser[1].classList.remove("ok")
  }else{
    retornoUser[1].classList.add("ok")
  }

 // Verifica se a senha contém pelo menos uma letra minúscula
  if (/[a-z]/.test(valor)) {
    retornoUser[2].classList.add("ok")
  }else{
    retornoUser[2].classList.remove("ok")
  }

  // Verifica se a senha contém pelo menos um número
  if (/[0-9]/.test(valor)) {
    retornoUser[3].classList.add("ok")
  }else{
    retornoUser[3].classList.remove("ok")
  }



 

  // Verifica se a senha contém pelo menos um símbolo (caractere especial)
  if (/[$&+,:;=?@#|'<>.^*()%!-]/.test(valor)) {
    retornoUser[4].classList.add("ok")
  }else{
    retornoUser[4].classList.remove("ok")
  }
})

// Função para validar o formulário
btn_cadastro.addEventListener('click',(event)=>{
     // Evitar o envio padrão do formulário
     event.preventDefault();
  
     // Obter os valores dos campos
     if(document.getElementById('nome')){
     var nome = document.getElementById('nome').value;
     }

     let email = document.querySelector('input[type=email]').value;

     if(document.querySelector('input[type=password')){
     var senha = inputSenha.value;
     }

   
     // Realizar validação dos campos
     allInputs.every((el,i)=>{
      if (el.value === '') {
        alert('Por favor, preencha todos os campos.');
        return false; // Impede o envio do formulário
      }
     })
     


     // Validar o formato do email usando uma expressão regular simples
     var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     if (!emailRegex.test(email)) {
       alert('Por favor, insira um endereço de email válido.');
       return false; // Impede o envio do formulário
     }
   
     //!Validação idade do usuário--------------------------------------------
     if(age){
        let data_number = Date.parse(age.value)
        console.log(age.value)
        let user_birth = new Date(data_number)
        console.log(user_birth.getMilliseconds())
        if(nowadays.getTime() - user_birth.getTime()  <= 567648000000){
            alert("Você não pode concluir o cadastro pois é menor de idade!")
           return false
       }
     }
    
     
 //! ----------------------------------------------------------------------
 
     // Se todos os campos estiverem válidos, você pode permitir o envio do formulário
     document.querySelector('form').submit();
     //Descomente esta linha para enviar o formulário
   
     // Ou você pode executar qualquer outra ação desejada aqui
   
     return true; // Permite o envio do formulário
   
   // Adicione um ouvinte de eventos para o formulário
 //   document.getElementById('meuFormulario').addEventListener('submit', validarFormulario);
})
   

