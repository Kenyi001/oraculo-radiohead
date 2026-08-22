# Graph Report - oraculo-radiohead  (2026-08-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 258 nodes · 282 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6f788165`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 13 edges
2. `compilerOptions` - 12 edges
3. `getMarketPulse()` - 12 edges
4. `scripts` - 11 edges
5. `normalizeSymbol()` - 11 edges
6. `getRiskLevel()` - 10 edges
7. `getPrice()` - 9 edges
8. `isStable()` - 5 edges
9. `getPortfolioState()` - 5 edges
10. `getMarketContext()` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (53): actionFromBand(), bandFromScore(), biasFromChange(), checkWdkGuardrail(), clamp(), computeBias(), DEFAULT_DEMO_POSITIONS, FearGreedSnapshot (+45 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (26): author, dependencies, @tetherto/wdk, @tetherto/wdk-cli, description, engines, node, @tetherto/wdk (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (21): @modelcontextprotocol/sdk, bin, oraculo-mcp, dependencies, @modelcontextprotocol/sdk, @oraculo/market-core, zod, devDependencies (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (18): dependencies, @tetherto/wdk, @tetherto/wdk-cli, devDependencies, typescript, exports, @tetherto/wdk, @tetherto/wdk-cli (+10 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (17): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (15): dependencies, @oraculo/market-core, react, react-dom, @oraculo/market-core, name, private, scripts (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (12): devDependencies, typescript, exports, typescript, main, name, scripts, build (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, typescript, @types/react (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (9): dotenv, ethers, hardhat, @nomicfoundation/hardhat-ethers, devDependencies, dotenv, ethers, hardhat (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (8): compilerOptions, composite, outDir, rootDir, extends, include, src/**/*, ../../tsconfig.base.json

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, rootDir, extends, include, src/**/*, ../../tsconfig.base.json

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, rootDir, extends, include, src/**/*, ../../tsconfig.base.json

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (3): fs, hre, path

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, outputDirectory

## Knowledge Gaps
- **153 isolated node(s):** `hre`, `fs`, `path`, `name`, `version` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 9` to `Community 1`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Community 8` to `Community 5`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `hre`, `fs`, `path` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06464646464646465 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._