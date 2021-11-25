const http = require("http");/**/
const persons = require("./src/models/persons");
let PersonsBD = new persons("./bd.json");
PORT = process.env.PORT || 3000;

http.createServer(
    (request, response) => {
        let paths = request.url.split('/');
        if (paths.length > 3) {
            response.statusCode = 404;
            response.end("Not found");
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
                        const data = JSON.parse(body);
                        
                        let answer = PersonsBD.postPerson(data.name,data.age,data.hobbies);
                        response.statusCode = answer.status;
                        response.statusMessage = answer.message;
                        response.end(answer.message);
                    });
                }
            } else {
                response.statusCode = 404;
                response.end("Page not found ");
            }
        }
    }
).listen(PORT);