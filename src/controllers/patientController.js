import patientService from "../services/patientService";
let postBookAppointment = async (req, res) => {
  try {
    let patient = await patientService.postBookAppointment(req.body);
    return res.status(200).json(patient);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let verifyBooking = async (req, res) => {
  try {
    let verify = await patientService.verifyBookingService(req.body);
    return res.status(200).json(verify);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getListPatient = async (req, res) => {
  try {
    let list = await patientService.getListPatientService(
      req.query.doctorId,
      req.query.date
    );

    return res.status(200).json(list);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let sendRemedy = async (req, res) => {
  try {
    let haha = await patientService.sendRemedyService(req.body);

    return res.status(200).json(haha);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  postBookAppointment: postBookAppointment,
  verifyBooking: verifyBooking,
  getListPatient: getListPatient,
  sendRemedy: sendRemedy,
};
