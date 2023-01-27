
const accounts = require('./model/accounts');
const emailjs = require('./utils/emailjs');
const countries = require('./json/countries');
const fetch= require("node-fetch")
module.exports = function(app) {


/*
	login & logout
*/

	app.get('/', function(req, res){
	// check if the user has an auto login key saved in a cookie //
		if (req.cookies.login == undefined){
			res.sendFile(__dirname + '/views/login.html');
		}	else{
	// attempt automatic login //
			accounts.validateLoginKey(req.cookies.login, req.ip, function(e, o){
				if (o){
					accounts.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/home');
					});
				}	else{
					res.sendFile(__dirname + '/views/login.html');
				}
			});
		}
	});

	app.post('/', async function(req, res){
		if(!await verifyCaptcha(req)){
			 res.status(409).send("");

		}
		else{
		accounts.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				if(o.isActive==false){
					res.status(401).send(o);
				}
				else{
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
				}	else{
					accounts.generateLoginKey(o.user, req.ip, function(key){
						res.cookie('login', key, { maxAge: 900000 });
						res.status(200).send(o);
					});
				}
			}
			}
		});
	}
	});
	function verifyCaptcha(req) {
		return new Promise((myResolve, myReject)=>{
		const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
	  
		  fetch(VERIFY_URL, {
		  method: "POST",
		  headers: { "Content-Type": "application/x-www-form-urlencoded" },
		  body: `secret=6LdQpygkAAAAAM_bfyTd39ha3x6ctcLTs96_bMdE&response=${req.body['cap']}`,
		})
		.then(async response => {
			var response=await response.json();
			console.log(response);
			if(response.success)
			{
				myResolve(true);
			}
			else{
				myResolve(false);
			}
		}).then(data => {
			myResolve(false);
		});
	});
	  }
	app.post('/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})

	/*
		about us
	*/
	app.post('/submit-form',function(req, res){
		msg = `
      <p>Name: ${req.body.name}</p>
      <p>Email: ${req.body.email}</p>
      <p>Message: ${req.body.message}</p>
    `;
		// emailjs.sendContactUsMail(msg);
		return res.status(200).send('Thanks, your message was sent!');
	});

	/*
		control panel
	*/

		app.get('/home', function(req, res) {
			if (req.session.user == null){
				res.redirect('/');
			}	else{
				res.render('home', {
					title : 'Control Panel',
					countries : countries,
					udata : req.session.user
				});
			}
		});

		app.post('/home', function(req, res){
			if (req.session.user == null){
				res.redirect('/');
			}	else{
				accounts.updateAccount({
					id		: req.session.user._id,
					name	: req.body['name'],
					email	: req.body['email'],
					pass	: req.body['pass'],
					country	: req.body['country']
				}, function(e, o){
					if (e){
						res.status(400).send('error-updating-account');
					}	else{
						req.session.user = o.value;
						res.status(200).send('ok');
					}
				});
			}
		});

	/*
		new accounts
	*/

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : countries });
	});

	app.post('/signup', async function(req, res){
		if(!await verifyCaptcha(req)){
			res.status(409).send("");

		}
		else{
		accounts.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	}
	});

	/*
	password reset
	*/
	app.get('/about-us', function(req, res){
	res.sendFile(__dirname + '/views/about-us.html');
	});

	app.get('/forgot-password', function(req, res){
	res.sendFile(__dirname + '/views/forgot-password.html');
	});

	app.post('/forgot-password', function(req, res){
		let email = req.body['email'];
		accounts.isuserExits(email,function(isUserExists){
			if(!isUserExists){
				return res.status(500).json({
					success: false,
					message: 'Email does not exist',
					});
			}
			else{

				accounts.generatePasswordKey(email, req.ip, function(e, account){
					if (e){
						res.status(404).send(e);
					}	else{
						emailjs.dispatchResetPasswordLink(account, function(e){
					// TODO this callback takes a moment to return, add a loader to give user feedback //
							if (!e){
								return res.status(200).json({
									success: true,
									message: 'Please check you inbox',
									});
							}	else{
								return res.status(500).json({
									success: false,
									message: 'Error sending email',
									});
							}
						});
					}
				});
				
			}
		})
		//console.log("lost password",email);
	});

	app.get('/active-account', function(req, res) {
		accounts.validateSignupKey(req.query['key'], function(e, o){
			console.log("active-account",o);
			if (e || o == null){
				res.sendFile(__dirname + '/views/forgot-password.html');
			} else{
				
				accounts.ActiveAccount(req.query['key']);
				res.redirect('/');
			}
		})
	});

	app.get('/reset-password', function(req, res) {
		accounts.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/');
			} else{
				req.session.passKey = req.query['key'];
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		let passKey = req.session.passKey;
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		accounts.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});

/*
	view, delete & reset accounts
*/

	app.get('/print', function(req, res) {
		accounts.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});

	app.post('/delete', function(req, res){
		accounts.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
		});
	});

	app.get('/reset', function(req, res) {
		accounts.deleteAllAccounts(function(){
			res.redirect('/print');
		});
	});


	// SERVER-CLIENT PROJECT ADDED:

	app.get('/index', function(req, res) {
		res.sendFile(__dirname + '/views/index.html');
	});

	app.get('*', function(req, res) { res.sendFile(__dirname + '/views/404.html'); });

	



};
