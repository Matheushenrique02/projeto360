const fotoInput = document.querySelector('#fotoInput');
const fotoPreview = document.querySelector('#fotoPreview');
const salvar = document.querySelector('#salvar');
const btnEditarPerfil = document.querySelector('#btnEditarPerfil');
const form = document.querySelector('#formulario');
const listaUsuarios = document.querySelector('#listaUsuarios');
const modalPerfis = document.querySelector('#modalPerfis');
const btnFecharModal = document.querySelector('#btnFecharModal');

let usuarioId = null; // Guarda o ID do usuário em edição

window.addEventListener('DOMContentLoaded', () => {
  carregarUsuarios();
});

// Abre modal ao clicar no botão "Editar Perfil"
btnEditarPerfil.addEventListener('click', () => {
  modalPerfis.style.display = 'block';
  carregarUsuarios();
});

// Fecha o modal
btnFecharModal.addEventListener('click', () => {
  modalPerfis.style.display = 'none';
});

// Fecha modal ao clicar fora da área do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modalPerfis) {
    modalPerfis.style.display = 'none';
  }
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  enviar();
});

fotoInput.addEventListener('change', function() {
  const file = fotoInput.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      fotoPreview.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
});

async function carregarUsuarios() {
  try {
    const resposta = await fetch('http://localhost:3000/usuarios');
    if (!resposta.ok) throw new Error('Erro ao carregar usuários');

    const usuarios = await resposta.json();
    listaUsuarios.innerHTML = '';

    usuarios.forEach(usuario => {
      const div = document.createElement('div');
      div.classList.add('usuario-item');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.marginBottom = '8px';

      const nomeSpan = document.createElement('span');
      nomeSpan.textContent = usuario.nome;
      nomeSpan.style.cursor = 'pointer';
      nomeSpan.addEventListener('click', () => {
        preencherFormulario(usuario);
        modalPerfis.style.display = 'none';
      });

      const btnExcluir = document.createElement('button');
      btnExcluir.textContent = 'Excluir';
      btnExcluir.style.backgroundColor = '#e74c3c';
      btnExcluir.style.color = '#fff';
      btnExcluir.style.border = 'none';
      btnExcluir.style.padding = '4px 8px';
      btnExcluir.style.borderRadius = '4px';
      btnExcluir.style.cursor = 'pointer';

      btnExcluir.addEventListener('click', async (e) => {
        e.stopPropagation(); // evita disparar o click no nome
        if (confirm(`Deseja realmente excluir o usuário "${usuario.nome}"?`)) {
          try {
            const res = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Erro ao deletar usuário');
            alert('Usuário deletado com sucesso!');
            carregarUsuarios(); // Atualiza a lista
          } catch (error) {
            alert('Falha ao deletar usuário');
            console.error(error);
          }
        }
      });

      div.appendChild(nomeSpan);
      div.appendChild(btnExcluir);
      listaUsuarios.appendChild(div);
    });
  } catch (erro) {
    console.error(erro);
    alert('Falha ao carregar lista de usuários');
  }
}

function preencherFormulario(usuario) {
  usuarioId = usuario.id; // Guarda o id do usuário selecionado
  document.querySelector('#nome').value = usuario.nome || '';
  document.querySelector('#idade').value = usuario.idade || '';
  document.querySelector('#endereçoRua').value = usuario.rua || '';
  document.querySelector('#endereçoBairro').value = usuario.bairro || '';
  document.querySelector('#endereçoEstado').value = usuario.estado || '';
  document.querySelector('#biografia').value = usuario.biografia || '';
  fotoPreview.src = usuario.foto || 'https://static.vecteezy.com/ti/vetor-gratis/p1/13360247-de-icone-de-foto-avatar-padrao-simbolo-de-sinal-de-perfil-de-midia-social-vetor.jpg';
}

async function enviar() {
  const fotoBase64 = fotoPreview.src.startsWith('data:image') ? fotoPreview.src : '';

  const dados = {
    nome: document.querySelector('#nome').value.trim(),
    idade: parseInt(document.querySelector('#idade').value.trim(), 10),
    rua: document.querySelector('#endereçoRua').value.trim(),
    bairro: document.querySelector('#endereçoBairro').value.trim(),
    estado: document.querySelector('#endereçoEstado').value.trim(),
    biografia: document.querySelector('#biografia').value.trim(),
    foto: fotoBase64
  };

  try {
    let resposta;

    if (usuarioId) {
      // Atualiza usuário existente
      resposta = await fetch(`http://localhost:3000/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Insere novo usuário
      resposta = await fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    if (!resposta.ok) throw new Error('Erro ao salvar os dados');

    alert('Perfil salvo com sucesso!');
    usuarioId = null; // Limpa o id após salvar para não confundir
    form.reset();
    fotoPreview.src = 'https://static.vecteezy.com/ti/vetor-gratis/p1/13360247-de-icone-de-foto-avatar-padrao-simbolo-de-sinal-de-perfil-de-midia-social-vetor.jpg';

    carregarUsuarios(); // Atualiza a lista após salvar

  } catch (erro) {
    alert('Falha ao salvar perfil');
    console.error(erro);
  }
}
