export class Token {
    constructor(
        public value: string,
        public clientId: string,
        public username: string,
        public scopes: string[],
        public type: string,
        public timestamp: Date,
    ) {

    }
}