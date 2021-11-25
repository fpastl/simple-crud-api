const fs = require("fs");
const { v4: uuidv4, validate } = require('uuid');

module.exports = class Persons {

    notFoundID = { message: "not found data with this id", status: 404 };
    notPassedValue = (field) => { return { status: 400, message: `field "${field}" not passed` } };
    invalidValue = (field) => { return { status: 400, message: `invalid ${field}` } };


    constructor(bdFile) {
        this.bdFile = bdFile ?? "./bd.json";
        if (!fs.existsSync(this.bdFile)) {
            fs.writeFileSync(this.bdFile, "[]");
        }
        this.data = JSON.parse(fs.readFileSync(this.bdFile, "utf8"));
    }

    getPerson = (id = false) => {
        if (id) {
            if (validate(id)) {
                let foundData = this.data.find((el) => el["id"] == id);
                if (foundData) return { data: foundData, status: 200 };
                else return this.notFoundID;
            }
            return this.invalidValue("id");
        }
        return { data: this.data, status: 200 };
    }
    checkIncorrect = (name, age, hobbies) => {
        if (name === undefined) return this.notPassedValue("name");
        if (age === undefined) return this.notPassedValue("age");
        if (hobbies === undefined) return this.notPassedValue("hobbies");
        if (!Array.isArray(hobbies)) return { status: 400, message: "hobbies should be an array" };
        return false;
    }

    postPerson = (name, age, hobbies) => {
        const notCorrect = this.checkIncorrect(name, age, hobbies);
        if (notCorrect) return notCorrect;

        const personID = uuidv4();
        this.data.push({
            "id": personID,
            "name": name,
            "age": age,
            "hobbies": hobbies,
        });
        this.updateBDFile();
        return { status: 201, data: this.data[this.data.length - 1]};
    }
    putPerson = (id, name, age, hobbies) => {
        if (validate(id)) {
            const notCorrect = this.checkIncorrect(name, age, hobbies);
            if (notCorrect) return notCorrect;
            let foundIndex = this.data.findIndex((el) => el["id"] == id);
            if (foundIndex>=0) {
                this.data[foundIndex].name = name;
                this.data[foundIndex].age = age;
                this.data[foundIndex].hobbies = hobbies;
                this.updateBDFile();
                return { status: 200,  data: this.data[foundIndex] };
            }
            else return  this.notFoundID;;

        }
        return this.invalidValue("id");
    }
    deletePerson = (id) =>{
        if (validate(id)) {
            let foundIndex = this.data.findIndex((el) => el["id"] == id);
            if (foundIndex>=0) {
                console.log(foundIndex);
                this.data.splice(foundIndex,1);
                this.updateBDFile();
                return { message: `success, delete person with id: "${id}"`, status: 204 };
            }
            else return  this.notFoundID;;
        }
        return this.invalidValue("id");
    }

    updateBDFile = ()=>{
        fs.writeFileSync(this.bdFile, JSON.stringify(this.data));
    }
}