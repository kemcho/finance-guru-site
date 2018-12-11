const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school)? data.school : '';
    data.degree = !isEmpty(data.degree)? data.degree : '';
    data.from = !isEmpty(data.from)? data.from : '';
    data.description = !isEmpty(data.description)? data.description : '';

    if(Validator.isEmpty(data.school)){
        errors.school = "school required";
    }

    if(Validator.isEmpty(data.degree)){
        errors.degree = "degree required";
    }

    if(Validator.isEmpty(data.from)){
        errors.from = "from date is required";
    }
   
    if(Validator.isEmpty(data.description)){
        errors.description = "description is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
};