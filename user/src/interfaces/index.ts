export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    credits: number;
    isAdmin: boolean;
    creatures: Array<string>
}