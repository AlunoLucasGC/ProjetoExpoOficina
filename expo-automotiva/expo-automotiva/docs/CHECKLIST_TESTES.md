# Checklist de testes — Expo Automotiva

Preencha a coluna de resultado somente depois de executar cada teste no seu computador/ambiente publicado.

| ID | Teste | Resultado esperado | Resultado observado |
|---|---|---|---|
| T01 | Iniciar MySQL e executar `sql/schema.sql` | Banco e quatro tabelas criados sem erro | Pendente de execução local |
| T02 | Configurar `.env` e executar `npm install` | Dependências instaladas | Pendente de execução local |
| T03 | Executar `npm run dev` | Servidor inicia e informa conexão MySQL | Pendente de execução local |
| T04 | Abrir `/health` | JSON com `status: ok` | Pendente de execução local |
| T05 | Abrir página inicial em desktop | Todas as seções e navegação aparecem | Pendente de execução local |
| T06 | Abrir página em celular/tablet | Menu, cartões, tabelas e formulário se adaptam | Pendente de execução local |
| T07 | Abrir Atrações | Veículos vêm da API/MySQL | Pendente de execução local |
| T08 | Filtrar por cada categoria | Lista mostra apenas a categoria selecionada | Pendente de execução local |
| T09 | Alternar dias da programação | Atividades e horários do dia são exibidos | Pendente de execução local |
| T10 | Enviar formulário sem campos obrigatórios | Navegador/API impede o cadastro | Pendente de execução local |
| T11 | Enviar inscrição válida de teste | API retorna protocolo e registro aparece em `inscricoes` | Pendente de execução local |
| T12 | Tentar enviar sem aceite de privacidade | API rejeita a inscrição | Pendente de execução local |
| T13 | Abrir painel sem token ou com token incorreto | API retorna 401 | Pendente de execução local |
| T14 | Abrir painel com token correto | Lista de inscrições aparece | Pendente de execução local |
| T15 | Confirmar inscrição no painel | Status muda para Confirmada no MySQL | Pendente de execução local |
| T16 | Consultar/excluir um veículo, atração ou atividade | Registro é exibido/excluído na API | Pendente de execução local |
| T17 | Conferir mapa e link de rota | Mapa carrega quando há internet | Pendente de execução local |
| T18 | Publicar e acessar via HTTPS | Site abre pela URL pública e API persiste no MySQL remoto | Pendente de deploy |

## Problemas/pendências conhecidas antes da validação

- A URL de produção ainda precisa ser criada pelo responsável, com hospedagem e MySQL remoto.
- O conteúdo do evento é fictício e precisa ser validado/substituído se necessário.
- O painel oferece consulta, cadastro e exclusão de veículos, atrações e programação, além da consulta e atualização de status das inscrições; a edição de registros existentes está disponível pela API PUT.
- O envio de inscrição não envia e-mail automático nem gera ingresso/QR Code, pois esses itens não constam nas funcionalidades mínimas descritas.
