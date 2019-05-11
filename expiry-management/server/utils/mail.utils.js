const nodemailer = require("nodemailer");

module.exports.sendEmail = (to, from, text, subject) => {
    return new Promise(async (resolve, reject) => {
        try {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass // generated ethereal password
                }
            });
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: to, // list of receivers
                subject: "Hello ✔", // Subject line
                text: text, // plain text body
            });
            console.log("Mail Info: ",info);
            resolve(info);
        } catch (error) {
            reject(error);
        }
    });
}