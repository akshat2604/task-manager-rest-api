const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.sendgridAPIkey);

sgMail.send({
    to: 'bhutaakshat@gmail.com',
    from: 'akshatjain2604@gmail.com',
    subject: 'This is my first ceation.',
    text: 'I hope it works fine.'
});

const sendwelcomeemail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshatjain2604@gmail.com',
        subject: 'Welcome to Task-App!',
        text: `Hey ${name} You are now part of Task-app family.\nNow manage all your tasks in one app.`
    });
};

const sendremoveemail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'akshatjain2604@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}.\nWe hope to see you back somtime soon.`
    });
};

module.exports = { sendwelcomeemail, sendremoveemail };