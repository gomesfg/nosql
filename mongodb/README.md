## MongoDB

Banco de Dados Não-Relacionais<br/>
Aluno: Felipe Eduardo Gomes

### Iniciar ambiente
```
// Baixar imagem do MongoDB
docker pull mongo
```
```
// Ativar o ambiente pelo docker compose
docker-compose up mongo-server
```
```
// Acessar o cli do mongo
docker exec -it mongodb_mongo-server_1 mongo admin
```
<br/>

### Exercício 1- Aquecendo com os pets

Insira os seguintes registros no MongoDB e em seguida responda as questões abaixo:

```
use petshop
db.pets.insert({name: "Mike", species: "Hamster"})
db.pets.insert({name: "Dolly", species: "Peixe"})
db.pets.insert({name: "Kilha", species: "Gato"})
db.pets.insert({name: "Mike", species: "Cachorro"})
db.pets.insert({name: "Sally", species: "Cachorro"})
db.pets.insert({name: "Chuck", species: "Gato"})
```
<br/>

> 1. Adicione outro Peixe e um Hamster com nome Frodo

```
db.pets.insert({name: "Frodo", species: "Peixe"})
db.pets.insert({name: "Frodo", species: "Hamster"})
```
```
WriteResult({ "nInserted" : 1 })
WriteResult({ "nInserted" : 1 })
```
<br/>

> 2. Faça uma contagem dos pets na coleção

```
db.pets.find().count();
```
```
8
```
<br/>

> 3. Retorne apenas um elemento o método prático possível

```
db.pets.findOne();
```
```
{
        "_id" : ObjectId("5e9e1847703c20aad44c15c6"),
        "name" : "Mike",
        "species" : "Hamster"
}
```
<br/>

> 4. Identifique o ID para o Gato Kilha.

```
db.pets.findOne({name: "Kilha", species: "Gato"}, {"_id":1});
```
```
{ "_id" : ObjectId("5e9e1847703c20aad44c15c8") }
```
<br/>

> 5. Faça uma busca pelo ID e traga o Hamster Mike

```
db.pets.findOne({_id: ObjectId("5e9e1847703c20aad44c15c6")});
```
```
{
        "_id" : ObjectId("5e9e1847703c20aad44c15c6"),
        "name" : "Mike",
        "species" : "Hamster"
}
```
<br/>

> 6. Use o find para trazer todos os Hamsters

```
db.pets.find({species: "Hamster"});
```
```
{ "_id" : ObjectId("5e9e1847703c20aad44c15c6"), "name" : "Mike", "species" : "Hamster" }
{ "_id" : ObjectId("5e9f916d703c20aad44c15cd"), "name" : "Frodo", "species" : "Hamster" }
```
<br/>

> 7. Use o find para listar todos os pets com nome Mike

```
db.pets.find({name: "Mike"});
```
```
{ "_id" : ObjectId("5e9e1847703c20aad44c15c6"), "name" : "Mike", "species" : "Hamster" }
{ "_id" : ObjectId("5e9e1847703c20aad44c15c9"), "name" : "Mike", "species" : "Cachorro" }
```
<br/>

> 8. Liste apenas o documento que é um Cachorro chamado Mike

```
db.pets.findOne({name: "Mike", species: "Cachorro"});
```
```
{
        "_id" : ObjectId("5e9e1847703c20aad44c15c9"),
        "name" : "Mike",
        "species" : "Cachorro"
}
```
<br/>

### Exercício 2 – Mama mia!

Importe o arquivo dos italian-people.js do seguinte endereço: Downloads NoSQL FURB. Em seguida, importe o mesmo com o seguinte comando:

```
mongo italian-people.js
```

Importar arquivo js do volume no docker (executar no cli do mongo)
```
load('/docker-entrypoint-initdb.d/italian-people.js');
```

Analise um pouco a estrutura dos dados e em seguida responda:
<br/>

> 1. Liste/Conte todas as pessoas que tem exatamente 99 anos. Você pode usar um count para indicar a quantidade.

```
db.italians.count({age: 99}); 
```
```
0
```
<br/>

> 2. Identifique quantas pessoas são elegíveis atendimento prioritário (pessoas com mais de 65 anos)

```
db.italians.count({"age" : {"$gte" : 65}})
```
```
1917
```
<br/>

> 3. Identifique todos os jovens (pessoas entre 12 a 18 anos).

```
db.italians.count({"age" : {"$gte" : 12, "$lte" : 18}})
```
```
904
```
<br/>

> 4. Identifique quantas pessoas tem gatos, quantas tem cachorro e quantas não tem nenhum dos dois

```
db.italians.count({"cat" : {$exists:true}});
```
```
6025
```
```
db.italians.count({"dog" : {$exists:true}});
```
```
3933
```
```
db.italians.count({"$and":[{"dog" : {$exists:false}, "cat" : {$exists:false}}]});
```
```
2411
```
<br/>

> 5. Liste/Conte todas as pessoas acima de 60 anos que tenham gato

```
db.italians.count({"$and":[{"age" : {"$gte" : 60}, "cat" : {$exists:true}}]});
```
```
1554
```
<br/>

> 6. Liste/Conte todos os jovens com cachorro

```
db.italians.count({"$and":[{"age" : {"$gte" : 12, "$lte" : 18}, "dog" : {$exists:true}}]});
```
```
364
```
<br/>

> 7. Utilizando o $where, liste todas as pessoas que tem gato e cachorro

```
db.italians.count({$where:"this.dog && this.cat"});
```
```
2369
```
<br/>

> 8. Liste todas as pessoas mais novas que seus respectivos gatos.

```
db.italians.count({$expr : {$lt: ["$age", "$cat.age"]}})
```
```
599
```
<br/>

> 9. Liste as pessoas que tem o mesmo nome que seu bichano (gatou ou cachorro)

```
db.italians.count({$where: "(this.cat && this.cat.name == this.firstname) || (this.dog && this.dog.name == this.firstname)"})
```
```
102
```
<br/>

> 10. Projete apenas o nome e sobrenome das pessoas com tipo de sangue de fator RH negativo

```
db.italians.find({bloodType: {$regex:/\-$/}}, {firstname:1, surname:1, bloodType:1})
```
```
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3454"), "firstname" : "Sonia", "surname" : "Gallo", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3455"), "firstname" : "Mattia", "surname" : "Carbone", "bloodType" : "O-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3457"), "firstname" : "Giorgia", "surname" : "Costa", "bloodType" : "A-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3458"), "firstname" : "Anna", "surname" : "De Angelis", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345a"), "firstname" : "Daniela", "surname" : "Lombardo", "bloodType" : "O-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345c"), "firstname" : "Alessandro", "surname" : "Ferrari", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345d"), "firstname" : "Sergio", "surname" : "Rizzi", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345e"), "firstname" : "Fabrizio", "surname" : "Montanari", "bloodType" : "O-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345f"), "firstname" : "Nicola", "surname" : "Rinaldi", "bloodType" : "O-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3461"), "firstname" : "Stefano", "surname" : "Rossi", "bloodType" : "AB-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3463"), "firstname" : "Serena", "surname" : "Gallo", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3465"), "firstname" : "Stefano", "surname" : "Testa", "bloodType" : "A-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3467"), "firstname" : "Ilaria", "surname" : "Parisi", "bloodType" : "AB-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e346a"), "firstname" : "Roberto", "surname" : "Sanna", "bloodType" : "O-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e346c"), "firstname" : "Giovanni", "surname" : "Vitali", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e346d"), "firstname" : "Claudio", "surname" : "Lombardi", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3471"), "firstname" : "Claudia", "surname" : "Carbone", "bloodType" : "AB-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3477"), "firstname" : "Federico", "surname" : "Ricci", "bloodType" : "B-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e347a"), "firstname" : "Federica", "surname" : "Caruso", "bloodType" : "AB-" }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e347b"), "firstname" : "Ilaria", "surname" : "Testa", "bloodType" : "A-" }
Type "it" for more
```
<br/>

> 11. Projete apenas os animais dos italianos. Devem ser listados os animais com nome e idade. Não mostre o identificador do mongo (ObjectId)

```
db.italians.find({$where: "(this.cat && this.dog)"},{"cat.name":1,"cat.age":1,"dog.name":1,"dog.age":1,_id:0})
```
```
{ "cat" : { "name" : "Massimiliano", "age" : 15 }, "dog" : { "name" : "Luca", "age" : 1 } }
{ "cat" : { "name" : "Elena", "age" : 15 }, "dog" : { "name" : "Antonella", "age" : 0 } }
{ "cat" : { "name" : "Cinzia", "age" : 9 }, "dog" : { "name" : "Daniela", "age" : 17 } }
{ "cat" : { "name" : "Patrizia", "age" : 15 }, "dog" : { "name" : "Claudio", "age" : 11 } }
{ "cat" : { "name" : "Maurizio", "age" : 5 }, "dog" : { "name" : "Alex", "age" : 4 } }
{ "cat" : { "name" : "Giovanni", "age" : 0 }, "dog" : { "name" : "Elisabetta", "age" : 0 } }
{ "cat" : { "name" : "Emanuele", "age" : 17 }, "dog" : { "name" : "Anna", "age" : 14 } }
{ "cat" : { "name" : "Michela", "age" : 11 }, "dog" : { "name" : "Valentina", "age" : 0 } }
{ "cat" : { "name" : "Gianluca", "age" : 17 }, "dog" : { "name" : "Antonella", "age" : 10 } }
{ "cat" : { "name" : "Riccardo", "age" : 2 }, "dog" : { "name" : "Michele", "age" : 9 } }
{ "cat" : { "name" : "Raffaele", "age" : 11 }, "dog" : { "name" : "Mirko", "age" : 0 } }
{ "cat" : { "name" : "Alberto", "age" : 12 }, "dog" : { "name" : "Martina", "age" : 9 } }
{ "cat" : { "name" : "Lorenzo", "age" : 13 }, "dog" : { "name" : "Alessandra", "age" : 6 } }
{ "cat" : { "name" : "Daniele", "age" : 0 }, "dog" : { "name" : "Stefania", "age" : 11 } }
{ "cat" : { "name" : "Raffaele", "age" : 5 }, "dog" : { "name" : "Maurizio", "age" : 9 } }
{ "cat" : { "name" : "Enzo ", "age" : 9 }, "dog" : { "name" : "Paola", "age" : 10 } }
{ "cat" : { "name" : "Eleonora", "age" : 5 }, "dog" : { "name" : "Maria", "age" : 5 } }
{ "cat" : { "name" : "Matteo", "age" : 5 }, "dog" : { "name" : "Antonio", "age" : 13 } }
{ "cat" : { "name" : "Cristina", "age" : 11 }, "dog" : { "name" : "Giovanna", "age" : 2 } }
{ "cat" : { "name" : "Giovanna", "age" : 1 }, "dog" : { "name" : "Pasquale", "age" : 3 } }
Type "it" for more
```
<br/>

> 12. Quais são as 5 pessoas mais velhas com sobrenome Rossi?

```
db.italians.find({surname:"Rossi"}).sort({age:-1}).limit(5)
```
```
{ "_id" : ObjectId("5ea5956f8a24bd0f931e3a18"), "firstname" : "Marco", "surname" : "Rossi", "username" : "user1576", "age" : 79, "email" : "Marco.Rossi@hotmail.com", "bloodType" : "B-", "id_num" : "827011132132", "registerDate" : ISODate("2010-08-01T23:20:25.609Z"), "ticketNumber" : 398, "jobs" : [ "Luteria" ], "favFruits" : [ "Goiaba", "Melancia" ], "movies" : [ { "title" : "O Senhor dos Anéis: As Duas Torres (2002)", "rating" : 0.58 } ], "cat" : { "name" : "Elena", "age" : 7 } }
{ "_id" : ObjectId("5ea595738a24bd0f931e4319"), "firstname" : "Martina", "surname" : "Rossi", "username" : "user3881", "age" : 79, "email" : "Martina.Rossi@live.com", "bloodType" : "A-", "id_num" : "315626715631", "registerDate" : ISODate("2010-04-22T02:11:31.371Z"), "ticketNumber" : 4499, "jobs" : [ "Engenharia de Produção", "Educação Física" ], "favFruits" : [ "Maçã" ], "movies" : [ { "title" : "O Senhor dos Anéis: A Sociedade do Anel (2001)", "rating" : 1.85 }, { "title" : "A Origem (2010)", "rating" : 3.66 } ], "cat" : { "name" : "Gabiele", "age" : 14 } }
{ "_id" : ObjectId("5ea595718a24bd0f931e3f75"), "firstname" : "Simone", "surname" : "Rossi", "username" : "user2949", "age" : 78, "email" : "Simone.Rossi@uol.com.br", "bloodType" : "A-", "id_num" : "164265050727", "registerDate" : ISODate("2014-07-23T19:08:04.762Z"), "ticketNumber" : 9279, "jobs" : [ "Produção Publicitária", "Engenharia da Computação" ], "favFruits" : [ "Banana" ], "movies" : [ { "title" : "A Lista de Schindler (1993)", "rating" : 1.25 }, { "title" : "Os Bons Companheiros (1990)", "rating" : 2.85 }, { "title" : "A Vida é Bela (1997)", "rating" : 3.76 } ] }
{ "_id" : ObjectId("5ea595768a24bd0f931e4a64"), "firstname" : "Cristian", "surname" : "Rossi", "username" : "user5748", "age" : 78, "email" : "Cristian.Rossi@gmail.com", "bloodType" : "AB-", "id_num" : "648844077067", "registerDate" : ISODate("2016-10-05T12:57:32.805Z"), "ticketNumber" : 4650, "jobs" : [ "Geologia" ], "favFruits" : [ "Banana", "Maçã", "Banana" ], "movies" : [ { "title" : "12 Homens e uma Sentença (1957)", "rating" : 1.58 }, { "title" : "Um Sonho de Liberdade (1994)", "rating" : 0.42 }, { "title" : "Matrix (1999)", "rating" : 4.96 }, { "title" : "1917 (2019)", "rating" : 4.96 }, { "title" : "Batman: O Cavaleiro das Trevas (2008)", "rating" : 4 } ] }
{ "_id" : ObjectId("5ea595788a24bd0f931e50e0"), "firstname" : "Anna", "surname" : "Rossi", "username" : "user7408", "age" : 77, "email" : "Anna.Rossi@outlook.com", "bloodType" : "O+", "id_num" : "530425854477", "registerDate" : ISODate("2011-04-09T19:29:56.060Z"), "ticketNumber" : 2087, "jobs" : [ "Medicina", "Gestão Ambiental" ], "favFruits" : [ "Banana", "Tangerina" ], "movies" : [ { "title" : "À Espera de um Milagre (1999)", "rating" : 2.25 } ], "mother" : { "firstname" : "Silvia", "surname" : "Rossi", "age" : 108 }, "cat" : { "name" : "Enrico", "age" : 9 } }
```
<br/>

> 13. Crie um italiano que tenha um leão como animal de estimação. Associe um nome e idade ao bichano

```
db.italians.insert({"firstname":"Felipe Eduardo","surname":"Gomes","age":29,"username":"fegomes","email":"fegomes@furb.br","bloodType":"A+","id_num":"13","registeredDate":new Date(), "ticketNumber" : 1313,"jobs":["Analista de Sistemas"],"favFruits":["Banana","Uva","Abacate"],"movies":[{title:"A espera de um milagre","rating":10},{"title":"Harry Potter","rating":6}],"mother" : { "firstname" : "Ana Cecilia", "surname" : "Reiter", "age" : 55 },"lion":{"name":"Juba","age":13}})
```
```
WriteResult({ "nInserted" : 1 })
```
<br/>

> 14. Infelizmente o Leão comeu o italiano. Remova essa pessoa usando o Id.

```
db.italians.findOne({firstname:"Felipe Eduardo"},{firstname:1,surname:1}) 
```
```
{
        "_id" : ObjectId("5ea63547c7c252ac58cea2e9"),
        "firstname" : "Felipe Eduardo",
        "surname" : "Gomes"
}
```
```
db.italians.deleteOne({_id: ObjectId("5ea63547c7c252ac58cea2e9")})
```
```
{ "acknowledged" : true, "deletedCount" : 1 }
```
<br/>

> 15. Passou um ano. Atualize a idade de todos os italianos e dos bichanos em 1.

```
db.italians.updateMany({}, {$inc:{"age":1}})
{ "acknowledged" : true, "matchedCount" : 10000, "modifiedCount" : 10000 }
```
```
db.italians.updateMany({cat:{$exists:true}}, {$inc:{"cat.age":1}})
{ "acknowledged" : true, "matchedCount" : 6025, "modifiedCount" : 6025 }
```
```
db.italians.updateMany({dog:{$exists:true}}, {$inc:{"dog.age":1}})
{ "acknowledged" : true, "matchedCount" : 3933, "modifiedCount" : 3933 }
```
<br/>

> 16. O Corona Vírus chegou na Itália e misteriosamente atingiu pessoas somente com gatos e de 66 anos. Remova esses italianos.

```
db.italians.deleteMany({age: {$eq:66}, cat:{$exists:true}})
```
```
{ "acknowledged" : true, "deletedCount" : 83 }
```
<br/>

> 17. Utilizando o framework agregate, liste apenas as pessoas com nomes iguais a sua respectiva mãe e que tenha gato ou cachorro.

```
db.italians.aggregate([{$match:{$expr:{$eq:["$firstname","$mother.firstname"]},$or:[{dog:{$exists:true}},{cat:{$exists:true}}]}}])
```
```
{ "_id" : ObjectId("5ea595708a24bd0f931e3cae"), "firstname" : "Cinzia", "surname" : "Ruggiero", "username" : "user2238", "age" : 57, "email" : "Cinzia.Ruggiero@uol.com.br", "bloodType" : "A+", "id_num" : "608050352746", "registerDate" : ISODate("2014-08-13T01:29:58.591Z"), "ticketNumber" : 9219, "jobs" : [ "Linguística", "Gerontologia" ], "favFruits" : [ "Goiaba", "Uva", "Pêssego" ], "movies" : [ { "title" : "Star Wars, Episódio V: O Império Contra-Ataca (1980)", "rating" : 0.21 } ], "mother" : { "firstname" : "Cinzia", "surname" : "Ruggiero", "age" : 88 }, "cat" : { "name" : "Rita", "age" : 9 }, "dog" : { "name" : "Giacomo", "age" : 16 } }
{ "_id" : ObjectId("5ea595718a24bd0f931e3db0"), "firstname" : "Valentina", "surname" : "Leone", "username" : "user2496", "age" : 70, "email" : "Valentina.Leone@live.com", "bloodType" : "AB+", "id_num" : "105525880106", "registerDate" : ISODate("2008-11-05T23:59:10.586Z"), "ticketNumber" : 7262, "jobs" : [ "Educação Física", "Sistemas para Internet" ], "favFruits" : [ "Kiwi" ], "movies" : [ { "title" : "A Lista de Schindler (1993)", "rating" : 2.1 }, { "title" : "Clube da Luta (1999)", "rating" : 1.73 } ], "mother" : { "firstname" : "Valentina", "surname" : "Leone", "age" : 97 }, "father" : { "firstname" : "Davide", "surname" : "Leone", "age" : 87 }, "cat" : { "name" : "Domenico", "age" : 13 } }
{ "_id" : ObjectId("5ea595748a24bd0f931e45cb"), "firstname" : "Massimo", "surname" : "Bianchi", "username" : "user4571", "age" : 71, "email" : "Massimo.Bianchi@outlook.com", "bloodType" : "A+", "id_num" : "271446732842", "registerDate" : ISODate("2018-05-16T04:45:43.412Z"), "ticketNumber" : 5638, "jobs" : [ "Gestão de Segurança Privada", "Matemática" ], "favFruits" : [ "Melancia", "Pêssego" ], "movies" : [ { "title" : "Três Homens em Conflito (1966)", "rating" : 4.98 } ], "mother" : { "firstname" : "Massimo", "surname" : "Bianchi", "age" : 90 }, "cat" : { "name" : "Lorenzo", "age" : 14 } }
{ "_id" : ObjectId("5ea595758a24bd0f931e487b"), "firstname" : "Valeira", "surname" : "Conte", "username" : "user5259", "age" : 11, "email" : "Valeira.Conte@hotmail.com", "bloodType" : "AB+", "id_num" : "716235860615", "registerDate" : ISODate("2012-04-15T18:26:41.906Z"), "ticketNumber" : 3228, "jobs" : [ "Música", "Engenharia Civil" ], "favFruits" : [ "Melancia" ], "movies" : [ { "title" : "Interestelar (2014)", "rating" : 0.32 }, { "title" : "Cidade de Deus (2002)", "rating" : 2.55 }, { "title" : "Seven: Os Sete Crimes Capitais (1995)", "rating" : 4.79 } ], "mother" : { "firstname" : "Valeira", "surname" : "Conte", "age" : 38 }, "dog" : { "name" : "Luigi", "age" : 13 } }
{ "_id" : ObjectId("5ea595788a24bd0f931e4eed"), "firstname" : "Dario", "surname" : "Giuliani", "username" : "user6909", "age" : 52, "email" : "Dario.Giuliani@hotmail.com", "bloodType" : "O-", "id_num" : "637614073628", "registerDate" : ISODate("2010-11-01T00:06:12.464Z"), "ticketNumber" : 6033, "jobs" : [ "Gestão da Qualidade", "Segurança da Informação" ], "favFruits" : [ "Uva", "Melancia", "Tangerina" ], "movies" : [ { "title" : "À Espera de um Milagre (1999)", "rating" : 3.75 }, { "title" : "A Viagem de Chihiro (2001)", "rating" : 4.99 }, { "title" : "A Origem (2010)", "rating" : 0.88 } ], "mother" : { "firstname" : "Dario", "surname" : "Giuliani", "age" : 76 }, "father" : { "firstname" : "Enrico", "surname" : "Giuliani", "age" : 87 }, "cat" : { "name" : "Angela", "age" : 9 }, "dog" : { "name" : "Eleonora", "age" : 18 } }
{ "_id" : ObjectId("5ea5957b8a24bd0f931e5861"), "firstname" : "Giovanna", "surname" : "Vitali", "username" : "user9329", "age" : 50, "email" : "Giovanna.Vitali@uol.com.br", "bloodType" : "A+", "id_num" : "738371105540", "registerDate" : ISODate("2007-09-14T19:17:29.770Z"), "ticketNumber" : 2812, "jobs" : [ "Manutenção de aeronaves", "Ciências Contábeis" ], "favFruits" : [ "Banana", "Goiaba", "Mamão" ], "movies" : [ { "title" : "Coringa (2019)", "rating" : 2.92 }, { "title" : "Um Estranho no Ninho (1975)", "rating" : 1.31 }, { "title" : "Coringa (2019)", "rating" : 2.14 }, { "title" : "Matrix (1999)", "rating" : 3.04 }, { "title" : "12 Homens e uma Sentença (1957)", "rating" : 2.22 } ], "mother" : { "firstname" : "Giovanna", "surname" : "Vitali", "age" : 81 }, "cat" : { "name" : "Ilaria", "age" : 10 } }
```
<br/>

> 18. Utilizando aggregate framework, faça uma lista de nomes única de nomes. Faça isso usando apenas o primeiro nome

```
db.italians.aggregate([{$group:{_id:"$firstname", count:{$sum:1}}}])
```
```
{ "_id" : "Stefania", "count" : 104 }
{ "_id" : "Marco", "count" : 98 }
{ "_id" : "Giorgia", "count" : 101 }
{ "_id" : "Marta", "count" : 83 }
{ "_id" : "Monica", "count" : 100 }
{ "_id" : "Silvia", "count" : 93 }
{ "_id" : "Mattia", "count" : 115 }
{ "_id" : "Massimiliano", "count" : 92 }
{ "_id" : "Alberto", "count" : 96 }
{ "_id" : "Enzo ", "count" : 93 }
{ "_id" : "Maria", "count" : 102 }
{ "_id" : "Serena", "count" : 117 }
{ "_id" : "Carlo", "count" : 88 }
{ "_id" : "Mario", "count" : 118 }
{ "_id" : "Nicola", "count" : 106 }
{ "_id" : "Valeira", "count" : 110 }
{ "_id" : "Gabiele", "count" : 95 }
{ "_id" : "Rita", "count" : 85 }
{ "_id" : "Sonia", "count" : 91 }
{ "_id" : "Giovanni", "count" : 86 }
Type "it" for more
```
<br/>

> 19. Agora faça a mesma lista do item acima, considerando nome completo

```
db.italians.aggregate([{$group:{_id:{"firstname": "$firstname","surname":"$surname"}, count:{$sum:1}}}])
```
```
{ "_id" : { "firstname" : "Mattia", "surname" : "Testa" }, "count" : 2 }
{ "_id" : { "firstname" : "Elena", "surname" : "Vitali" }, "count" : 1 }
{ "_id" : { "firstname" : "Claudio", "surname" : "Caputo" }, "count" : 2 }
{ "_id" : { "firstname" : "Simona", "surname" : "Fiore" }, "count" : 2 }
{ "_id" : { "firstname" : "Simone", "surname" : "Conti" }, "count" : 3 }
{ "_id" : { "firstname" : "Daniela", "surname" : "Cattaneo" }, "count" : 1 }
{ "_id" : { "firstname" : "Michela", "surname" : "Gatti" }, "count" : 3 }
{ "_id" : { "firstname" : "Gianluca", "surname" : "Fabbri" }, "count" : 1 }
{ "_id" : { "firstname" : "Elisabetta", "surname" : "Longo" }, "count" : 1 }
{ "_id" : { "firstname" : "Dario", "surname" : "Ferretti" }, "count" : 3 }
{ "_id" : { "firstname" : "Giovanni", "surname" : "Mancini" }, "count" : 1 }
{ "_id" : { "firstname" : "Paolo", "surname" : "Ferrara" }, "count" : 1 }
{ "_id" : { "firstname" : "Paolo", "surname" : "Messina" }, "count" : 3 }
{ "_id" : { "firstname" : "Roberta", "surname" : "Piras" }, "count" : 2 }
{ "_id" : { "firstname" : "Stefano", "surname" : "Costatini" }, "count" : 1 }
{ "_id" : { "firstname" : "Carlo", "surname" : "Sala" }, "count" : 1 }
{ "_id" : { "firstname" : "Marco", "surname" : "Coppola" }, "count" : 2 }
{ "_id" : { "firstname" : "Alessia", "surname" : "Ferretti" }, "count" : 3 }
{ "_id" : { "firstname" : "Andrea", "surname" : "Battaglia" }, "count" : 2 }
{ "_id" : { "firstname" : "Anna", "surname" : "Ferrari" }, "count" : 4 }
Type "it" for more
```
<br/>

> 20. Procure pessoas que gosta de Banana ou Maçã, tenham cachorro ou gato, mais de 20 e menos de 60 anos.

```
db.italians.find({$and:[{$or:[{favFruits:{$elemMatch:{$in:["Banana","Maçã"]}}}]},{$or:[{cat:{$exists:true}},{dog:{$exists:true}}]},{age:{$gt:20,$lt:60}}]})
```
```
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3458"), "firstname" : "Anna", "surname" : "De Angelis", "username" : "user104", "age" : 34, "email" : "Anna.De Angelis@hotmail.com", "bloodType" : "B-", "id_num" : "311126672120", "registerDate" : ISODate("2017-11-09T10:20:28.951Z"), "ticketNumber" : 5670, "jobs" : [ "Jornalismo" ], "favFruits" : [ "Laranja", "Maçã" ], "movies" : [ { "title" : "Três Homens em Conflito (1966)", "rating" : 3.48 }, { "title" : "Pulp Fiction: Tempo de Violência (1994)", "rating" : 0.52 }, { "title" : "Harakiri (1962)", "rating" : 4.44 }, { "title" : "O Poderoso Chefão II (1974)", "rating" : 3.9 }, { "title" : "A Felicidade Não se Compra (1946)", "rating" : 3.79 } ], "cat" : { "name" : "Federica", "age" : 17 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e345a"), "firstname" : "Daniela", "surname" : "Lombardo", "username" : "user106", "age" : 31, "email" : "Daniela.Lombardo@live.com", "bloodType" : "O-", "id_num" : "871355875461", "registerDate" : ISODate("2011-02-16T08:02:47.109Z"), "ticketNumber" : 1056, "jobs" : [ "Engenharia Civil", "Jogos Digitais" ], "favFruits" : [ "Maçã", "Melancia" ], "movies" : [ { "title" : "Um Estranho no Ninho (1975)", "rating" : 2.26 }, { "title" : "A Felicidade Não se Compra (1946)", "rating" : 3.97 }, { "title" : "Interestelar (2014)", "rating" : 0.97 } ], "cat" : { "name" : "Elena", "age" : 16 }, "dog" : { "name" : "Antonella", "age" : 1 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3461"), "firstname" : "Stefano", "surname" : "Rossi", "username" : "user113", "age" : 39, "email" : "Stefano.Rossi@hotmail.com", "bloodType" : "AB-", "id_num" : "538261341247", "registerDate" : ISODate("2012-03-01T04:58:55.044Z"), "ticketNumber" : 3636, "jobs" : [ "Zootecnia", "Engenharia Bioquímica, de Bioprocessos e Biotecnologia" ], "favFruits" : [ "Goiaba", "Banana" ], "movies" : [ { "title" : "1917 (2019)", "rating" : 1.88 }, { "title" : "1917 (2019)", "rating" : 3.87 }, { "title" : "À Espera de um Milagre (1999)", "rating" : 0.36 } ], "dog" : { "name" : "Elena", "age" : 9 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e346e"), "firstname" : "Lucia", "surname" : "Fabbri", "username" : "user126", "age" : 51, "email" : "Lucia.Fabbri@gmail.com", "bloodType" : "O+", "id_num" : "775523672182", "registerDate" : ISODate("2016-08-09T20:57:21.120Z"), "ticketNumber" : 9722, "jobs" : [ "Manutenção de aeronaves" ], "favFruits" : [ "Kiwi", "Maçã", "Laranja" ], "movies" : [ { "title" : "A Vida é Bela (1997)", "rating" : 2.38 }, { "title" : "Intocáveis (2011)", "rating" : 2.69 } ], "cat" : { "name" : "Giovanni", "age" : 1 }, "dog" : { "name" : "Elisabetta", "age" : 1 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e3483"), "firstname" : "Paola", "surname" : "D’Angelo", "username" : "user147", "age" : 38, "email" : "Paola.D’Angelo@hotmail.com", "bloodType" : "O-", "id_num" : "000716006523", "registerDate" : ISODate("2018-07-18T02:45:59.981Z"), "ticketNumber" : 9027, "jobs" : [ "Ciências Econômicas" ], "favFruits" : [ "Laranja", "Banana" ], "movies" : [ { "title" : "Vingadores: Ultimato (2019)", "rating" : 2.07 }, { "title" : "O Senhor dos Anéis: O Retorno do Rei (2003)", "rating" : 4.75 } ], "father" : { "firstname" : "Fabrizio", "surname" : "D’Angelo", "age" : 70 }, "dog" : { "name" : "Sergio", "age" : 3 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e348b"), "firstname" : "Alberto", "surname" : "Ferraro", "username" : "user155", "age" : 36, "email" : "Alberto.Ferraro@gmail.com", "bloodType" : "O-", "id_num" : "458678034264", "registerDate" : ISODate("2014-07-12T14:14:52.455Z"), "ticketNumber" : 3950, "jobs" : [ "Aquicultura", "Filosofia" ], "favFruits" : [ "Maçã", "Pêssego" ], "movies" : [ { "title" : "A Vida é Bela (1997)", "rating" : 3.16 }, { "title" : "Intocáveis (2011)", "rating" : 3 } ], "mother" : { "firstname" : "Paolo", "surname" : "Ferraro", "age" : 59 }, "father" : { "firstname" : "Riccardo", "surname" : "Ferraro", "age" : 64 }, "dog" : { "name" : "Filipo", "age" : 17 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e348c"), "firstname" : "Valeira", "surname" : "Damico", "username" : "user156", "age" : 28, "email" : "Valeira.Damico@outlook.com", "bloodType" : "AB+", "id_num" : "328541674867", "registerDate" : ISODate("2009-07-28T06:07:21.694Z"), "ticketNumber" : 4999, "jobs" : [ "Segurança Pública" ], "favFruits" : [ "Tangerina", "Pêssego", "Maçã" ], "movies" : [ { "title" : "Intocáveis (2011)", "rating" : 0.67 }, { "title" : "Clube da Luta (1999)", "rating" : 2.28 } ], "cat" : { "name" : "Riccardo", "age" : 3 }, "dog" : { "name" : "Michele", "age" : 10 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e349c"), "firstname" : "Dario", "surname" : "Vitali", "username" : "user172", "age" : 39, "email" : "Dario.Vitali@live.com", "bloodType" : "A-", "id_num" : "481676015427", "registerDate" : ISODate("2017-12-13T23:42:50.487Z"), "ticketNumber" : 9878, "jobs" : [ "Engenharia Aeronáutica" ], "favFruits" : [ "Maçã" ], "movies" : [ { "title" : "A Felicidade Não se Compra (1946)", "rating" : 1.22 }, { "title" : "A Felicidade Não se Compra (1946)", "rating" : 2.12 }, { "title" : "Seven: Os Sete Crimes Capitais (1995)", "rating" : 4.1 } ], "cat" : { "name" : "Matteo", "age" : 6 }, "dog" : { "name" : "Antonio", "age" : 14 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34a2"), "firstname" : "Fabrizio", "surname" : "Galli", "username" : "user178", "age" : 46, "email" : "Fabrizio.Galli@uol.com.br", "bloodType" : "AB+", "id_num" : "313721004412", "registerDate" : ISODate("2017-10-16T17:49:33.566Z"), "ticketNumber" : 6759, "jobs" : [ "Comunicação em Mídias Digitais" ], "favFruits" : [ "Mamão", "Maçã" ], "movies" : [ { "title" : "O Poderoso Chefão II (1974)", "rating" : 4.96 }, { "title" : "Um Estranho no Ninho (1975)", "rating" : 1.92 } ], "dog" : { "name" : "Manuela", "age" : 9 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34a8"), "firstname" : "Giorgia", "surname" : "Marchetti", "username" : "user184", "age" : 29, "email" : "Giorgia.Marchetti@outlook.com", "bloodType" : "A+", "id_num" : "802845108275", "registerDate" : ISODate("2007-03-20T11:26:31.119Z"), "ticketNumber" : 3180, "jobs" : [ "Arqueologia", "Estética e Cosmética" ], "favFruits" : [ "Banana", "Laranja", "Banana" ], "movies" : [ { "title" : "Seven: Os Sete Crimes Capitais (1995)", "rating" : 4.98 }, { "title" : "Os Bons Companheiros (1990)", "rating" : 4.97 } ], "father" : { "firstname" : "Pietro", "surname" : "Marchetti", "age" : 59 }, "cat" : { "name" : "Sonia", "age" : 9 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34ac"), "firstname" : "Sergio", "surname" : "Costa", "username" : "user188", "age" : 32, "email" : "Sergio.Costa@uol.com.br", "bloodType" : "AB+", "id_num" : "826235487873", "registerDate" : ISODate("2014-09-03T14:29:17.091Z"), "ticketNumber" : 5108, "jobs" : [ "Matemática" ], "favFruits" : [ "Banana", "Banana", "Melancia" ], "movies" : [ { "title" : "Um Estranho no Ninho (1975)", "rating" : 2.02 }, { "title" : "O Poderoso Chefão (1972)", "rating" : 2.97 } ], "father" : { "firstname" : "Sonia", "surname" : "Costa", "age" : 65 }, "dog" : { "name" : "Filipo", "age" : 16 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34b0"), "firstname" : "Davide", "surname" : "Ricci", "username" : "user192", "age" : 21, "email" : "Davide.Ricci@uol.com.br", "bloodType" : "A-", "id_num" : "243482372233", "registerDate" : ISODate("2013-05-03T14:41:58.645Z"), "ticketNumber" : 9138, "jobs" : [ "Relações Internacionais" ], "favFruits" : [ "Banana", "Tangerina", "Mamão" ], "movies" : [ { "title" : "A Vida é Bela (1997)", "rating" : 3.84 }, { "title" : "A Viagem de Chihiro (2001)", "rating" : 0.52 }, { "title" : "Vingadores: Ultimato (2019)", "rating" : 2.3 }, { "title" : "O Poderoso Chefão (1972)", "rating" : 1.73 }, { "title" : "Intocáveis (2011)", "rating" : 2.59 } ], "cat" : { "name" : "Patrizia", "age" : 6 }, "dog" : { "name" : "Gabiele", "age" : 8 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34c3"), "firstname" : "Roberta", "surname" : "Ricci", "username" : "user211", "age" : 45, "email" : "Roberta.Ricci@uol.com.br", "bloodType" : "B+", "id_num" : "437203880103", "registerDate" : ISODate("2008-10-18T09:43:04.430Z"), "ticketNumber" : 6775, "jobs" : [ "Sistemas de Telecomunicações" ], "favFruits" : [ "Maçã", "Kiwi" ], "movies" : [ { "title" : "Clube da Luta (1999)", "rating" : 2.59 }, { "title" : "Os Sete Samurais (1954)", "rating" : 0.99 }, { "title" : "Harakiri (1962)", "rating" : 3.24 }, { "title" : "Os Bons Companheiros (1990)", "rating" : 0.81 } ], "cat" : { "name" : "Mario", "age" : 1 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34cc"), "firstname" : "Michela", "surname" : "Gatti", "username" : "user220", "age" : 46, "email" : "Michela.Gatti@uol.com.br", "bloodType" : "O-", "id_num" : "111600821256", "registerDate" : ISODate("2015-11-22T23:01:02.024Z"), "ticketNumber" : 6368, "jobs" : [ "Engenharia de Segurança no Trabalho" ], "favFruits" : [ "Mamão", "Maçã", "Tangerina" ], "movies" : [ { "title" : "Intocáveis (2011)", "rating" : 1.2 }, { "title" : "Cidade de Deus (2002)", "rating" : 0.13 }, { "title" : "Três Homens em Conflito (1966)", "rating" : 1.69 } ], "mother" : { "firstname" : "Elisa", "surname" : "Gatti", "age" : 64 }, "cat" : { "name" : "Serena", "age" : 16 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34d4"), "firstname" : "Eleonora", "surname" : "Serra", "username" : "user228", "age" : 25, "email" : "Eleonora.Serra@outlook.com", "bloodType" : "A-", "id_num" : "477115776671", "registerDate" : ISODate("2007-06-22T22:49:56.571Z"), "ticketNumber" : 4124, "jobs" : [ "Engenharia de Biossistemas", "Tradutor e Intérprete" ], "favFruits" : [ "Maçã" ], "movies" : [ { "title" : "Três Homens em Conflito (1966)", "rating" : 3.48 } ], "cat" : { "name" : "Silvia", "age" : 1 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34ee"), "firstname" : "Veronica", "surname" : "Costa", "username" : "user254", "age" : 48, "email" : "Veronica.Costa@live.com", "bloodType" : "A-", "id_num" : "330733085611", "registerDate" : ISODate("2014-11-25T10:55:20.825Z"), "ticketNumber" : 8286, "jobs" : [ "Comunicação e Informação" ], "favFruits" : [ "Uva", "Banana", "Pêssego" ], "movies" : [ { "title" : "O Senhor dos Anéis: O Retorno do Rei (2003)", "rating" : 3.88 }, { "title" : "O Senhor dos Anéis: A Sociedade do Anel (2001)", "rating" : 2.75 } ], "cat" : { "name" : "Cristian", "age" : 10 }, "dog" : { "name" : "Laura", "age" : 4 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34f1"), "firstname" : "Laura", "surname" : "Piras", "username" : "user257", "age" : 36, "email" : "Laura.Piras@gmail.com", "bloodType" : "AB-", "id_num" : "160645481810", "registerDate" : ISODate("2012-12-16T08:05:00.177Z"), "ticketNumber" : 2805, "jobs" : [ "Energias Renováveis" ], "favFruits" : [ "Uva", "Maçã", "Laranja" ], "movies" : [ { "title" : "Os Bons Companheiros (1990)", "rating" : 0.04 }, { "title" : "A Lista de Schindler (1993)", "rating" : 4.51 }, { "title" : "Cidade de Deus (2002)", "rating" : 2.08 }, { "title" : "À Espera de um Milagre (1999)", "rating" : 0.94 }, { "title" : "Batman: O Cavaleiro das Trevas (2008)", "rating" : 3.76 } ], "cat" : { "name" : "Cinzia", "age" : 14 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34f2"), "firstname" : "Claudia", "surname" : "Rinaldi", "username" : "user258", "age" : 25, "email" : "Claudia.Rinaldi@outlook.com", "bloodType" : "O-", "id_num" : "426125621727", "registerDate" : ISODate("2018-12-09T10:39:04.194Z"), "ticketNumber" : 893, "jobs" : [ "Engenharia de Telecomunicações" ], "favFruits" : [ "Kiwi", "Maçã", "Banana" ], "movies" : [ { "title" : "A Felicidade Não se Compra (1946)", "rating" : 4.06 } ], "cat" : { "name" : "Giorgia", "age" : 17 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34f5"), "firstname" : "Mauro", "surname" : "Marino", "username" : "user261", "age" : 58, "email" : "Mauro.Marino@live.com", "bloodType" : "AB+", "id_num" : "232585616136", "registerDate" : ISODate("2012-09-05T08:45:16.930Z"), "ticketNumber" : 7206, "jobs" : [ "Engenharia Florestal", "Automação Industrial" ], "favFruits" : [ "Banana", "Tangerina" ], "movies" : [ { "title" : "Interestelar (2014)", "rating" : 1.58 }, { "title" : "O Poderoso Chefão II (1974)", "rating" : 1.29 }, { "title" : "O Senhor dos Anéis: A Sociedade do Anel (2001)", "rating" : 0.88 } ], "cat" : { "name" : "Sergio", "age" : 1 }, "dog" : { "name" : "Stefania", "age" : 16 } }
{ "_id" : ObjectId("5ea5956d8a24bd0f931e34fb"), "firstname" : "Maria", "surname" : "D’Angelo", "username" : "user267", "age" : 22, "email" : "Maria.D’Angelo@yahoo.com", "bloodType" : "O+", "id_num" : "006870678355", "registerDate" : ISODate("2016-11-21T14:51:00.674Z"), "ticketNumber" : 7689, "jobs" : [ "Engenharia Civil" ], "favFruits" : [ "Tangerina", "Maçã", "Mamão" ], "movies" : [ { "title" : "Parasita (2019)", "rating" : 3.01 }, { "title" : "O Senhor dos Anéis: O Retorno do Rei (2003)", "rating" : 3.79 } ], "cat" : { "name" : "Sonia", "age" : 2 } }
Type "it" for more
```
<br/>

### Exercício 3 - Stockbrokers

Importe o arquivo stocks.json do repositório Downloads NoSQL FURB. Esses dados são dados reais da bolsa americana de 2015. A importação do arquivo JSON é um pouco diferente da execução de um script:

```
mongoimport --db stocks --collection stocks --file stocks.json
```

Analise um pouco a estrutura dos dados novamente e em seguida, responda as seguintes perguntas:
<br/>

> 1. Liste as ações com profit acima de 0.5 (limite a 10 o resultado)

```
// Não consegui fazer
```
<br/>

> 2. Liste as ações com perdas (limite a 10 novamente)

```
match (p:Person)-[:WROTE]->(:Movie {title: 'Speed Racer'}) return p.name
```
<br/>

> 3. Liste as 10 ações mais rentáveis 

```
match (m:Movie)<--(:Person {name: 'Tom Hanks'}) return m.title
```
<br/>

> 4. Qual foi o setor mais rentável?

```
match (m:Movie)-[rel]-(:Person {name: 'Tom Hanks'}) return m.title, type(rel)
```
<br/>

> 5. Ordene as ações pelo profit e usando um cursor, liste as ações.

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>

> 6. Renomeie o campo “Profit Margin” para apenas “profit”.

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>

> 7. Agora liste apenas a empresa e seu respectivo resultado

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>

> 8. Analise as ações. É uma bola de cristal na sua mão... Quais as três ações você investiria?

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>

> 9. Liste as ações agrupadas por setor

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>

### Exercício 4 - Fraude na Enron!

Um dos casos mais emblemáticos de fraude no mundo é o caso da Enron. A comunicade do MongoDB utiliza muito esse dataset pois o mesmo se tornou público, então vamos importar esse material também:

```
mongoimport --db stocks --collection stocks --file
enron.json
```
<br/>

> 1. Liste as pessoas que enviaram e-mails (de forma distinta, ou seja, sem repetir). Quantas pessoas são?

```
match (a:Person)-[:ACTED_IN]->(m:Movie) where a.name = 'Tom Cruise' return m.title as Filme
```
<br/>

> 2. Contabilize quantos e-mails tem a palavra “fraud”

```
match (a:Person) where a.born >= 1970 and a.born < 1980 return a.name as Nome, a.born as `Data Nascimento`
```
<br/>