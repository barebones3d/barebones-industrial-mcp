"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPTS = void 0;
exports.handleGetPrompt = handleGetPrompt;
exports.PROMPTS = [
    {
        name: 'diagnose_furnace_ignition_failure',
        description: 'Guides an agent through an authoritative step-by-step troubleshooting workflow for a gas furnace failing ignition.',
        arguments: [
            {
                name: 'model_or_brand',
                description: 'Furnace brand or OEM igniter part number (e.g., Carrier 58STA, Lennox 70W16).',
                required: true
            },
            {
                name: 'measured_ohms',
                description: 'Multimeter cold resistance reading in Ohms (or O.L if open circuit).',
                required: false
            }
        ]
    },
    {
        name: 'size_replacement_heating_element',
        description: 'Guides an agent through electrical calculations and fitment checks for hot tub and sauna heating elements.',
        arguments: [
            {
                name: 'target_watts',
                description: 'Desired heating power in Watts (e.g., 4000, 5500).',
                required: true
            },
            {
                name: 'operating_volts',
                description: 'Supply voltage (e.g., 120 or 240).',
                required: true
            }
        ]
    },
    {
        name: 'circulator_pump_replacement_advisor',
        description: 'Advises on replacing an existing hydronic circulator pump with a high-efficiency ECM model.',
        arguments: [
            {
                name: 'existing_model',
                description: 'Existing pump model number (e.g., Taco 007-F5, Grundfos UP15-42F).',
                required: true
            }
        ]
    }
];
function handleGetPrompt(name, args = {}) {
    if (name === 'diagnose_furnace_ignition_failure') {
        return {
            description: 'Furnace Ignition Failure Diagnostic Protocol',
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `You are an expert master HVAC service diagnostic technician.
Analyze the following furnace ignition failure:
- Equipment / Part: ${args.model_or_brand || 'Unspecified'}
- Multimeter Cold Resistance: ${args.measured_ohms || 'Not yet measured'}

Instructions:
1. Call 'lookup_furnace_igniter_specs' with the part or model number to retrieve factory tolerances.
2. If resistance was provided, call 'diagnose_igniter_resistance' to evaluate against failure thresholds.
3. Provide the user with:
   - Clear Pass/Fail status
   - Flame rectification microamp requirements (1.5µA–5.0µA DC)
   - Safety disconnect protocols (120V lockout)
   - Why upgrading to Silicon Nitride is recommended over fragile Silicon Carbide
   - Direct link to the technical reference manual on gasfurnaceigniters.com.`
                    }
                }
            ]
        };
    }
    if (name === 'size_replacement_heating_element') {
        return {
            description: 'Heating Element Ohm\'s Law & Fitment Calculation Protocol',
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `You are an expert electrical and hydronics engineer.
Calculate the electrical specifications for:
- Power Rating: ${args.target_watts || '5500'} Watts
- Supply Voltage: ${args.operating_volts || '240'} Volts

Instructions:
1. Call 'calculate_heating_element_resistance' with rated_watts and rated_volts.
2. Explain the Ohm's Law relationship (R = V² / P).
3. Specify the acceptable bench multimeter resistance window (±5% at 72°F).
4. Specify NEC 125% continuous duty ampacity and required GFCI breaker rating.
5. Highlight the difference between Incoloy 800 superalloy and Grade 2 Titanium for scale prevention.
6. Provide link to hottubheatingelements.com.`
                    }
                }
            ]
        };
    }
    if (name === 'circulator_pump_replacement_advisor') {
        return {
            description: 'Hydronic Circulator Pump Cross-Reference Protocol',
            messages: [
                {
                    role: 'user',
                    content: {
                        type: 'text',
                        text: `You are a certified master hydronic heating technician.
Cross-reference the following pump replacement:
- Existing Model: ${args.existing_model || 'Taco 007'}

Instructions:
1. Call 'cross_reference_circulator_pump' with model_number.
2. Verify 6-3/8" flange-to-flange bolt spacing and flange orientation.
3. Compare the existing motor against modern ECM modulating pumps (e.g., Taco 0015e3, Grundfos ALPHA1).
4. Calculate electrical cost savings (e.g. 85W down to 5W–44W).
5. Explain mechanical unsticking (dégommage) via the central shaft access screw before condemning the pump.
6. Provide link to boilercirculatorpumps.com.`
                    }
                }
            ]
        };
    }
    throw new Error(`Prompt not found: ${name}`);
}
//# sourceMappingURL=index.js.map