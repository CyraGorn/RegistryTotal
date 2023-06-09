const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var rand = require('random-seed').create();
const fetch = (url) => import('node-fetch').then(({ default: fetch }) => fetch(url));

mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.kfyb4jw.mongodb.net/registrytotal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const CarOwners = require('../models/CarOwners');
const Cars = require('../models/Cars');
const Staff = require('../models/Staff');
const Registry = require('../models/Registry');
const RegistryOffice = require('../models/RegistryOffice');

async function createCollection() {
    CarOwners.createCollection().then(function (collection) {
        console.log('CarOwners is created!');
    });

    Cars.createCollection().then(function (collection) {
        console.log('Cars is created!');
    });

    Staff.createCollection().then(function (collection) {
        console.log('Staff is created!');
    });

    Registry.createCollection().then(function (collection) {
        console.log('Registry is created!');
    });

    RegistryOffice.createCollection().then(function (collection) {
        console.log('RegistryOffice is created!');
    });
}

const getRandomNumber = (min, max) => {
    return rand.intBetween(min, max);
};

const getRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
};

const getRandomAlphabetString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const getRandomNumericString = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

function generateUniqueString(lastDigit, min, max) {
    const timestamp = new Date().getTime().toString().slice(lastDigit);
    const randomNum = getRandomNumber(min, max);
    return String(timestamp) + String(randomNum);
};

async function loadProvince(url) {
    const response = await fetch(url);
    const names = await response.json();
    return names;
}

function createDate(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    var month = String(randomDate.getMonth() + 1).padStart(2, '0'); // January is 0
    var day = String(randomDate.getDate()).padStart(2, '0');
    var year = randomDate.getFullYear();
    var date = month + '/' + day + '/' + year;
    return date;
}

function createPerson() {
    var ho = ["Nguyễn", "Ngô", "Lê", "Trần", "Bùi", "Lý", "Triệu", "Ma", "Lương"];
    var dem = ["Văn", "Thị", "Đức", "Hữu", "Thu", "Ngọc"];
    var ten = ["Linh", "Nam", "Vương", "Minh", "Cường", "Hải", "Hà", "Sơn", "Hoa", "Trung", "Hương", "Chí", "Chi", "Trí", "Thảo"];
    var namel1 = ho.length;
    var namel2 = dem.length;
    var namel3 = ten.length;
    var rand1 = Math.floor(Math.random() * namel1);
    var rand2 = Math.floor(Math.random() * namel2);
    var rand3 = Math.floor(Math.random() * namel3);
    var name = ho[rand1] + " " + dem[rand2] + " " + ten[rand3];
    var dob = createDate("01/01/1950", "12/31/2003");
    var ssn = generateUniqueString(-5, 1000000, 9999999);
    var sdt = "0" + generateUniqueString(-3, 100000, 999999);
    var person = ({
        name: name,
        dateOfBirth: dob,
        SSN: ssn,
        phone: sdt
    });
    return person;
}

function createSpecification() {
    const wheelFormulas = ['4x2', '4x4', '6x4', '6x6'];
    const fuels = ['Xăng', 'Diesel', 'Điện', 'Dầu'];
    const numberOfTires = [4, 6, 8];
    const tireSizes = ["205/55R16", "225/65R17", "235/45R18", "265/70R16", "215/60R16", "225/40R18"];
    var specification = {
        wheelFormula: wheelFormulas[getRandomNumber(0, 3)],
        wheelTread: `${getRandomNumber(1400, 2000)} mm`,
        overallDimension: `${getRandomNumber(3500, 5000)} x ${getRandomNumber(1500, 2200)} x ${getRandomNumber(1200, 1800)} mm`,
        luggageContainer: `${getRandomNumber(1500, 2500)} x ${getRandomNumber(1000, 1500)} x ${getRandomNumber(800, 1200)} mm`,
        wheelBase: `${getRandomNumber(2400, 3200)} mm`,
        kerbMass: `${getRandomNumber(800, 1600)} kg`,
        authorizedPayload: `${getRandomNumber(500, 1000)} kg`,
        authorizedTotalMass: `${getRandomNumber(1500, 3000)} kg`,
        authorizedTowedMass: `${getRandomNumber(1000, 2000)} kg`,
        carriedNo: `${getRandomNumber(4, 7)}`,
        fuel: fuels[getRandomNumber(0, 2)],
        engineDisplacement: `${getRandomNumber(1000, 2000)} cc`,
        maxOutputToRpmRatio: `${getRandomNumber(50, 150)}/${getRandomNumber(4000, 7000)}`,
        numberOfTiresAndTireSize: `${numberOfTires[getRandomNumber(0, 2)]} - ${tireSizes[getRandomNumber(0, 5)]}`
    }
    return specification;
}

function getRandomNumberPlate() {
    const regionCodes = ["19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42"];
    const serialNum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const serialChar = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M"];

    let plateNumber = '';
    let region = regionCodes[getRandomNumber(0, 9)];
    let serichar = serialChar[getRandomNumber(0, 10)];
    let serinum = serialNum[getRandomNumber(0, 5)];
    let order = String(getRandomNumber(10000, 99999));
    order = order.slice(0, 3) + "." + order.slice(3, 5);

    plateNumber = region + serichar + serinum + " - " + order;
    return plateNumber;
}

async function createCars(numberPlate, index) {
    var specification = createSpecification();
    var owner = "123456789123";
    var types = ['Xe Tải', 'SUV', 'Hatchback', 'Sedan', 'Coupe', 'Xe Bán Tải', 'Rơ Moóc', 'Xe Đầu Kéo'];
    var brands = ['Toyota', 'Honda', 'Kia', 'Ford', 'Hyundai', 'Mitsubishi'];
    var countries = ['Japan', 'Korea', 'Thailand', 'China', 'Russia', 'United States', 'Germany'];
    var places = await loadProvince('https://provinces.open-api.vn/api/');
    var purposes = ['Cá nhân', 'Kinh doanh', 'Cơ quan'];

    var type = types[Math.floor(Math.random() * types.length)];
    var mark = brands[Math.floor(Math.random() * brands.length)];
    var modelCode = getRandomString(12);
    var engineNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    var chassisNumber = Math.random().toString(36).substring(2, 15).toUpperCase();
    var manufacturedYear = 2018 - Math.floor(Math.random() * 20);
    var manufacturedCountry = countries[Math.floor(Math.random() * countries.length)];
    var oneCity = places[Math.floor(Math.random() * places.length)];
    var city = oneCity['name'];
    var purpose = purposes[Math.floor(Math.random() * purposes.length)];
    var certDate = createDate(`01/01/${manufacturedYear}`, `12/31/${manufacturedYear}`);
    certDate = new Date(certDate);
    var certNum = getRandomString(6);
    Cars.create({
        numberPlate: numberPlate,
        owner: owner,
        registry: [],
        type: type,
        mark: mark,
        modelCode: modelCode,
        engineNumber: engineNumber,
        chassisNumber: chassisNumber,
        manufacturedCountry: manufacturedCountry,
        manufacturedYear: manufacturedYear,
        specification: specification,
        boughtPlace: city,
        purpose: purpose,
        certificate: {
            certDate: certDate,
            certNum: certNum
        }
    });
}

async function createStaff(index, isAdmin) {
    var data = createPerson();
    var email = "@gmail.com";
    if (isAdmin == 0) {
        email = "staff" + String(index) + email;
    } else {
        email = "admin" + String(index) + email;
    }
    var password = "12345678";
    var workFor = "123456789123";
    Staff.create({
        data: data,
        isAdmin: isAdmin,
        email: email,
        password: password,
        workFor: workFor,
        registed: []
    });
}

function createCarOwners(index) {
    var data = createPerson();
    var email = "user" + String(index) + "@gmail.com";
    CarOwners.create({
        data: data,
        email: email,
    });
}

async function createRegistryOffice(isAdmin, officeNum) {
    var province = await loadProvince('https://provinces.open-api.vn/api/?depth=2');
    var map = {

    };
    for (var i = 0; i < 63; i++) {
        map[province[i]['name']] = 0;
    }
    for (var i = 0; i < officeNum; i++) {
        var name = "";
        var city = "";
        var address = "Quận Nam Từ Liêm - Thành phố Hà Nội";
        if (isAdmin == 1) {
            name = "Cục đăng kiểm Việt Nam";
            city = "Thành phố Hà Nội";
        } else {
            var rand1 = getRandomNumber(0, 62);
            city = province[rand1]['name'];
            map[city]++;
            name = `Trung tâm đăng kiểm số ${map[city]} ${city}`;
            var rand2 = getRandomNumber(0, province[rand1]['districts'].length - 1);
            address = province[rand1]['districts'][rand2]['name'] + " - " + city;
        }
        var hotline = "0" + generateUniqueString(-6, 100, 999);
        var hotmail = `office${i + 1}@gmail.com`;
        if (isAdmin == 1) {
            hotmail = "registrytotal@vr.com.vn";
        }
        var staff = [];
        RegistryOffice.create({
            name: name,
            city: city,
            address: address,
            isAdmin: isAdmin,
            hotline: hotline,
            hotMail: hotmail,
            staff: staff
        });
    }
}

function createRegistry() {
    var regisNum = getRandomNumericString(4) + getRandomAlphabetString(1) + "-" + getRandomNumericString(6);
    var reportNum = regisNum;
    var regisPlace = "123456789123";
    var regisStaff = "123456789123";
    var car = "123456789123";
    var regisDate = createDate("01/01/2021", "05/31/2023");
    regisDate = new Date(regisDate);
    var expiredDate = new Date(regisDate);
    expiredDate.setMonth(regisDate.getMonth() + 18);
    Registry.create({
        regisNum: regisNum,
        regisPlace: regisPlace,
        regisStaff: regisStaff,
        car: car,
        regisDate: regisDate,
        expiredDate: expiredDate
    });
}

async function updateRegistry() {
    var allCar = await Registry.find({}).select("car regisPlace regisDate expiredDate").populate({
        path: "car",
        select: "type manufacturedYear email specification.carriedNo purpose modification"
    });
    for (let i = 0; i < allCar.length; i++) {
        var tmp = allCar[i]['car'];
        if (tmp['type'] === "Xe Tải" || tmp['type'] === "Xe Đầu Kéo" || tmp['type'] === "Rơ Moóc") {
            if (2023 - tmp['manufacturedYear'] >= 20) {
                var regist = allCar[i]['regisDate'];
                regist = new Date(regist);
                var expired = new Date(regist);
                expired.setMonth(regist.getMonth() + 3);
                Registry.findByIdAndUpdate(allCar[i]['_id'], {
                    expiredDate: expired
                }).then((data) => {
                    console.log("ok");
                });
                continue;
            }
            if (tmp['type'] == "Xe Tải" || tmp['type'] == "Xe Đầu Kéo") {
                if (2023 - tmp['manufacturedYear'] > 7) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 6);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 12);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                }
            } else {
                if (2023 - tmp['manufacturedYear'] > 12) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 6);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 12);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                }
            }
        } else {
            if (tmp['specification']['carriedNo'] >= 10) {
                if (2023 - tmp['manufacturedYear'] >= 15) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 3);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else if (2023 - tmp['manufacturedYear'] > 5) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 6);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 12);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                }
            }
            if (tmp['purpose'] == "Kinh doanh") {
                if (2023 - tmp['manufacturedYear'] > 5) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 6);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 12);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                }
            } else {
                if (2023 - tmp['manufacturedYear'] > 20) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 6);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else if (2023 - tmp['manufacturedYear'] > 7) {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 12);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                } else {
                    var regist = allCar[i]['regisDate'];
                    regist = new Date(regist);
                    var expired = new Date(regist);
                    expired.setMonth(regist.getMonth() + 24);
                    Registry.findByIdAndUpdate(allCar[i]['_id'], {
                        expiredDate: expired
                    }).then((data) => {
                        console.log("ok");
                    });
                    continue;
                }
            }
        }
    }
}

async function connect_CarCarOwners(carNum) {
    var carID = await Cars.find({});
    var carOwnerID = await CarOwners.find({});
    for (let i = 0; i < carNum; i++) {
        Cars.updateOne({
            _id: carID[i]
        }, {
            owner: carOwnerID[i]
        }).then(() => {
            console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
    }
}

const ObjectId = require('mongoose').Types.ObjectId;
async function connect_RegistryCarStaff(carNum) {
    var carID = await Cars.find({});
    var registryID = await Registry.find({});
    var staffID = await Staff.find({
        isAdmin: 0
    }).select("_id workFor");
    for (let i = 0; i < registryID.length; i++) {
        let rand = getRandomNumber(0, staffID.length - 1);
        Registry.findByIdAndUpdate(registryID[i]['_id'], {
            regisPlace: new ObjectId(staffID[rand]['workFor']),
            regisStaff: new ObjectId(staffID[rand]['_id']),
            car: carID[i % carNum],
        }).then(() => {
            console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
        Staff.findByIdAndUpdate(staffID[rand]['_id'], {
            $push: {
                registed: registryID[i]['_id']
            }
        }).then(() => {
            console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
        Cars.findByIdAndUpdate(carID[i % carNum]['_id'], {
            $push: {
                registry: registryID[i]
            }
        }).then(() => {
            console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
    }
}

async function connect_RegistryofficeStaff(maxStaffInOneOffice, isAdmin) {
    var registryOfficeID = await RegistryOffice.find({
        isAdmin: isAdmin
    });

    var staffID = await Staff.find({
        isAdmin: isAdmin
    });
    var j = 0;
    for (let i = 0; i < registryOfficeID.length; i++) {
        var count = 0;
        for (; j < staffID.length && count < maxStaffInOneOffice; j++) {
            count++;
            RegistryOffice.updateOne({
                _id: registryOfficeID[i]
            }, {
                $push: {
                    staff: staffID[j]
                }
            }).then(() => {
                console.log("Successfully updated");
            }).catch((err) => {
                console.log(err);
                return;
            });

            Staff.updateOne({
                _id: staffID[j]
            }, {
                workFor: registryOfficeID[i]
            }).then(() => {
                console.log("Successfully updated");
            }).catch((err) => {
                console.log(err);
                return;
            });
        }
    }
}

async function createAll(adminNum, staffNum, registryDepartmentNum, registryOfficeNum, carOwnerNum, carNum, registryNum) {
    for (let i = 0; i < adminNum; i++) {
        createStaff(i, 1);
    }
    for (let i = 0; i < staffNum; i++) {
        createStaff(i, 0);
    }
    createRegistryOffice(1, registryDepartmentNum);
    createRegistryOffice(0, registryOfficeNum);

    for (let i = 1; i <= carOwnerNum; i++) {
        createCarOwners(i);
    }

    const set = new Set();
    for (let i = 0; i < carNum; i++) {
        var numberPlate = getRandomNumberPlate();
        if (set.has(numberPlate)) {
            i--;
            continue;
        }
        set.add(numberPlate);
    }
    const arr = Array.from(set);
    for (let i = 0; i < arr.length; i++) {
        createCars(arr[i], i + 1);
    }

    for (let i = 0; i < registryNum; i++) {
        createRegistry();
    }
}

async function updatecity() {
    let registry = await Registry.find({}).skip(12000).limit(3000).select("_id regisPlace");
    // let office = await RegistryOffice.find({}).select("_id city");
    // console.log(registry[0]);
    // console.log(office[0])
    for (let i = 0; i < registry.length; i++) {
        // console.log(registry['regisPlace'])
        let city = await RegistryOffice.findOne({
            _id: registry[i]['regisPlace']
        }).select("city").catch((err) => {
            console.log(err);
        });
        Registry.updateOne({
            _id: registry[i]
        }, {
            city: city['city']
        }).then((data) => {
            console.log(i);
        }).catch((err) => {
            console.log(err)
        })
    }
}

async function main() {
    // const db = mongoose.connection;
    // db.dropDatabase();

    var adminNum = 50;
    var staffNum = 1200;
    var registryDepartmentNum = 1;
    var registryOfficeNum = 100;
    var carOwnerNum = 5000;
    var carNum = carOwnerNum;
    var registryNum = 15000;

    // await createCollection();
    // await CarOwners.deleteMany({});
    // await Cars.deleteMany({});
    // await Registry.deleteMany({});
    // await RegistryOffice.deleteMany({});
    // await Staff.deleteMany({});
    // await createAll(adminNum, staffNum, registryDepartmentNum, registryOfficeNum, carOwnerNum, carNum, registryNum);

    // connect_CarCarOwners(carNum);
    // connect_RegistryCarStaff(carNum);
    // connect_RegistryofficeStaff(adminNum, 1);
    // connect_RegistryofficeStaff(12, 0);

    // updateRegistry();
    updatecity();
    // const SALT_WORK_FACTOR = 10;
    // const bcrypt = require('bcrypt');
    // async function hashPassword(password) {
    //     const salt = await new Promise((resolve, reject) => {
    //         bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    //             if (err) reject(err)
    //             resolve(salt)
    //         });
    //     });
    //     const hashedPassword = await new Promise((resolve, reject) => {
    //         bcrypt.hash(password, salt, function (err, hash) {
    //             if (err) reject(err)
    //             resolve(hash)
    //         });
    //     });
    //     return hashedPassword;
    // }
    // var staff = await Staff.find({});
    // for (var i = 0; i < staff.length; i++) {
    //     var s = await hashPassword('12345678');
    //     Staff.updateOne({
    //         _id: staff[i]._id
    //     }, {
    //         password: String(s)
    //     }).then(() => {
    //         console.log(`Successfully updated ${i}`);
    //     }).catch((err) => {
    //         console.log(err);
    //         return;
    //     });
    // }
}
main()