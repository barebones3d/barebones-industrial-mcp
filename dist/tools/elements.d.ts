export declare const calculateHeatingElementResistanceTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            rated_watts: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            rated_volts: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            measured_ohms: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                examples: number[];
            };
            application: {
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
export declare const lookupSpaHeatingElementTool: {
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
export declare function handleCalculateHeatingElementResistance(args: {
    rated_watts: number;
    rated_volts: number;
    measured_ohms?: number;
    application?: string;
}): {
    powerWatts: number;
    voltageVolts: number;
    nominalColdResistanceOhms: number;
    toleranceSpanOhms: string;
    fullLoadAmperage: number;
    necContinuousCurrentRating: number;
    recommendedGfciBreaker: string;
    recommendedMinWireGauge: string;
    diagnosticEvaluation: any;
    canonicalGuideUrl: string;
};
export declare function handleLookupSpaHeatingElement(args: {
    part_number: string;
    brand?: string;
}): {
    status: string;
    message: string;
    availableModels: string[];
    canonicalSearchUrl: string;
    partNumber?: undefined;
    brand?: undefined;
    title?: undefined;
    ratedWatts?: undefined;
    ratedVolts?: undefined;
    nominalColdResistance?: undefined;
    toleranceRange?: undefined;
    manifoldDimensions?: undefined;
    terminalOffset?: undefined;
    sheathMetallurgy?: undefined;
    sensorCompatibility?: undefined;
    topsideErrorCodes?: undefined;
    engineeringGuidance?: undefined;
    canonicalDocumentationUrl?: undefined;
} | {
    message?: undefined;
    availableModels?: undefined;
    canonicalSearchUrl?: undefined;
    status: string;
    partNumber: string;
    brand: string;
    title: string;
    ratedWatts: number;
    ratedVolts: number;
    nominalColdResistance: string;
    toleranceRange: string;
    manifoldDimensions: string;
    terminalOffset: string;
    sheathMetallurgy: string;
    sensorCompatibility: string;
    topsideErrorCodes: string[];
    engineeringGuidance: string;
    canonicalDocumentationUrl: string;
};
//# sourceMappingURL=elements.d.ts.map