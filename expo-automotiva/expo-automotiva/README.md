# Expo Automotiva — aplicação web

Projeto acadêmico fictício de divulgação de evento automotivo em Ijuí–RS. A aplicação usa HTML, CSS, JavaScript, Bootstrap 5, Node.js, Express e MySQL.

## Funcionalidades implementadas

- Página inicial com nome, data, local, chamada principal e galeria de veículos.
- Atrações/veículos por categoria: Antigos, Esportivos, Modificados e Motocicletas. Os registros são carregados do MySQL pela API.
- Programação por dia, horário, descrição e local, também carregada do MySQL.
- Localização com endereço, mapa incorporado e link de rota; informações de estacionamento.
- Acessibilidade, horários, regras de entrada e permanência.
- Contato por e-mail e links para redes sociais.
- Formulário de inscrição de visitante/expositor com validação e gravação no MySQL.
- Painel administrativo protegido por token para consultar inscrições, alterar status e consultar/excluir veículos, atrações e programação.
- Layout responsivo com Bootstrap e CSS próprio.

## Requisitos

- Node.js 18 ou superior
- MySQL 8 (ou versão compatível com InnoDB e utf8mb4)
- Navegador atualizado

## Como executar localmente

1. Instale o Node.js e o MySQL.
2. Crie o banco e as tabelas executando o script `sql/schema.sql` no MySQL Workbench ou terminal. **Execute o script uma única vez em uma base vazia** para não duplicar os dados demonstrativos.
3. Copie `.env.example` para `.env` e preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e um `ADMIN_TOKEN` longo (recomenda-se 32 caracteres ou mais).
4. Abra o terminal na pasta do projeto e execute:

   ```bash
   npm install
   npm run dev
   ```

5. Acesse `http://localhost:3000`. O teste de saúde da API fica em `http://localhost:3000/health`.
6. Para abrir o painel, acesse `http://localhost:3000/admin.html` e informe o valor de `ADMIN_TOKEN`.

## API

### Rotas públicas

| Método | Rota | Função |
|---|---|---|
| GET | `/api/veiculos` | Lista veículos; aceita `?categoria=Antigos` etc. |
| GET | `/api/atracoes` | Lista atrações cadastradas |
| GET | `/api/programacao` | Lista programação; aceita `?data=2026-11-15` |
| POST | `/api/inscricoes` | Registra visitante ou expositor |

Exemplo de corpo JSON para inscrição:

```json
{
  "nome": "Participante de Teste",
  "email": "teste@example.com",
  "telefone": "5599999999999",
  "tipo_inscricao": "Visitante",
  "veiculo_id": null,
  "mensagem": "Inscrição de teste",
  "aceite_privacidade": true
}
```

### Rotas administrativas

Todas exigem o cabeçalho `x-admin-token: SEU_ADMIN_TOKEN`.

| Método | Rota | Função |
|---|---|---|
| GET | `/api/admin/inscricoes` | Consulta inscrições |
| GET/POST/PUT/DELETE | `/api/admin/veiculos` | Consulta e gerencia veículos |
| GET/POST/PUT/DELETE | `/api/admin/atracoes` | Consulta e gerencia atrações |
| GET/POST/PUT/DELETE | `/api/admin/programacao` | Consulta e gerencia programação |
| PATCH | `/api/admin/inscricoes/:id/status` | Altera status para Recebida, Confirmada ou Cancelada |

O painel visual implementa consulta de inscrições, alteração de status e cadastro de veículos, atrações e programação, além da exclusão de registros. As rotas PUT também estão disponíveis para atualização de registros por clientes administrativos.

## Banco de dados

O script `sql/schema.sql` cria quatro tabelas:

- `veiculos`: informações, categoria, imagem e destaque.
- `atracoes`: atividades e informações das atrações.
- `programacao`: data, horário, descrição e local; indexada por data/horário.
- `inscricoes`: dados de participantes, tipo de inscrição, status e vínculo opcional com veículo.

A relação entre inscrições e veículos é `inscricoes.veiculo_id → veiculos.id`, com `ON DELETE SET NULL`.

## Publicação na internet (deploy)

O código está preparado para plataformas que hospedam aplicações Node.js e oferecem MySQL gerenciado. Exemplos de arquitetura: aplicação Node em Render/Railway/Fly.io e MySQL gerenciado em serviço compatível. Antes de publicar:

1. Crie um banco MySQL acessível pelo servidor da aplicação e importe `sql/schema.sql`.
2. Publique o repositório Git em um serviço de hospedagem Node.js com comando de build `npm install` e comando de inicialização `npm start`.
3. Cadastre as variáveis de ambiente do `.env` no painel do provedor; **não envie `.env` ao Git**.
4. Configure `NODE_ENV=production`, `PORT` conforme o provedor e um `ADMIN_TOKEN` exclusivo e forte.
5. Configure domínio/HTTPS no provedor e teste `/health`, as listagens e uma inscrição de teste.

**A URL pública ainda não existe:** para publicar de verdade são necessários uma conta de hospedagem, banco MySQL remoto e configuração de variáveis/credenciais. Não invente ou apresente `localhost` como URL publicada. A publicação precisa ser concluída na conta do responsável pelo projeto.

## Observações importantes para a entrega acadêmica

- Data, contato, preços de ingresso e atrações são dados fictícios de demonstração; o local foi indicado como Parque de Exposições Wanderley Burmann, BR-285, Km 454, Ijuí/RS. Confirme e ajuste os dados com a orientação do professor antes de apresentar como informações reais.
- As imagens são ilustrações geradas para o conceito visual do projeto; não representam veículos reais confirmados.
- A aplicação armazena dados de inscrição. Para uso real, implemente política de privacidade completa, consentimento adequado, HTTPS, autenticação administrativa robusta, backups, proteção contra abuso e procedimento de retenção/exclusão conforme a LGPD.
- O site não processa pagamento nem emite ingresso. A inscrição online é o recurso solicitado implementado; se o professor exigir venda/pagamento, isso precisará de integração adicional.
