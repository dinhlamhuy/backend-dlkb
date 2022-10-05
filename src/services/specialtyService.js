const db = require("../models");
const jwt = require("jsonwebtoken");

let createSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.nameVi ||
        !data.nameEn ||
        !data.imageBase64 ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        await db.Specialty.create({
          nameVi: data.nameVi,
          nameEn: data.nameEn,
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

let getAllSpecialtyService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll({});
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
let getDetailSpecialtyByIdService = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = {};
      data = await db.Specialty.findOne({
        where: {
          id: id,
        },
        attributes: [
          "nameVi",
          "nameEn",
          "descriptionHTML",
          "descriptionMarkdown",
        ],
      });
      if (data) {
        let doctorSpecialty = [];
        if (location === "ALL") {
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: { specialtyId: id },
            attributes: ["doctorId", "provinceId"],
          });
        } else {
          doctorSpecialty = await db.Doctor_Infor.findAll({
            where: { specialtyId: id, provinceId: location },
            attributes: ["doctorId", "provinceId"],
          });
        }
        data.doctorSpecialty = doctorSpecialty;
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
let testjwtService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findAll();

      const acsessToken = jwt.sign({ user:user.id }, "mySecretKey");

      resolve({
        errCode: 0,
        errMessage: "OK",
        data: acsessToken,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createSpecialtyService: createSpecialtyService,
  getAllSpecialtyService: getAllSpecialtyService,
  getDetailSpecialtyByIdService: getDetailSpecialtyByIdService,
  testjwtService: testjwtService,
};
