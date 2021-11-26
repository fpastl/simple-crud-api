# simple-crud-api
RS school node js task

## Установка
1. клонировать репозиторий
2. перейти в папку репозитория и выполнить  `$npm install`

## Команды
- `$npm run start:dev` - запускает development версию приложения (перезапускает сервер при изменениях в файлах)
- `$npm run start:prod` - запускает production версию приложения (webpack собирает проект и запускает собранную версию)
- `$npm run test` - запускает тесты (3 сценария )

## Работа
1. запустить сервер `$npm run start:dev` или `$npm run start:prod`
2. Отправлять запросы на запущенный сервер (стандартно localhost:3000), по пути `/person`, пример: `localhost:3000/person/`
   -  GET-запрос `/person/`  -  вернёт список всех записей;
   -  GET-запрос `/person/{id}`, при условии, что id соответсвует UUID и существует запись с таким id  -  вернёт найденную запись
   -  POST-запрос `/person`, при условии, что переданы данные  -  добавит новую запись в бд и вернёт её
      >  переданные данные должны соответствовать формату JSON и содержать в себе обязательные поля `"name"`,`"age"`,`"hobbies"`, причём, значением `"hobbies"` должен быть массив; Пример данных: `{"name":"Jon","age":44,"hobbies":["walk"]}`;
   -  PUT-запрос `/person/{id}`, при условии, что id соответсвует UUID, существует запись с таким id и переданы данные  -  изменит запись в бд и вернёт её
      >  переданные данные должны соответствовать формату JSON и содержать в себе обязательные поля `"name"`,`"age"`,`"hobbies"`, причём, значением `"hobbies"` должен быть массив; Пример данных: `{"name":"Jon","age":44,"hobbies":["walk"]}`
   -  DELETE-запрос `/person/{id}`, при условии, что id соответсвует UUID и существует запись с таким id  -  удалит найденную запись и вернёт сообщение об удачном удалении
