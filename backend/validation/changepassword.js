const Validator = require('validator');
const isEmpty = require('../is-empty');
const bcrypt = require('bcryptjs');

module.exports = function validateChangePasswordInput(data) {
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : '';
    data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : '';
    data.newPassword_confirm = !isEmpty(data.newPassword_confirm) ? data.newPassword_confirm : '';
    let oldPasswordMatches = (bcrypt.compareSync(data.oldPassword, data.password)) ? 'matches' : 'wrongOld'

    if(Validator.equals(oldPasswordMatches, 'wrongOld')) {
        errors.oldPassword = 'Old Password Incorrect';
    }

    if(!Validator.isLength(data.newPassword, {min: 6, max: 30})) {
        errors.newPassword = 'Password must have 6 chars';
    }

    if(Validator.isEmpty(data.newPassword)) {
        errors.newPassword = 'New Password is required';
    }

    if(!Validator.isLength(data.newPassword_confirm, {min: 6, max: 30})) {
        errors.newPassword_confirm = 'Password must have 6 chars';
    }

    if(!Validator.equals(data.newPassword, data.newPassword_confirm)) {
        errors.newPassword_confirm = 'New Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.newPassword_confirm)) {
        errors.newPassword_confirm = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
