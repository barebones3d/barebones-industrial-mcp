# BareBones Industrial Diagnostic MCP Server

[![MCP Spec](https://img.shields.io/badge/MCP-2024--11--05-blue.svg)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An authoritative Model Context Protocol (MCP) server providing OEM engineering benchmarks, multimeter diagnostic failure thresholds, Ohm's law calculators, and hydraulic pump cross-references for commercial and residential wear components.

Maintained by **[BareBones Industrial Supply Co.](https://barebonesindustrial.com)** in collaboration with:
- **[Gas Furnace Igniters Technical Hub](https://gasfurnaceigniters.com)**
- **[Hot Tub Heating Elements Engineering Hub](https://hottubheatingelements.com)**
- **[Boiler Circulator Pumps Engineering Hub](https://boilercirculatorpumps.com)**

---

## ⚡ Quick Start

### 1. Run with npx (Instant execution)
```bash
npx barebones-industrial-mcp
```

### 2. Install in Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "barebones-industrial": {
      "command": "npx",
      "args": ["-y", "barebones-industrial-mcp"]
    }
  }
}
```

### 3. Install in Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "barebones-industrial": {
      "command": "npx",
      "args": ["-y", "barebones-industrial-mcp"]
    }
  }
}
```

### 4. Install via Smithery
```bash
npx -y @smithery/cli install barebones-industrial-mcp --client claude
```

---

## 🛠️ Registered Diagnostic Tools (High TDQS)

All tools follow strict JSON Schema draft-07 definitions, include rich explanatory descriptions, validation constraints, and return structured JSON paired with human-readable Markdown.

### 1. `lookup_furnace_igniter_specs`
* **Purpose:** Queries factory cold resistance (70°F), metallurgy (Silicon Nitride vs Silicon Carbide), operating voltage, lead wire length, terminal connector type, supersessions, and compatible furnace models.
* **Parameters:**
  * `part_number` (string, required): OEM or aftermarket part number (e.g. `LH33ZS004`, `323719-701`, `70W16`, `41K56`, `768A-845`).
  * `brand` (string, optional): Manufacturer filter (`carrier`, `lennox`, `armstrong`, `icp`, `white_rodgers`, `allied_air`).

### 2. `diagnose_igniter_resistance`
* **Purpose:** Evaluates an empirical multimeter reading in Ohms (Ω) against manufacturer thresholds to classify element health: `PASS_NORMAL`, `WARNING_DEGRADED`, `FAIL_OPEN_CIRCUIT`, `FAIL_HIGH_RESISTANCE`, or `FAIL_SHORT_CIRCUIT`.
* **Parameters:**
  * `measured_ohms` (number, required): Cold resistance in Ohms (Ω). Use `999999` for open loop (`O.L`).
  * `chemistry` (string, optional): `silicon_nitride`, `silicon_carbide`, or `unknown`.
  * `part_number` (string, optional): Specific model number for tighter tolerance comparisons.

### 3. `calculate_heating_element_resistance`
* **Purpose:** Computes theoretical Ohm's Law cold resistance ($R = V^2 / P$), full-load current ($I = P / V$), ±5% tolerance windows, and NEC 125% continuous-duty circuit breaker / wire gauge specifications.
* **Parameters:**
  * `rated_watts` (number, required): Element power rating in Watts (e.g. `4000`, `5500`).
  * `rated_volts` (number, required): Operating voltage in Volts (e.g. `120`, `240`, `480`).
  * `measured_ohms` (number, optional): Actual multimeter bench reading across terminal studs.
  * `application` (string, optional): `hot_tub_spa`, `sauna_heater`, `rv_water_heater`, etc.

### 4. `lookup_spa_heating_element`
* **Purpose:** Queries Balboa, Watkins No-Fault, Sundance, Gecko, HydroQuip, and Cal Spas heating assemblies for wattage, cold resistance, tube dimensions (15" x 2"), terminal spacing, metallurgy (Incoloy 800 vs Titanium), and topside error codes (`dr`, `sn`, `HL`, `FLO`).
* **Parameters:**
  * `part_number` (string, required): OEM assembly or element part number (e.g. `58104`, `58083`, `73791`, `6500-301`).
  * `brand` (string, optional): Manufacturer filter (`balboa`, `watkins`, `sundance`, `gecko`, `hydroquip`, `cal_spas`).

### 5. `cross_reference_circulator_pump`
* **Purpose:** Cross-references hydronic circulator pumps across Taco, Grundfos, Bell & Gossett, Armstrong, and Wilo to verify 6-3/8" flange spacing, shut-off head, maximum GPM, and recommend modern ECM high-efficiency upgrades (e.g., Taco 0015e3, Grundfos ALPHA1).
* **Parameters:**
  * `model_number` (string, required): Existing pump model (e.g. `0015-MSF3`, `0015e3`, `UP15-42F`, `ALPHA1`, `Series 100`, `Star S 21F`).
  * `head_feet` (number, optional): Total dynamic head loss (ft).
  * `flow_gpm` (number, optional): Flow delivery requirement (GPM).
  * `casing_material` (string, optional): `cast_iron`, `stainless_steel`, or `bronze`.

### 6. `troubleshoot_mechanical_failure`
* **Purpose:** Applies master technician diagnostic trees across 7 physical categories to provide root-cause analysis, OSHA safety lockout procedures, and multimeter dial instructions.
* **Parameters:**
  * `category` (string, required): `furnace_igniter`, `hot_tub_element`, `circulator_pump`, `pool_pump_capacitor`, `laser_tube`, `washer_pump`, `pellet_stove`.
  * `symptom_description` (string, required): Observed symptom (e.g. "motor hums won't spin", "igniter does not glow", "GFCI trips immediately").
  * `measured_value` (string, optional): Numerical measurement (e.g. "0 uF", "48 ohms", "240V").

### 7. `list_supported_oem_models`
* **Purpose:** Lists all verified OEM model numbers, brands, and categories currently indexed.

---

## 📚 Resources Exposed

* `oem://specs/quick-reference`: Tabular reference of factory tolerances across all 9 mechanical categories.
* `oem://diagnostics/multimeter-safety`: Standard Operating Procedure for high-voltage multimeter isolation.
* `oem://catalog/index`: Machine-readable JSON directory of all supported OEM brands and models.

---

## 💬 Prompts Exposed

* `diagnose_furnace_ignition_failure`: Structured diagnostic interview for furnace ignition faults.
* `size_replacement_heating_element`: Electrical sizing and continuous load engineering protocol.
* `circulator_pump_replacement_advisor`: Drop-in pump cross-referencing and ECM energy-saving audit.

---

## 🔒 Security & Performance

* **Zero Network Latency:** All OEM specifications and engineering failure curves are packaged locally within the server. Zero external HTTP requests are made at runtime, guaranteeing sub-millisecond execution.
* **Strict Validation:** Input schemas enforce strict types, boundaries, and sanitization.

---

## 📄 License

MIT © [BareBones Industrial Supply Co.](https://barebonesindustrial.com)
