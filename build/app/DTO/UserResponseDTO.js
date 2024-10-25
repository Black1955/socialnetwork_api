export class UserResponseDTO {
    constructor(user, subscribed) {
        this.user = user;
        this.subscribed = subscribed;
    }
    getUser() {
        return this.user;
    }
    setUser(user) {
        this.user = user;
    }
    getObject() {
        return { user: this.user, subscribed: this.subscribed };
    }
}
