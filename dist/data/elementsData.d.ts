/**
 * Authoritative Hot Tub & Spa Heating Elements OEM Database
 * Covers Balboa Water Group, Watkins No-Fault, Sundance Spas, Gecko Alliance, HydroQuip, and Cal Spas.
 */
export interface HeatingElementSpec {
    partNumber: string;
    brand: 'balboa' | 'watkins' | 'sundance' | 'gecko' | 'hydroquip' | 'cal_spas' | 'universal';
    title: string;
    ratedWatts: number;
    ratedVolts: number;
    nominalColdOhms: number;
    coldResistanceRange: string;
    manifoldDimensions: string;
    terminalOffset: string;
    metallurgy: 'incoloy_800' | 'titanium' | 'incoloy_840';
    sensorCompatibility: string;
    topsideErrorCodes: string[];
    canonicalUrl: string;
    troubleshootingGuidance: string;
}
export declare const HEATING_ELEMENTS_DATABASE: HeatingElementSpec[];
//# sourceMappingURL=elementsData.d.ts.map