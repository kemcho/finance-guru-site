const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateProfileInput(data) {
    let errors = {};

    //Validator only works on strings, thus let us explicity set daa.hanle fields to empty strings
    data.handle = !isEmpty(data.handle)? data.handle : '';
    data.status = !isEmpty(data.status)? data.status : '';
    data.skills = !isEmpty(data.skills)? data.skills : '';
    data.website = !isEmpty(data.website)? data.website : '';
    data.bio = !isEmpty(data.bio)? data.bio : '';
    data.youtube = !isEmpty(data.youtube)? data.youtube: '';
    data.twitter = !isEmpty(data.twitter)? data.twitter: '';
    data.facebook = !isEmpty(data.facebook)? data.facebook: '';
    data.linkedin = !isEmpty(data.linkedin)? data.linkedin: '';
    data.instagram = !isEmpty(data.instagram)? data.instagram: '';



    if(!Validator.isLength(data.handle,{min:2,max:30})){
        errors.handle = "Handle needs to be between 2 and 30 characters";
    }

    //For all required fields in the model make sure you check they are not empty
    if(Validator.isEmpty(data.handle)){
        errors.handle = "Handle is required";
    }
    if(Validator.isEmpty(data.status)){
        errors.status = "Status is required";
    }
    if(Validator.isEmpty(data.skills)){
        errors.skills = "Skills is required";
    }
    if(!Validator.isURL(data.website)){
        errors.website = "valid url is required for website"
    }
    if(Validator.isEmpty(data.website)){
        errors.website = "Website is required";
    }
    if(Validator.isEmpty(data.bio)){
        errors.bio = "Bio is required";
    }
    if(!Validator.isEmpty(data.youtube)){
        if(!Validator.isURL(data.youtube)){
            errors.youtube = "Valid URL is required";
        } 
    }
    if(!Validator.isEmpty(data.twitter)){
        if(!Validator.isURL(data.twitter)){
            errors.twitter = "Valid URL is required";
        } 
    }
    if(!Validator.isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = "Valid URL is required";
        } 
    }
    if(!Validator.isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = "Valid URL is required";
        } 
    }
    if(!Validator.isEmpty(data.instagram)){
        if(!Validator.isURL(data.instagram)){
            errors.instagram = "Valid URL is required";
        } 
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};