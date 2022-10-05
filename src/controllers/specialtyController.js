import specialtyService from "../services/specialtyService";
let createSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createSpecialtyService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getAllSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.getAllSpecialtyService();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let id = req.query.id;
    let location = req.query.location;
    if (!id || !location) {
      return res.status(200).json({
        errCode: 3,
        errMessage: "id not found",
      });
    } else {
      let data = await specialtyService.getDetailSpecialtyByIdService(
        id,
        location
      );
      return res.status(200).json(data);
    }
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
let testjwt = async (req, res) => {
  try {
    let data = await specialtyService.testjwtService(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
module.exports = {
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  testjwt: testjwt,
};
