# MB EXPRESS

Site completo em React + Vite para a MB EXPRESS, empresa de logística e entregas de moto em Blumenau/SC.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- Leaflet + OpenStreetMap
- `localStorage` com dados mockados para protótipo e GitHub Pages

## Como instalar

```bash
npm install
```

## Como rodar

```bash
npm run dev
```

## Como gerar build

```bash
npm run build
```

O build fica em `dist/`.

## Publicar no GitHub Pages

1. Rode `npm run build`.
2. Publique a pasta `dist/` no GitHub Pages.
3. O projeto usa `base: './'` no `vite.config.js`, preparado para funcionar em subpastas do GitHub Pages.

## Login administrativo

O login do protótipo fica em:

```txt
src/data/config.js
```

Padrão:

- Usuário: `admin`
- Senha: `mbexpress2026`

Isso é apenas para protótipo. Como o site será hospedado no GitHub Pages, qualquer dado no front-end pode ser visto por usuários técnicos.

## Segurança importante

- Login em `localStorage` não é segurança real.
- Dados sensíveis não devem ficar públicos em produção.
- Para produção real, use backend, banco de dados, autenticação segura, logs e permissões por perfil.
- Cadastros com telefone e dados pessoais precisam de tratamento adequado de privacidade e LGPD.

## Dados locais

Os dados iniciais ficam em:

```txt
src/data/mockData.js
```

O app grava motoboys e solicitações no `localStorage`. Para limpar tudo, remova as chaves que começam com `mb_express_` no navegador.

## Fluxo de protocolo

Quando o cliente calcula o orcamento e clica em **Solicitar motoboy**, o site:

1. Salva a entrega completa no painel administrativo.
2. Gera um protocolo no formato `MBX-AAAAMMDD-CODIGO`.
3. Abre o WhatsApp com uma mensagem curta contendo somente o protocolo.
4. Permite copiar o protocolo caso o WhatsApp nao esteja conectado.

No painel admin, use a busca em **Solicitacoes de entrega** para localizar o pedido pelo protocolo e visualizar rota, valor, tempo, cliente e status.

## Orçamento, agenda e cálculo

O orçamento permite marcar **Você quer agendar essa entrega?** e escolher data/horário. No painel admin, entregas agendadas aparecem com etiqueta no card e também no calendário de entregas agendadas.

A fórmula de valor fica em `src/services/mapService.js` e usa os parâmetros de `src/data/config.js`:

```txt
COMBUSTIVEL = (KM / 30) * PRECO_GASOLINA
MANUTENCAO = KM * 0.25
OPERACIONAL = KM * 1.20
TOTAL = COMBUSTIVEL + MANUTENCAO + OPERACIONAL
```

## Rastreio de pedido

A página `/rastreio` permite que o cliente acompanhe a entrega pelo protocolo. O painel admin alimenta esse rastreio:

- Sem motoboy alocado: aparece como aguardando entregador.
- Com motoboy selecionado no admin: aparece o nome do motoboy alocado.
- Status `Em andamento`: aparece como motoboy a caminho.
- Status `Finalizado` ou `Cancelado`: encerra a linha do tempo.

No protótipo, o rastreio lê os dados do `localStorage`. Para funcionar entre celulares, computadores e GitHub Pages em produção real, será necessário backend/API com banco de dados.

## Mapas e autocomplete

O serviço de endereços está em:

```txt
src/services/mapService.js
```

Ele tenta buscar endereços via OpenStreetMap/Nominatim e usa fallback local com ruas de Blumenau caso a API esteja indisponível.

### Google Maps opcional

O projeto mantém OpenStreetMap/OSRM como versão gratuita. Para testar Google Maps sem remover o fallback, crie um arquivo `.env.local`:

```txt
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE
VITE_MAP_PROVIDER=auto
```

Com `auto`, o app usa Google Maps para geocodificação/rota quando a chave estiver disponível e cai para OpenStreetMap/OSRM se falhar. Para forçar a versão gratuita antiga:

```txt
VITE_MAP_PROVIDER=osm
```

Em produção, restrinja a chave no Google Cloud por domínio, limite cota e configure alertas de orçamento.

## WhatsApp e bot Discloud

O serviço está em:

```txt
src/services/whatsappService.js
```

Hoje ele monta links `https://wa.me/55NUMERO?text=MENSAGEM`.

Para integrar futuramente com o bot hospedado na Discloud, crie um endpoint próprio no bot, por exemplo:

```txt
POST https://seu-bot.discloud.app/api/entregas
```

Depois substitua ou complemente a função `sendToFutureBotWebhook`. A estrutura não usa WhatsApp Cloud API e está preparada para enviar dados a uma API/webhook própria do bot por sessão remota.

## Futuro app Android

Para aplicativo Android, a recomendação é:

- Migrar dados de `localStorage` para uma API.
- Usar banco como PostgreSQL, MySQL, Firebase ou Supabase.
- Criar autenticação real para admin e motoboys.
- Reutilizar os contratos de dados em `services/` para manter web, bot e app falando o mesmo formato.

## Estrutura

```txt
src/
  assets/
  components/
  context/
  data/
  pages/
  routes/
  services/
  utils/
```
