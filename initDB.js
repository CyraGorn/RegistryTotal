const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var rand = require('random-seed').create();

// mongoose.connect('mongodb://localhost/registrytotal', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

mongoose.connect('mongodb+srv://baongo:BB8XZsud1EOx4Cjj@registrytotal.kfyb4jw.mongodb.net/registrytotal?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const CarOwners = require('./models/CarOwners');
const Cars = require('./models/Cars');
const Staff = require('./models/Staff');
const Registry = require('./models/Registry');
const RegistryOffice = require('./models/RegistryOffice');

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

function generateUniqueString(lastDigit, min, max) {
    const timestamp = new Date().getTime().toString().slice(lastDigit);
    const randomNum = getRandomNumber(min, max);
    return String(timestamp) + String(randomNum);
};


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
    var ssn = generateUniqueString(-6, 100000, 999999);
    var sdt = "0" + generateUniqueString(-4, 10000, 99999);
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
    const fuels = ['Gasoline', 'Diesel', 'Electric'];
    const numberOfTires = [4, 6, 8];
    const tireSizes = ["205/55R16", "225/65R17", "235/45R18", "265/70R16", "215/60R16", "225/40R18"];
    var specification = {
        wheelFormula: wheelFormulas[getRandomNumber(0, 3)],
        wheelTread: `${getRandomNumber(1400, 2000)} mm`,
        overallDimension: `${getRandomNumber(3500, 5000)} x ${getRandomNumber(1500, 2200)} x ${getRandomNumber(1200, 1800)} mm`,
        containerDimension: `${getRandomNumber(1500, 2500)} x ${getRandomNumber(1000, 1500)} x ${getRandomNumber(800, 1200)} mm`,
        lengthBase: `${getRandomNumber(2400, 3200)} mm`,
        kerbMass: `${getRandomNumber(800, 1600)} kg`,
        authorizedPayload: `${getRandomNumber(500, 1000)} kg`,
        authorizedTotalMass: `${getRandomNumber(1500, 3000)} kg`,
        authorizedTowedMass: `${getRandomNumber(1000, 2000)} kg`,
        permissibleCarry: `${getRandomNumber(4, 7)}`,
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

function createCars(numberPlate, index) {
    var specification = createSpecification();
    var owner = "123456789123";
    var types = ['Xe tải', 'SUV', 'Hatchback', 'Sedan', 'Coupe', 'Xe bán tải', 'Rơ moóc', 'Xe đầu kéo'];
    var brands = ['Toyota', 'Honda', 'Kia', 'Ford', 'Hyundai', 'Mitsubishi'];
    var colors = ['Trắng', 'Đen', 'Bạc', 'Đỏ', 'Xanh lục', 'Xám', 'Xanh lam', 'Tím', 'Vàng', 'Hồng'];
    var countries = ['Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Trung Quốc', 'Nga', 'Hoa Kỳ', 'Đức'];
    var places = ["Thành phố Hà Nội", "Tỉnh Hà Giang", "Tỉnh Cao Bằng", "Tỉnh Bắc Kạn", "Tỉnh Tuyên Quang", "Tỉnh Lào Cai", "Tỉnh Điện Biên", "Tỉnh Lai Châu", "Tỉnh Sơn La", "Tỉnh Yên Bái", "Tỉnh Hoà Bình", "Tỉnh Thái Nguyên", "Tỉnh Lạng Sơn", "Tỉnh Quảng Ninh", "Tỉnh Bắc Giang", "Tỉnh Phú Thọ", "Tỉnh Vĩnh Phúc", "Tỉnh Bắc Ninh", "Tỉnh Hải Dương", "Thành phố Hải Phòng", "Tỉnh Hưng Yên", "Tỉnh Thái Bình", "Tỉnh Hà Nam", "Tỉnh Nam Định", "Tỉnh Ninh Bình", "Tỉnh Thanh Hóa", "Tỉnh Nghệ An", "Tỉnh Hà Tĩnh", "Tỉnh Quảng Bình", "Tỉnh Quảng Trị", "Tỉnh Thừa Thiên Huế", "Thành phố Đà Nẵng", "Tỉnh Quảng Nam", "Tỉnh Quảng Ngãi", "Tỉnh Bình Định", "Tỉnh Phú Yên", "Tỉnh Khánh Hòa", "Tỉnh Ninh Thuận", "Tỉnh Bình Thuận", "Tỉnh Kon Tum", "Tỉnh Gia Lai", "Tỉnh Đắk Lắk", "Tỉnh Đắk Nông", "Tỉnh Lâm Đồng", "Tỉnh Bình Phước", "Tỉnh Tây Ninh", "Tỉnh Bình Dương", "Tỉnh Đồng Nai", "Tỉnh Bà Rịa - Vũng Tàu", "Thành phố Hồ Chí Minh", "Tỉnh Long An", "Tỉnh Tiền Giang", "Tỉnh Bến Tre", "Tỉnh Trà Vinh", "Tỉnh Vĩnh Long", "Tỉnh Đồng Tháp", "Tỉnh An Giang", "Tỉnh Kiên Giang", "Thành phố Cần Thơ", "Tỉnh Hậu Giang", "Tỉnh Sóc Trăng", "Tỉnh Bạc Liêu", "Tỉnh Cà Mau"];
    var purposes = ['Cá nhân', 'Kinh doanh'];

    var type = types[Math.floor(Math.random() * types.length)];
    var brand = brands[Math.floor(Math.random() * brands.length)];
    var modelCode = getRandomString(12);
    var engineNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    var chassisNumber = Math.random().toString(36).substring(2, 15).toUpperCase();
    var color = colors[Math.floor(Math.random() * colors.length)];
    var manufacturedYear = 2018 - Math.floor(Math.random() * 20);
    var manufacturedCountry = countries[Math.floor(Math.random() * countries.length)];
    var boughtPlace = places[Math.floor(Math.random() * places.length)];
    var purpose = purposes[Math.floor(Math.random() * purposes.length)];
    var registry = "123456789123";
    var certDate = createDate(`01/01/${manufacturedYear}`, `12/31/${manufacturedYear}`);
    certDate = new Date(certDate);
    var certNum = getRandomString(6);
    Cars.create({
        numberPlate: numberPlate,
        owner: owner,
        registry: registry,
        type: type,
        brand: brand,
        modelCode: modelCode,
        engineNumber: engineNumber,
        chassisNumber: chassisNumber,
        color: color,
        manufacturedCountry: manufacturedCountry,
        manufacturedYear: manufacturedYear,
        specification: specification,
        boughtPlace: boughtPlace,
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
        workFor: workFor
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

function createRegistryOffice(isAdmin, officeNum) {
    var province = ["Thành phố Hà Nội", "Tỉnh Hà Giang", "Tỉnh Cao Bằng", "Tỉnh Bắc Kạn", "Tỉnh Tuyên Quang", "Tỉnh Lào Cai", "Tỉnh Điện Biên", "Tỉnh Lai Châu", "Tỉnh Sơn La", "Tỉnh Yên Bái", "Tỉnh Hoà Bình", "Tỉnh Thái Nguyên", "Tỉnh Lạng Sơn", "Tỉnh Quảng Ninh", "Tỉnh Bắc Giang", "Tỉnh Phú Thọ", "Tỉnh Vĩnh Phúc", "Tỉnh Bắc Ninh", "Tỉnh Hải Dương", "Thành phố Hải Phòng", "Tỉnh Hưng Yên", "Tỉnh Thái Bình", "Tỉnh Hà Nam", "Tỉnh Nam Định", "Tỉnh Ninh Bình", "Tỉnh Thanh Hóa", "Tỉnh Nghệ An", "Tỉnh Hà Tĩnh", "Tỉnh Quảng Bình", "Tỉnh Quảng Trị", "Tỉnh Thừa Thiên Huế", "Thành phố Đà Nẵng", "Tỉnh Quảng Nam", "Tỉnh Quảng Ngãi", "Tỉnh Bình Định", "Tỉnh Phú Yên", "Tỉnh Khánh Hòa", "Tỉnh Ninh Thuận", "Tỉnh Bình Thuận", "Tỉnh Kon Tum", "Tỉnh Gia Lai", "Tỉnh Đắk Lắk", "Tỉnh Đắk Nông", "Tỉnh Lâm Đồng", "Tỉnh Bình Phước", "Tỉnh Tây Ninh", "Tỉnh Bình Dương", "Tỉnh Đồng Nai", "Tỉnh Bà Rịa - Vũng Tàu", "Thành phố Hồ Chí Minh", "Tỉnh Long An", "Tỉnh Tiền Giang", "Tỉnh Bến Tre", "Tỉnh Trà Vinh", "Tỉnh Vĩnh Long", "Tỉnh Đồng Tháp", "Tỉnh An Giang", "Tỉnh Kiên Giang", "Thành phố Cần Thơ", "Tỉnh Hậu Giang", "Tỉnh Sóc Trăng", "Tỉnh Bạc Liêu", "Tỉnh Cà Mau"];
    var map = {

    };
    for (var i = 0; i < 63; i++) {
        map[province[i]] = 0;
    }
    for (var i = 0; i < officeNum; i++) {
        var name = "";
        var address = "Thành phố Hà Nội";
        if (isAdmin == 1) {
            name = "Cục đăng kiểm Việt Nam";
        } else {
            address = province[getRandomNumber(0, 62)];
            map[address]++;
            name = `Trung tâm đăng kiểm số ${map[address]} ${address}`;
        }
        var hotline = "0" + generateUniqueString(-6, 100, 999);
        var hotmail = `randomemail${i + 1}@gmail.com`;
        if (isAdmin == 1) {
            hotmail = "registrytotal@vr.com.vn";
        }
        var staff = [];
        RegistryOffice.create({
            name: name,
            address: address,
            isAdmin: isAdmin,
            hotline: hotline,
            hotMail: hotmail,
            staff: staff
        });
    }
}

function createRegistry() {
    var regisNum = getRandomString(10);
    var regisPlace = "123456789123";
    var regisStaff = "123456789123";
    var car = "123456789123";
    var regisDate = createDate("01/01/2022", "05/12/2023");
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
        select: "type manufacturedYear email specification.permissibleCarry purpose"
    });
    for (let i = 0; i < allCar.length; i++) {
        var tmp = allCar[i]['car'];
        if (tmp['type'] == "Xe tải" || tmp['type'] == "Xe đầu kéo" || tmp['type'] == "Rơ moóc") {
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
            if (tmp['type'] == "Xe tải" || tmp['type'] == "Xe đầu kéo") {
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
            if (tmp['specification']['permissibleCarry'] >= 10) {
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
            if (tmp['purpose'] == "business") {
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
            // console.log("Successfully updated");
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
    for (let i = 0; i < carNum; i++) {
        let rand = getRandomNumber(0, staffID.length - 1);
        Registry.findByIdAndUpdate(registryID[i]['_id'], {
            regisPlace: new ObjectId(staffID[rand]['workFor']),
            regisStaff: new ObjectId(staffID[rand]['_id']),
            car: carID[i],
        }).then(() => {
            // console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
        Cars.findByIdAndUpdate(carID[i]['_id'], {
            registry: registryID[i]
        }).then(() => {
            // console.log("Successfully updated");
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
                // console.log("Successfully updated");
            }).catch((err) => {
                console.log(err);
                return;
            });

            Staff.updateOne({
                _id: staffID[j]
            }, {
                workFor: registryOfficeID[i]
            }).then(() => {
                // console.log("Successfully updated");
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

async function main() {
    // const db = mongoose.connection;
    // db.dropDatabase();

    var adminNum = 50;
    var staffNum = 1200;
    var registryDepartmentNum = 1;
    var registryOfficeNum = 100;
    var carOwnerNum = 5000;
    var carNum = carOwnerNum;
    var registryNum = carNum;

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