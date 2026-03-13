# Scrcpy Dashboard

A Next.js dashboard for managing Android devices and streaming them via [ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy). **Satu project** – dashboard dan ws-scrcpy digabung, tidak perlu menjalankan 2 project terpisah.

## Prerequisites

- **Node.js** 18+
- **ADB** (Android Debug Bridge) – [Installation guide](https://developer.android.com/tools/adb)
- **scrcpy** – untuk streaming (terinstall otomatis di Docker)

## Setup

### 1. Install dependencies

```bash
npm install
npm install --prefix ./ws-scrcpy
```

### 2. Configure environment (opsional)

Buat `.env.local` jika ingin mengubah URL ws-scrcpy:

```
NEXT_PUBLIC_SCRCPY_URL=http://localhost:8000
```

Default: `http://localhost:8000`.

### 3. Jalankan (satu perintah)

```bash
npm run dev:all
```

Ini menjalankan **Next.js dashboard** (port 3000) dan **ws-scrcpy** (port 8000) bersamaan. Buka [http://localhost:3000](http://localhost:3000).

### Alternatif: Development terpisah

```bash
# Terminal 1: Dashboard saja
npm run dev

# Terminal 2: ws-scrcpy saja (build + start)
npm run start:ws
```

## Docker (Instalasi Mudah)

### Build & Run

```bash
# Build image
npm run docker:build

# Jalankan container
npm run docker:up
```

Atau manual:

```bash
docker compose up -d
```

Buka [http://localhost:3000](http://localhost:3000).

### Catatan Docker

- **USB (ADB via kabel)**: Container memakai `--privileged` dan mount `/dev/bus/usb`. Pastikan device terhubung sebelum start.
- **Wireless ADB**: Jika hanya pakai `adb connect IP:5555`, bisa hapus `privileged` dan `volumes` di `docker-compose.yml`.
- Stop: `npm run docker:down` atau `docker compose down`

## Production Build

```bash
npm run build
npm run start
```

## Usage

### Dashboard (`/`)

- **Add Device**: Masukkan `IP:port` (mis. `192.168.1.100:5555`) dan klik Connect.
- **Device List**: Daftar device yang terhubung, refresh otomatis tiap 5 detik.
- **Open**: Buka device view dengan ws-scrcpy di iframe.
- **Disconnect**: Putuskan device jaringan.
- **Remote Servers (Laptop Lain)**: Tambah URL ws-scrcpy dari laptop lain untuk kontrol Android di jaringan.

### Device View (`/device/[serial]`)

- Menampilkan ws-scrcpy di iframe dengan serial device yang dipilih.
- Akses langsung: `/device/YOUR_SERIAL` atau `/device/192.168.1.100%3A5555`.

### Remote View (`/remote?url=...`)

- Membuka ws-scrcpy dari laptop lain dalam iframe.
- Digunakan saat mengklik "Buka" pada Remote Server.

## Project Structure

```
scrcpy-dashboard/
├── src/                    # Next.js (dashboard)
│   ├── app/
│   ├── components/
│   └── lib/
├── ws-scrcpy/              # ws-scrcpy (streaming Android)
│   ├── src/
│   ├── webpack/
│   └── ...
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Scripts

| Script                 | Deskripsi                                    |
| ---------------------- | -------------------------------------------- |
| `npm run dev:all`      | Jalankan dashboard + ws-scrcpy (development) |
| `npm run dev`          | Dashboard saja                               |
| `npm run build`        | Build ws-scrcpy + Next.js                    |
| `npm run start`        | Production: Next.js + ws-scrcpy              |
| `npm run docker:build` | Build Docker image                           |
| `npm run docker:up`    | Jalankan container                           |
| `npm run docker:down`  | Stop container                               |

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- ws-scrcpy (Express, WebSocket, ADB)
- ADB (via `child_process`)
