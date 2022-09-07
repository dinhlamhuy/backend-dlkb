import e from "express";
import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;

  if (!limit) limit = 10;

  try {
    let userData = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(userData);
  } catch (error) {
    console.log("Get all code error: ", error);

    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let allDoctor = await doctorService.getAllDoctorService();
    return res.status(200).json(allDoctor);
  } catch (error) {
    console.log("Get all code error: ", error);

    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    // console.log("as", req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("save post infor doctor error: ", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.id;
    let inforDoctor = await doctorService.getDetailDoctorByIdService(doctorId);
    return res.status(200).json(inforDoctor);
  } catch (error) {
    console.log("save post infor doctor error: ", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let addbulk = await doctorService.bulkCreateScheduleService(req.body);
    return res.status(200).json(addbulk);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getScheduleByDate = async (req, res) => {
  try {
    let addbulk = await doctorService.getScheduleByDateService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(addbulk);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getExtraInforDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let inforDoctor = await doctorService.getExtraDoctorByIdService(doctorId);
    return res.status(200).json(inforDoctor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getProfileDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let inforDoctor = await doctorService.getProfileDoctorByIdService(doctorId);
    return res.status(200).json(inforDoctor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
};
