# Documentação do Projeto

## Comandos disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor em modo de desenvolvimento com recarga automática. |
| `npm run build` | Compila o projeto TypeScript para JavaScript em `dist/`. |
| `npm start` | Executa a versão compilada do servidor a partir da pasta `dist/`. |
| `npm run migration:create -- <nome>` | Cria um arquivo de migração vazio na base core. |
| `npm run migration:generate -- <nome>` | Gera uma migração com base nas alterações detectadas nas entidades. |
| `npm run migration:run` | Executa as migrações pendentes na base core configurada. |
| `npm run migration:revert` | Desfaz a última migração executada. |
| `npm run ibge:import` | Executa a rotina de importação de dados do IBGE diretamente da API pública BrasilAPI. |
| `npm run tenants:migrate` | Aplica as migrações de domínio em todos os bancos provisionados para os tenants ativos e garante o usuário padrão. |

> As variáveis de ambiente de conexão devem estar configuradas antes da execução dos comandos que acessam banco de dados.

## Documentação de Rotas

Todas as rotas retornam respostas em JSON.

### Rotas públicas (core)

#### GET `/health`
- **Descrição:** Verifica se o serviço está respondendo.
- **Autenticação:** Não requer token.
- **Resposta 200:** `{ "status": "ok" }`

#### Rotas de administração de tenants
Rotas públicas destinadas ao gerenciamento de tenants na base "core".

##### GET `/tenants`
- **Descrição:** Lista todos os tenants cadastrados.
- **Autenticação:** Não requer token.

##### GET `/tenants/{id}`
- **Descrição:** Busca um tenant pelo identificador numérico.
- **Parâmetros de rota:** `id` (número inteiro).

##### POST `/tenants`
- **Descrição:** Cadastra um novo tenant.
- **Corpo (JSON):** ver seção [Payloads e Configurações do Projeto](#payloads-e-configura%C3%A7%C3%B5es-do-projeto).

##### PUT `/tenants/{id}`
- **Descrição:** Atualiza os dados de um tenant existente.
- **Parâmetros de rota:** `id` (número inteiro).
- **Corpo (JSON):** Mesmo payload do POST. Somente os campos enviados serão alterados.

##### DELETE `/tenants/{id}`
- **Descrição:** Remove um tenant pelo identificador.
- **Resposta 204:** Sem corpo.

### Rotas autenticadas por tenant
Para acessar os recursos de domínio:

1. Tenha em mãos o `tenantToken` (UUID) fornecido na criação do tenant (ele continuará sendo exigido nas rotas autenticadas após o login).
2. Autentique-se via `POST /auth/login`, informando o `cnpj`, `email` e `senha`. O tenant será identificado apenas pelo CNPJ, dispensando o cabeçalho `x-tenant-token` nessa etapa.
3. Utilize `x-tenant-token` e `Authorization: Bearer <token>` em todas as requisições subsequentes às rotas protegidas.

#### POST `/auth/login`
- **Descrição:** Realiza a autenticação de usuários do tenant resolvendo automaticamente o contexto do tenant a partir do `cnpj` informado.
- **Headers:** Não requer `x-tenant-token`.
- **Corpo (JSON):**
  ```json
  {
    "cnpj": "12345678000199",
    "email": "admin@empresa.com",
    "senha": "Senha@123"
  }
  ```
- **Resposta 200:**
  ```json
  {
    "token": "jwt.assinado...",
    "usuario": {
      "id": 1,
      "nome": "Administrador",
      "email": "admin@empresa.com"
    }
  }
  ```
- **Observações:**
  - O campo `cnpj` aceita valores com ou sem formatação; apenas os dígitos serão considerados.
  - O token expira conforme `AUTH_EXPIRES_IN`.
  - O payload do JWT inclui `tenantToken` e será validado junto ao `x-tenant-token` em cada requisição protegida.

#### CRUD de Usuários
Gerenciamento dos usuários do tenant que podem consumir a API.

##### GET `/usuarios`
- **Descrição:** Lista todos os usuários do tenant.

##### GET `/usuarios/{id}`
- **Descrição:** Retorna os detalhes de um usuário pelo identificador numérico.

##### POST `/usuarios`
- **Descrição:** Cria um novo usuário.
- **Corpo (JSON):**
  ```json
  {
    "nome": "Operador Comercial",
    "email": "operador@empresa.com",
    "senha": "SenhaForte@123",
    "ativo": true
  }
  ```
- **Regras:**
  - Nome entre 3 e 150 caracteres.
  - E-mail válido, único no tenant e com até 180 caracteres.
  - Senha entre 8 e 64 caracteres.
  - `ativo` é opcional e por padrão `true`.

##### PUT `/usuarios/{id}`
- **Descrição:** Atualiza os dados de um usuário.
- **Corpo (JSON):** Qualquer combinação dos campos `nome`, `email`, `senha` e `ativo`, respeitando as mesmas regras de validação.

##### DELETE `/usuarios/{id}`
- **Descrição:** Remove um usuário do tenant.
- **Resposta 204:** Sem corpo.

#### Rotas de Estados
##### GET `/estados`
- **Descrição:** Retorna todos os estados cadastrados para o tenant atual.

#### Rotas de Cidades
##### GET `/cidades/{uf}`
- **Descrição:** Lista as cidades pertencentes à UF informada para o tenant atual.
- **Parâmetros de rota:** `uf` (código da unidade federativa com duas letras).

#### Rotas de Produtos
##### GET `/produtos`
- **Descrição:** Lista todos os produtos cadastrados no tenant ordenados por descrição.

##### GET `/produtos/{id}`
- **Descrição:** Busca um produto específico pelo identificador numérico.

##### POST `/produtos`
- **Descrição:** Cria um novo produto.
- **Corpo (JSON):**
  ```json
  {
    "descricao": "Café em grãos 1kg"
  }
  ```
- **Regras:** Campo `descricao` obrigatório, entre 1 e 255 caracteres.

##### PUT `/produtos/{id}`
- **Descrição:** Atualiza os dados de um produto existente.
- **Corpo (JSON):** Mesma regra de validação da criação.

##### DELETE `/produtos/{id}`
- **Descrição:** Remove um produto do tenant.
- **Resposta 204:** Sem corpo.

#### CRUD de Tipos de Sacaria
Controla os tipos de embalagens utilizados pelos embarques de café.

##### GET `/tipos-sacaria`
- **Descrição:** Lista todos os tipos de sacaria cadastrados no tenant ordenados por descrição.

##### GET `/tipos-sacaria/{id}`
- **Descrição:** Detalha um tipo de sacaria específico pelo identificador numérico.

##### POST `/tipos-sacaria`
- **Descrição:** Cria um novo tipo de sacaria.
- **Corpo (JSON):**
  ```json
  {
    "descricao": "Sacaria nova 60kg",
    "ativo": true
  }
  ```
- **Regras:**
  - `descricao` obrigatório entre 3 e 150 caracteres.
  - `ativo` é opcional e padrão `true`.

##### PUT `/tipos-sacaria/{id}`
- **Descrição:** Atualiza descrição ou status de um tipo de sacaria.
- **Corpo (JSON):** Qualquer combinação dos campos `descricao` e `ativo` respeitando as regras acima.

##### DELETE `/tipos-sacaria/{id}`
- **Descrição:** Remove um tipo de sacaria.
- **Resposta 204:** Sem corpo.

## Payloads e Configurações do Projeto

### Variáveis de ambiente relacionadas a tenants e autenticação

| Variável | Descrição |
| --- | --- |
| `TENANT_DB_HOST` | Host utilizado para as conexões com os bancos dos tenants (padrão: mesmo host da base core). |
| `TENANT_DB_PORT` | Porta de conexão dos bancos dos tenants (padrão: mesma porta da base core). |
| `TENANT_DB_SSL` | Define se a conexão dos tenants utiliza SSL (`true`/`false`). |
| `TENANT_DB_SUPER_USER` | Usuário com privilégios suficientes para criar bancos e aplicar migrações (padrão: usuário da base core). |
| `TENANT_DB_SUPER_PASS` | Senha do usuário administrador usado na criação das estruturas dos tenants (padrão: senha da base core). |
| `AUTH_SECRET` | Segredo utilizado para assinar e validar os JWTs. Defina um valor forte em produção. |
| `AUTH_EXPIRES_IN` | Tempo de expiração do JWT (ex: `1h`, `12h`, `7d`). |
| `TENANT_USUARIO_SENHA_PADRAO` | Senha utilizada pelo seeder para criar o usuário administrador inicial de cada tenant (`Senha@123` por padrão). |

### Payload padrão para criação/atualização de tenants
```json
{
  "name": "Identificador interno",
  "razaoSocial": "Razão Social LTDA",
  "nomeFantasia": "Nome Fantasia",
  "cnpj": "12345678000190",
  "inscricaoEstadual": "123456789",
  "emailContato": "contato@empresa.com",
  "telefoneContato": "11999998888",
  "clienteId": 1
}
```
- `razaoSocial`, `nomeFantasia` e `cnpj` são obrigatórios. O `cnpj` deve conter 14 dígitos numéricos.
- As credenciais e o nome do banco são gerados automaticamente com base no nome e no CNPJ do tenant. A senha é criada de forma randômica e forte.
- Após a criação o sistema provisiona o banco, executa as migrações de tenant, importa estados/cidades do IBGE e cria um usuário administrador padrão.
- Sempre que novas migrações forem adicionadas utilize `npm run tenants:migrate` para aplicá-las em todos os bancos de tenants já provisionados (o comando também garante o usuário padrão).

### Usuário padrão por tenant
- Assim que o tenant é provisionado, o seeder verifica se há usuários cadastrados e, se não houver, cria automaticamente um usuário "Administrador" ativo.
- O e-mail padrão utiliza `emailContato` do tenant (quando disponível) ou `admin@<nome-do-tenant>.local`.
- A senha utilizada é definida por `TENANT_USUARIO_SENHA_PADRAO` e registrada no log do processo de provisionamento/migração para facilitar o repasse ao cliente.
- Recomenda-se alterar a senha imediatamente após o primeiro acesso via `/usuarios/{id}`.

### Tipos de sacaria padrão por tenant
- Após as migrações, o seeder garante até cinco tipos de sacaria/embalagens comuns (`Sacaria nova 60kg`, `Sacaria usada 60kg`, `Big bag 1000kg`, `Café granel ensacado`, `Carga a granel`).
- O seeder apenas insere as descrições que ainda não existirem, permitindo personalização sem sobrescrever registros.
