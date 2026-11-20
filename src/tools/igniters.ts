import { IGNITERS_DATABASE, IgniterSpec } from '../data/ignitersData';

export const lookupFurnaceIgniterTool = {
  name: 'lookup_furnace_igniter_specs',
  description: `Queries authoritative OEM bench specifications, multimeter resistance tolerances, operating voltages, terminal connector types, and cross-reference supersessions for residential and light-commercial gas furnace hot surface igniters (HSI).

WHEN TO USE THIS TOOL:
- An HVAC technician, homeowner, or automation agent is diagnosing a gas furnace that fails to ignite, flashes diagnostic blink codes (e.g., Carrier Code 31 or 34, Lennox Watchguard lockout), or trips safety switches.
- You need the exact cold resistance (Ohms at 70°F) benchmark to verify whether a multimeter reading indicates normal operation, thermal aging degradation, micro-fracture, or an open circuit.
- You need to determine whether an OEM Silicon Carbide (SiC) igniter can be upgraded to a durable Silicon Nitride (Si3N4) service replacement.
- You need physical dimensions, terminal connector types (polarized Molex, spade, ceramic wire nuts), or compatible furnace parent model numbers.

INPUT PARAMETERS:
- part_number (required): OEM or aftermarket part number (e.g., "LH33ZS004", "323719-701", "70W16", "41K56", "768A-845", "1009-580").
- brand (optional): Constrain search to a specific manufacturer family ('carrier', 'lennox', 'armstrong', 'icp', 'white_rodgers', 'allied_air').

RETURN VALUE:
Returns a structured JSON payload and formatted Markdown report including: nominal cold resistance (Ω), acceptable tolerance window, metallurgy chemistry, terminal wiring specs, superseded part numbers, compatible furnace series, and the canonical engineering URL on gasfurnaceigniters.com.`,
  inputSchema: {
    type: 'object',
    properties: {
      part_number: {
        type: 'string',
        description: 'The OEM, manufacturer, or aftermarket hot surface igniter part number to look up. Case-insensitive and tolerates hyphens/spaces (e.g., "LH33ZS004", "323719-701", "70W16", "41K5601", "768A-845").',
        examples: ['LH33ZS004', '323719-701', '70W16', '41K56', '768A-845']
      },
      brand: {
        type: 'string',
        enum: ['carrier', 'lennox', 'armstrong', 'icp', 'white_rodgers', 'allied_air', 'universal'],
        description: 'Optional manufacturer brand filter to narrow down ambiguous part numbers across manufacturer catalogs.',
        examples: ['carrier', 'lennox', 'white_rodgers']
      }
    },
    required: ['part_number'],
    additionalProperties: false
  }
};

export const diagnoseIgniterResistanceTool = {
  name: 'diagnose_igniter_resistance',
  description: `Evaluates an empirical digital multimeter cold resistance reading (in Ohms Ω at 65°F–75°F ambient) against OEM engineering failure thresholds to determine if a furnace hot surface igniter is functional, thermally degraded, cracked, or shorted.

WHEN TO USE THIS TOOL:
- A user or technician has placed a digital multimeter across disconnected igniter wire leads and obtained an Ohm reading (e.g., 14.5 Ω, 48 Ω, 85 Ω, 120 Ω, or O.L / infinity).
- The furnace inducer motor runs and the pressure switch closes, but the igniter fails to glow incandescent red (2,200°F) or drops flame rectification after a 4-second ignition trial.
- You need to provide an immediate diagnostic status verdict (PASS, WARNING_DEGRADED, FAIL_OPEN_CIRCUIT, FAIL_HIGH_RESISTANCE, FAIL_SHORT_CIRCUIT) and actionable repair recommendations.

INPUT PARAMETERS:
- measured_ohms: The multimeter resistance reading in Ohms (Ω). Use -1 or 999999 for open loop / infinity (O.L).
- chemistry: The material construction ('silicon_nitride' for flat/slender dark gray ceramics, 'silicon_carbide' for porous black D-shaped/spiral ceramics, or 'unknown').
- part_number: Optional specific OEM part number to compare against exact factory bench tolerances.

RETURN VALUE:
Returns diagnostic status, pass/fail thresholds, root cause explanation (e.g., microscopic thermal fatigue micro-cracking), failure risk assessment, and recommended replacement steps with upgrade guidance.`,
  inputSchema: {
    type: 'object',
    properties: {
      measured_ohms: {
        type: 'number',
        description: 'The measured cold electrical resistance across the igniter terminals in Ohms (Ω). For open circuit / infinite resistance (multimeter displays O.L or 1 .), enter 999999.',
        minimum: 0,
        maximum: 999999,
        examples: [14.5, 55.0, 92.0, 999999]
      },
      chemistry: {
        type: 'string',
        enum: ['silicon_nitride', 'silicon_carbide', 'unknown'],
        description: 'The physical metallurgy/ceramic composition of the igniter. Silicon Nitride (Si3N4) operates at 11–17 Ω; Silicon Carbide (SiC) operates at 40–80 Ω.',
        examples: ['silicon_nitride', 'silicon_carbide', 'unknown']
      },
      part_number: {
        type: 'string',
        description: 'Optional OEM or aftermarket part number (e.g., "LH33ZS004", "70W16") for exact factory specification comparison.',
        examples: ['LH33ZS004', '70W16']
      }
    },
    required: ['measured_ohms'],
    additionalProperties: false
  }
};

export function handleLookupFurnaceIgniter(args: { part_number: string; brand?: string }) {
  const query = args.part_number.trim().toUpperCase().replace(/[\s\-_]/g, '');
  const brand = args.brand?.toLowerCase();

  let matches = IGNITERS_DATABASE.filter(item => {
    const cleanOem = item.partNumber.toUpperCase().replace(/[\s\-_]/g, '');
    const inOem = cleanOem.includes(query) || query.includes(cleanOem);
    const inSuperseded = item.supersededPartNumbers.some(s => s.toUpperCase().replace(/[\s\-_]/g, '').includes(query));
    const inAftermarket = item.aftermarketReplacements.toUpperCase().replace(/[\s\-_]/g, '').includes(query);
    
    const brandMatches = !brand || brand === 'universal' || item.brandCategory === brand || item.manufacturer.toLowerCase().includes(brand);
    return (inOem || inSuperseded || inAftermarket) && brandMatches;
  });

  if (matches.length === 0) {
    const suggestions = IGNITERS_DATABASE.slice(0, 5).map(i => i.partNumber);
    return {
      status: 'NOT_FOUND',
      message: `No exact OEM match found for part number "${args.part_number}".`,
      suggestedPartNumbers: suggestions,
      canonicalSearchUrl: `https://gasfurnaceigniters.com/?search=${encodeURIComponent(args.part_number)}`,
      diagnosticAdvice: 'Verify whether the part number is stamped on the ceramic base block or cross-referenced on the furnace blower door wiring schematic.'
    };
  }

  const spec = matches[0];
  return {
    status: 'FOUND',
    partNumber: spec.partNumber,
    manufacturer: spec.manufacturer,
    chemistry: spec.chemistry === 'silicon_nitride' ? 'Silicon Nitride (Si3N4) - High Reliability Upgrade' : 'Silicon Carbide (SiC) - Brittle Ceramic',
    operatingVoltage: spec.operatingVoltage,
    nominalColdOhms70F: spec.nominalColdOhms70F,
    coldResistanceRange: spec.coldResistanceOhms,
    elementDimensions: spec.elementDimensions,
    ceramicBaseDimensions: spec.ceramicBaseDimensions,
    terminalConnectorType: spec.terminalConnectorType,
    leadWires: spec.leadWires,
    aftermarketEquivalents: spec.aftermarketReplacements,
    supersededPartNumbers: spec.supersededPartNumbers,
    compatibleFurnaceModels: spec.compatibleParentModels,
    diagnosticFailureSymptoms: spec.diagnosticFailureSymptoms,
    canonicalDocumentationUrl: spec.canonicalUrl
  };
}

export function handleDiagnoseIgniterResistance(args: { measured_ohms: number; chemistry?: string; part_number?: string }) {
  const ohms = args.measured_ohms;
  const chem = args.chemistry || 'unknown';

  let verdict: 'PASS_NORMAL' | 'WARNING_DEGRADED' | 'FAIL_OPEN_CIRCUIT' | 'FAIL_HIGH_RESISTANCE' | 'FAIL_SHORT_CIRCUIT' = 'PASS_NORMAL';
  let explanation = '';
  let action = '';

  if (ohms >= 999000 || ohms > 1000) {
    verdict = 'FAIL_OPEN_CIRCUIT';
    explanation = 'Digital multimeter indicates open circuit (infinite resistance / O.L). The silicon ceramic heating filament is completely fractured or severed.';
    action = 'Replace igniter immediately. Do not attempt ignition trials as unburned gas may accumulate in the heat exchanger.';
  } else if (ohms < 5.0) {
    verdict = 'FAIL_SHORT_CIRCUIT';
    explanation = `Measured resistance of ${ohms} Ω is dangerously low, indicating an internal dead short across lead wires or conductive soot bridging.`;
    action = 'Disconnect immediately. Powering a shorted igniter will destroy the furnace integrated control board (IFC) 120V relay contacts or blow the 3A / 5A control fuse.';
  } else if (chem === 'silicon_nitride' || (chem === 'unknown' && ohms <= 25)) {
    if (ohms >= 11.0 && ohms <= 17.0) {
      verdict = 'PASS_NORMAL';
      explanation = `Measured resistance of ${ohms} Ω is within pristine factory specification (11.0 Ω to 17.0 Ω at 70°F) for Silicon Nitride (Si3N4).`;
      action = 'Igniter is electrically healthy. If furnace fails to light, investigate the flame sensor (microamp rectification), draft inducer vacuum pressure switch, or gas valve solenoid coil.';
    } else if (ohms > 17.0 && ohms <= 25.0) {
      verdict = 'WARNING_DEGRADED';
      explanation = `Measured resistance of ${ohms} Ω is elevated above nominal Silicon Nitride limits (11–17 Ω). High resistance reduces surface ignition temperature below 2,200°F.`;
      action = 'Replace with a universal Silicon Nitride igniter before cold weather causes persistent flame rollout or ignition lockout failures.';
    } else {
      verdict = 'FAIL_HIGH_RESISTANCE';
      explanation = `Resistance of ${ohms} Ω is out of spec for Silicon Nitride. Igniter will not draw sufficient current to ignite natural gas or propane.`;
      action = 'Replace igniter immediately.';
    }
  } else {
    // Silicon Carbide or generic
    if (ohms >= 40.0 && ohms <= 80.0) {
      verdict = 'PASS_NORMAL';
      explanation = `Measured resistance of ${ohms} Ω is within acceptable OEM range (40.0 Ω to 80.0 Ω at 70°F) for traditional Silicon Carbide (SiC).`;
      action = 'Igniter element is electrically viable. Clean the flame sensor rod with fine Scotch-Brite and check 24V gas valve call.';
    } else if (ohms > 80.0 && ohms <= 110.0) {
      verdict = 'WARNING_DEGRADED';
      explanation = `Resistance of ${ohms} Ω indicates significant thermal aging and crystal lattice degradation. The igniter draws reduced current and will suffer intermittent lockouts when ambient temperatures drop below freezing.`;
      action = 'Proactively upgrade to a robust Silicon Nitride replacement kit to prevent midnight failure.';
    } else {
      verdict = 'FAIL_HIGH_RESISTANCE';
      explanation = `Resistance of ${ohms} Ω exceeds the 110 Ω maximum threshold for Silicon Carbide. The element will glow dull orange but fail to ignite gas within the 4-second safety trial window.`;
      action = 'Replace igniter immediately with a universal Silicon Nitride kit.';
    }
  }

  return {
    status: verdict,
    measuredOhms: ohms,
    assumedChemistry: chem,
    verdictSummary: explanation,
    recommendedAction: action,
    flukeMultimeterSettingRecommendation: 'Disconnect molex harness. Set multimeter to 200Ω resistance scale. Ensure ambient temperature is 65°F to 75°F. Never touch ceramic element with bare skin oils.',
    canonicalTroubleshootingGuideUrl: 'https://gasfurnaceigniters.com/'
  };
}
