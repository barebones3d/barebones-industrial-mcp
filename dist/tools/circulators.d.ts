export declare const crossReferenceCirculatorPumpTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            model_number: {
                type: string;
                description: string;
                examples: string[];
            };
            head_feet: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            flow_gpm: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            casing_material: {
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
export declare function handleCrossReferenceCirculatorPump(args: {
    model_number: string;
    head_feet?: number;
    flow_gpm?: number;
    casing_material?: string;
}): {
    canonicalDocumentationUrl?: undefined;
    status: string;
    message: string;
    standardFlangeDimension: string;
    recommendedUniversalUpgrade: string;
    availableModelsInCatalog: string[];
    canonicalCatalogUrl: string;
    queriedModel?: undefined;
    brand?: undefined;
    title?: undefined;
    flangeSpacing?: undefined;
    casingMaterial?: undefined;
    motorTechnology?: undefined;
    maximumShutOffHead?: undefined;
    maximumFlowRate?: undefined;
    ratedPowerDraw?: undefined;
    universalDropInFitmentNote?: undefined;
    recommendedEcmUpgrades?: undefined;
    engineeringGuidance?: undefined;
} | {
    message?: undefined;
    standardFlangeDimension?: undefined;
    recommendedUniversalUpgrade?: undefined;
    availableModelsInCatalog?: undefined;
    canonicalCatalogUrl?: undefined;
    status: string;
    queriedModel: string;
    brand: string;
    title: string;
    flangeSpacing: string;
    casingMaterial: string;
    motorTechnology: string;
    maximumShutOffHead: string;
    maximumFlowRate: string;
    ratedPowerDraw: string;
    universalDropInFitmentNote: string;
    recommendedEcmUpgrades: {
        model: string;
        powerConsumption: string;
        features: string;
    }[];
    engineeringGuidance: string;
    canonicalDocumentationUrl: string;
};
//# sourceMappingURL=circulators.d.ts.map