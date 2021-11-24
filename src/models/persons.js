const fs = require("fs");
const { v4: uuidv4, validate } = require('uuid');

class Persons {
    constructor() {
        this.data = JSON.parse(fs.readFileSync('../bd.json', "utf8"));
    }
    getPerson = (id = false) => {
        if (id) {
            if (validate(id)) {
                let foundData = this.data.find((el, index, arr) => el["id"] == id);
                if (foundData) return { "data": foundData, "status": 200 };
                else return { "message": "запись с таким id не найдена", "status": 404 };
            }
            return { "message": "id не валиден", "status": 400 };
        }
        return { "data": this.data, "status": 200 };
    }
    postPerson = (name, age, hobbies) => {
        if (+age >= 0 && +age <= 200 && typeof name === "string" && name.length > 3 && name.length < 100 && Array.isArray(hobbies)) {
            this.data.push({
                "id": uuidv4(),
                "name": name,
                "age": age,
                "hobbies": hobbies,
            });
            fs.writeFileSync('../bd.json', JSON.stringify(this.data));
            return { status: 200 };
        }
    }
}