// Imports models
import { Permission } from './permission';

export class Role {
    constructor(public name: string, public permissions: Permission[]) {

    }
}
