# Tareas Victor — Casandra (Aleph Hackathon 2026)

**Responsable:** Victor  
**Proyecto:** Oráculo de Inversión Casandra ([oraculo-radiohead](https://github.com/Kenyi001/oraculo-radiohead))  
**Tracks:** **General (default) + WDK sponsor**

---

## Decisión de red (oficial)

- [x] **Despliegue oficial de Contrato (`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`) en Ethereum Sepolia** (#10)
**Ethereum Sepolia** (chainId `11155111`) es la red oficial del demo — el equipo tiene SepoliaETH; Base faucet no disponible.  
Base Sepolia queda opcional para después.

### Deploy oficial (#10)

| | |
|---|---|
| Address | `0x27544Fe45b81C09fC91f99c0A7374970839eC4FF` |
| Explorer | https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF |
| Artifact | `contracts/deployments/sepolia.json` |

## Tarea

- [x] Sincronizar `master`
- [x] Verificar `CasandraRegistry.sol`
- [x] Smoke local
- [x] **Despliegue Ethereum Sepolia + address en README/demo** (#10)
- [ ] Confirmar en #10: snapshot id=0 visible + checklist de pruebas (compile/smoke/explorer/README)

## Checklist de pruebas (Hacki)

1. `npx hardhat compile`
2. `npm run contracts:deploy:local`
3. Deploy Sepolia → `chainId: 11155111` (ya hecho)
4. Snapshot `publishRiskSnapshot` id=0
5. Link Etherscan vivo
6. README + `VITE_CASANDRA_*` / `.env.production`

Tracks: [docs/TRACK.md](../TRACK.md) · Contracts: [contracts/README.md](../../contracts/README.md)
