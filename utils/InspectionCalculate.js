const RegistryModel = require('../models/Registry');
const OwnerModel = require('../models/CarOwners');
const CarsModel = require('../models/Cars');
const Generate = require('./Generate');
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.kfyb4jw.mongodb.net/registrytotal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

class InspectionCalculation {
    static async generateRegisNum() {
        let regisNum;
        while (1) {
            regisNum = Generate.getRandomNumericString(4) + Generate.getRandomAlphabetString(1) + "-" + Generate.getRandomNumericString(6);
            let existRegisNum = await RegistryModel.findOne({
                regisNum: regisNum
            }).catch((err) => {
                return null;
            });
            if (!existRegisNum) {
                break;
            }
        }
        return regisNum;
    }

    static generateExpireDate(car) {
        let expired = new Date();
        if (car['type'] === "Xe Tải" || car['type'] === "Xe Đầu Kéo" || car['type'] === "Rơ Moóc") {
            if (2023 - car['manufacturedYear'] >= 20) {
                expired.setMonth(expired.getMonth() + 3);
            } else {
                if (car['type'] == "Xe Tải" || car['type'] == "Xe Đầu Kéo") {
                    if (2023 - car['manufacturedYear'] > 7) {
                        expired.setMonth(expired.getMonth() + 6);
                    } else {
                        expired.setMonth(expired.getMonth() + 12);
                    }
                } else {
                    if (2023 - car['manufacturedYear'] > 12) {
                        expired.setMonth(expired.getMonth() + 6);
                    } else {
                        expired.setMonth(expired.getMonth() + 12);
                    }
                }
            }
        } else {
            if (car['specification']['carriedNo'] >= 10) {
                if (2023 - car['manufacturedYear'] >= 15) {
                    expired.setMonth(expired.getMonth() + 3);
                } else if (2023 - car['manufacturedYear'] > 5) {
                    expired.setMonth(expired.getMonth() + 6);
                } else {
                    expired.setMonth(expired.getMonth() + 12);
                }
            } else if (car['purpose'] == "Kinh doanh") {
                if (2023 - car['manufacturedYear'] > 5) {
                    expired.setMonth(expired.getMonth() + 6);
                } else {
                    expired.setMonth(expired.getMonth() + 12);
                }
            } else {
                if (2023 - car['manufacturedYear'] > 20) {
                    expired.setMonth(expired.getMonth() + 6);
                } else if (2023 - car['manufacturedYear'] > 7) {
                    expired.setMonth(expired.getMonth() + 12);
                } else {
                    expired.setMonth(expired.getMonth() + 24);
                }
            }
        }
        return expired;
    }

    static async insertOwner(owner) {
        let existOwner = await OwnerModel.findOne({
            'data.SSN': owner['data']['SSN']
        }).catch((err) => {
            return null;
        });
        if (!existOwner) {
            existOwner = await OwnerModel.create(owner).catch((err) => {
                return null;
            })
        }
        return existOwner;
    }

    static async insertCar(car) {
        let existCar = await CarsModel.findOne({
            numberPlate: car['numberPlate']
        }).catch((err) => {
            return null;
        })
        if (!existCar) {
            existCar = await CarsModel.create(car).catch((err) => {
                return null;
            })
        }
        return existCar;
    }
}

module.exports = InspectionCalculation;