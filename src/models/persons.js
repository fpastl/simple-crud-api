const fs = require("fs");
const { v4: uuidv4, validate } = require('uuid');

module.exports = class Persons {
    constructor(bdFile) {
        this.bdFile = bdFile ?? "./bd.json";
        if (!fs.existsSync( this.bdFile)) {
            fs.writeFileSync( this.bdFile, "[]");
        }
        this.data = JSON.parse(fs.readFileSync( this.bdFile, "utf8"));
    }
    getPerson = (id = false) => {
        if (id) {
            if (validate(id)) {
                let foundData = this.data.find((el) => el["id"] == id);
                if (foundData) return { data: foundData, status: 200 };
                else return { message: "not found data with this id", status: 404 };
            }
            return { message: "invalid id", status: 400 };
        }
        return { data: this.data, status: 200 };
    }
    postPerson = (name, age, hobbies) => {

        if (name === undefined) return { status: 400, message: "name value not passed" };
        if (age === undefined) return { status: 400, message: "age value not passed" };
        if (hobbies === undefined) return { status: 400, message: "hobbies value not passed" };
        if (!Array.isArray(hobbies)) return { status: 404, message: "hobbies should be an array" };
        
        const personID = uuidv4();
        this.data.push({
            "id": personID,
            "name": name,
            "age": age,
            "hobbies": hobbies,
        });
        fs.writeFileSync( this.bdFile, JSON.stringify(this.data));
        return { status: 200, message: `success, id of new post : "${personID}"` };
    }
}