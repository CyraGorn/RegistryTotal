const OfficeModel = require('../models/RegistryOffice');
const StaffModel = require('../models/Staff');

class validation {
    static removeAscent(str) {
        if (str === null || str === undefined) return str;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    }

    static isValid(string) {
        var re = /^([a-z]+)((\s{1}[a-z]+){1,})$/g
        return re.test(this.removeAscent(string)) && (string.length <= 20)
    }

    static checkValidName(name) {
        name = name.trim();
        var arr = name.split(" ");
        var kq = "";
        for (var i = 0; i < arr.length; i++) {
            var tmp = arr[i].trim().toLowerCase();
            if (tmp != "") {
                tmp = tmp.substr(0, 1).toUpperCase() + tmp.substr(1);
                kq += tmp + " ";
            }
        }
        kq = kq.trim();
        return [this.isValid(kq), kq];
    }

    static checkValidEmail(email) {
        var re = /(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFF-a-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?\.)+[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9](?:[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9-]*[\u00A0-\uD7FF\uE000-\uFFFFa-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}\])/
        return re.test(email);
    }

    static checkValidDOB(dob) {
        var re = /(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]((?:19|20)\d\d)/
        if (re.test(dob)) {
            var today = new Date();
            dob = new Date(dob);
            var eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            var sixtyYearsAgo = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate());
            if (dob <= eighteenYearsAgo && dob >= sixtyYearsAgo) {
                return true;
            }
        }
        return false;
    }

    static checkValidPhone(phone) {
        var re = /^0\d{9}$/
        if (re.test(phone)) {
            return true;
        }
        return false;
    }

    static checkValidSSN(ssn) {
        var re = /^\d{12}$/
        if (re.test(ssn)) {
            return true;
        }
        return false;
    }

    static async checkValidOffice(isAdmin, workFor) {
        if ((isAdmin === 1 && workFor !== "Cục đăng kiểm Việt Nam")
            || (isAdmin !== 1 && workFor === "Cục đăng kiểm Việt Nam")) {
            return null;
        }
        var office = await OfficeModel.findOne({
            name: workFor
        }).select("name _id").catch((err) => {
            return null;
        });
        if (!office) {
            return null;
        }
        return office;
    }

    static async checkValidStaffID(id) {
        var staff = await StaffModel.findOne({
            _id: id
        }).select("isAdmin").catch((err) => {
            return null;
        });
        if (!staff) {
            return null;
        }
        return staff;
    }
}

module.exports = validation;