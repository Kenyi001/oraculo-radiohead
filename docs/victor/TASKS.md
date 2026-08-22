# Tareas Victor — Casandra (Aleph Hackathon 2026)

**Responsable:** Victor  
**Proyecto:** Oráculo de Inversión Casandra ([oraculo-radiohead](https://github.com/Kenyi001/oraculo-radiohead))  
**Track:** AI (Aleph) → **General (default) + WDK sponsor**  

---

## Tarea Seleccionada

- [x] **Sincronizar cambios de GitHub en la rama local (`master`)**
- [x] **Verificar y preparar el Contrato Inteligente (`CasandraRegistry.sol`)**
- [ ] **Despliegue a Base Sepolia y actualización de dirección en README + Demo** (#10)

Tracks: see [docs/TRACK.md](../TRACK.md) · WDK: [docs/WDK.md](../WDK.md)

---

## 📝 Registro de Actividades Realizadas

### 1. Sincronización de Rama Git desde GitHub
- Se ejecutó `git fetch origin` identificando nuevas ramas remotas (`feature/Arnez` y `rama-augusto`).
- Se realizó un `git pull origin master` con integración *fast-forward* limpia, actualizando 28 archivos clave del repositorio.

### 2. Preparación del Entorno de Smart Contracts
- Se ejecutó e instaló la totalidad de dependencias del monorepo (`npm install`).
- Se instaló y configuró el compilador de Solidity `v0.8.24` para EVM target `paris`.
- Se verificó la compilación de `contracts/CasandraRegistry.sol` sin advertencias ni errores.

### 3. Prueba de Despliegue Local (Dry-Run)
- Se ejecutó `npm run contracts:deploy:local` exitosamente.
- El contrato se desplegó localmente (`0x5FbDB2315678afecb367f032d93F642f64180aa3`) y registró la primera transacción de prueba on-chain (`Published demo snapshot id=0`).

### 4. Documentación del Contrato Inteligente (`CasandraRegistry`)
- **Propósito:** Registro inmutable on-chain para almacenar snapshots de riesgo calculados por el motor de Casandra (evitando alucinaciones o manipulación de datos por agentes IA).
- **Estructura de datos (`Snapshot`):** `portfolioHash` (bytes32), `score` (0-100), `band` (low/med/high), `timestamp`, `publisher`.
- **Funciones:** `publishRiskSnapshot()`, `latestSnapshot()`, `snapshotCount()`.

---

## ⚠️ Corrección (2026-08-22) — red equivocada

Deploy reportado en **Ethereum Sepolia** (`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF` / [etherscan](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)) **no cuenta**. #10 exige **Base Sepolia** (chainId `84532`, explorer `sepolia.basescan.org`). El `.sol` está OK; hay que **redeploy** en Base. Detalle: [issue #10](https://github.com/Kenyi001/oraculo-radiohead/issues/10).

## 🏁 Pasos Finales para Despliegue a Base Sepolia

1. **Fondear wallet en Base Sepolia** (no Ethereum Sepolia): [Alchemy faucet](https://www.alchemy.com/faucets/base-sepolia) o Coinbase CDP. MetaMask: chainId `84532`.

2. **Variables de entorno** en `.env` (raíz del repo — nunca committear la key):
   ```env
   PRIVATE_KEY=tu_private_key_aqui
   BASE_SEPOLIA_RPC=https://base-sepolia-rpc.publicnode.com
   ```

3. **Deploy:**
   ```bash
   npm run contracts:deploy:base
   ```
   Verificar log: `chainId: 84532` y link `https://sepolia.basescan.org/address/0x...`

4. **Actualizar:**
   - `contracts/deployments/baseSepolia.json` (lo escribe el script)
   - `README.md` + `packages/demo-web/.env` (`VITE_CASANDRA_REGISTRY_ADDRESS` + `VITE_CASANDRA_REGISTRY_EXPLORER`)
   - Comentar la address en [#10](https://github.com/Kenyi001/oraculo-radiohead/issues/10)
