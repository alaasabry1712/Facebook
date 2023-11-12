const nodemailer = require("nodemailer"); // Nodemailer for sending emails
const { google } = require("googleapis"); // Google APIs
const { OAuth2 } = google.auth; // OAuth2 for authentication with Google
const oauth_link = "https://developers.google.com/oauthplayground"; // OAuth playground link
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env; // Environment variables

// Creating a new OAuth2 client
const auth = new OAuth2(MAILING_ID, MAILING_SECRET, MAILING_REFRESH, oauth_link);

// Function to send a verification email
exports.sendVerificationEmail = (email, name, url) => {
    // Setting the credentials for the OAuth2 client
    auth.setCredentials({
        refresh_token: MAILING_REFRESH,
    });

    // Getting an access token
    const accessToken = auth.getAccessToken();

    // Creating a SMTP transport for sending emails using Nodemailer
    const stmp = nodemailer.createTransport({
        service: "gmail", // Use Gmail as the email service
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken,
        },
    });

    // Defining the mail options
    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Facebook email verification",
        html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png" alt="" style="width:30px"><span>Action required: Activate your facebook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Facebook. To complete your registration, please confirm your account.</span></div><a href=${url} style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">Confirm your account</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all your friends. Once registered on facebook, you can share photos, organize events and much more.</span></div></div>`,
    };

    // Sending the email
    stmp.sendMail(mailOptions, (err, res) => {
        if (err) return err;
        return res;
    });
};

exports.sendResetCode = (email, name, code) => {
    // Set credentials for email service using OAuth2
    auth.setCredentials({
        refresh_token: MAILING_REFRESH,
    });

    // Get an access token
    const accessToken = auth.getAccessToken();

    // Create an SMTP transporter for sending emails using Nodemailer
    const smtp = nodemailer.createTransport({
        service: "gmail", // Use Gmail as the email service
        auth: {
            type: "OAuth2",
            user: EMAIL, // Sender's email address
            clientId: MAILING_ID, // OAuth2 client ID
            clientSecret: MAILING_SECRET, // OAuth2 client secret
            refreshToken: MAILING_REFRESH, // Refresh token
            accessToken,
        },
    });

    // Define email content and settings
    const mailOptions = {
        from: EMAIL, // Sender's email address
        to: email, // Recipient's email address
        subject: "Reset Facebook Password", // Email subject
        // Email content in HTML format
        html: `<div style="max-width:700px;margin-bottom:1rem;display:flex;align-items:center;gap:10px;font-family:Roboto;font-weight:600;color:#3b5998"><img src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png" alt="" style="width:30px"><span>Action require: Activate your facebook account</span></div><div style="padding:1rem 0;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;color:#141823;font-size:17px;font-family:Roboto"><span>Hello ${name}</span><div style="padding:20px 0"><span style="padding:1.5rem 0">You recently created an account on Facebook. To complete your registration, please confirm your account.</span></div><a  style="width:200px;padding:10px 15px;background:#4c649b;color:#fff;text-decoration:none;font-weight:600">${code}</a><br><div style="padding-top:20px"><span style="margin:1.5rem 0;color:#898f9c">Facebook allows you to stay in touch with all your friends, once refistered on facebook,you can share photos,organize events and much more.</span></div></div>`,
    };

    // Send the email
    smtp.sendMail(mailOptions, (err, res) => {
        if (err) return err; // Handle errors if there are any

        return res; // Return the result if the email is sent successfully
    });
};
