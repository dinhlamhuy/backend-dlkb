const db = require("../models");

let createClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          descriptionMarkdown: data.descriptionMarkdown,
          descriptionHTML: data.descriptionHTML,
          image: data.imageBase64,
        });
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

let getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailClinicByIdService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      data = await db.Clinic.findOne({
        where: {
          id: id,
        },
        attributes: [
          "name",
          "address",
          "descriptionHTML",
          "descriptionMarkdown",
        ],
      });
      if (data) {
        let doctorClinic = [];

        doctorClinic = await db.Doctor_Infor.findAll({
          where: { clinicId: id },
          attributes: ["doctorId"],
        });

        data.doctorClinic = doctorClinic;
      } else {
        data = {};
      }
      resolve({
        errCode: 0,
        errMessage: "OK",
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createClinicService: createClinicService,
  getAllClinicService: getAllClinicService,
  getDetailClinicByIdService: getDetailClinicByIdService,
};
