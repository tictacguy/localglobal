# Local Global

Marketplace che mette in contatto **viaggiatori** e **local** per esperienze autentiche,
con match per interessi, booking, chat sbloccata dalla prenotazione (paywall) e un
**Passaporto** gamificato. UI fedele al design `UI_UX.fig`, idee dal board `Brainstorming.jam`.

## Stack

- **web/** — React + Vite + TypeScript (app a schermo mobile 375px, centrata su desktop)
- **server/** — Node + Express + TypeScript + Prisma + PostgreSQL
- **Caddy** — reverse proxy con **HTTPS automatico** (Let's Encrypt)
- **Docker Compose** — orchestrazione su porte interne "esotiche"

## Sicurezza

- Password con **bcrypt** (cost 12), sessione in **cookie httpOnly** `SameSite=Lax`
- Validazione input con **Zod** su ogni endpoint
- **Helmet**, CORS ristretto all'origin pubblico, **guardia CSRF** (controllo Origin/Referer)
- **Rate limiting** (stretto sugli endpoint di autenticazione)
- Caddy aggiunge HSTS, `X-Content-Type-Options`, `X-Frame-Options`

> **Pagamenti:** il flusso di prenotazione e il paywall della chat sono implementati,
> ma **nessun pagamento reale** viene elaborato. Per attivare i pagamenti collega
> Stripe (chiavi in variabili d'ambiente) nel punto segnato in `server/src/routes/api.ts`
> (`POST /bookings`). Finché non lo fai, `booking.paid` resta `false`.

## Sviluppo locale

Richiede una istanza Postgres (es. `docker run -e POSTGRES_PASSWORD=localglobal -e POSTGRES_USER=localglobal -e POSTGRES_DB=localglobal -p 5432:5432 postgres:16-alpine`).

```bash
# Backend
cd server
npm install
cp ../.env.example .env        # imposta DATABASE_URL/JWT_SECRET per il locale
npx prisma db push
npm run seed                   # dati demo
npm run dev                    # http://localhost:8080

# Frontend (altro terminale)
cd web
npm install
npm run dev                    # http://localhost:5173 (proxy /api -> :8080)
```

Account demo: `alberto@localglobal.it` / `Password123!` (o `SEED_DEMO_PASSWORD`).

## Deploy in produzione (Docker + HTTPS)

Prerequisiti sul server: Docker + Docker Compose, DNS di `localglobal.it` che punta
al server, porte 80 e 443 aperte.

```bash
git clone https://github.com/tictacguy/localglobal.git
cd localglobal
cp .env.example .env
# modifica .env: POSTGRES_PASSWORD, JWT_SECRET (openssl rand -base64 48), PUBLIC_ORIGIN=https://localglobal.it
docker compose up -d --build
docker compose run --rm api npm run seed   # una tantum, dati demo
```

Caddy ottiene automaticamente il certificato Let's Encrypt al primo avvio: il sito
è raggiungibile in HTTPS su `https://localglobal.it`.

### Porte

| Servizio | Porta interna | Pubblicazione host            |
| -------- | ------------- | ----------------------------- |
| caddy    | 80 / 443      | `80`, `443` (pubbliche)       |
| web      | 80            | `127.0.0.1:47880` (solo loc.) |
| api      | 8080          | `127.0.0.1:47891` (solo loc.) |
| db       | 5432          | non pubblicata                |

## Schermate implementate

Login · Registrati · Onboarding (4 step) · Welcome · Home (feed + ricerca) ·
Esplora (swipe match) · Dettaglio esperienza · Prenotazione (Aggiungi appuntamento) ·
Messaggi · Chat (con paywall) · Profilo · Dati Personali (+ selezione città) ·
Profilo Local · Passaporto.
