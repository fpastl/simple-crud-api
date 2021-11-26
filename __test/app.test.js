const request = require("supertest");
const serv = require("../src/app");
const { NIL} = require('uuid');

describe("Сценарий 1: из примера:", () => {
    const obj = { "name": "obj name", "age": 10, "hobbies": [] };
    const putObj = { "name": "rename obj", "age": 20, "hobbies": ['music'] };
    test("GET-запросом получаем все объекты (ожидается массив)", async () => {
        return await request(serv)
            .get("/person")
            .then(response => {
                expect(response.statusCode).toBe(200);
                startLength = response.body.length;
            });
    });
    test("POST-запросом создается новый объект (ожидается ответ, содержащий свежесозданный объект)", async () => {
        return await request(serv)
            .post("/person/")
            .send(obj)
            .set('Content-Type', 'application/json')
            .then(response => {
                const responseObj = JSON.parse(response.text);
                obj.id = responseObj.id;
                expect(response.statusCode).toBe(201);
                expect(responseObj.name).toMatch(obj.name);
                expect(responseObj.age).toBe(obj.age);
                expect(responseObj.hobbies).toEqual(obj.hobbies);
            });
    });
    test("GET-запросом пытаемся получить созданный объект по его id (ожидается созданный объект)", async () => {
        return await request(serv)
            .get(`/person/${obj.id}`)
            .then(response => {
                const responseObj = JSON.parse(response.text);
                expect(response.statusCode).toBe(200);
                expect(responseObj.name).toMatch(obj.name);
                expect(responseObj.age).toBe(obj.age);
                expect(responseObj.hobbies).toEqual(obj.hobbies);
            });
    });
    test("PUT-запросом пытаемся обновить созданный объект (ожидается ответ, содержащий обновленный объект с тем же id)", async () => {
        return await request(serv)
            .put(`/person/${obj.id}`)
            .send(putObj)
            .set('Content-Type', 'application/json')
            .then(response => {
                const responseObj = JSON.parse(response.text);
                expect(response.statusCode).toBe(200);
                expect(responseObj.id).toMatch(obj.id);
                expect(responseObj.name).toMatch(putObj.name);
                expect(responseObj.age).toBe(putObj.age);
                expect(responseObj.hobbies).toEqual(putObj.hobbies);
            });
    });
    test("DELETE-запросом удаляем созданный объект по id (ожидается подтверждение успешного удаления)", async () => {
        return await request(serv)
            .delete(`/person/${obj.id}`)
            .then(response => {
                expect(response.statusCode).toBe(204);
            });
    });
    test("GET-запросом пытаемся получить созданный объект по его id (ожидается созданный объект)", async () => {
        return await request(serv)
            .get(`/person/${obj.id}`)
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
});

describe('Сценарий 2: с ошибками в запросах', () => {
    const incorrectObj = { "name": "obj name", "age": 10};
    const incorrectPutObj = { "name": "obj name", "hobbies": [] };
    const obj = { "name": "obj name", "age": 10, "hobbies": [] };
    test('GET-запросом по несуществующему пути "/asd" (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .get("/asd")
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test('GET-запросом для некоректного id(не uuid) "/person/1" (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .get("/person/1")
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('POST-запросом без указания обязательного поля в отправляемом объекте: "hobbies" (ожидается: код ответа 400)', async () => {
        return await request(serv)
            .post("/person")
            .send(incorrectObj)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('POST-запросом с правильными данными (ожидается: созданный объект)', async () => {
        return await request(serv)
            .post("/person")
            .send(obj)
            .set('Content-Type', 'application/json')
            .then(response => {
                obj.id = JSON.parse(response.text).id;
                expect(response.statusCode).toBe(201);
            });
    });
    test('PUT-запросом без указания обязательного поля в отправляемом объекте: "age" (ожидается: код ответа 400)', async () => {
        return await request(serv)
            .put(`/person/${obj.id}`)
            .send(incorrectPutObj)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('DELETE-запросом пытаемся удалить несуществующий объект (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .delete(`/person/${NIL}`)
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test('DELETE-запросом удаляем ранее созданный объект (ожидается: код ответа 204)', async () => {
        return await request(serv)
            .delete(`/person/${obj.id}`)
            .then(response => {
                expect(response.statusCode).toBe(204);
            });
    });
});

describe('Сценарий 3: остальные случаи', () => {
    const incorrectObj = { "name": "obj name", "age": 10};
    const incorrectPutObj = { "name": "obj name", "hobbies": [] };
    const obj = { "name": "obj name", "age": 10, "hobbies": [] };
    test('GET-запросом по несуществующему пути "/person/2/2" (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .get("/person/2/2")
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test('PUT-запросом без указания id: "/person" (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .put(`/person`)
            .send(obj)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test(`PUT-запросо c несуществующим id: "/person/${NIL}" (ожидается: код ответа 404)`, async () => {
        return await request(serv)
            .put(`/person/${NIL}`)
            .send(obj)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test(`PUT-запросо c невалидным(не uuid) id: "/person/1" (ожидается: код ответа 400)`, async () => {
        return await request(serv)
            .put(`/person/1`)
            .send(obj)
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('DELETE-запросом без указания id: "/person" (ожидается: код ответа 404)', async () => {
        return await request(serv)
            .delete(`/person`)
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
    test('DELETE-запросомc невалидным(не uuid) id: "/person/1" (ожидается: код ответа 400)', async () => {
        return await request(serv)
            .delete(`/person/1`)
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('DELETE-запросомc невалидным(не uuid) id: "/person/1" (ожидается: код ответа 400)', async () => {
        return await request(serv)
            .delete(`/person/1`)
            .then(response => {
                expect(response.statusCode).toBe(400);
            });
    });
    test('POST-запросом с данными не соответствующими формату JSON (ожидается: код ответа 500)', async () => {
        return await request(serv)
            .post("/person")
            .send("name: name, age: age, hobbies: []")
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(500);
            });
    });
    test('PГЕ-запросом с данными не соответствующими формату JSON (ожидается: код ответа 500)', async () => {
        return await request(serv)
            .put(`/person/${NIL}`)
            .send("name: name, age: age, hobbies: []")
            .set('Content-Type', 'application/json')
            .then(response => {
                expect(response.statusCode).toBe(500);
            });
    });
});