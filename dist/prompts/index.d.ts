export declare const PROMPTS: {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
}[];
export declare function handleGetPrompt(name: string, args?: Record<string, string>): {
    description: string;
    messages: {
        role: string;
        content: {
            type: string;
            text: string;
        };
    }[];
};
//# sourceMappingURL=index.d.ts.map