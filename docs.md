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
| `npm run bancos:import -- --tenant=<token>` | Atualiza o cadastro de bancos do tenant informado (ou de todos, quando o parâmetro não é enviado) consumindo a BrasilAPI. |
| `npm run pagamentos:seed -- --tenant=<token>` | Executa os seeders de formas e condições de pagamento para todos os tenants ou apenas para o identificador informado. |
| `npm run tenants:migrate` | Aplica as migrações de domínio em todos os bancos provisionados para os tenants ativos e garante o usuário padrão. |

> As variáveis de ambiente de conexão devem estar configuradas antes da execução dos comandos que acessam banco de dados.

## Documentação de Rotas

Todas as rotas retornam respostas em JSON.

### Convenção de paginação e busca

As listagens que suportam grandes volumes (`/clientes` e `/vendas`) utilizam um padrão único de paginação e retorno:

- **Parâmetros de query:**
  - `pagina`: inteiro >= 1 (padrão `1`).
  - `limite`: inteiro entre 1 e 100 (padrão `20`).
  - `ordenarPor`: campo permitido por rota (ex.: `nome`, `documento` em clientes).
  - `ordenacao`: `ASC` ou `DESC` (padrão `ASC`).
  - `busca`: texto livre usado para pesquisar pelos campos suportados pela listagem.
- **Resposta padrão:**

```json
{
  "dados": [],
  "pagina": 1,
  "limite": 20,
  "total": 0,
  "totalPaginas": 1
}
```

> O campo `dados` contém o array da entidade solicitada. Os demais campos informam o estado da paginação para facilitar a construção de componentes de navegação no front-end.

### Convenção de respostas de erro

Independentemente do módulo, os erros retornam o seguinte formato padronizado:

```json
{
  "codigo": "ERRO_VALIDACAO",
  "mensagem": "Há dados inválidos no payload enviado.",
  "detalhes": ["Descrição é obrigatória."]
}
```

- `codigo` pode assumir os valores `ERRO_VALIDACAO`, `ERRO_NEGOCIO`, `NAO_ENCONTRADO` ou `ERRO_INTERNO`.
- `mensagem` descreve o motivo do erro em linguagem natural.
- `detalhes` é opcional e traz a lista de validações quebradas quando aplicável.

O front-end pode se basear nesses códigos para tratar fluxos específicos (ex.: destacar campos com erro de validação, exibir alertas de autorização, etc.).

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

#### CRUD de Observações Fiscais
Cadastro das observações fiscais que podem ser anexadas às notas, separadas por tipo de destinatário.

##### GET `/observacoes-fiscais`
- **Descrição:** Lista todas as observações fiscais cadastradas para o tenant.

##### GET `/observacoes-fiscais/tipo/{tipo}`
- **Descrição:** Lista as observações filtrando diretamente pelo tipo (`PRODUTOR` ou `EMPRESAS`).
- **Observação:** O parâmetro `tipo` é case insensitive, mas será normalizado para maiúsculas internamente.

##### GET `/observacoes-fiscais/{id}`
- **Descrição:** Detalha uma observação fiscal pelo identificador numérico.

##### POST `/observacoes-fiscais`
- **Descrição:** Cria uma nova observação fiscal.
- **Corpo (JSON):**
  ```json
  {
    "descricao": "Texto que será impresso na nota fiscal.",
    "tipo": "PRODUTOR"
  }
  ```
- **Regras:**
  - `descricao` obrigatório, mínimo 5 caracteres, aceita textos longos.
  - `tipo` obrigatório e deve ser `PRODUTOR` ou `EMPRESAS` (sempre em maiúsculo).

##### PUT `/observacoes-fiscais/{id}`
- **Descrição:** Atualiza a descrição, o tipo ou ambos para uma observação existente.
- **Corpo (JSON):** Qualquer combinação válida de `descricao` e `tipo` respeitando as regras acima.

##### DELETE `/observacoes-fiscais/{id}`
- **Descrição:** Remove uma observação fiscal.
- **Resposta 204:** Sem corpo.

#### CRUD de Bancos
Mantém o catálogo de instituições financeiras sincronizadas com a BrasilAPI.

##### GET `/bancos`
- **Descrição:** Lista todos os bancos cadastrados para o tenant atual em ordem alfabética.

##### GET `/bancos/{id}`
- **Descrição:** Retorna os detalhes de um banco específico pelo identificador numérico.

##### POST `/bancos`
- **Descrição:** Cria manualmente um novo banco ou ajusta o cadastro existente.
- **Corpo (JSON):**
  ```json
  {
    "codigo": 260,
    "ispb": "18236120",
    "nome": "Nu Pagamentos",
    "nomeCompleto": "Nu Pagamentos S.A."
  }
  ```
- **Regras:**
  - `codigo` é opcional, mas quando informado deve ser inteiro e maior que zero.
  - `ispb` é obrigatório e deve conter exatamente 8 dígitos numéricos.
  - `nome` obrigatório (2 a 150 caracteres).
  - `nomeCompleto` obrigatório (2 a 255 caracteres).

##### PUT `/bancos/{id}`
- **Descrição:** Atualiza qualquer um dos campos (`codigo`, `ispb`, `nome`, `nomeCompleto`) seguindo as mesmas regras do POST.

##### DELETE `/bancos/{id}`
- **Descrição:** Remove um banco cadastrado.
- **Resposta 204:** Sem corpo.

#### CRUD de Clientes
Cadastro dos compradores/produtores vinculados aos tenants. Todos os campos listados como obrigatórios são validados via Zod e devem respeitar os seguintes enums (sempre em maiúsculas):

- `tipoPessoa`: `PESSOA_FISICA` (ou código `1`) e `PESSOA_JURIDICA` (ou código `2`).
- `tipoComprador`: `PRODUTOR` (`1`), `COMPRADOR` (`2`) ou `PRODUTOR_COMPRADOR` (`3`).
- `atuacao`: `MERCADO_INTERNO` (`1`), `EXPORTADOR` (`2`), `TORREFADOR` (`3`) ou `CORRETOR` (`4`).

> Todo cliente possui o campo booleano `ativo` (padrão `true`). Utilize a rota `PATCH /clientes/{id}/status` para ativar/desativar sem alterar os demais dados cadastrais.

##### GET `/clientes`
- **Descrição:** Lista os clientes do tenant aplicando paginação, ordenação (`nome`, `documento` ou `createdAt`) e busca textual por nome, cidade ou documento.
- **Parâmetros de query:** segue o [padrão de paginação](#conven%C3%A7%C3%A3o-de-pagina%C3%A7%C3%A3o-e-busca).

##### GET `/clientes/{id}`
- **Descrição:** Detalha um cliente específico pelo identificador.

##### POST `/clientes`
- **Descrição:** Cria um cliente seguindo o novo cadastro simplificado.
- **Corpo (JSON):**
  ```json
  {
    "nome": "Fazenda São Jorge",
    "tipoPessoa": "PESSOA_JURIDICA",
    "documento": "12345678000199",
    "inscricaoEstadual": "1234567890",
    "tipoComprador": "PRODUTOR_COMPRADOR",
    "atuacao": "EXPORTADOR",
    "dataNascimento": "1990-01-01",
    "cep": "01001000",
    "endereco": "Rua Exemplo",
    "numero": "100",
    "complemento": "Sala 2",
    "bairro": "Centro",
    "uf": "SP",
    "cidade": "São Paulo",
    "email": "contato@exemplo.com",
    "telefone": "11999999999",
    "observacao": "Cliente estratégico",
    "numeroCar": "CAR123456"
  }
  ```
- **Regras principais:**
  - `documento` aceita CPF/CNPJ com ou sem máscara; apenas dígitos são armazenados (11 dígitos para PF, 14 para PJ).
  - `dataNascimento` deve ser uma data válida (string ISO ou objeto Date).
  - `cep` e `telefone` aceitam qualquer formatação, mas são normalizados para dígitos.
  - `email`, `inscricaoEstadual`, `complemento`, `observacao` e `numeroCar` são opcionais.

##### PUT `/clientes/{id}`
- **Descrição:** Atualiza um cliente existente. Qualquer combinação dos campos do POST é aceita, desde que ao menos um campo seja enviado.

##### DELETE `/clientes/{id}`
- **Descrição:** Remove um cliente.
- **Resposta 204:** Sem corpo.

##### PATCH `/clientes/{id}/status`
- **Descrição:** Atualiza apenas o status ativo do cliente.
- **Corpo (JSON):** `{ "ativo": true }`
- **Regras:** `ativo` é obrigatório e deve ser booleano. Útil para bloquear/reativar clientes sem perder o histórico.

#### Listagem geral de Vendas

##### GET `/vendas`
- **Descrição:** Retorna as vendas cadastradas aplicando o mesmo padrão de paginação do CRUD de clientes.
- **Parâmetros de query:** `pagina`, `limite`, `ordenarPor` (`dataVenda`, `numeroContrato`, `status`, `clienteNome` ou `createdAt`), `ordenacao` e `busca` (filtra por número do contrato, status ou nome do cliente).
- **Resposta 200:**
  ```json
  {
    "dados": [
      {
        "id": 15,
        "numeroContrato": "VEN-2025/0015",
        "clienteId": 2,
        "produto": "Café arábica",
        "quantidadeSacas": 150,
        "precoMedio": "1020.50",
        "status": "ABERTA",
        "dataVenda": "2025-02-10",
        "observacoes": null,
        "createdAt": "2025-02-10T10:30:00.000Z",
        "updatedAt": "2025-02-10T10:30:00.000Z",
        "cliente": {
          "id": 2,
          "nome": "Fazenda Santa Clara"
        }
      }
    ],
    "pagina": 1,
    "limite": 20,
    "total": 1,
    "totalPaginas": 1
  }
  ```
- **Observações:** o relacionamento com clientes é retornado apenas com os campos essenciais para identificação (`id` e `nome`).

#### CRUD de Locais de Descarga
Pontos de recebimento vinculados a um cliente. Úteis para controlar para onde o café pode ser entregue. Todos os campos passam por validação com Zod e exigem que o `clienteId` exista.

##### GET `/locais-descarga`
- **Descrição:** Lista todos os locais de descarga do tenant ordenados por nome.

##### GET `/locais-descarga/{id}`
- **Descrição:** Detalha um local pelo identificador.

##### GET `/locais-descarga/cliente/{clienteId}`
- **Descrição:** Lista apenas os locais vinculados ao cliente informado.
- **Parâmetros de rota:** `clienteId` inteiro maior que zero.

##### POST `/locais-descarga`
- **Descrição:** Cria um novo local de descarga vinculado a um cliente.
- **Corpo (JSON):**
  ```json
  {
    "clienteId": 1,
    "nome": "Armazém Matriz",
    "cep": "01001000",
    "endereco": "Rua Exemplo",
    "numero": "100",
    "complemento": "Galpão 3",
    "bairro": "Centro",
    "uf": "SP",
    "cidade": "São Paulo"
  }
  ```
- **Regras principais:** `clienteId` deve existir; `nome`, `endereco`, `numero`, `bairro`, `uf`, `cidade` são obrigatórios; `cep` aceita qualquer formatação mas é salvo com 8 dígitos; `complemento` é opcional.

##### PUT `/locais-descarga/{id}`
- **Descrição:** Atualiza um local existente. Qualquer combinação de campos do POST pode ser enviada, desde que ao menos um esteja presente.

##### DELETE `/locais-descarga/{id}`
- **Descrição:** Remove um local de descarga.
- **Resposta 204:** Sem corpo.

#### CRUD de Contas Bancárias
Armazena os dados bancários e chaves PIX vinculados aos clientes do tenant. Sempre informe um `clienteId` válido e um `bancoId` existente (consulte o CRUD de bancos). Os campos de lista aceitam o valor em texto ou o respectivo código numérico:

- `tipoConta`: `CORRENTE` (`1`), `POUPANCA` (`2`), `SALARIO` (`3`) ou `PAGAMENTO` (`4`).
- `tipoChavePix`: `CPF` (`1`), `CNPJ` (`2`), `EMAIL` (`3`), `TELEFONE` (`4`) ou `ALEATORIA` (`5`).

##### GET `/contas-bancarias`
- **Descrição:** Lista todas as contas bancárias cadastradas no tenant ordenadas pelo identificador.

##### GET `/contas-bancarias/{id}`
- **Descrição:** Detalha uma conta bancária específica.

##### GET `/contas-bancarias/cliente/{clienteId}`
- **Descrição:** Lista apenas as contas vinculadas ao cliente informado.
- **Parâmetros de rota:** `clienteId` inteiro maior que zero.

##### POST `/contas-bancarias`
- **Descrição:** Cria uma conta bancária.
- **Corpo (JSON):**
  ```json
  {
    "clienteId": 1,
    "bancoId": 10,
    "agencia": "1234",
    "numeroConta": "1234567",
    "digitoConta": "0",
    "tipoConta": "CORRENTE",
    "tipoChavePix": "CNPJ",
    "chavePix": "12345678000199"
  }
  ```
- **Regras principais:**
  - `agencia` deve conter de 3 a 20 caracteres alfanuméricos (apenas dígitos/letras são persistidos).
  - `numeroConta` deve conter de 3 a 30 caracteres alfanuméricos.
  - `digitoConta` é opcional (1 a 5 caracteres) e é salvo em maiúsculas.
  - `tipoConta`, `tipoChavePix` e `chavePix` são opcionais, mas `tipoChavePix` e `chavePix` devem ser enviados juntos.

##### PUT `/contas-bancarias/{id}`
- **Descrição:** Atualiza qualquer combinação dos campos do POST. O serviço valida os relacionamentos ao alterar `clienteId` ou `bancoId`.

##### DELETE `/contas-bancarias/{id}`
- **Descrição:** Remove uma conta bancária.
- **Resposta 204:** Sem corpo.

#### CRUD de Formas de Pagamento
Catálogo com as formas aceitas pelo tenant. Os seeders criam automaticamente `A VISTA`, `A PRAZO` e `PARCELADO`, mas o CRUD permite incluir outras opções.

##### GET `/formas-pagamento`
- **Descrição:** Lista todas as formas cadastradas ordenadas por nome.

##### GET `/formas-pagamento/{id}`
- **Descrição:** Busca uma forma específica pelo identificador.

##### POST `/formas-pagamento`
- **Descrição:** Cria uma nova forma.
- **Corpo (JSON):**
  ```json
  {
    "nome": "BOLETO 15 DIAS",
    "descricao": "Boleto a ser pago em até 15 dias"
  }
  ```
- **Regras:** `nome` obrigatório (3-120 caracteres, único no tenant); `descricao` é opcional com até 255 caracteres.

##### PUT `/formas-pagamento/{id}`
- **Descrição:** Atualiza qualquer combinação dos campos `nome` e `descricao`.
- **Regras:** Ao menos um campo deve ser informado no payload.

##### DELETE `/formas-pagamento/{id}`
- **Descrição:** Remove uma forma de pagamento.
- **Resposta 204:** Sem corpo.

#### CRUD de Condições de Pagamento
Define parcelamentos e prazos vinculados a uma forma de pagamento. Cada registro precisa apontar para uma forma existente e informar as regras de prazo.

##### GET `/condicoes-pagamento`
- **Descrição:** Lista todas as condições cadastradas ordenadas por descrição.

##### GET `/condicoes-pagamento/{id}`
- **Descrição:** Detalha uma condição específica.

##### GET `/condicoes-pagamento/forma/{formaPagamentoId}`
- **Descrição:** Filtra as condições pertencentes à forma indicada.
- **Parâmetros de rota:** `formaPagamentoId` inteiro maior que zero.

##### POST `/condicoes-pagamento`
- **Descrição:** Cria uma condição.
- **Corpo (JSON):**
  ```json
  {
    "formaPagamentoId": 1,
    "descricao": "30/60 dias",
    "quantidadeParcelas": 2,
    "primeiraParcelaEmDias": 30,
    "intervaloDias": 30
  }
  ```
- **Regras:**
  - `formaPagamentoId` deve apontar para uma forma existente.
  - `descricao` obrigatório entre 3 e 150 caracteres.
  - `quantidadeParcelas` entre 1 e 60.
  - `primeiraParcelaEmDias` e `intervaloDias` aceitam apenas inteiros positivos (zero permite cobrança imediata).

##### PUT `/condicoes-pagamento/{id}`
- **Descrição:** Atualiza qualquer conjunto dos campos aceitos no POST.
- **Regras:** Pelo menos um campo deve ser enviado. Alterar `formaPagamentoId` também valida a existência da forma.

##### DELETE `/condicoes-pagamento/{id}`
- **Descrição:** Remove uma condição.
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

### Formas e condições de pagamento padrão
- O provisionamento do tenant executa os seeders `garantirFormasPagamentoPadrao` e `garantirCondicoesPagamentoPadrao`.
- As formas inseridas automaticamente são `A VISTA`, `A PRAZO` e `PARCELADO`.
- As condições padrão criam cinco prazos usuais (pagamento imediato, 30 dias, 45 dias, 30/60 dias e entrada + 2x mensais). O comando `npm run pagamentos:seed` pode ser executado a qualquer momento para reaplicar os seeders em um tenant específico ou em todos.
