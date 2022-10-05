import nodemailer from "nodemailer";
require("dotenv").config();

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: "dlhuyhuii1301@gmail.com",
      to: dataSend.reciverEmail,
      subject: "Thông tin đặt lịch khám bệnh",
      html: getBodyHTMLEmail(dataSend),
    },
    function (err) {
      if (err) console.log(err);
    }
  );
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h3>Xin chào ${dataSend.patientName}!</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Website Booking Care</p>
      <p>Thông tin đặt lịch khám bệnh:</p>
      <p><b>Thời gian: ${dataSend.time}</b></p>
      <p><b>Bác sĩ: ${dataSend.doctorName}</b></p>
      <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
      <p>Xin chân thành cảm ơn</p>     
      `;
  }
  if (dataSend.language === "en") {
    result = `<h3>Dear ${dataSend.patientName}!</h3>
      <p>You received this email because you booked an online medical appointment on Booking Care Website</p>
      <p>Information to schedule an appointment:</p>
      <p><b>Time: ${dataSend.time}</b></p>
      <p><b>Doctor: ${dataSend.doctorName}</b></p>
      <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
      <p>Thank!</p>     
      `;
  }
  return result;
};

let emailAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail(
    {
      from: "dlhuyhuii1301@gmail.com",
      to: dataSend.email,
      subject: "Kết quả đặt lịch khám bệnh",
      attachments: [
        {
          filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
          content: dataSend.imgBase64.split("base64,")[1],
          encoding: "base64",
        },
      ],
      html: getBodyHTMLEmailRemedy(dataSend),
    },
    function (err) {
      if (err) console.log(err);
    }
  );
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `<h3>Xin chào bạn !</h3>
      <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Website Booking Care</p>
      <p>Thông tin đơn thuốc/hoá đơn được gửi trong file đính kèm:</p>
      <p>Xin chân thành cảm ơn</p>     
      `;
  }
  if (dataSend.language === "en") {
    result = `<h3>Dear You!</h3>
      <p>You received this email because you booked an online medical appointment on Booking Care Website</p>
      <p>Prescription/invoice information is sent in the attached file:</p>
      <p>Thank!</p>     
      `;
  }
  return result;
};
module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  emailAttachment: emailAttachment,
};
