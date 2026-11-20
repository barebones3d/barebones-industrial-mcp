/**
 * Authoritative Gas Furnace Hot Surface Igniters (HSI) OEM Database
 * Sourced directly from Carrier, Lennox, White-Rodgers, and ICP primary engineering service manuals.
 */
export interface IgniterSpec {
    partNumber: string;
    manufacturer: string;
    brandCategory: 'carrier' | 'lennox' | 'armstrong' | 'icp' | 'white_rodgers' | 'allied_air';
    operatingVoltage: string;
    coldResistanceOhms: string;
    nominalColdOhms70F: number;
    chemistry: 'silicon_nitride' | 'silicon_carbide';
    elementDimensions: string;
    ceramicBaseDimensions: string;
    leadWires: string;
    terminalConnectorType: string;
    aftermarketReplacements: string;
    supersededPartNumbers: string[];
    compatibleParentModels: string[];
    diagnosticFailureSymptoms: string;
    canonicalUrl: string;
}
export declare const IGNITERS_DATABASE: IgniterSpec[];
//# sourceMappingURL=ignitersData.d.ts.map