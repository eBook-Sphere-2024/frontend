export class User {
    constructor(public id: number, public first_name: string,
        public last_name: string, public username: string,
        public email: string, public password: string, public avatar?: string) {
    }
}