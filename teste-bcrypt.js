const bcrypt = require('bcrypt');

const senhaDigitada = '123'; // A senha que você quer testar
const hashDoBanco = '$2b$10$kbjyEP0KiM2QNWD5es0Q6eJlg8OGqv1aCmj8OCgubWpZQ38Z29lWq'; // O hash salvo no banco

bcrypt.compare(senhaDigitada, hashDoBanco).then(result => {
  console.log('Senha válida?', result); // Esperado: true, se a senha bate com o hash
}).catch(err => {
  console.error('Erro no bcrypt.compare:', err);
});
