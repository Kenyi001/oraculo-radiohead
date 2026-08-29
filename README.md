# Casandra 🔮 (oraculo-radiohead)

**Decision substrate for AI agents — sourced, timestamped market evidence so the agent decides on its own.**  
*Not predictions. Not a money-mover. Not financial advice.*

[![Hackathon](https://img.shields.io/badge/Aleph-Hackathon_2026-blueviolet?style=for-the-badge)](https://hacki.crecimiento.build/h/aleph-hackathon-2026)
[![Network](https://img.shields.io/badge/Ethereum-Sepolia_Testnet-blue?style=for-the-badge&logo=ethereum)](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)
[![Sponsor](https://img.shields.io/badge/Track-Tether_WDK-teal?style=for-the-badge)](https://hacki.crecimiento.build/h/aleph-hackathon-2026/tracks/wdk-track)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 1. Resumen General y Propuesta de Valor

En el ecosistema DeFi actual, los agentes de IA suelen tomar decisiones basadas en raspados de pantalla caóticos, opiniones de chats o heurísticas sesgadas. Esto los lleva a alucinar precios, inventar razones de mercado e iniciar transacciones arriesgadas.

**Casandra** resuelve esto proporcionando un **Evidence Pack (Paquete de Evidencia) determinista, versionado y estructurado en JSON**. 

```
                               ┌──────────────────────────┐
                               │   Fuentes en Tiempo Real │
                               │  (RSS, Precios, F&G Index)│
                               └─────────────┬────────────┘
                                             ▼
                               ┌──────────────────────────┐
                               │     Algoritmo Casandra   │
                               │   (Análisis de Riesgo)   │
                               └─────────────┬────────────┘
                                             ▼
                               ┌──────────────────────────┐
   ┌──────────────────────────►│      Evidence Pack       ├──────────────────────────┐
   │                           │     (JSON Estructurado)  │                          │
   │                           └─────────────┬────────────┘                          │
   ▼                                         ▼                                       ▼
┌──────────────────────────┐   ┌─────────────┴────────────┐   ┌──────────────────────────┐
│   MCP Server (stdio)     │   │      Smart Contract      │   │     Frontend (React)     │
│   (Agentes de IA)        │   │    (Ethereum Sepolia)    │   │      (Visualización)     │
└──────────────────────────┘   └──────────────────────────┘   └──────────────────────────┘
```

### Características Clave:
- **Toma de decisiones libre de alucinaciones:** En lugar de darle sugerencias directas de compra/venta, entrega a los agentes una estructura de datos `consume_only: true` con los fundamentos del mercado. El agente lee, procesa y asume la responsabilidad de la decisión.
- **Evidencia Unificada:** Combina precio actual, cambios de 24h, métricas de sentimiento (Fear & Greed Index), titulares de noticias en vivo vía RSS (CoinTelegraph, CoinDesk) y un desglose detallado de por qué el mercado se encuentra en ese estado.
- **Arquitectura de Guardarraíl (WDK):** Integra Tether WDK de forma segura. Si el agente decide actuar basándose en la evidencia de Casandra, el puente opcional WDK valida que no haya señales de alerta extrema antes de autorizar cualquier operación de prueba.

---

## 2. Arquitectura Técnica y Componentes

El proyecto está estructurado como un monorepo basado en **npm Workspaces**, diseñado para ser modular, altamente tipado (TypeScript) y fácil de extender:

```
oraculo-radiohead/
├── contracts/             # Contratos inteligentes (Hardhat + Solidity)
├── packages/
│   ├── market-core/       # Algoritmos de riesgo, parsing de RSS, datos agregados
│   ├── mcp-server/        # Servidor de Model Context Protocol (stdio)
│   ├── wdk-bridge/        # Integración y manifiesto del Tether WDK
│   └── demo-web/          # Interfaz web de usuario (React + Vite)
├── scripts/               # Scripts de utilidad rápida
└── docs/                  # Especificaciones, dirección de diseño y pitches
```

### Detalle de Componentes

1. **`@oraculo/market-core` (Núcleo de Datos y Algoritmo de Riesgo)**
   - Recupera precios de criptomonedas y variaciones en tiempo real.
   - Consume y parsea XML de feeds RSS oficiales (`CoinTelegraph` y `CoinDesk`) segmentados por símbolo (`BTC`, `ETH`, `SOL`, `USDT`).
   - Implementa **`casandra-risk-v1`**: Un algoritmo transparente que evalúa el nivel de riesgo en una escala de 0 a 100 ponderando la volatilidad, los cambios de precio y la proporción de stablecoins en el portafolio.
   - Genera el **Evidence Pack** con campos como: `why`, `reasons[]`, `meters`, `headlines[]`, `market_favor`, `confidence`, y `verdict`.

2. **`@oraculo/mcp-server` (Protocolo de Contexto de Modelos - MCP)**
   - Implementa el estándar de Anthropic/MCP para comunicar herramientas directamente a LLMs.
   - Expone herramientas críticas como `get_market_pulse` (Primaria), `get_price`, `get_risk_level`, `get_portfolio_state` y `check_wdk_guardrail`.
   - Se ejecuta a través de `stdio`, ideal para integración directa en IDEs como Cursor o clientes de escritorio como Claude Desktop.

3. **`@oraculo/wdk-bridge` (Puente Tether WDK)**
   - Gestiona las dependencias de Tether WDK (`@tetherto/wdk` y `@tetherto/wdk-cli`).
   - Define el flujo de guardarraíles para agentes: 1) Desbloqueo de cartera, 2) Validación de riesgo con Casandra (`check_wdk_guardrail`), 3) Ejecución/Simulación en WDK (dry-run).

4. **`contracts/CasandraRegistry.sol` (Registro On-Chain)**
   - Contrato inteligente minimalista escrito en Solidity y desplegado en **Ethereum Sepolia**.
   - Permite anclar hashes de los análisis de riesgo y portafolio generados por Casandra a la blockchain para auditoría pública y verificación de consistencia en el tiempo.
   - **Dirección Sepolia:** [`0x27544Fe45b81C09fC91f99c0A7374970839eC4FF`](https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF)

5. **`@oraculo/demo-web` (Frontend de Demostración)**
   - Aplicación web construida con React, Vite y CSS Vanilla para un diseño premium, fluido e interactivo.
   - Permite a los jueces de la Hackathon interactuar visualmente con el Evidence Pack, simular carteras, ver las noticias analizadas y consultar registros en la blockchain.

---

## 3. Instalación, Variables de Entorno y Ejecución Local

### Requisitos Previos
- **Node.js** >= 20.x
- **npm** >= 10.x

### Paso 1: Clonar e Instalar Dependencias
```bash
git clone https://github.com/Kenyi001/oraculo-radiohead.git
cd oraculo-radiohead
npm install
```

### Paso 2: Configuración de Variables de Entorno

#### 1. Configuración de Tether WDK (Raíz del proyecto)
Crea un archivo `.env` en la raíz del proyecto basado en `.env.wdk.example`:
```env
WDK_WALLET_NAME=casandra-dev
WDK_DEFAULT_NETWORK=sepolia
# Opcional (si se requieren consultas extendidas):
# MOONPAY_API_KEY=tu_api_key
# WDK_INDEXER_URL=url_del_indexer
```

#### 2. Configuración de Contratos Inteligentes (`/contracts`)
Crea un archivo `.env` en el directorio `contracts/` basándote en `contracts/.env.example`:
```env
PRIVATE_KEY=tu_clave_privada_de_sepolia (nunca compartir)
SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
```

#### 3. Configuración del Frontend (`/packages/demo-web`)
Crea un archivo `.env` en `packages/demo-web/` basado en `packages/demo-web/.env.example`:
```env
VITE_CASANDRA_REGISTRY_ADDRESS=0x27544Fe45b81C09fC91f99c0A7374970839eC4FF
VITE_CASANDRA_REGISTRY_EXPLORER=https://sepolia.etherscan.io/address/0x27544Fe45b81C09fC91f99c0A7374970839eC4FF
```

### Paso 3: Compilación del Monorepo
Para compilar todos los paquetes en el orden correcto de dependencias:
```bash
npm run build
```

### Paso 4: Ejecución Local

- **Ejecutar Servidor MCP (stdio):**
  ```bash
  npm run start:mcp
  ```
  *(Alternativamente para desarrollo: `npm run dev:mcp`)*

- **Ejecutar Frontend (Vite):**
  ```bash
  npm run dev:web
  ```
  Abre tu navegador en [http://localhost:5173](http://localhost:5173).

- **Ejecutar Compilación y Despliegue Local de Contratos (Hardhat):**
  ```bash
  npm run contracts:compile
  # Para desplegar en la red local de Hardhat
  npm run contracts:deploy:local
  # Para desplegar en Ethereum Sepolia
  npm run contracts:deploy:sepolia
  ```

- **Ejecutar Script de Utilidad (Probar la obtención del Pulse en Node):**
  ```bash
  node scripts/capture-pulse-json.mjs
  ```

---

## 4. Configuración MCP en Cursor o Claude Desktop

Para integrar las herramientas de Casandra en tu agente o IDE:

### Configuración en Cursor (settings -> Features -> MCP):
- **Name:** `casandra`
- **Type:** `command`
- **Command:** `node <RUTA_ABSOLUTA_A_TU_PROYECTO>/packages/mcp-server/dist/index.js`

### Configuración en Claude Desktop (`config.json`):
```json
{
  "mcpServers": {
    "casandra": {
      "command": "node",
      "args": [
        "<RUTA_ABSOLUTA_A_TU_PROYECTO>/packages/mcp-server/dist/index.js"
      ]
    }
  }
}
```

---

## 5. Equipo de Trabajo y Colaboradores

Un gran proyecto construido por mentes apasionadas en la **Aleph Hackathon 2026 (Santa Cruz, Bolivia)**:

| Integrante | Rol / Responsabilidad | GitHub |
|---|---|---|
| **Dax Kenji Tellez Duran** | **MCP + Core + Integración Pulse + Vercel Deployment** <br> Arquitectura del servidor MCP, lógica core de agregación y despliegue del demo web. | [@Kenyi001](https://github.com/Kenyi001) |
| **David Arnez** | **Calidad del Market Pulse y Algorítmica** <br> Diseño, calibración y especificación del motor de análisis de riesgo y Evidence Pack. | [@arnez69](https://github.com/arnez69) |
| **Victor Manuel** | **Contratos Inteligentes y Web3 Integración** <br> Desarrollo y despliegue de `CasandraRegistry` en Sepolia, integración de RPCs e interacción blockchain. | [@Vctor11180](https://github.com/Vctor11180) |
| **Augusto Ronald** | **Dirección de Pitch, Video Demostrativo y Documentación** <br> Storytelling del proyecto, grabación del video de uso y redacción de dirección técnica. | [@RonaldGaymer2002](https://github.com/RonaldGaymer2002) |

---

## Descargo de Responsabilidad / Disclaimer
**No es asesoría financiera.** Casandra no toma posiciones comerciales, no ejecuta operaciones automatizadas por sí misma de manera autónoma en producción y no garantiza rendimientos. El propósito principal es enriquecer el contexto para que los agentes operen bajo un marco riguroso de evidencia empírica.
