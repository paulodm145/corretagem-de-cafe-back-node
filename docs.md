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
| `npm run ibge:import` | Executa a rotina de importação de dados do IBGE. |

> As variáveis de ambiente de conexão devem estar configuradas antes da execução dos comandos que acessam banco de dados.

## Endpoints

Todas as rotas expostas abaixo retornam respostas em JSON. As rotas protegidas por multitenancy exigem o cabeçalho `x-tenant-token` com o token UUID do tenant ativo.

### GET `/health`
- **Descrição:** Verifica se o serviço está respondendo.
- **Autenticação:** Não requer token.
- **Resposta 200:** `{ "status": "ok" }`

### Rotas de administração de tenants
Rotas públicas destinadas ao gerenciamento de tenants na base "core".

#### GET `/tenants`
- **Descrição:** Lista todos os tenants cadastrados.
- **Autenticação:** Não requer token.

#### GET `/tenants/{id}`
- **Descrição:** Busca um tenant pelo identificador numérico.
- **Parâmetros de rota:** `id` (número inteiro).

#### POST `/tenants`
- **Descrição:** Cadastra um novo tenant.
- **Corpo (JSON):**
  ```json
  {
    "name": "Identificador interno",
    "razaoSocial": "Razão Social LTDA",
    "nomeFantasia": "Nome Fantasia",
    "cnpj": "12345678000190",
    "inscricaoEstadual": "123456789",
    "emailContato": "contato@empresa.com",
    "telefoneContato": "11999998888",
    "clienteId": 1,
    "dbName": "tenant_db",
    "dbHost": "localhost",
    "dbPort": 5432,
    "dbUsername": "usuario",
    "dbPassword": "senha",
    "dbSsl": false,
    "isActive": true
  }
  ```
- **Observações:** `razaoSocial`, `nomeFantasia` e `cnpj` são obrigatórios. O `cnpj` deve conter 14 dígitos numéricos.

#### PUT `/tenants/{id}`
- **Descrição:** Atualiza os dados de um tenant existente.
- **Parâmetros de rota:** `id` (número inteiro).
- **Corpo (JSON):** Mesma estrutura do POST. Apenas os campos informados serão atualizados, mantendo as validações dos obrigatórios.

#### DELETE `/tenants/{id}`
- **Descrição:** Remove um tenant pelo identificador.
- **Resposta 204:** Sem corpo.

### Rotas protegidas por tenant
Para acessar as rotas abaixo informe `x-tenant-token` com o token UUID do tenant ativo.

#### GET `/estados`
- **Descrição:** Retorna todos os estados cadastrados para o tenant atual.

#### GET `/cidades/{uf}`
- **Descrição:** Lista as cidades pertencentes à UF informada para o tenant atual.
- **Parâmetros de rota:** `uf` (código da unidade federativa com duas letras).

> Sempre que um novo endpoint for adicionado à API ele deve ser documentado neste arquivo seguindo o mesmo padrão de descrição.
