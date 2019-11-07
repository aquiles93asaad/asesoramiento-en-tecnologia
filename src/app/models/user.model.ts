export interface User {
    _id?: string;
    name: string;
    lastName: string;
    email: string;
    esAdmin: boolean;
    image: string;
    createdBy: string;
    createdAt: Date;
    modifiedBy: string;
    modifiedAt: Date;
}
