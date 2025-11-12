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
| `npm run tenants:migrate` | Aplica as migrações de domínio em todos os bancos provisionados para os tenants ativos. |

> As variáveis de ambiente de conexão devem estar configuradas antes da execução dos comandos que acessam banco de dados.

### Variáveis de ambiente relacionadas a tenants

| Variável | Descrição |
| --- | --- |
| `TENANT_DB_HOST` | Host utilizado para as conexões com os bancos dos tenants (padrão: mesmo host da base core). |
| `TENANT_DB_PORT` | Porta de conexão dos bancos dos tenants (padrão: mesma porta da base core). |
| `TENANT_DB_SSL` | Define se a conexão dos tenants utiliza SSL (`true`/`false`). |
| `TENANT_DB_SUPER_USER` | Usuário com privilégios suficientes para criar bancos, extensões e aplicar migrações (padrão: usuário da base core). |
| `TENANT_DB_SUPER_PASS` | Senha do usuário administrador usado na criação das estruturas dos tenants (padrão: senha da base core). |

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
    "clienteId": 1
  }
  ```
- **Observações:**
  - `razaoSocial`, `nomeFantasia` e `cnpj` são obrigatórios. O `cnpj` deve conter 14 dígitos numéricos.
  - As credenciais e o nome do banco são gerados automaticamente com base no nome e no CNPJ do tenant. A senha é criada de forma randômica e forte.
  - Após a criação o sistema provisiona o banco, executa as migrações de tenant e importa os dados de `estados` e `cidades` diretamente da API oficial do IBGE.
  - Sempre que novas migrações forem adicionadas utilize `npm run tenants:migrate` para aplicá-las em todos os bancos de tenants já provisionados.

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
