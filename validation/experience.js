const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title)? data.title : '';
    data.company = !isEmpty(data.company)? data.company : '';
    data.from = !isEmpty(data.from)? data.from : '';
    data.description = !isEmpty(data.description)? data.description : '';

    if(Validator.isEmpty(data.title)){
        errors.title = "Title required";
    }

    if(Validator.isEmpty(data.company)){
        errors.company = "Company required";
    }

    if(Validator.isEmpty(data.from)){
        errors.from = "From date is required";
    }
   
    if(Validator.isEmpty(data.description)){
        errors.description = "Description is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};