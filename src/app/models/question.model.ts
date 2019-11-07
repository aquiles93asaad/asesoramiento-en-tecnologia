export interface Question {
    _id?: string;
    label: string;
    questionType: string;
    answers: {
        label: string;
        value: string | boolean;
        procesorMinScore: number;
        procesorMaxScore: number;
        ramMinScore: number;
        ramMaxScore: number;
        storageMinScore: number;
        storageMaxScore: number;
        graphicsCardMinScore: number;
        graphicsCardMaxScore: number;
    }[];
    usageProfiles: string[];
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
}
