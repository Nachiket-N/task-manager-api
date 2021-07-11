const mailgun = require("mailgun-js");
const DOMAIN = process.env.mailGun_DOMAIN;
const mailGunAPIKey = process.env.mailGun_API_Key;
const mg = mailgun({ apiKey: mailGunAPIKey, domain: DOMAIN });

const sendWelcomeEmail = ({ email, name }) => {
	mg.messages().send(
		{
			from: "drnachiketss@gmail.com",
			to: email,
			subject: "Thanks for joining my task app!",
			text: `Welcome to the app, ${name}. Any feedback and suggestions are appreciated.`,
		},
		function (err, body) {
			if (err) {
				return console.log(err);
			}
			console.log(body);
		}
	);
};

const sendCancellationEmail = ({ email, name }) => {
	mg.messages().send(
		{
			from: "drnachiketss@gmail.com",
			to: email,
			subject: "We're sorry to see you leave.",
			text: `Hope you join us again, ${name}.`,
		},
		function (err, body) {
			if (err) {
				return console.log(err);
			}
			console.log(body);
		}
	);
};
module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail,
};

// const data = {
// 	from: "Excited User <me@samples.mailgun.org>",
// 	to: "drnachiketss@gmail.com, YOU@YOUR_DOMAIN_NAME",
// 	subject: "Hello",
// 	text: "Testing some Mailgun awesomness!",
// };
// mg.messages().send(data, function (error, body) {
// 	console.log(body);
// });
