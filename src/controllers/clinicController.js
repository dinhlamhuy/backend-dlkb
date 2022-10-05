import clinicService from "../services/clinicService";
let createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinicService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinicService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let id = req.query.id;

    if (!id) {
      return res.status(200).json({
        errCode: 3,
        errMessage: "id not found",
      });
    } else {
      let data = await clinicService.getDetailClinicByIdService(id);
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
};
