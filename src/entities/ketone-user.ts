export class KetoneUser {
    constructor(
        public username: string,
        public emailAddress: string,
        public password: string,
        public verified: boolean,
        public enabled: boolean,
        public profileImage: string,
        public apiKey: string,
    ) {

    }
}
