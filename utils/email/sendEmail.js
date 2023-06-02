require("dotenv").config();
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let source = fs.readFileSync(path.join(__dirname, template), "utf8");
        let compiledTemplate = handlebars.compile(source);
        let info = await transporter.sendMail({
            from: "Cục đăng kiểm Việt Nam " + process.env.EMAIL_USERNAME,
            to: email,
            subject: subject,
            html: compiledTemplate(payload),
        });
    } catch (error) {
        return error;
    }
};

module.exports = sendEmail;