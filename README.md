# Chronicles

An interactive RPG legacy game built with React Three Fiber. Part of the DarkWave ecosystem.

**Live:** [yourlegacy.io](https://yourlegacy.io)

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite (Three.js via R3F, Framer Motion) |
| 3D Engine | @react-three/fiber + @react-three/drei |
| State | React Query |
| Deployment | Static build |

## Structure

```
chronicles/
├── src/          # React + Three.js game client
├── public/       # Static assets
└── scripts/      # Build scripts
```

## Development

```bash
npm install
npm run dev
```

## Related

Game routes and server-side logic live in `trust-layer/server/chronicles-play-routes.ts` (served from the Trust Layer backend).
