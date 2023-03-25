export declare class User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    private normalizeEmail;
    password: string;
    phone: string;
    isAdmin: boolean;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
    private hashPassword;
}
