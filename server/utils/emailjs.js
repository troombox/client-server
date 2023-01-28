const nodemailer = require('nodemailer');
// const SMTPClient = require('emailjs').SMTPClient;
// const client = new SMTPClient({
// 	host: process.env.NL_EMAIL_HOST,
// 	user: process.env.NL_EMAIL_USER,
// 	password: process.env.NL_EMAIL_PASS,
// 	ssl: true,
// 	port : 465
// });
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: process.env.EMAIL_USER,
	  pass: process.env.EMAIL_PASS
	}
  });
module.exports.dispatchResetPasswordLink = function(account, callback)
{
	// const email = {
	// 	from		: process.env.NL_EMAIL_NAME+' <'+process.env.NL_EMAIL_USER+'>',
	// 	to			: account.email,
	// 	subject		: 'Password Reset',
	// 	attachment	: composeResetPasswordEmail(account)
	// };
	var mailOptions = {
		from: process.env.EMAIL_USER,
		to: account.email,
		subject: 'Password Reset',
		//text: body
		html: composeResetPasswordEmail(account)
	  };
	
	  transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
		  console.log(error);
		  callback('emailjs is not setup correctly, did you set your env variables?');
		} else {
			callback(null);
		}
	  });
	// client.send(email, (e) => {
	// 	if (e && (e.code == 5 || e.smtp == undefined)){
	// 		callback('emailjs is not setup correctly, did you set your env variables?');
	// 	}	else{
	// 		callback(null);
	// 	}
	// });
}

const composeResetPasswordEmail = function(o)
{
	let baseurl = process.env.NL_SITE_URL || 'http://localhost:3000';
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+baseurl+'/reset-password?key='+o.passKey+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "<a href='https://braitsch.io'>braitsch</a><br><br>";
		html += "</body></html>";
	return html;
}


// contact us email
const composeContactUsEmail = function(msg)
{
	let baseurl = process.env.NL_SITE_URL || 'http://localhost:3000';
	var html = "<html><body>";
		html += msg;
		html += "</body></html>";
	return html;
}

module.exports.sendContactUsMail = function(message)
{
	var mailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.EMAIL_USER,
		subject: 'Contact Us',
		//text: body
		html: composeContactUsEmail(message)
	  };
	
	  transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
		  console.log(error);
		}
	  });
}

