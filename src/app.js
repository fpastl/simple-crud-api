const http = require("http");
const persons = require("./models/persons");
let PersonsBD = new persons("./bd.json");
const notJSON = "data does not match format JSON";
const pageNotFound = "page not found, use only /person or /person/{id}";
const notAssignedID =  'not assigned id: "../person/{id}"';


module.exports = http.createServer(
    (request, response) => {
        let paths = request.url.split('/');
        if (paths.length > 3) {
            response.statusCode = 404;
            response.statusMessage = pageNotFound;
            response.end(pageNotFound);
        } else {
            if (paths[1] == "person") {
                if (request.method == "GET") {
                    let answer = PersonsBD.getPerson(paths[2]);
                    response.statusCode = answer.status;
                    if (response.statusCode === 200) {
                        response.setHeader('Content-Type', 'application/json');
                        response.end(JSON.stringify(answer.data));
                    } else {
                        response.statusMessage = answer.message;
                        response.end(answer.message);
                    }
                } else if (request.method == "POST") {
                    let body = '';
                    request.on('data', chunk => {
                        body += chunk.toString();
                    });
                    request.on('end', () => {
                        let data;
                        try {
                            data = JSON.parse(body);
                        } catch (e) {
                            response.statusCode = 500;
                            response.statusMessage = notJSON;
                        } if (response.statusCode == 500) {
                            console.log(response.statusCode);
                            response.end(response.statusMessage);
                        } else {
                            let answer = PersonsBD.postPerson(data.name, data.age, data.hobbies);
                            response.statusCode = answer.status;
                            if (response.statusCode == 201) {
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify(answer.data));
                            }
                            response.statusMessage = answer.message;
                            response.end(answer.message);
                        }
                    });
                } else if (request.method == "PUT") {
                    if (paths[2]) {
                        let body = '';
                        request.on('data', chunk => {
                            body += chunk.toString();
                        });
                        request.on('end', () => {
                            let data;
                            try {
                                data = JSON.parse(body);
                            } catch {
                                response.statusCode = 500;
                                response.statusMessage = notJSON;
                            } if (response.statusCode == 500) {
                                console.log(response.statusCode);
                                response.end(response.statusMessage);
                            } else {
                                let answer = PersonsBD.putPerson(paths[2], data.name, data.age, data.hobbies);
                                response.statusCode = answer.status;
                                if (response.statusCode == 200) {
                                    response.setHeader('Content-Type', 'application/json');
                                    response.end(JSON.stringify(answer.data));
                                }
                                response.statusMessage = answer.message;
                                response.end(answer.message);
                            }
                        });
                    } else {
                        response.statusCode = 404;
                        response.statusMessage =notAssignedID;
                        response.end(notAssignedID);
                    }
                } else if (request.method == "DELETE") {
                    if (paths[2]) {
                        let answer = PersonsBD.deletePerson(paths[2]);
                        response.statusCode = answer.status;
                        response.statusMessage = answer.message;
                        response.end(answer.message);
                    } else {
                        response.statusCode = 404;
                        response.statusMessage = notAssignedID;
                        response.end(notAssignedID);
                    }
                } else {
                    response.statusCode = 501;
                    response.statusMessage = "Method not implemented, use only GET,POST,PUT,DELETE";
                    response.end("Method not implemented, use only GET,POST,PUT,DELETE");
                }
            } else {
                response.statusCode = 404;
                response.statusMessage = pageNotFound;
                response.end(pageNotFound);
            }
        }
    }
);