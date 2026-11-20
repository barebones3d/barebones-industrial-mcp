export declare const troubleshootMechanicalFailureTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            category: {
                type: string;
                enum: string[];
                description: string;
                examples: string[];
            };
            symptom_description: {
                type: string;
                description: string;
                examples: string[];
            };
            measured_value: {
                type: string;
                description: string;
                examples: string[];
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
};
export declare const listSupportedOemModelsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            category: {
                type: string;
                enum: string[];
                description: string;
                examples: string[];
            };
        };
        additionalProperties: boolean;
    };
};
export declare function handleTroubleshootMechanicalFailure(args: {
    category: string;
    symptom_description: string;
    measured_value?: string;
}): {
    category: string;
    evaluatedSymptom: string;
    userReportedValue: string;
    probableRootCauses: string[];
    safetyProtocol: string;
    stepByStepDiagnosticProcedure: string;
    canonicalDiagnosticReferenceUrl: string;
};
export declare function handleListSupportedOemModels(args: {
    category?: string;
}): any;
//# sourceMappingURL=general.d.ts.map