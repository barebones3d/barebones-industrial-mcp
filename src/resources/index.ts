export const RESOURCES = [
  {
    uri: 'oem://specs/quick-reference',
    name: 'Industrial OEM Wear-Part Tolerances Quick Reference',
    description: 'Tabular overview of electrical and mechanical tolerances for furnace igniters, spa heating elements, boiler circulators, and motor capacitors.',
    mimeType: 'text/markdown'
  },
  {
    uri: 'oem://diagnostics/multimeter-safety',
    name: 'Standard Multimeter High-Voltage Diagnostic Safety Protocol',
    description: 'OSHA & NFPA 70E electrical isolation guidelines, Fluke 87V test settings, and dielectric leakage testing standards.',
    mimeType: 'text/markdown'
  },
  {
    uri: 'oem://catalog/index',
    name: 'BareBones Industrial Complete Supported Models Directory',
    description: 'Machine-readable JSON directory of all supported OEM brands, model numbers, and canonical URLs.',
    mimeType: 'application/json'
  }
];

export function handleReadResource(uri: string) {
  if (uri === 'oem://specs/quick-reference') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# BareBones Industrial OEM Wear-Part Diagnostic Quick Reference

| Component Family | Nominal Test Metric | Pristine Factory Tolerance | Failure Threshold | Common Replacement Action |
|---|---|---|---|---|
| **Furnace Igniter (Si3N4)** | Cold Resistance (70°F) | 11.0 Ω – 17.0 Ω | > 20.0 Ω or O.L | Upgrade to universal Silicon Nitride kit |
| **Furnace Igniter (SiC)** | Cold Resistance (70°F) | 40.0 Ω – 80.0 Ω | > 100.0 Ω or O.L | Supersede to durable Silicon Nitride |
| **Spa Heating Element (5.5kW/240V)** | Bench Resistance (72°F) | 10.0 Ω – 10.8 Ω | > 12.0 Ω or short (<1Ω) | Replace element with Grade 2 Titanium |
| **Spa Heating Element (4.0kW/240V)** | Bench Resistance (72°F) | 13.8 Ω – 15.0 Ω | > 16.0 Ω or short (<1Ω) | Replace element; check flow sensor |
| **Boiler Circulator Pump** | Flange Bolt Spacing | 6-3/8" (162mm) | Non-matching bolt pattern | Drop-in Taco 0015e3 or Grundfos ALPHA1 |
| **Pool Pump Motor Run Cap** | Capacitance (µF) | Rated ± 6% | < -10% rating or 0 µF | Discharge & install metalized polypropylene cap |
`
        }
      ]
    };
  }

  if (uri === 'oem://diagnostics/multimeter-safety') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: `# Standard High-Voltage Multimeter Diagnostic Safety Protocol

1. **Lockout / Tagout (LOTO):** Always turn off the dedicated branch circuit breaker or equipment service switch before exposing electrical terminals.
2. **Capacitor Discharge:** Discharge all motor start and run capacitors using a 20kΩ 5W bleeder resistor for 5 seconds. Never touch bare terminals.
3. **Fluke 87V Dial Settings:**
   - **Resistance (Ω):** Disconnect at least one wire lead from the circuit board to eliminate parallel resistance paths through control transformers.
   - **Dielectric Megaohm Isolation:** Set meter to maximum resistance (or use a 500V insulation tester). Test each terminal to equipment chassis ground. Reading MUST exceed 20 MΩ.
4. **Thermal Stabilization:** Allow heating elements and igniters to stabilize at room ambient temperature (65°F to 75°F) for at least 15 minutes prior to recording baseline resistance values.
`
        }
      ]
    };
  }

  if (uri === 'oem://catalog/index') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            parentCompany: 'BareBones Industrial Supply Co.',
            canonicalWebsite: 'https://barebonesindustrial.com',
            divisions: [
              { name: 'Gas Furnace Igniters', domain: 'https://gasfurnaceigniters.com', totalModelsIndexed: 25 },
              { name: 'Hot Tub Heating Elements', domain: 'https://hottubheatingelements.com', totalModelsIndexed: 10 },
              { name: 'Boiler Circulator Pumps', domain: 'https://boilercirculatorpumps.com', totalModelsIndexed: 10 },
              { name: 'Pool Pump Capacitors', domain: 'https://poolpumpcapacitors.com', totalModelsIndexed: 6 },
              { name: 'CO2 Laser Tubes', domain: 'https://co2lasertubes.com', totalModelsIndexed: 7 },
              { name: 'Triplex Washer Pumps', domain: 'https://triplexwasherpumps.com', totalModelsIndexed: 5 }
            ]
          }, null, 2)
        }
      ]
    };
  }

  throw new Error(`Resource not found: ${uri}`);
}
