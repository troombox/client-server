function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const dataToValid = {
    'email' : "",
    'pass'  : ""
}


const validateEmail = (_email) => {
    if(_email == null){
        return [false, 'validateEmail: param'];
    }
    if(_email === ''){
        return [false, 'Empty Email Field. '];
    }
    var result = _email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!result){
        return [false, 'Email is not valid. '];
    }
    return [true, null] ;
}


const validatePass = (_pswd) => {
    if(_pswd == null){
        return [false, 'validatePass: param'];
    }
    var error_list = "";
    if(_pswd === ''){
        return [false, 'Empty Password Field. '];
    }
    if(_pswd.length < 6){
        error_list +="Password must be at least 6 characters long. ";
    }
    if(!_pswd.match(/[A-Z]/)){
        error_list += "Password must contain at least one uppercase letter. ";
    }
    if(!_pswd.match(/[a-z]/)){
        error_list += "Password must contain at least one lowercase letter. ";
    }
    if(!_pswd.match(/[0-9]/)){
        error_list += "Password must contain at least one number. ";
    }
    if(!_pswd.match(/[`~!@#\$%\^&\*\(\)\-=_+\\\[\]{}/\?,\.\<\>]/)){
        error_list += "Password must contain at least one special character. ";
    }
    if(error_list === ''){
        return [true, null];
    }
    return [false, error_list];
}


const validatePassVsConfirm = (_pswd, _conf) => {
    if(_pswd === _conf){
        return [true, null];
    }
    return [false, 'Password and Confirmation do not match'];
}


//implementation-specific function
const resultCreatorForLoginScreen = (_rEmail, _rPass) => {
    console.log('resultCreatorForLoginScreen' + _rEmail[0] + _rPass[0])
    var result = [];
    if(_rEmail[0] == false || _rPass[0] == false){
        result[0] = false;
        result[1] = null;
        if(_rEmail[1] != null){
            result[1] = _rEmail[1];
        }
        if(_rPass[1] != null){
            if(result[1] == null){
                result[1] = _rPass[1];
            }else{
                result[1] += _rPass[1];
            }
        }
    } else {
        result[0] = true;
        result[1] = null;
    }
    return result;
}


const resultCreatorForSignupScreen = (_rEmail, _rPass, _rConfirm) => {
    console.log('resultCreatorForLoginScreen' + _rEmail[0] + _rPass[0] + _rConfirm[0])
    var result = [];
    if(_rConfirm[0] == false){
        result[0] = false;
        result[1] = 'Password and Confirmation do not match!'
        return result;
    }
    return resultCreatorForLoginScreen(_rEmail, _rPass);
}

const resultCreatorForContactScreen = (_name, _subject, _rEmail) => {
    console.log(_rEmail);
    var result = [];
    if(_name === '' || _subject === 'subj0'){
        result[0] = false;
        if(_name === ''){
            result[1] = "Name is empty. ";
        }
        if(_subject ==='subj0'){
            if(result[1] == null){
                result[1] = "Please choose the contact reason. ";
            } else{
                result[1] += "Please choose the contact reason. ";
            }
        }
    }
    if(_rEmail[0] == false ){
        result[1] += _rEmail[1];
    }
    if(result[0] == false){
        console.log(result);
        return result;
    }
    result[0] = true;
    result[1] = null;
    console.log(result);
    return result;
}

const resultParser = (_result) => {
    if(_result[0] == false && _result[1] != null ){
        printAlertError(_result[1]);
        return false;
    }
    return true;
}

const printAlertError = (_errMsg) => {
    window.alert("Error: " + _errMsg );
}


