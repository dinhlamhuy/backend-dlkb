import db from "../models/index";
require("dotenv").config();
import _, { reject } from "lodash";

import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        // reason: this.state.reason,

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            lastname: data.fullName,
            email: data.email,
            roleId: "R3",
            address: data.address,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
          },
        });
        //create a booking record
        if (user && user[0]) {
          let day = new Date(data.date);

          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: day,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Booking success!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let verifyBookingService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.token) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getListPatientService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let day = new Date(+date);

        let data = await db.Booking.findAll({
          where: { statusId: "S2", doctorId: doctorId, date: day },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "lastname",
                "address",
                "gender",
                "phoneNumber",
              ],

              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypebookingData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: false,
          nest: true,
        });

        resolve({
          errCode: 0,
          errMessage: "OK!",
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let sendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
          nest: true,
        });

        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();

          await emailService.emailAttachment(data);
          resolve({
            errCode: 0,
            errMessage: "OK!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  postBookAppointment: postBookAppointment,
  verifyBookingService: verifyBookingService,
  getListPatientService: getListPatientService,
  sendRemedyService: sendRemedyService,
};
