import db from "../models/index";
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        console.log(data);
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send('Post cerud from server');
}

let displayGetCRUD = async (req, res) => {
    let user = await CRUDService.getALLUser();
    return res.render('display.ejs', {
        user: user
    });
}

let geteditCRUD = async (req, res) => {

    let UserId = req.query.id;
    if (UserId) {
        let user = await CRUDService.getUserInfoById(UserId);
        return res.render('editcrud.ejs', {
            user: user
        });
    } else {
        return res.send('No ID User, so You should find ID user ');
    }
}

let putUserCRUD = async (req, res) => {
    let user = await CRUDService.updateUserById(req.body);
    return res.render('display.ejs', {
        user: user
    });
}
let deleteUserCRUD = async (req, res) => {
    let UserId = req.query.id;
    if (UserId) {
        let user = await CRUDService.deleteUser(UserId);
        return res.render('display.ejs', {
            user: user
        });
    } else {
        return res.send('No ID User, so You should find ID user ');
    }
}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    geteditCRUD: geteditCRUD,
    putUserCRUD: putUserCRUD,
    deleteUserCRUD: deleteUserCRUD,
}