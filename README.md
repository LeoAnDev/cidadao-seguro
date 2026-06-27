# Sistema Cidadão Seguro

Este é um projeto full-stack (Node.js, Express, MySQL e Vanilla JS) para o gerenciamento de segurança pública de um município. O sistema permite o controle de Cidadãos, Agentes, Bairros e Ocorrências através de um painel administrativo moderno.

## Tecnologias Utilizadas

- **Backend**: Node.js com Express.js (v5.x)
- **Banco de Dados**: MySQL (driver `mysql2`)
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript puro (Fetch API)
- **Ferramentas de Desenvolvimento**: Nodemon, Dotenv (para variáveis de ambiente)

## Estrutura do Projeto

- `/public`: Contém todos os arquivos estáticos do frontend (HTML, CSS e JS).
- `/src/models`: Classes puras em Javascript orientadas a objetos (sem herança, conforme especificação).
- `/src/controllers`: Controladores das rotas de API para cada entidade.
- `/src/routes.js`: Arquivo centralizado contendo todas as definições das rotas da API.
- `/src/db.js`: Configuração do pool de conexões com o MySQL.
- `database.sql`: Script SQL para criação das tabelas e do banco de dados.
- `server.js`: Arquivo principal do servidor web (Express).
- `.env`: Arquivo de configuração de variáveis de ambiente (Credenciais do banco e Porta).
- `initDb.js`: Script Node.js opcional para ajudar a inicializar o banco de dados.

## Como Executar

### 1. Configurar o Banco de Dados

Certifique-se de que o MySQL está rodando em sua máquina na porta `3306`. O projeto foi configurado com um arquivo `.env` para gerenciar as credenciais com segurança.

Crie ou edite o arquivo `.env` na raiz do projeto contendo as seguintes variáveis:

```env
DB_HOST=172.24.128.1
DB_USER=root
DB_PASSWORD=root
DB_NAME=cidadaoseguro-db
PORT=3000
```

> **Nota para WSL2**: O IP `172.24.128.1` foi definido por padrão para acessar o MySQL hospedado no Windows a partir do ambiente WSL. Se estiver rodando o Node direto no Windows, altere para `DB_HOST=localhost`.

Você pode criar o banco de dados importando o script `database.sql` diretamente no seu cliente MySQL (Workbench/DBeaver):

```bash
mysql -u root -proot < database.sql
```

### 2. Instalar as Dependências

Na raiz do projeto, execute:

```bash
npm install
```

### 3. Rodar a Aplicação

Para iniciar o servidor em modo de desenvolvimento (com auto-reload usando `nodemon`):

```bash
npm run dev
```

Para iniciar o servidor em modo de produção:

```bash
npm start
```

O servidor estará rodando na porta `3000`. Acesse `http://localhost:3000` em seu navegador para visualizar o painel administrativo.

## Funcionalidades do Dashboard

- **Tema Claro / Escuro**: Botão de alternância localizado na barra superior.
- **Gerenciamento Completo (CRUD)**: Possibilidade de listar, cadastrar e excluir registros de Cidadãos, Agentes, Bairros e Ocorrências.
- **Estatísticas Rápidas**: Visualização do total de registros na página de início.
# cidadao-seguro
# cidadao-seguro
