import db from "../models/index";
require("dotenv").config();
import _, { reject } from "lodash";
import moment from "moment";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {};
      let getdata = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      response.errCode = 0;
      response.data = getdata;
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};
let getAllDoctorService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {};
      let data = await db.User.findAll({
        where: {
          roleId: "R2",
        },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let checkDetailInforDoctor = (inputData) => {
  let arr = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "priceId",
    "paymentId",
    "provinceId",
    "nameClinic",
    "addressClinic",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};
let saveDetailInforDoctor = (inputInforDoctor) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkDetailInforDoctor(inputInforDoctor);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing parameter: ${checkObj.element}`,
        });
      } else {
        if (inputInforDoctor.action === "CREATE") {
          await db.Markdown.create({
            contentMarkdown: inputInforDoctor.contentMarkdown,
            contentHTML: inputInforDoctor.contentHTML,
            description: inputInforDoctor.description,
            doctorId: inputInforDoctor.doctorId,
          });
        } else if (inputInforDoctor.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputInforDoctor.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentMarkdown = inputInforDoctor.contentMarkdown;
            doctorMarkdown.contentHTML = inputInforDoctor.contentHTML;
            doctorMarkdown.description = inputInforDoctor.description;
            doctorMarkdown.doctorId = inputInforDoctor.doctorId;
            await doctorMarkdown.save();
          }
        }

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: inputInforDoctor.doctorId },
          raw: false,
        });
        if (doctorInfor) {
          doctorInfor.priceId = inputInforDoctor.priceId;
          doctorInfor.provinceId = inputInforDoctor.paymentId;
          doctorInfor.paymentId = inputInforDoctor.provinceId;
          doctorInfor.nameClinic = inputInforDoctor.nameClinic;
          doctorInfor.addressClinic = inputInforDoctor.addressClinic;
          doctorInfor.specialtyId = inputInforDoctor.specialtyId;
          doctorInfor.clinicId = inputInforDoctor.clinicId;
          doctorInfor.note = inputInforDoctor.note;
          await doctorInfor.save();
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputInforDoctor.doctorId,
            priceId: inputInforDoctor.priceId,
            provinceId: inputInforDoctor.paymentId,
            paymentId: inputInforDoctor.provinceId,
            nameClinic: inputInforDoctor.nameClinic,
            addressClinic: inputInforDoctor.addressClinic,
            specialtyId: inputInforDoctor.specialtyId,
            clinicId: inputInforDoctor.clinicId,
            note: inputInforDoctor.note,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailDoctorByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter doctorId",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            roleId: "R2",
            id: id,
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password", "email"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required param!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.date },
          attributes: ["timeType", "doctorId", "maxNumber", "date"],
          raw: true,
        });
        //convent date
        if (existing && existing.length > 0) {
          existing = existing.map((item) => {
            item.date = new Date(item.date).getTime();
            return item;
          });
        }

        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });
        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        // console.log("check diffent", toCreate);
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getScheduleByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let day = new Date(+date);
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: day,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getExtraDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueVi", "valueEn"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getProfileDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter doctorId",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId,
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password", "email"],
          },
          include: [
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueVi", "valueEn"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueVi", "valueEn"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueVi", "valueEn"],
            },
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctorService: getAllDoctorService,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorByIdService: getDetailDoctorByIdService,
  bulkCreateScheduleService: bulkCreateScheduleService,
  getScheduleByDateService: getScheduleByDateService,
  getExtraDoctorByIdService: getExtraDoctorByIdService,
  getProfileDoctorByIdService: getProfileDoctorByIdService,
};
