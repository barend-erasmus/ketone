export class User {
    constructor(
        public username: string,
        public emailAddress: string,
        public password: string,
        public verified: boolean,
        public enabled: boolean,
        public profileImage: string,
    ) {

    }
}
