# Agente: Boas práticas para projetos JavaScript/Node.js

## Objetivo

Você é um agente que auxilia na escrita, refatoração e revisão de código JavaScript/Node.js.
Sempre que gerar código, siga as boas práticas abaixo, mantendo o código limpo, legível, seguro e testável.

---

## Convenções gerais de código

- Use **sintaxe moderna (ES2017+)**:
  - Prefira `const` e `let` em vez de `var`.
  - Use arrow functions quando fizer sentido, principalmente para funções pequenas.
  - Use **destructuring**, **spread** e **template literals** para tornar o código mais claro.
  - Nomes de variveis, classes, arquivos, pastas entre outros devem ser descritivos e em pt-br  

- Evite código mágico:
  - Não use “números mágicos” ou strings soltas; extraia para constantes com nomes claros.
  - Nomeie variáveis e funções de forma descritiva (`getUserById`, `createOrder`, etc.).
- Mantenha funções pequenas:
  - Uma função deve ter **uma responsabilidade clara**.
  - Se uma função estiver fazendo demais, divida em funções menores.
- Evite duplicação:
  - Aplique o princípio **DRY (Don’t Repeat Yourself)** sempre que possível.
- Comentários:
  - Use comentários apenas quando 
   (regras de negócio, decisões complexas).
  - Não comente o óbvio; prefira melhorar o nome de funções/variáveis.  
- Documente rotas, payloads e anotações importantes no arquivo docs.md
- Chaves primárias **nunca** devem usar UUID. Sempre utilize tipos inteiros auto-incrementais (ex.: `serial`, `bigint`) para identificadores.
- Todos os enums do domínio devem ficar em `src/ENUMS`, com valores **sempre em caixa alta** para garantir consistência com o banco e com o front-end.
- Sempre que criar ou atualizar endpoints, utilize **Zod** para validar os payloads antes de chamar os services.

---

## Módulos e organização

- Use **ES Modules** (`import`/`export`) quando possível, ou siga o padrão de módulos escolhido pelo projeto (`require`/`module.exports`) de forma consistente.
- Cada arquivo deve ter uma responsabilidade clara:
  - Arquivos de rota não devem conter regras de negócio complexas.
  - Regras de negócio devem ficar em **services/use-cases**.
  - Acesso a dados deve ficar em **repositories/models**.
- Estrutura sugerida (ajuste conforme o projeto):
  - `src/`
    - `config/` – configurações e variáveis de ambiente
    - `routes/` – definição de rotas HTTP
    - `controllers/` – entrada/saída HTTP
    - `services/` ou `usecases/` – regras de negócio
    - `repositories/` – acesso a banco de dados
    - `middlewares/`
    - `utils/` ou `lib/` – funções utilitárias
    - `tests/` – testes automatizados

---

## Promises, async/await e erros

- **Sempre** use `async/await` em vez de `then/catch` encadeados, quando possível.
- Faça tratamento explícito de erros:
  - Em código de infraestrutura (controllers, jobs), use `try/catch`.
  - Em services, lance erros com mensagens claras (por exemplo, `throw new Error('USER_NOT_FOUND')` ou erros customizados).
- Nunca ignore Promises (não deixe Promise sem `await` ou sem `return`, a não ser que seja intencional e justificado).
- Para código assíncrono em loop, prefira:
  - `for ... of` com `await` dentro, **ou**
  - `Promise.all()` quando as operações puderem rodar em paralelo.

---

## Node.js: boas práticas específicas

- Não acesse variáveis de ambiente diretamente em vários pontos do código:
  - Crie um módulo de **config** (ex: `src/config/env.ts`) que centralize o acesso a `process.env`.
- Nunca exponha segredos (tokens, senhas, chaves de API) em código-fonte:
  - Use `.env` e variáveis de ambiente.
- Ao trabalhar com APIs:
  - Valide inputs de requisição (body, params, query) antes de passá-los para os services.
  - Retorne códigos HTTP coerentes (`200`, `201`, `400`, `404`, `422`, `500`, etc.).
- Ao manipular arquivos ou streams:
  - Sempre trate erros (`error` event em streams).
  - Evite carregar arquivos gigantes inteiros na memória; prefira streams quando fizer sentido.

---

## Estilo, lint e formatação

- Siga as regras de um lint configurado (por exemplo, **ESLint**):
  - Não gere código que viole regras de lint quando elas forem conhecidas.
  - Prefira padrões de código que evitem `any`, variáveis não usadas, etc.
- Mantenha o código formatado:
  - Considere o uso de **Prettier** (indentação consistente, aspas, ponto e vírgula conforme padrão do projeto).
- Em caso de dúvida, prefira um estilo **consistente com o restante do projeto**.

---

## TypeScript (quando o projeto usar)

- Se o projeto estiver em TypeScript:
  - **Digite tudo que for importante** (parâmetros, retorno de funções, objetos, tipos de domínio).
  - Evite `any`; use tipos específicos ou genéricos bem definidos.
  - Separe tipos/interfaces em arquivos de tipo quando forem reutilizados.
- Gere tipos que representem o domínio (ex: `User`, `Order`, `CoffeeLot`) em vez de usar `{ [key: string]: any }`.

---  

## Documentação e exemplos

- Ao gerar novos módulos, inclua comentários(usar o arquivos docs.md) curto quando houver lógica de negócio complexa.
- Se o código envolver fluxo não trivial (ex: múltiplas etapas, filas, jobs), explique rapidamente em comentário ou JSDoc.
- Sempre que possível, mantenha exemplos de uso (por exemplo, em testes ou arquivos de exemplo).

---

## Pull Requests e refatoração

- Prefira mudanças pequenas e bem focadas.
- Ao refatorar:
  - Mantenha o comportamento atual, a menos que a alteração de comportamento seja desejada e documentada.
  - Atualize testes quando necessário.
- Sempre que detectar código duplicado ou difícil de ler, proponha uma refatoração incremental.  

## Uso de bibliotecas externas (NPM/Yarn/PNPM)

**Regra de ouro:**  
NUNCA copie o código-fonte completo de uma biblioteca externa (como `zod`, `lodash`, etc.) para dentro do projeto.

Em vez disso, siga sempre estas orientações:

1. **Sempre sugerir instalação via gerenciador de pacotes**

   Quando precisar de uma biblioteca, sugira algo como:

   - `npm install zod`
   - `yarn add zod`
   - `pnpm add zod`

   E depois importar normalmente no código:

   ```ts
   import { z } from "zod";


