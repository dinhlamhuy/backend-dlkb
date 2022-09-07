import bcrypt from 'bcryptjs';
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phoneNumber: data.phoneNumber,
            });
            resolve('OK create a new user success!');
        } catch (error) {
            reject(error);
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);

        } catch (error) {
            reject(error);
        }
    })
}

let getALLUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let AllUser = await db.User.findAll({
                raw: true
            });
            resolve(AllUser);
        } catch (error) {
            reject(error);
        }
    })
}

let editUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let AllUser = await db.User.findAll({
                raw: true
            });
            resolve(AllUser);
        } catch (error) {
            reject(error);
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId
                }
            });
            if (user) {

                resolve(user);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);

        }
    })
}

let updateUserById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data.id
                }
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                await user.save();

                let AllUser = await db.User.findAll();
                resolve(AllUser);
            } else {
                resolve('Cant update');
            }

        } catch (error) {
            reject(error);

        }
    })
}
let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data.id
                }
            });
            if (user) {
                await user.destroy();

            }
            resolve()
        } catch (error) {
            reject(error);

        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getALLUser: getALLUser,
    getUserInfoById: getUserInfoById,
    updateUserById: updateUserById,
    deleteUser: deleteUser,
}