# Scrcpy Dashboard - Unified Docker image
# Combines Next.js dashboard + ws-scrcpy for Android device streaming

FROM node:20-bookworm-slim AS base

# Install ADB, build tools for node-pty (native module), and runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    android-tools-adb \
    libusb-1.0-0 \
    ca-certificates \
    python3 \
    make \
    g++ \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Dependencies ---
COPY package.json package-lock.json ./
COPY ws-scrcpy/package.json ws-scrcpy/package-lock.json ./ws-scrcpy/

RUN npm ci && npm ci --prefix ./ws-scrcpy

# --- Build ws-scrcpy ---
COPY ws-scrcpy ./ws-scrcpy
RUN npm run build:ws

# --- Build Next.js ---
COPY . .
# Exclude ws-scrcpy from COPY . to avoid overwriting; already copied above
RUN npm run build

EXPOSE 3000 8000

# Run both: Next.js (3000) + ws-scrcpy (8000)
CMD ["npm", "run", "start"]
