export class User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    mobile: string;
    countryCode: string;
    password: string;

    constructor(user?: User) {
        this.firstName = user && user.firstName || '';
        this.lastName = user && user.lastName || '';
        this.username = user && user.username || '';
        this.email = user && user.email || '';
        this.mobile = user && user.mobile || '';
        this.countryCode = user && user.countryCode || '';
        this.password = user && user.password || '';
    }

    public userSignupValidator() {
        if (this.emptyCheck(this.firstName)) {
            return 'First Name cannot be empty!';
        } else if (this.emptyCheck(this.lastName)) {
            return 'Last Name cannot be empty!';
        } else if (this.emptyCheck(this.username)) {
            return 'Username cannot be empty!';
        } else if (this.emptyCheck(this.email)) {
            return 'Email cannot be empty!';
        } else if (this.emptyCheck(this.mobile)) {
            return 'Mobile cannot be empty!';
        } else if (this.emptyCheck(this.countryCode)) {
            return 'Country Code cannot be empty!';
        } else if (this.emptyCheck(this.password)) {
            return 'Password cannot be empty!';
        } else if (this.checkMinLength(this.username)) {
            return 'Username should not be less than 5';
        } else if (this.checkMinLength(this.password)) {
            return 'Password should not be less than 5';
        }
        return null;
    }

    public userLoginValidator() {
        if (this.emptyCheck(this.email)) {
            return 'Email cannot be empty!';
        } else if (this.emptyCheck(this.password)) {
            return 'Password cannot be empty!';
        } else if (this.checkMinLength(this.password)) {
            return 'Password should not be less than 5';
        }
        return null;
    }

    private emptyCheck(input) {
        if (input === null || input === '') {
            return true;
        }
        return false;
    }

    private checkMinLength(input) {
        if (input.length < 5) {
            return true;
        }
        return false;
    }

    private checkUserMinLength(input) {
        if (input.length < 3) {
            return true;
        }
        return false;
    }

    private checkMaxLength(input) {
        if (input.length > 15) {
            return true;
        }
        return false;
    }

    private checkUserMaxLength(input) {
        if (input.length < 100) {
            return true;
        }
        return false;
    }
}
