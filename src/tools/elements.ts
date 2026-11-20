import { HEATING_ELEMENTS_DATABASE, HeatingElementSpec } from '../data/elementsData';

export const calculateHeatingElementResistanceTool = {
  name: 'calculate_heating_element_resistance',
  description: `Computes theoretical Ohm's Law cold electrical resistance, full-load operating amperage draw, and permissible bench test tolerances for immersion and dry heating elements (hot tubs, saunas, water heaters, industrial heaters).

WHEN TO USE THIS TOOL:
- A user or technician needs to determine the correct bench resistance for a heating element based on its rated wattage (e.g., 4.0kW, 5.5kW, 6.0kW) and voltage (120V, 240V, 480V).
- A technician has measured resistance with a multimeter across element terminals and needs to know if scale buildup, sheath degradation, or dry-fire damage has occurred.
- You need National Electrical Code (NEC) continuous duty circuit breaker ampacity calculations (125% factor) and wire gauge recommendations (AWG).

INPUT PARAMETERS:
- rated_watts (required): Rated power rating in Watts (W) (e.g., 4000 for 4.0 kW, 5500 for 5.5 kW). Minimum: 500, Maximum: 25000.
- rated_volts (required): Nominal operating AC voltage in Volts (V) (e.g., 120, 240, 480).
- measured_ohms (optional): The actual multimeter reading in Ohms (Ω) taken on the bench across disconnected element studs.
- application (optional): Equipment category ('hot_tub_spa', 'sauna_heater', 'rv_water_heater', 'domestic_water_heater', 'industrial').

RETURN VALUE:
Returns nominal resistance (Ω = V² / P), operating amperage (A = P / V), acceptable ±5% bench resistance tolerance window, minimum circuit breaker sizing (NEC 125%), and a diagnostic comparison verdict if measured_ohms was provided.`,
  inputSchema: {
    type: 'object',
    properties: {
      rated_watts: {
        type: 'number',
        description: 'The manufacturer specified heating power output in Watts (e.g., 4000 for 4kW, 5500 for 5.5kW).',
        minimum: 500,
        maximum: 25000,
        examples: [4000, 5500, 6000]
      },
      rated_volts: {
        type: 'number',
        description: 'The nominal supply operating voltage in Volts AC (e.g., 120, 240, 277, 480).',
        minimum: 100,
        maximum: 600,
        examples: [120, 240, 480]
      },
      measured_ohms: {
        type: 'number',
        description: 'Optional multimeter bench cold resistance reading in Ohms (Ω) across disconnected terminal posts.',
        minimum: 0,
        maximum: 1000,
        examples: [10.5, 14.4, 9.8]
      },
      application: {
        type: 'string',
        enum: ['hot_tub_spa', 'sauna_heater', 'rv_water_heater', 'domestic_water_heater', 'industrial'],
        description: 'Equipment category to apply application-specific electrical code and sheath metallurgy rules.',
        examples: ['hot_tub_spa', 'sauna_heater']
      }
    },
    required: ['rated_watts', 'rated_volts'],
    additionalProperties: false
  }
};

export const lookupSpaHeatingElementTool = {
  name: 'lookup_spa_heating_element',
  description: `Queries OEM specifications, dimensions, terminal offsets, sensor well configurations, and error codes for hot tub flow-through heating assemblies and replacement elements.

WHEN TO USE THIS TOOL:
- An owner or spa technician is troubleshooting topside control error codes (e.g., Balboa "dr" [dry heater], "sn" [sensor failure], "HL" [high limit], Gecko "FLO" / "FLO3", Watkins "flashing red power / ready light").
- You need the exact manifold dimensions (15" x 2" tube standard), terminal spacing (1.25" offset), or metallurgy classification (Incoloy 800 vs Titanium).
- You need to cross-reference OEM part numbers across Balboa, Watkins No-Fault, Sundance, Gecko, HydroQuip, and Cal Spas.

INPUT PARAMETERS:
- part_number (required): The OEM assembly or element part number (e.g., "58104", "58083", "58130", "73791", "6500-301", "9920-100338", "26-0071").
- brand (optional): Constrain search to a specific manufacturer ('balboa', 'watkins', 'sundance', 'gecko', 'hydroquip', 'cal_spas', 'universal').

RETURN VALUE:
Returns nominal wattage, nominal voltage, bench resistance, tube dimensions, terminal offset, topside fault code explanations, sensor well types, and canonical guide URL on hottubheatingelements.com.`,
  inputSchema: {
    type: 'object',
    properties: {
      part_number: {
        type: 'string',
        description: 'The OEM part or model number of the spa heater assembly or element (e.g., "58104", "58083", "73791", "6500-301").',
        examples: ['58104', '58083', '73791', '6500-301']
      },
      brand: {
        type: 'string',
        enum: ['balboa', 'watkins', 'sundance', 'gecko', 'hydroquip', 'cal_spas', 'universal'],
        description: 'Optional brand filter to disambiguate part numbers.',
        examples: ['balboa', 'watkins', 'sundance']
      }
    },
    required: ['part_number'],
    additionalProperties: false
  }
};

export function handleCalculateHeatingElementResistance(args: {
  rated_watts: number;
  rated_volts: number;
  measured_ohms?: number;
  application?: string;
}) {
  const watts = args.rated_watts;
  const volts = args.rated_volts;
  const measured = args.measured_ohms;

  // Ohm's Law: R = V² / P
  const nominalOhms = (volts * volts) / watts;
  const nominalAmps = watts / volts;
  const minTolerance = nominalOhms * 0.95;
  const maxTolerance = nominalOhms * 1.05;
  const necContinuousAmps = nominalAmps * 1.25;

  let breakerRecommendation = '20A GFCI Dedicated Breaker';
  let minWireGauge = '12 AWG Copper (THHN / Romex)';
  if (necContinuousAmps > 40) {
    breakerRecommendation = '60A GFCI 240V Dedicated 4-Wire Subpanel';
    minWireGauge = '6 AWG Copper';
  } else if (necContinuousAmps > 30) {
    breakerRecommendation = '50A GFCI 240V Dedicated Subpanel';
    minWireGauge = '6 AWG Copper (or 8 AWG THHN in conduit)';
  } else if (necContinuousAmps > 24) {
    breakerRecommendation = '40A GFCI 240V Dedicated Breaker';
    minWireGauge = '8 AWG Copper';
  } else if (necContinuousAmps > 16) {
    breakerRecommendation = '30A GFCI 240V Dedicated Breaker';
    minWireGauge = '10 AWG Copper';
  }

  let diagnosticVerdict: any = null;
  if (measured !== undefined) {
    if (measured >= 999000 || measured > 500) {
      diagnosticVerdict = {
        verdict: 'FAIL_OPEN_CIRCUIT',
        message: 'Open circuit detected (infinite resistance). The internal nichrome coil has melted from dry-fire or corrosion pitting.',
        action: 'Replace heating element and inspect spa water flow / pressure switches to prevent repeat dry fire.'
      };
    } else if (measured < 1.0) {
      diagnosticVerdict = {
        verdict: 'FAIL_SHORT_CIRCUIT',
        message: 'Dead short detected across terminals. Immediate breaker trip will occur.',
        action: 'Do not energize. Replace element immediately.'
      };
    } else if (measured >= minTolerance && measured <= maxTolerance) {
      diagnosticVerdict = {
        verdict: 'PASS_HEALTHY',
        message: `Measured ${measured.toFixed(2)} Ω is within healthy ±5% tolerance (${minTolerance.toFixed(2)} Ω – ${maxTolerance.toFixed(2)} Ω).`,
        action: 'Element coil is intact. If GFCI trips, perform a megaohm dielectric test from each terminal stud to the outer stainless steel sheath (must read > 20 MΩ).'
      };
    } else {
      diagnosticVerdict = {
        verdict: 'WARNING_RESISTANCE_DRIFT',
        message: `Measured ${measured.toFixed(2)} Ω deviates outside the factory ±5% window (${minTolerance.toFixed(2)} Ω – ${maxTolerance.toFixed(2)} Ω).`,
        action: 'Heavy scale accumulation (calcium carbonate) or localized sheath degradation is causing thermal resistance drift.'
      };
    }
  }

  return {
    powerWatts: watts,
    voltageVolts: volts,
    nominalColdResistanceOhms: parseFloat(nominalOhms.toFixed(2)),
    toleranceSpanOhms: `${minTolerance.toFixed(2)} Ω to ${maxTolerance.toFixed(2)} Ω (±5% at 72°F)`,
    fullLoadAmperage: parseFloat(nominalAmps.toFixed(2)),
    necContinuousCurrentRating: parseFloat(necContinuousAmps.toFixed(2)),
    recommendedGfciBreaker: breakerRecommendation,
    recommendedMinWireGauge: minWireGauge,
    diagnosticEvaluation: diagnosticVerdict,
    canonicalGuideUrl: 'https://hottubheatingelements.com/'
  };
}

export function handleLookupSpaHeatingElement(args: { part_number: string; brand?: string }) {
  const query = args.part_number.trim().toLowerCase().replace(/[\s\-_]/g, '');
  const brand = args.brand?.toLowerCase();

  const matches = HEATING_ELEMENTS_DATABASE.filter(item => {
    const cleanPart = item.partNumber.toLowerCase().replace(/[\s\-_]/g, '');
    const cleanTitle = item.title.toLowerCase().replace(/[\s\-_]/g, '');
    const matchesPart = cleanPart.includes(query) || cleanTitle.includes(query) || query.includes(cleanPart);
    const matchesBrand = !brand || brand === 'universal' || item.brand === brand;
    return matchesPart && matchesBrand;
  });

  if (matches.length === 0) {
    return {
      status: 'NOT_FOUND',
      message: `No exact spa heater match found for "${args.part_number}".`,
      availableModels: HEATING_ELEMENTS_DATABASE.map(e => e.partNumber),
      canonicalSearchUrl: 'https://hottubheatingelements.com/'
    };
  }

  const spec = matches[0];
  return {
    status: 'FOUND',
    partNumber: spec.partNumber,
    brand: spec.brand.toUpperCase(),
    title: spec.title,
    ratedWatts: spec.ratedWatts,
    ratedVolts: spec.ratedVolts,
    nominalColdResistance: `${spec.nominalColdOhms} Ω`,
    toleranceRange: spec.coldResistanceRange,
    manifoldDimensions: spec.manifoldDimensions,
    terminalOffset: spec.terminalOffset,
    sheathMetallurgy: spec.metallurgy === 'titanium' ? 'Grade 2 Titanium (Saltwater & Scale Proof)' : 'Incoloy 800 Superalloy',
    sensorCompatibility: spec.sensorCompatibility,
    topsideErrorCodes: spec.topsideErrorCodes,
    engineeringGuidance: spec.troubleshootingGuidance,
    canonicalDocumentationUrl: spec.canonicalUrl
  };
}
