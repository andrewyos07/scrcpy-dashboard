# Scrcpy Dashboard

A Next.js dashboard for managing Android devices and streaming them via [ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy). Uses ADB to discover, connect, and disconnect devices over USB and network.

## Prerequisites

- **Node.js** 18+
- **ADB** (Android Debug Bridge) – [Installation guide](https://developer.android.com/tools/adb)
- **ws-scrcpy** – WebSocket-based scrcpy viewer for streaming device screens

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set the ws-scrcpy URL:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SCRCPY_URL=http://localhost:8000
```

Replace with your ws-scrcpy server URL (e.g. `http://your-server:8000`).

### 3. Run ws-scrcpy (separate process)

Start ws-scrcpy before using the dashboard:

```bash
# Example: run ws-scrcpy on port 8000
npx ws-scrcpy
```

### 4. Start the dashboard

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

### Dashboard (`/`)

- **Add Device**: Enter `IP:port` (e.g. `192.168.1.100:5555`) and click Connect to add a device over the network.
- **Device List**: Shows connected devices with serial, model, and state. Refreshes every 5 seconds.
- **Open**: Opens the device view in an iframe with ws-scrcpy.
- **Disconnect**: Disconnects network devices (shown only for `IP:port` serials).
- **Remote Servers (Laptop Lain)**: Tambah URL ws-scrcpy dari laptop lain. Berguna untuk mengontrol Android yang terhubung ke laptop lain di jaringan. Contoh: `http://192.168.0.50:8000`.

### Device View (`/device/[serial]`)

- Embeds ws-scrcpy in an iframe.
- Passes the device serial as a URL query parameter for ws-scrcpy to target the correct device.
- Access directly via `/device/YOUR_SERIAL` or `/device/192.168.1.100%3A5555` for network devices.

### Remote View (`/remote?url=...`)

- Membuka ws-scrcpy dari laptop lain dalam iframe.
- Digunakan saat mengklik "Buka" pada Remote Server.

### Setup Multi-Laptop

1. **Laptop A** (punya Android): Jalankan ws-scrcpy (`npm start` di folder ws-scrcpy). Pastikan berjalan di port 8000 dan bisa diakses dari jaringan (firewall allow).
2. **Laptop B** (dashboard): Jalankan scrcpy-dashboard. Di section "Remote Servers", tambah `http://<IP_LAPTOP_A>:8000`.
3. Klik "Buka" untuk mengontrol Android di Laptop A dari Laptop B.

## API Endpoints

| Method | Endpoint                  | Description                                     |
| ------ | ------------------------- | ----------------------------------------------- |
| GET    | `/api/devices`            | List connected devices                          |
| POST   | `/api/devices/connect`    | Connect device by `{ "address": "IP:port" }`    |
| POST   | `/api/devices/disconnect` | Disconnect device by `{ "address": "IP:port" }` |

## Project Structure

```
src/
├── types/device.ts       # Device, AddDeviceInput, ApiResponse
├── lib/adb.ts            # ADB utilities (getDevices, connect, disconnect)
├── app/
│   ├── api/devices/      # API routes
│   ├── device/[serial]/  # Device view with ws-scrcpy iframe
│   └── page.tsx          # Dashboard
└── components/
    ├── DeviceList.tsx    # Device list with connect/open
    └── AddDeviceForm.tsx # Add device form
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- ADB (via `child_process`)
