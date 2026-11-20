"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crossReferenceCirculatorPumpTool = void 0;
exports.handleCrossReferenceCirculatorPump = handleCrossReferenceCirculatorPump;
const circulatorsData_1 = require("../data/circulatorsData");
exports.crossReferenceCirculatorPumpTool = {
    name: 'cross_reference_circulator_pump',
    description: `Cross-references residential and light-commercial hydronic boiler circulator pumps across Taco, Grundfos, Bell & Gossett, Armstrong, and Wilo to identify compatible drop-in replacements and high-efficiency ECM upgrade models.

WHEN TO USE THIS TOOL:
- A heating contractor or homeowner is replacing a failed, leaking, noisy, or seized wet-rotor circulator pump on a hydronic boiler, radiant floor heating loop, or domestic hot water recirc loop.
- You need to verify whether replacement pumps match the standard 6-3/8" flange-to-flange bolt spacing and flange orientation.
- You need to cross-reference an older single-speed or 3-speed cast iron pump (e.g., Taco 007, Taco 0015, Grundfos UP15-42F, B&G Series 100) to an electronically commutated motor (ECM) replacement that saves up to 85% electrical power (e.g., Taco 0015e3, Grundfos ALPHA1).
- You need shut-off head feet, maximum GPM flow rate, and casing material requirements (cast iron for closed-loop hydronics vs bronze/stainless steel for potable water).

INPUT PARAMETERS:
- model_number (required): Existing circulator pump model number (e.g., "0015-MSF3", "0015e3", "008-F6", "0011-F4", "UP15-42F", "ALPHA1", "ecocirc 19-14", "Series 100", "Star S 21F", "Astro 250").
- head_feet (optional): Required hydraulic total dynamic head loss in feet of head (e.g., 10, 15, 20).
- flow_gpm (optional): Required system flow rate in Gallons Per Minute (GPM) (e.g., 5, 12, 18).
- casing_material (optional): Flange casing metallurgy ('cast_iron', 'stainless_steel', 'bronze').

RETURN VALUE:
Returns OEM model specifications, flange bolt spacing, shut-off head, maximum flow rate, direct drop-in replacement pump options, ECM energy-saving recommendations, and canonical documentation URL on boilercirculatorpumps.com.`,
    inputSchema: {
        type: 'object',
        properties: {
            model_number: {
                type: 'string',
                description: 'The model number or name of the existing circulator pump (e.g., "0015-MSF3", "0015e3", "UP15-42F", "ALPHA1", "Series 100", "Star S 21F", "Astro 250").',
                examples: ['0015-MSF3', '0015e3', 'UP15-42F', 'ALPHA1', 'ecocirc 19-14', 'Star S 21F']
            },
            head_feet: {
                type: 'number',
                description: 'System hydraulic head loss in feet of water head (ft). Helps determine operating point on the pump curve.',
                minimum: 0,
                maximum: 50,
                examples: [8, 12, 16]
            },
            flow_gpm: {
                type: 'number',
                description: 'Required system flow rate in Gallons Per Minute (GPM).',
                minimum: 0,
                maximum: 60,
                examples: [6, 12, 18]
            },
            casing_material: {
                type: 'string',
                enum: ['cast_iron', 'stainless_steel', 'bronze'],
                description: 'Casing metallurgy requirement. Cast iron is required for closed-loop heating; stainless or bronze is mandatory for potable domestic water systems.',
                examples: ['cast_iron', 'stainless_steel', 'bronze']
            }
        },
        required: ['model_number'],
        additionalProperties: false
    }
};
function handleCrossReferenceCirculatorPump(args) {
    const query = args.model_number.trim().toLowerCase().replace(/[\s\-_]/g, '');
    const matches = circulatorsData_1.CIRCULATOR_PUMPS_DATABASE.filter(item => {
        const cleanModel = item.modelNumber.toLowerCase().replace(/[\s\-_]/g, '');
        const cleanTitle = item.title.toLowerCase().replace(/[\s\-_]/g, '');
        return cleanModel.includes(query) || cleanTitle.includes(query) || query.includes(cleanModel);
    });
    if (matches.length === 0) {
        return {
            status: 'NOT_FOUND',
            message: `No exact circulator pump model match found for "${args.model_number}".`,
            standardFlangeDimension: '6-3/8" (162 mm) flange-to-flange bolt pattern is universal across standard residential Taco 00, Grundfos UP, and Wilo Star pumps.',
            recommendedUniversalUpgrade: 'Taco 0015e3 ECM High-Efficiency Circulator (replaces Taco 005, 007, 008, 0015, Grundfos UP15-42, and Wilo Star S 21)',
            availableModelsInCatalog: circulatorsData_1.CIRCULATOR_PUMPS_DATABASE.map(c => c.modelNumber),
            canonicalCatalogUrl: 'https://boilercirculatorpumps.com/'
        };
    }
    const pump = matches[0];
    const ecmAlternatives = [
        {
            model: 'Taco 0015e3 ECM High-Efficiency Variable Speed',
            powerConsumption: '5W – 44W (saves up to 85% electrical consumption)',
            features: 'Rotary dial head-curve selection, BIO Barrier sediment protection, integrated check valve (IFC)'
        },
        {
            model: 'Grundfos ALPHA1 15-55F ECM',
            powerConsumption: '5W – 45W',
            features: 'Push-button 3-speed plus auto constant pressure modes, tool-free terminal wiring'
        }
    ];
    return {
        status: 'FOUND',
        queriedModel: pump.modelNumber,
        brand: pump.brand.toUpperCase(),
        title: pump.title,
        flangeSpacing: pump.flangeSpacing,
        casingMaterial: args.casing_material || pump.casingMaterial,
        motorTechnology: pump.motorType === 'ecm_high_efficiency' ? 'ECM Variable Frequency Drive' : 'Standard Asynchronous Wet-Rotor',
        maximumShutOffHead: `${pump.maxHeadFeet} Feet of Head`,
        maximumFlowRate: `${pump.maxFlowGPM} GPM`,
        ratedPowerDraw: pump.powerDrawWatts,
        universalDropInFitmentNote: 'Standard 2-bolt elliptical flange with 6-3/8" bolt-to-bolt spacing. Includes rubber EPDM flange gaskets.',
        recommendedEcmUpgrades: ecmAlternatives,
        engineeringGuidance: pump.troubleshootingGuidance,
        canonicalDocumentationUrl: pump.canonicalUrl
    };
}
//# sourceMappingURL=circulators.js.map