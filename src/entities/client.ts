// Imports models
import { Role } from './role';

export class Client {

    public isKetoneClient: boolean = false;

    constructor(
        public name: string,
        public id: string,
        public secret: string,
        public allowedScopes: string[],
        public redirectUris: string[],
        public allowForgotPassword: boolean,
        public allowRegister: boolean,
        public username: string,
        public role: Role,
    ) {
        this.isKetoneClient = this.id === 'fLTSn80KPQNOPCS2R7dq';
    }

    public isOwner(username: string) {
        return this.username === username;
    }
}
