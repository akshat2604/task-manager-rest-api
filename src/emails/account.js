const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.sendgridAPIkey);

const sendwelcomeemail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.devemail,
        subject: 'Welcome to Task-App!',
        text: `Hey ${name} You are now part of Task-app family.\nNow manage all your tasks in one app.`
    });
};

const sendremoveemail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.devemail,
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}.\nWe hope to see you back somtime soon.`
    });
};

module.exports = { sendwelcomeemail, sendremoveemail };