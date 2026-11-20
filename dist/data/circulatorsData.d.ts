/**
 * Authoritative Hydronic Boiler Circulator Pumps OEM Database
 * Covers Taco Comfort Solutions, Grundfos, Bell & Gossett, Armstrong, and Wilo.
 */
export interface CirculatorPumpSpec {
    modelNumber: string;
    brand: 'taco' | 'grundfos' | 'bell_gossett' | 'armstrong' | 'wilo';
    title: string;
    flangeSpacing: string;
    casingMaterial: 'cast_iron' | 'stainless_steel' | 'bronze';
    operatingVoltage: string;
    motorType: 'standard_wet_rotor' | 'ecm_high_efficiency';
    maxFlowGPM: number;
    maxHeadFeet: number;
    powerDrawWatts: string;
    dropInEquivalents: string[];
    canonicalUrl: string;
    troubleshootingGuidance: string;
}
export declare const CIRCULATOR_PUMPS_DATABASE: CirculatorPumpSpec[];
//# sourceMappingURL=circulatorsData.d.ts.map