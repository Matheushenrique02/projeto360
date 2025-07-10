# Página de Perfil de Usuário

Este projeto é uma página onde dá pra cadastrar, editar e excluir perfis de usuário. Usei HTML, CSS e JavaScript no front-end. No back-end foi usado Node.js com Express, e os dados ficam salvos em um banco MySQL.

### Funcionalidades:
- Cadastro de usuário com nome, idade, endereço, biografia e foto;
- Visualização de todos os perfis salvos;
- Edição de perfil existente;
- Exclusão de perfil;
- Foto de perfil com preview antes de salvar.

### Sobre o projeto:
Estou mais focado em ter uma base sólida em javascript no momento, e esse projeto foi um desafio técnico. Com ele, consegui praticar bastante. Para conseguir conectar com banco de dados e fazer a parte do back-end, usei ajuda do ChatGPT, já que ainda não estudei profundamente Node.js nem MySQL. Meu foco atual é aprender bem JavaScript e depois seguir pro React e back-end.

###### Estrutura do Banco de Dados (MySQL):
```sql
CREATE DATABASE IF NOT EXISTS sync360;
USE sync360;

CREATE TABLE IF NOT EXISTS usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  idade INT,
  rua VARCHAR(100),
  bairro VARCHAR(100),
  estado VARCHAR(50),
  biografia TEXT,
  foto LONGTEXT
);
