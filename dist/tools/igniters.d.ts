export declare const lookupFurnaceIgniterTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            part_number: {
                type: string;
                description: string;
                examples: string[];
            };
            brand: {
                type: string;
                enum: string[];
                description: string;
                examples: string[];
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
};
export declare const diagnoseIgniterResistanceTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            measured_ohms: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            chemistry: {
                type: string;
                enum: string[];
                description: string;
                examples: string[];
            };
            part_number: {
                type: string;
                description: string;
                examples: string[];
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
};
export declare function handleLookupFurnaceIgniter(args: {
    part_number: string;
    brand?: string;
}): {
    status: string;
    message: string;
    suggestedPartNumbers: string[];
    canonicalSearchUrl: string;
    diagnosticAdvice: string;
    partNumber?: undefined;
    manufacturer?: undefined;
    chemistry?: undefined;
    operatingVoltage?: undefined;
    nominalColdOhms70F?: undefined;
    coldResistanceRange?: undefined;
    elementDimensions?: undefined;
    ceramicBaseDimensions?: undefined;
    terminalConnectorType?: undefined;
    leadWires?: undefined;
    aftermarketEquivalents?: undefined;
    supersededPartNumbers?: undefined;
    compatibleFurnaceModels?: undefined;
    diagnosticFailureSymptoms?: undefined;
    canonicalDocumentationUrl?: undefined;
} | {
    message?: undefined;
    suggestedPartNumbers?: undefined;
    canonicalSearchUrl?: undefined;
    diagnosticAdvice?: undefined;
    status: string;
    partNumber: string;
    manufacturer: string;
    chemistry: string;
    operatingVoltage: string;
    nominalColdOhms70F: number;
    coldResistanceRange: string;
    elementDimensions: string;
    ceramicBaseDimensions: string;
    terminalConnectorType: string;
    leadWires: string;
    aftermarketEquivalents: string;
    supersededPartNumbers: string[];
    compatibleFurnaceModels: string[];
    diagnosticFailureSymptoms: string;
    canonicalDocumentationUrl: string;
};
export declare function handleDiagnoseIgniterResistance(args: {
    measured_ohms: number;
    chemistry?: string;
    part_number?: string;
}): {
    status: "FAIL_HIGH_RESISTANCE" | "FAIL_OPEN_CIRCUIT" | "FAIL_SHORT_CIRCUIT" | "PASS_NORMAL" | "WARNING_DEGRADED";
    measuredOhms: number;
    assumedChemistry: string;
    verdictSummary: string;
    recommendedAction: string;
    flukeMultimeterSettingRecommendation: string;
    canonicalTroubleshootingGuideUrl: string;
};
//# sourceMappingURL=igniters.d.ts.map