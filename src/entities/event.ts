export class Event {
    constructor(public clientId: string, public username: string, public name: string, public ipAddress: string, public timestamp: Date = null) {

    }
}
