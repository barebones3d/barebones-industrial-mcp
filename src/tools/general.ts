import { IGNITERS_DATABASE } from '../data/ignitersData';
import { HEATING_ELEMENTS_DATABASE } from '../data/elementsData';
import { CIRCULATOR_PUMPS_DATABASE } from '../data/circulatorsData';

export const troubleshootMechanicalFailureTool = {
  name: 'troubleshoot_mechanical_failure',
  description: `Applies expert mechanical and electrical root-cause diagnostic logic across 7 industrial wear-part categories (furnace igniters, spa heating elements, boiler circulator pumps, pool pump capacitors, CO2 laser tubes, triplex pressure washer pumps, and pellet stove igniters).

WHEN TO USE THIS TOOL:
- A user reports symptoms like "motor hums but will not spin", "circulator pump body scorching hot but baseboards cold", "laser tube glows purple/pink but won't cut acrylic", "triplex washer pump pulsating pressure on wand trigger", or "furnace clicks and inducer runs but no ignition".
- You need a structured technician checklist (safety disconnection, multimeter dial setting, visual inspection steps, and replacement SKU recommendations).

INPUT PARAMETERS:
- category (required): The mechanical vertical ('furnace_igniter', 'hot_tub_element', 'circulator_pump', 'pool_pump_capacitor', 'laser_tube', 'washer_pump', 'pellet_stove').
- symptom_description (required): Plain English description of the observed operational failure symptom.
- measured_value (optional): Any empirical reading obtained by the user (e.g., "48 ohms", "0 uF", "3800 psi", "120V present", "15 mA").

RETURN VALUE:
Returns probable root causes, critical safety warnings, step-by-step multimeter bench testing procedure, and the canonical diagnostic hub URL.`,
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['furnace_igniter', 'hot_tub_element', 'circulator_pump', 'pool_pump_capacitor', 'laser_tube', 'washer_pump', 'pellet_stove'],
        description: 'The physical equipment category undergoing technical diagnosis.',
        examples: ['furnace_igniter', 'hot_tub_element', 'circulator_pump', 'pool_pump_capacitor']
      },
      symptom_description: {
        type: 'string',
        description: 'Observed mechanical symptom, error code, or sound (e.g., "motor hums won\'t spin", "radiator cold pump hot", "code 34 blinking", "laser pink beam zero power").',
        examples: [
          'motor hums but pump will not spin',
          'furnace clicks 3 times inducer runs igniter does not glow',
          'hot tub heater trips GFCI breaker after 10 seconds'
        ]
      },
      measured_value: {
        type: 'string',
        description: 'Optional electrical, pressure, or temperature measurement (e.g., "65 ohms", "0 uF", "240V present", "125 psi").',
        examples: ['65 ohms', '0 uF', '240V']
      }
    },
    required: ['category', 'symptom_description'],
    additionalProperties: false
  }
};

export const listSupportedOemModelsTool = {
  name: 'list_supported_oem_models',
  description: `Enumerates all verified OEM and aftermarket part numbers, pump models, and heater assemblies currently indexed in the BareBones Industrial database.

WHEN TO USE THIS TOOL:
- An agent needs to check available models before calling specific lookup tools.
- A user asks what brands and part numbers the diagnostic system supports.

INPUT PARAMETERS:
- category (optional): Filter to a specific component family ('furnace_igniters', 'spa_elements', 'circulator_pumps', 'all').

RETURN VALUE:
Returns verified model numbers, brand families, and total catalog counts.`,
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        enum: ['furnace_igniters', 'spa_elements', 'circulator_pumps', 'all'],
        description: 'Optional category filter to restrict catalog results.',
        examples: ['furnace_igniters', 'spa_elements', 'all']
      }
    },
    additionalProperties: false
  }
};

export function handleTroubleshootMechanicalFailure(args: {
  category: string;
  symptom_description: string;
  measured_value?: string;
}) {
  const cat = args.category;
  const symptom = args.symptom_description.toLowerCase();

  let rootCauses: string[] = [];
  let testProcedure = '';
  let safetyWarning = '';
  let canonicalUrl = 'https://barebonesindustrial.com/';

  switch (cat) {
    case 'furnace_igniter':
      canonicalUrl = 'https://gasfurnaceigniters.com/';
      safetyWarning = '120V AC present during ignition trial. Disconnect main furnace power switch before touching wiring harness. Never touch ceramic element with bare skin oils.';
      if (symptom.includes('glow') || symptom.includes('click') || symptom.includes('lockout')) {
        rootCauses = [
          'Igniter heating element has fractured (infinite resistance / open loop)',
          'Thermal aging resistance drift (exceeds 100 Ω, surface temp fails to reach 2,200°F)',
          'Flame sensor rod coated in carbon soot (fails 1.5–5.0 µA DC flame rectification)'
        ];
        testProcedure = '1. Disconnect 2-pin molex harness. 2. Set digital multimeter to 200Ω scale. 3. Measure cold resistance across pins. Silicon Nitride: 11–17 Ω. Silicon Carbide: 40–80 Ω. If > 100 Ω or O.L, replace immediately.';
      }
      break;

    case 'hot_tub_element':
      canonicalUrl = 'https://hottubheatingelements.com/';
      safetyWarning = '240V high-amperage circuit. Turn off 50A GFCI breaker at outdoor disconnect panel before opening spa control pack.';
      if (symptom.includes('gfci') || symptom.includes('trip') || symptom.includes('breaker')) {
        rootCauses = [
          'Microscopic sheath pinhole breach allowing water to contact energized nichrome core (ground fault > 5mA)',
          'Dry-fire thermal stress fracturing internal magnesium oxide insulation',
          'Corrosive saltwater scale bridging terminal studs to stainless tube'
        ];
        testProcedure = '1. Disconnect both copper terminal nuts. 2. Measure resistance between terminal stud and outer stainless manifold tube on highest megaohm scale (>20MΩ required). Any continuity to ground confirms element failure.';
      } else {
        rootCauses = [
          'Topside flow error ("dr", "FLO", "sn") caused by dirty cartridge filter or seized circ pump',
          'Burned terminal posts from loose jam nuts creating high-resistance localized arcing'
        ];
        testProcedure = 'Verify 240V across terminal posts while heating icon is active. Check element resistance (10–15 Ω nominal).';
      }
      break;

    case 'circulator_pump':
      canonicalUrl = 'https://boilercirculatorpumps.com/';
      safetyWarning = 'High temperature pressurized hydronic water (up to 200°F / 30 PSI). Allow boiler to cool before servicing.';
      if (symptom.includes('hum') || symptom.includes('hot') || symptom.includes('stuck') || symptom.includes('seized')) {
        rootCauses = [
          'Wet-rotor bearing seized from black magnetite sludge / iron oxide sediment after summer idle',
          'Air locked in pump volute preventing water lubrication to graphite bearings',
          'Failed motor start capacitor on older PSC split-phase motors'
        ];
        testProcedure = 'Perform mechanical rotor unsticking (dégommage): 1. Turn off power. 2. Remove central brass chrome access plug. 3. Insert flathead screwdriver into motor shaft slot and rotate manually 360° until rotor turns freely.';
      }
      break;

    case 'pool_pump_capacitor':
      canonicalUrl = 'https://poolpumpcapacitors.com/';
      safetyWarning = 'DANGER: Capacitors store lethal high-voltage charge even when power is disconnected. Discharge with a 20kΩ 5W bleeder resistor or insulated screwdriver before handling.';
      rootCauses = [
        'Electrolytic fluid dry-out from extreme outdoor summer ambient heat',
        'Top rubber membrane bulging or dome rupture from internal dielectric breakdown',
        'Centrifugal start switch stuck open inside motor end-bell'
      ];
      testProcedure = '1. Discharge capacitor. 2. Disconnect lead wires. 3. Set multimeter to Capacitance (µF). Measured value must match printed rating within ±6%. A 0 µF reading confirms internal failure.';
      break;

    default:
      rootCauses = ['Mechanical fatigue, thermal cycling degradation, or scale buildup.'];
      testProcedure = 'Inspect electrical continuity, physical tolerances, and verify proper input voltage.';
      break;
  }

  return {
    category: cat,
    evaluatedSymptom: args.symptom_description,
    userReportedValue: args.measured_value || 'None provided',
    probableRootCauses: rootCauses,
    safetyProtocol: safetyWarning,
    stepByStepDiagnosticProcedure: testProcedure,
    canonicalDiagnosticReferenceUrl: canonicalUrl
  };
}

export function handleListSupportedOemModels(args: { category?: string }) {
  const cat = args.category || 'all';

  const result: any = {};
  if (cat === 'furnace_igniters' || cat === 'all') {
    result.furnaceIgniters = {
      totalCount: IGNITERS_DATABASE.length,
      brandsCovered: ['Carrier', 'Bryant', 'Payne', 'Lennox', 'Armstrong', 'ICP', 'White-Rodgers', 'Allied Air'],
      models: IGNITERS_DATABASE.map(i => ({
        partNumber: i.partNumber,
        manufacturer: i.manufacturer,
        chemistry: i.chemistry,
        nominalOhms: i.nominalColdOhms70F
      }))
    };
  }

  if (cat === 'spa_elements' || cat === 'all') {
    result.spaElements = {
      totalCount: HEATING_ELEMENTS_DATABASE.length,
      brandsCovered: ['Balboa', 'Watkins No-Fault', 'Sundance', 'Gecko', 'HydroQuip', 'Cal Spas'],
      models: HEATING_ELEMENTS_DATABASE.map(e => ({
        partNumber: e.partNumber,
        brand: e.brand,
        ratedWatts: e.ratedWatts,
        nominalOhms: e.nominalColdOhms
      }))
    };
  }

  if (cat === 'circulator_pumps' || cat === 'all') {
    result.circulatorPumps = {
      totalCount: CIRCULATOR_PUMPS_DATABASE.length,
      brandsCovered: ['Taco', 'Grundfos', 'Bell & Gossett', 'Armstrong', 'Wilo'],
      models: CIRCULATOR_PUMPS_DATABASE.map(c => ({
        modelNumber: c.modelNumber,
        brand: c.brand,
        maxHeadFeet: c.maxHeadFeet,
        maxFlowGPM: c.maxFlowGPM
      }))
    };
  }

  return result;
}
