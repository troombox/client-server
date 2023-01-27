
function LoginValidator()
{
// bind a simple alert window to this controller to display any errors //
	this.loginErrors = $('.modal-alert');
	
	this.showLoginError = function(t, m)
	{
		$('.modal-alert .modal-header h4').text(t);
		$('.modal-alert .modal-body').html(m);
		this.loginErrors.modal('show');
	}
}

LoginValidator.prototype.validateForm = function()
{
	var pass = $('#pass-tf').val();
	if ($('#user-tf').val() == ''){
		this.showLoginError('Whoops!', 'Please enter a valid username');
		return false;
	}	else if (pass == ''){
		this.showLoginError('Whoops!', 'Please enter a password');
		return false;
	} 	else if(pass.length < 6){
		this.showLoginError('Whoops!', 'Password must be at least 6 characters long');
		return false;
    }	else if(!pass.match(/[A-Z]/)){
		this.showLoginError('Whoops!', 'Password must contain at least one uppercase letter');
		return false;
	} 	else if(!pass.match(/[a-z]/)){
		this.showLoginError('Whoops!', 'Password must contain at least one lowercase letter');
		return false;
    }	else if(!pass.match(/[0-9]/)){
		this.showLoginError('Whoops!', 'Password must contain at least one number');
		return false;
	} 	else if(!pass.match(/[`~!@#\$%\^&\*\(\)\-=_+\\\[\]{}/\?,\.\<\>]/)){
		this.showLoginError('Whoops!', 'Password must contain at least one special character');
		return false;
    }	else {
		return true;
	}
}

