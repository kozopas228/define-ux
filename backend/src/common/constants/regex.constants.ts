// checks if a password has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const PK_SK_REGEX = /^[A-Za-z0-9#-]+_[A-Za-z0-9#-]+$/;

export const EMAIL_REGEX =
    // eslint-disable-next-line max-len
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const IMAGE_REGEXP = /^image\/(jpeg|png|webp)$/;
export const IMAGE_JPEG_REGEXP = /^image\/jpeg$/;
