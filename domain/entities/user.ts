export type User = {
    id: number;
    email: string;
    password: string;
    name: string | null;
    role: string;
    banned: boolean;
}