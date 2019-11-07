import { Question } from './question.model';

export interface UsageProfile {
    _id?: string;
    name: string;
    label: string;
    description: string;
    questions: Question[];
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
}
