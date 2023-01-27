function getResponseTokenForCaptcha(){
	return new Promise((myResolve, myReject)=>{
	grecaptcha.ready(function() {
		grecaptcha.execute('6LdQpygkAAAAAMJxXPAeZtJK93co0N2-qNJ3pq67', {action: 'submit'}).then((token)=> {
			// Add your logic to submit to your backend server here.
			myResolve(token);
		});
	  });
	});
}
  async function onload() {
    let token=await getResponseTokenForCaptcha();
    document.getElementById('cap').value=token;
   }
   onload();

$(document).ready(function(){
	
	var av = new AccountValidator();
	var sc = new SignupController();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			return av.validateForm();
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') $('.modal-alert').modal('show');
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
				av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
				av.showInvalidUserName();
			}
			 if(e.status==409){
				lv.showLoginError('Login Failure', 'Captcha verfication failed please refresh the page and try again');
			}
		}
	});
	$('#name-tf').focus();
	
// customize the account signup form //
	
	$('#account-form h2').text('Signup');
	$('#account-form #sub').text('Please tell us a little about yourself');
	$('#account-form-btn1').html('Cancel');
	$('#account-form-btn2').html('Submit');
	$('#account-form-btn2').addClass('btn-primary');
	
// setup the alert that displays when an account is successfully created //

	$('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
	$('.modal-alert .modal-header h4').text('Account Created!');
	$('.modal-alert .modal-body p').html('Your account has been created. please check inbox to active the account</br>Click OK to return to the login page.');

});