import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import jwtController from "../controllers/jwtController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.geteditCRUD);
  router.post("/put-crud", homeController.putUserCRUD);
  router.get("/delete-crud", homeController.deleteUserCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-users", userController.handleCreateNewUser);
  router.put("/api/edit-users", userController.handleEditUsers);
  router.delete("/api/delete-users", userController.handleDeleteUsers);

  router.get("/api/allcode", userController.getAllCode);

  //doctor
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctor", doctorController.getAllDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  //Thêm thông tin markdown
  router.post("/api/save-infor-doctor", doctorController.postInforDoctor);

  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );
  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );

  // Patient
  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.post("/api/send-remedy", patientController.sendRemedy);
  router.get(
    "/api/get-list-patient-for-doctor",
    patientController.getListPatient
  );

  //API Email
  router.post("/verify-booking", patientController.verifyBooking);
  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );

  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );

  router.get(
    "/api/testjwt",
    jwtController.verifyToken,
    specialtyController.testjwt
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
