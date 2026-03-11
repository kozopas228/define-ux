export function validateName(name: string): string[] {
    const errors = [];
    if (name.length >= 100) {
        errors.push('Name must be less than 100 characters.');
    }

    if (name.length < 3) {
        errors.push('Name must be at least 3 characters.');
    }

    return errors;
}

export function validateDescription(name: string): string[] {
    const errors = [];
    if (name.length >= 500) {
        errors.push('Description must be less than 500 characters.');
    }

    return errors;
}

export function validatePassword(password: string): string[] {
    const errors = [];
    if (
        !/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password)
    ) {
        errors.push(
            'password should contain at least one upper case letter, ' +
                'one lower case letter and number or special character '
        );
    }

    return errors;
}
