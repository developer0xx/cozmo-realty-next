const nodemailer = require('nodemailer');
const config = require('config');
const mailKey = config.get('mailKey');

const mailTo = 'webdev.championlenders@gmail.com';
const mailFrom = 'webdev.championlenders@gmail.com';
const URLHost = 'http://localhost:3000';

let mailer = (req, data, res) => {
	let transporter = nodemailer.createTransport({
		host: 'mail.cozmorealty.com',
		port: 465,
		secure: true,
		auth: {
			user: mailKey.user,
			pass: mailKey.pass,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	if (data.mailType === 'contact') {
		transporter.sendMail(
			{
				from: mailFrom,
				to: mailTo,
				subject: 'Contact: Request from ' + req.body.name,
				text: `New CONTACT request from ${req.body.name} \n
			Phone Number : ${req.body.phoneNumber}\n
			Email: ${req.body.email}\n
			Message: \n
			${req.body.message}\n\n`,
			},
			(err, info) => {
				if (err) {
					console.log('contact:', err);
					return res.status(400).json({ success: false, err });
				}
				return res.status(200).json({ success: true, message: 'We will be contacting you as soon as possible.' });
			}
		);
	} else if (data.mailType === 'invest') {
		transporter.sendMail(
			{
				from: mailFrom,
				to: mailTo,
				subject: 'Invest: Request from ' + req.body.name,
				text: `New INVEST request from ${req.body.name} \n
			Phone Number : ${req.body.phoneNumber}\n
			Email: ${req.body.email}\n
			Property: ${req.body.streetAddress}, ${req.body.streetAddress2nd}, ${req.body.city}, ${req.body.state} ${req.body.zip}\n
			\n
			URL: ${URLHost}/property/${req.body._id}
			\n\n`,
			},
			(err, info) => {
				if (err) {
					console.log('invest:', err);
					return res.status(400).json({ success: false, err });
				}
				return res.status(200).json({ success: true, message: 'We will be contacting you as soon as possible.' });
			}
		);
	} else if (data.mailType === 'new-agent') {
		const agentInfo = data;
		transporter.sendMail(
			{
				from: mailFrom,
				to: mailTo,
				subject: 'COZMO REALTY - New Agent: Request from ' + `${agentInfo.firstName} ${agentInfo.lastName}`,
				text: `New Agent joining request from \n
			Name: ${agentInfo.firstName} ${agentInfo.lastName} \n
			Phone Number : ${agentInfo.phoneNumber}\n
			Email: ${agentInfo.email}\n
			DRE #: ${agentInfo.dreNum}\n
			Since: ${agentInfo.agentSince}\n
			\n
			\n\n`,
			},
			(err, info) => {
				if (err) {
					console.log('new-agent:', err);
					return res.status(400).json({ success: false, type: 'mail-issue', err });
				}
				return res.status(200).json({ success: true, message: 'We will be contacting you as soon as possible.' });
			}
		);
	} else if (data.mailType === 'new-mentor') {
		const mentorInfo = data;
		transporter.sendMail(
			{
				from: mailFrom,
				to: mailTo,
				subject: 'COZMO REALTY - New mentor: Request from ' + `${mentorInfo.firstName} ${mentorInfo.lastName}`,
				text: `New mentor joining request from \n
			Name: ${mentorInfo.firstName} ${mentorInfo.lastName} \n
			Phone Number : ${mentorInfo.phoneNumber}\n
			Email: ${mentorInfo.email}\n
			Since: ${mentorInfo.mentorSince}\n
			\n
			\n\n`,
			},
			(err, info) => {
				if (err) {
					console.log('new-mentor:', err);
					return res.status(400).json({ success: false, type: 'mail-issue', err });
				}
				return res.status(200).json({ success: true, message: 'We will be contacting you as soon as possible.' });
			}
		);
	} else if (data.mailType === 'reset') {
		transporter.sendMail(
			{
				from: mailFrom,
				to: data.email,
				subject: 'Cozmo Realty Password Reset',
				html: `<p>Please use the following link to <a href="${URLHost}/reset/${data.resetToken}" target="_blank">reset your password</a> <br/>\n
			If you did not request this password change please feel free to ignore it.\n<br/>
			\n\n<br/></p>`,
			},
			(err, info) => {
				if (err) {
					console.log('reset error:', err);
					return res.status(400).json({ success: false, err });
				}
				return res.status(200).json({ success: true, message: 'Reset Password link sent!' });
			}
		);
	} else if (data.mailType === 'claim') {
		const { authorEmail, leadType, pocketId, businessId, activeId, buyerId, claimers: { firstName, lastName, email, phoneNumber, message } } = data;
		const leadID = leadType === 'pocket-listings' ? pocketId : leadType === 'business' ? businessId : leadType === 'active' ? activeId : leadType === 'buyer' ? buyerId : null;
		transporter.sendMail(
			{
				from: mailFrom,
				to: authorEmail,
				subject: `Cozmo Realty - ${firstName} ${lastName} is interested in your property!`,
				html: `<p>${firstName} ${lastName} is interested in your property! <br/>
						\tName: ${firstName} ${lastName} <br/>
						\tPhone Number : ${phoneNumber}<br/>
						\tEmail: ${email}<br/>
						\tMessage: ${message}<br/><br/>
				<a href="${leadType}/${leadID}" target="_blank">View Listing</a> <br/><br/><br/></p>`,
			},
			(err, info) => {
				if (err) {
					console.log('reset error:', err);
					return res.status(400).json({ success: false, err });
				}
				return res.status(200).json({ success: true, message: 'Claim submitted successfully!' });
			}
		);
	} else {
		console.log('error');
		return res.status(400).json({ success: false, err: 'invalid mail type' });
	}
};

module.exports = { mailer };
