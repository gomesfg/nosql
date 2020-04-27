## HBASE

Banco de Dados Não-Relacionais<br/>
Aluno: Felipe Eduardo Gomes

### Iniciar ambiente
Baixar imagem do HBASE
```
docker pull dajobe/hbase
```
Ativar o ambiente pelo docker compose
```
docker-compose up hbase-server
```
Acessar o shell do hbase
```
docker-compose exec hbase-server hbase shell
```
<br/>

### Aquecendo com alguns dados

1) Crie a tabela com 2 famílias de colunas:
a. personal-data
b. professional-data

```
create_namespace 'italians'
Took 0.8345 seconds
```
```
create 'italians','personal-data','professional-data'
Created table italians
Took 0.8239 seconds
=> Hbase::Table - italians
```

2) Importe o arquivo via linha de comando
```
docker-compose exec hbase-server hbase shell /hbase-seed/italians.txt
Took 0.6745 seconds
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

Importe o arquivo dos italian-people.js do seguinte endereço: Downloads NoSQL FURB. 
Para importar o arquivo <i>italian-people.js</i> do volume, deve ser executado o script abaixo no cli do mongo
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

Importe o arquivo stocks.json do repositório Downloads NoSQL FURB. Esses dados são dados reais da bolsa americana de 2015. 
Para importar o arquivo <i>stocks.json</i> do volume, deve ser executado o script abaixo no shell do mongo
```
docker exec -it mongodb_mongo-server_1 //bin//sh
```
```
mongoimport --db stock --collection stock --file /docker-entrypoint-initdb.d/stock.json
```
```
2020-04-27T02:17:46.503+0000    connected to: mongodb://localhost/
2020-04-27T02:17:47.591+0000    6756 document(s) imported successfully. 0 document(s) failed to import.
```

Analise um pouco a estrutura dos dados novamente e em seguida, responda as seguintes perguntas:
<br/>

> 1. Liste as ações com profit acima de 0.5 (limite a 10 o resultado)

```
db.stock.find({"Profit Margin":{$gt:0.5}}).limit(10)
```
```
{ "_id" : ObjectId("52853800bb1177ca391c180f"), "Ticker" : "AB", "Profit Margin" : 0.896, "Institutional Ownership" : 0.368, "EPS growth past 5 years" : -0.348, "Total Debt/Equity" : 0, "Return on Assets" : 0.086, "Sector" : "Financial", "P/S" : 13.25, "Change from Open" : 0.0047, "Performance (YTD)" : 0.3227, "Performance (Week)" : -0.0302, "Insider Transactions" : 0.5973, "P/B" : 1.4, "EPS growth quarter over quarter" : 2.391, "Payout Ratio" : 1.75, "Performance (Quarter)" : 0.0929, "Forward P/E" : 12.58, "P/E" : 15.82, "200-Day Simple Moving Average" : 0.0159, "Shares Outstanding" : 92.26, "Earnings Date" : ISODate("2013-10-24T12:30:00Z"), "52-Week High" : -0.1859, "Change" : -0.0009, "Analyst Recom" : 3, "Volatility (Week)" : 0.0264, "Country" : "USA", "Return on Equity" : 0.087, "50-Day Low" : 0.123, "Price" : 21.5, "50-Day High" : -0.0574, "Return on Investment" : 0.033, "Shares Float" : 86.66, "Dividend Yield" : 0.0743, "EPS growth next 5 years" : 0.08, "Industry" : "Asset Management", "Beta" : 1.63, "Operating Margin" : 1, "EPS (ttm)" : 1.36, "PEG" : 1.98, "Float Short" : 0.0253, "52-Week Low" : 0.4687, "Average True Range" : 0.59, "EPS growth next year" : 0.0654, "Sales growth past 5 years" : -0.298, "Company" : "AllianceBernstein Holding L.P.", "Gap" : -0.0056, "Relative Volume" : 0.63, "Volatility (Month)" : 0.0298, "Market Cap" : 1985.39, "Volume" : 199677, "Short Ratio" : 6.3, "Performance (Half Year)" : -0.1159, "Relative Strength Index (14)" : 50.05, "Insider Ownership" : 0.002, "20-Day Simple Moving Average" : -0.007, "Performance (Month)" : 0.0847, "P/Free Cash Flow" : 93.21, "Institutional Transactions" : 0.0818, "Performance (Year)" : 0.3884, "LT Debt/Equity" : 0, "Average Volume" : 348.08, "EPS growth this year" : 1.567, "50-Day Simple Moving Average" : 0.0458 }
{ "_id" : ObjectId("52853801bb1177ca391c1895"), "Ticker" : "AGNC", "Profit Margin" : 0.972, "Institutional Ownership" : 0.481, "EPS growth past 5 years" : -0.0107, "Total Debt/Equity" : 8.56, "Return on Assets" : 0.022, "Sector" : "Financial", "P/S" : 3.77, "Change from Open" : 0.0102, "Performance (YTD)" : -0.1652, "Performance (Week)" : -0.017, "Insider Transactions" : 0.4931, "P/B" : 0.86, "EPS growth quarter over quarter" : -8.2, "Payout Ratio" : 0.79, "Performance (Quarter)" : -0.0083, "Forward P/E" : 7.64, "P/E" : 3.68, "200-Day Simple Moving Average" : -0.1282, "Shares Outstanding" : 390.6, "Earnings Date" : ISODate("2013-10-28T20:30:00Z"), "52-Week High" : -0.2938, "P/Cash" : 3.93, "Change" : 0.0131, "Analyst Recom" : 2.6, "Volatility (Week)" : 0.0268, "Country" : "USA", "Return on Equity" : 0.205, "50-Day Low" : 0.0695, "Price" : 21.71, "50-Day High" : -0.1066, "Return on Investment" : 0.015, "Shares Float" : 383.97, "Dividend Yield" : 0.1493, "EPS growth next 5 years" : 0.035, "Industry" : "REIT - Residential", "Beta" : 0.51, "Sales growth quarter over quarter" : 0.073, "Operating Margin" : 0.67, "EPS (ttm)" : 5.82, "PEG" : 1.05, "Float Short" : 0.0311, "52-Week Low" : 0.1117, "Average True Range" : 0.52, "EPS growth next year" : -0.3603, "Company" : "American Capital Agency Corp.", "Gap" : 0.0028, "Relative Volume" : 0.71, "Volatility (Month)" : 0.02, "Market Cap" : 8370.56, "Volume" : 4576064, "Gross Margin" : 0.746, "Short Ratio" : 1.69, "Performance (Half Year)" : -0.2136, "Relative Strength Index (14)" : 43.53, "Insider Ownership" : 0.003, "20-Day Simple Moving Average" : -0.0318, "Performance (Month)" : -0.042, "Institutional Transactions" : 0.0077, "Performance (Year)" : -0.1503, "LT Debt/Equity" : 0, "Average Volume" : 7072.83, "EPS growth this year" : -0.169, "50-Day Simple Moving Average" : -0.0376 }
{ "_id" : ObjectId("52853801bb1177ca391c1950"), "Ticker" : "ARCC", "Profit Margin" : 0.654, "Institutional Ownership" : 0.513, "EPS growth past 5 years" : 0.105, "Total Debt/Equity" : 0.59, "Return on Assets" : 0.08, "Sector" : "Financial", "P/S" : 5.87, "Change from Open" : 0.0105, "Performance (YTD)" : 0.0805, "Performance (Week)" : 0.0023, "P/B" : 1.08, "EPS growth quarter over quarter" : 0.22, "Payout Ratio" : 0.714, "Performance (Quarter)" : 0.0548, "Forward P/E" : 10.69, "P/E" : 8.32, "200-Day Simple Moving Average" : 0.046, "Shares Outstanding" : 266.17, "Earnings Date" : ISODate("2013-11-05T13:30:00Z"), "52-Week High" : -0.0014, "P/Cash" : 46.93, "Change" : 0.0082, "Analyst Recom" : 2, "Volatility (Week)" : 0.0129, "Country" : "USA", "Return on Equity" : 0.13, "50-Day Low" : 0.0527, "Price" : 17.86, "50-Day High" : -0.0014, "Return on Investment" : 0.056, "Shares Float" : 279.11, "Dividend Yield" : 0.0858, "EPS growth next 5 years" : 0.08, "Industry" : "Diversified Investments", "Beta" : 1.62, "Sales growth quarter over quarter" : 0.16, "Operating Margin" : 0.485, "EPS (ttm)" : 2.13, "PEG" : 1.04, "Float Short" : 0.0146, "52-Week Low" : 0.2192, "Average True Range" : 0.21, "EPS growth next year" : 0.0209, "Sales growth past 5 years" : 0.317, "Company" : "Ares Capital Corporation", "Gap" : -0.0023, "Relative Volume" : 0.68, "Volatility (Month)" : 0.0109, "Market Cap" : 4716.6, "Volume" : 938330, "Gross Margin" : 0.528, "Short Ratio" : 2.68, "Performance (Half Year)" : 0.0267, "Relative Strength Index (14)" : 61.2, "20-Day Simple Moving Average" : 0.0211, "Performance (Month)" : 0.0381, "Institutional Transactions" : 0.0183, "Performance (Year)" : 0.1574, "LT Debt/Equity" : 0, "Average Volume" : 1522.64, "EPS growth this year" : 0.417, "50-Day Simple Moving Average" : 0.0272 }
{ "_id" : ObjectId("52853801bb1177ca391c195a"), "Ticker" : "ARI", "Profit Margin" : 0.576, "Institutional Ownership" : 0.631, "EPS growth past 5 years" : 0.1829, "Total Debt/Equity" : 0.28, "Return on Assets" : 0.046, "Sector" : "Financial", "P/S" : 9.35, "Change from Open" : 0.0214, "Performance (YTD)" : 0.0803, "Performance (Week)" : -0.0055, "Insider Transactions" : -0.0353, "P/B" : 0.89, "EPS growth quarter over quarter" : -0.413, "Payout Ratio" : 1.159, "Performance (Quarter)" : 0.0861, "Forward P/E" : 9.57, "P/E" : 11.88, "200-Day Simple Moving Average" : 0.0497, "Shares Outstanding" : 37.37, "Earnings Date" : ISODate("2013-11-04T21:30:00Z"), "52-Week High" : -0.0404, "P/Cash" : 3.88, "Change" : 0.024, "Analyst Recom" : 2.1, "Volatility (Week)" : 0.0135, "Country" : "USA", "Return on Equity" : 0.064, "50-Day Low" : 0.1598, "Price" : 16.67, "50-Day High" : 0.0109, "Return on Investment" : 0.044, "Shares Float" : 36.7, "Dividend Yield" : 0.0983, "EPS growth next 5 years" : 0.025, "Industry" : "REIT - Diversified", "Beta" : 0.55, "Sales growth quarter over quarter" : 0.309, "Operating Margin" : 0.682, "EPS (ttm)" : 1.37, "PEG" : 4.75, "Float Short" : 0.0182, "52-Week Low" : 0.2179, "Average True Range" : 0.24, "EPS growth next year" : 0.1739, "Company" : "Apollo Commercial Real Estate Finance, Inc.", "Gap" : 0.0025, "Relative Volume" : 1.48, "Volatility (Month)" : 0.0152, "Market Cap" : 608.45, "Volume" : 299352, "Gross Margin" : 0.919, "Short Ratio" : 3.01, "Performance (Half Year)" : -0.0502, "Relative Strength Index (14)" : 68.71, "Insider Ownership" : 0.004, "20-Day Simple Moving Average" : 0.0331, "Performance (Month)" : 0.0376, "P/Free Cash Flow" : 126.76, "Institutional Transactions" : 0.0318, "Performance (Year)" : 0.1259, "LT Debt/Equity" : 0.28, "Average Volume" : 222.35, "EPS growth this year" : 0.193, "50-Day Simple Moving Average" : 0.0673 }
{ "_id" : ObjectId("52853801bb1177ca391c1968"), "Ticker" : "ARR", "Profit Margin" : 0.848, "Institutional Ownership" : 0.318, "EPS growth past 5 years" : 0.813, "Total Debt/Equity" : 8.92, "Return on Assets" : 0.031, "Sector" : "Financial", "P/S" : 1.7, "Change from Open" : 0.0223, "Performance (YTD)" : -0.2821, "Performance (Week)" : -0.0025, "Insider Transactions" : 0.2313, "P/B" : 0.68, "Payout Ratio" : 0.474, "Performance (Quarter)" : -0.0195, "Forward P/E" : 6.79, "P/E" : 1.88, "200-Day Simple Moving Average" : -0.1454, "Shares Outstanding" : 372.59, "Earnings Date" : ISODate("2013-10-28T04:00:00Z"), "52-Week High" : -0.3453, "P/Cash" : 1.87, "Change" : 0.0249, "Analyst Recom" : 2.6, "Volatility (Week)" : 0.024, "Country" : "USA", "Return on Equity" : 0.308, "50-Day Low" : 0.0728, "Price" : 4.12, "50-Day High" : -0.0678, "Return on Investment" : 0.011, "Shares Float" : 366.32, "Dividend Yield" : 0.1493, "EPS growth next 5 years" : -0.049, "Industry" : "REIT - Residential", "Beta" : 0.3, "Operating Margin" : 0.858, "EPS (ttm)" : 2.14, "Float Short" : 0.0415, "52-Week Low" : 0.1495, "Average True Range" : 0.09, "EPS growth next year" : -0.0878, "Company" : "ARMOUR Residential REIT, Inc.", "Gap" : 0.0025, "Relative Volume" : 1.37, "Volatility (Month)" : 0.0218, "Market Cap" : 1497.82, "Volume" : 6608855, "Short Ratio" : 2.87, "Performance (Half Year)" : -0.2651, "Relative Strength Index (14)" : 51.26, "Insider Ownership" : 0.002, "20-Day Simple Moving Average" : -0.0024, "Performance (Month)" : -0.0099, "P/Free Cash Flow" : 10.46, "Institutional Transactions" : 0.0016, "Performance (Year)" : -0.286, "LT Debt/Equity" : 0, "Average Volume" : 5299, "EPS growth this year" : 7.533, "50-Day Simple Moving Average" : 0.0048 }
{ "_id" : ObjectId("52853801bb1177ca391c1998"), "Ticker" : "ATHL", "Profit Margin" : 0.732, "Institutional Ownership" : 0.753, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 1.81, "Current Ratio" : 0.5, "Return on Assets" : 0.218, "Sector" : "Basic Materials", "P/S" : 10.42, "Change from Open" : 0.0088, "Performance (YTD)" : 0.1851, "Performance (Week)" : 0.1049, "Quick Ratio" : 0.5, "Insider Transactions" : -0.2682, "P/B" : 7.24, "EPS growth quarter over quarter" : -0.566, "Payout Ratio" : 0, "Performance (Quarter)" : 0.2007, "Forward P/E" : 27.38, "P/E" : 28.16, "200-Day Simple Moving Average" : 0.0877, "Shares Outstanding" : 66.34, "Earnings Date" : ISODate("2013-11-11T21:30:00Z"), "52-Week High" : -0.0439, "P/Cash" : 866.67, "Change" : 0.0126, "Analyst Recom" : 2.3, "Volatility (Week)" : 0.0678, "Country" : "USA", "Return on Equity" : 0.528, "50-Day Low" : 0.2479, "Price" : 33.07, "50-Day High" : -0.0439, "Return on Investment" : 0.08, "Shares Float" : 76.13, "EPS growth next 5 years" : 0.5, "Industry" : "Independent Oil & Gas", "Sales growth quarter over quarter" : 0.964, "Operating Margin" : 0.394, "EPS (ttm)" : 1.16, "PEG" : 0.56, "Float Short" : 0.0046, "52-Week Low" : 0.3097, "Average True Range" : 1.53, "EPS growth next year" : 0.6013, "Company" : "Athlon Energy Inc.", "Gap" : 0.0037, "Relative Volume" : 0.59, "Volatility (Month)" : 0.0464, "Market Cap" : 2166.66, "Volume" : 177265, "Gross Margin" : 0.791, "Short Ratio" : 1.07, "Relative Strength Index (14)" : 56.58, "Insider Ownership" : 0.09, "20-Day Simple Moving Average" : 0.0373, "Performance (Month)" : 0.0102, "LT Debt/Equity" : 1.81, "Average Volume" : 330.36, "EPS growth this year" : 0, "50-Day Simple Moving Average" : 0.0476 }
{ "_id" : ObjectId("52853801bb1177ca391c19f6"), "Ticker" : "AYR", "Profit Margin" : 0.548, "Institutional Ownership" : 0.745, "EPS growth past 5 years" : -0.228, "Total Debt/Equity" : 2.08, "Return on Assets" : 0.066, "Sector" : "Services", "P/S" : 1.92, "Change from Open" : 0.0058, "Performance (YTD)" : 0.5577, "Performance (Week)" : -0.0032, "Insider Transactions" : -0.0052, "P/B" : 0.83, "EPS growth quarter over quarter" : -0.656, "Payout Ratio" : 0.123, "Performance (Quarter)" : 0.1566, "Forward P/E" : 10.45, "P/E" : 126.07, "200-Day Simple Moving Average" : 0.2063, "Shares Outstanding" : 70.35, "Earnings Date" : ISODate("2013-10-31T12:30:00Z"), "52-Week High" : -0.0257, "P/Cash" : 5.58, "Change" : 0.0042, "Analyst Recom" : 2.6, "Volatility (Week)" : 0.0202, "Country" : "USA", "Return on Equity" : 0.257, "50-Day Low" : 0.1304, "Price" : 18.99, "50-Day High" : -0.0257, "Return on Investment" : 0.007, "Shares Float" : 64.67, "Dividend Yield" : 0.0349, "EPS growth next 5 years" : 0.292, "Industry" : "Rental & Leasing Services", "Beta" : 2.07, "Sales growth quarter over quarter" : -0.016, "Operating Margin" : 0.457, "EPS (ttm)" : 0.15, "PEG" : 4.32, "Float Short" : 0.0327, "52-Week Low" : 0.8106, "Average True Range" : 0.37, "EPS growth next year" : 0.4873, "Sales growth past 5 years" : 0.125, "Company" : "Aircastle LTD", "Gap" : -0.0016, "Relative Volume" : 0.39, "Volatility (Month)" : 0.0193, "Market Cap" : 1330.3, "Volume" : 200382, "Short Ratio" : 3.78, "Performance (Half Year)" : 0.2295, "Relative Strength Index (14)" : 58.67, "Insider Ownership" : 0.008, "20-Day Simple Moving Average" : 0.0054, "Performance (Month)" : 0.0849, "P/Free Cash Flow" : 3.39, "Institutional Transactions" : -0.0268, "Performance (Year)" : 0.7493, "LT Debt/Equity" : 2.08, "Average Volume" : 559.42, "EPS growth this year" : -0.72, "50-Day Simple Moving Average" : 0.0545 }
{ "_id" : ObjectId("52853801bb1177ca391c1a97"), "Ticker" : "BK", "Profit Margin" : 0.63, "Institutional Ownership" : 0.826, "EPS growth past 5 years" : -0.03, "Total Debt/Equity" : 0.53, "Return on Assets" : 0.006, "Sector" : "Financial", "P/S" : 11.32, "Change from Open" : -0.0015, "Performance (YTD)" : 0.3095, "Performance (Week)" : 0.0195, "Insider Transactions" : -0.1546, "P/B" : 1.07, "EPS growth quarter over quarter" : 0.344, "Payout Ratio" : 0.304, "Performance (Quarter)" : 0.0898, "Forward P/E" : 13.19, "P/E" : 18.03, "200-Day Simple Moving Average" : 0.127, "Shares Outstanding" : 1148.72, "Earnings Date" : ISODate("2013-10-16T12:30:00Z"), "52-Week High" : -0.0069, "P/Cash" : 0.22, "Change" : 0.003, "Analyst Recom" : 2.7, "Volatility (Week)" : 0.0216, "Country" : "USA", "Return on Equity" : 0.06, "50-Day Low" : 0.1255, "Price" : 33.1, "50-Day High" : -0.0069, "Return on Investment" : 0.042, "Shares Float" : 1146.23, "Dividend Yield" : 0.0182, "EPS growth next 5 years" : 0.066, "Industry" : "Asset Management", "Beta" : 1.16, "Sales growth quarter over quarter" : -0.025, "EPS (ttm)" : 1.83, "PEG" : 2.73, "Float Short" : 0.0125, "52-Week Low" : 0.4512, "Average True Range" : 0.54, "EPS growth next year" : 0.096, "Sales growth past 5 years" : -0.092, "Company" : "The Bank of New York Mellon Corporation", "Gap" : 0.0045, "Relative Volume" : 0.61, "Volatility (Month)" : 0.0155, "Market Cap" : 37907.89, "Volume" : 2578576, "Short Ratio" : 3.1, "Performance (Half Year)" : 0.1156, "Relative Strength Index (14)" : 63.27, "Insider Ownership" : 0.001, "20-Day Simple Moving Average" : 0.032, "Performance (Month)" : 0.0749, "Institutional Transactions" : 0.0015, "Performance (Year)" : 0.4019, "LT Debt/Equity" : 0.53, "Average Volume" : 4611.68, "EPS growth this year" : 0, "50-Day Simple Moving Average" : 0.0626 }
{ "_id" : ObjectId("52853801bb1177ca391c1abd"), "Ticker" : "BLX", "Profit Margin" : 0.588, "Institutional Ownership" : 0.281, "EPS growth past 5 years" : 0.045, "Total Debt/Equity" : 3.73, "Return on Assets" : 0.017, "Sector" : "Financial", "P/S" : 5.22, "Change from Open" : 0.0103, "Performance (YTD)" : 0.2812, "Performance (Week)" : -0.0131, "P/B" : 1.19, "EPS growth quarter over quarter" : -0.506, "Payout Ratio" : 0.372, "Performance (Quarter)" : 0.0597, "Forward P/E" : 9.32, "P/E" : 13.01, "200-Day Simple Moving Average" : 0.1134, "Shares Outstanding" : 38.22, "Earnings Date" : ISODate("2013-10-16T12:30:00Z"), "52-Week High" : -0.0161, "P/Cash" : 1.71, "Change" : 0.0095, "Analyst Recom" : 1.7, "Volatility (Week)" : 0.023, "Country" : "Panama", "Return on Equity" : 0.137, "50-Day Low" : 0.1075, "Price" : 26.54, "50-Day High" : -0.0161, "Return on Investment" : 0.027, "Shares Float" : 29.25, "Dividend Yield" : 0.0456, "EPS growth next 5 years" : 0.0698, "Industry" : "Foreign Money Center Banks", "Beta" : 1.19, "Sales growth quarter over quarter" : 0, "Operating Margin" : 0.809, "EPS (ttm)" : 2.02, "PEG" : 1.86, "Float Short" : 0.0296, "52-Week Low" : 0.366, "Average True Range" : 0.49, "EPS growth next year" : 0.2192, "Sales growth past 5 years" : -0.062, "Company" : "Banco Latinoamericano de Comercio Exterior, S.A", "Gap" : -0.0008, "Relative Volume" : 1.05, "Volatility (Month)" : 0.0205, "Market Cap" : 1004.75, "Volume" : 102478, "Short Ratio" : 8.07, "Performance (Half Year)" : 0.1597, "Relative Strength Index (14)" : 60.34, "Insider Ownership" : 0.0706, "20-Day Simple Moving Average" : 0.0098, "Performance (Month)" : 0.0554, "P/Free Cash Flow" : 56.77, "Institutional Transactions" : 0.0149, "Performance (Year)" : 0.2983, "LT Debt/Equity" : 1.91, "Average Volume" : 107.45, "EPS growth this year" : 0.098, "50-Day Simple Moving Average" : 0.0498 }
{ "_id" : ObjectId("52853801bb1177ca391c1af0"), "Ticker" : "BPO", "Profit Margin" : 0.503, "Institutional Ownership" : 0.958, "EPS growth past 5 years" : 0.354, "Total Debt/Equity" : 1.15, "Current Ratio" : 1, "Return on Assets" : 0.043, "Sector" : "Financial", "P/S" : 4.04, "Change from Open" : 0.001, "Performance (YTD)" : 0.1519, "Performance (Week)" : -0.0052, "Quick Ratio" : 1, "P/B" : 0.9, "EPS growth quarter over quarter" : -0.415, "Payout Ratio" : 0.235, "Performance (Quarter)" : 0.1825, "Forward P/E" : 18.74, "P/E" : 8.65, "200-Day Simple Moving Average" : 0.1124, "Shares Outstanding" : 505, "Earnings Date" : ISODate("2011-02-11T13:30:00Z"), "52-Week High" : -0.022, "P/Cash" : 22.13, "Change" : 0.0021, "Analyst Recom" : 3.1, "Volatility (Week)" : 0.0127, "Country" : "USA", "Return on Equity" : 0.115, "50-Day Low" : 0.1976, "Price" : 19.15, "50-Day High" : -0.022, "Return on Investment" : 0.015, "Shares Float" : 504.86, "Dividend Yield" : 0.0293, "EPS growth next 5 years" : 0.0735, "Industry" : "Property Management", "Beta" : 1.64, "Sales growth quarter over quarter" : 0.01, "Operating Margin" : 0.552, "EPS (ttm)" : 2.21, "PEG" : 1.18, "Float Short" : 0.0062, "52-Week Low" : 0.2728, "Average True Range" : 0.23, "EPS growth next year" : -0.105, "Sales growth past 5 years" : -0.043, "Company" : "Brookfield Properties Corporation", "Gap" : 0.001, "Relative Volume" : 0.17, "Volatility (Month)" : 0.0112, "Market Cap" : 9650.55, "Volume" : 249482, "Gross Margin" : 0.621, "Short Ratio" : 1.9, "Performance (Half Year)" : 0.0269, "Relative Strength Index (14)" : 62.08, "Insider Ownership" : 0.4972, "20-Day Simple Moving Average" : 0.012, "Performance (Month)" : 0.0154, "Institutional Transactions" : -0.004, "Performance (Year)" : 0.2482, "LT Debt/Equity" : 1.15, "Average Volume" : 1650.73, "EPS growth this year" : -0.212, "50-Day Simple Moving Average" : 0.0538 }
```
<br/>

> 2. Liste as ações com perdas (limite a 10 novamente)

```
db.stock.find({"Profit Margin":{$lt:0.0}}).limit(10)
```
```
{ "_id" : ObjectId("52853800bb1177ca391c1806"), "Ticker" : "AAOI", "Profit Margin" : -0.023, "Institutional Ownership" : 0.114, "EPS growth past 5 years" : 0, "Current Ratio" : 1.5, "Return on Assets" : -0.048, "Sector" : "Technology", "P/S" : 2.3, "Change from Open" : -0.0215, "Performance (YTD)" : 0.2671, "Performance (Week)" : -0.0381, "Quick Ratio" : 0.9, "EPS growth quarter over quarter" : -1, "Forward P/E" : 12.77, "200-Day Simple Moving Average" : 0.0654, "Shares Outstanding" : 12.6, "52-Week High" : -0.0904, "P/Cash" : 16.23, "Change" : -0.0269, "Analyst Recom" : 1.8, "Volatility (Week)" : 0.0377, "Country" : "USA", "Return on Equity" : 0.043, "50-Day Low" : 0.3539, "Price" : 12.28, "50-Day High" : -0.0904, "Return on Investment" : -0.004, "Shares Float" : 11.46, "Industry" : "Semiconductor - Integrated Circuits", "Sales growth quarter over quarter" : 0.256, "Operating Margin" : -0.007, "EPS (ttm)" : -0.13, "Float Short" : 0.0011, "52-Week Low" : 0.3539, "Average True Range" : 0.63, "EPS growth next year" : 38.52, "Company" : "Applied Optoelectronics, Inc.", "Gap" : -0.0055, "Relative Volume" : 0.12, "Volatility (Month)" : 0.0608, "Market Cap" : 159.06, "Volume" : 12203, "Gross Margin" : 0.292, "Short Ratio" : 0.12, "Insider Ownership" : 0.021, "20-Day Simple Moving Average" : -0.0251, "Performance (Month)" : 0.2397, "Average Volume" : 110.95, "EPS growth this year" : 0.833, "50-Day Simple Moving Average" : 0.0654 }
{ "_id" : ObjectId("52853800bb1177ca391c180c"), "Ticker" : "AAV", "Profit Margin" : -0.232, "Institutional Ownership" : 0.58, "EPS growth past 5 years" : -0.265, "Total Debt/Equity" : 0.32, "Current Ratio" : 0.8, "Return on Assets" : -0.032, "Sector" : "Basic Materials", "P/S" : 2.64, "Change from Open" : 0.0286, "Performance (YTD)" : 0.1914, "Performance (Week)" : 0.0158, "Quick Ratio" : 0.8, "P/B" : 0.63, "EPS growth quarter over quarter" : 1.556, "Performance (Quarter)" : 0.0349, "200-Day Simple Moving Average" : 0.0569, "Shares Outstanding" : 168.38, "Earnings Date" : ISODate("2011-03-16T04:00:00Z"), "52-Week High" : -0.1242, "Change" : 0.0233, "Analyst Recom" : 2.7, "Volatility (Week)" : 0.0381, "Country" : "Canada", "Return on Equity" : -0.055, "50-Day Low" : 0.1127, "Price" : 3.95, "50-Day High" : -0.0436, "Return on Investment" : -0.068, "Shares Float" : 167.07, "Industry" : "Oil & Gas Drilling & Exploration", "Beta" : 2.05, "Sales growth quarter over quarter" : 0.399, "Operating Margin" : 0.102, "EPS (ttm)" : -0.34, "Float Short" : 0.0008, "52-Week Low" : 0.4158, "Average True Range" : 0.12, "EPS growth next year" : -0.667, "Sales growth past 5 years" : -0.121, "Company" : "Advantage Oil & Gas Ltd.", "Gap" : -0.0052, "Relative Volume" : 0.85, "Volatility (Month)" : 0.0303, "Market Cap" : 649.96, "Volume" : 116750, "Gross Margin" : 0.682, "Short Ratio" : 0.89, "Performance (Half Year)" : 0.0078, "Relative Strength Index (14)" : 52.62, "Insider Ownership" : 0.0025, "20-Day Simple Moving Average" : -0.0001, "Performance (Month)" : 0.0158, "Institutional Transactions" : 0.0402, "Performance (Year)" : 0.1386, "LT Debt/Equity" : 0.32, "Average Volume" : 149.81, "EPS growth this year" : 0.42, "50-Day Simple Moving Average" : 0.023 }
{ "_id" : ObjectId("52853800bb1177ca391c1815"), "Ticker" : "ABCD", "Profit Margin" : -0.645, "Institutional Ownership" : 0.186, "EPS growth past 5 years" : -0.195, "Current Ratio" : 1.4, "Return on Assets" : -0.416, "Sector" : "Services", "P/S" : 0.41, "Change from Open" : 0, "Performance (YTD)" : 0.2072, "Performance (Week)" : 0.0229, "Quick Ratio" : 1.2, "Insider Transactions" : -0.0267, "EPS growth quarter over quarter" : 1.022, "Performance (Quarter)" : -0.0496, "200-Day Simple Moving Average" : 0.0446, "Shares Outstanding" : 47.36, "Earnings Date" : ISODate("2013-11-07T21:30:00Z"), "52-Week High" : -0.2757, "P/Cash" : 1.37, "Change" : 0, "Analyst Recom" : 2, "Volatility (Week)" : 0.0737, "Country" : "USA", "Return on Equity" : 3.596, "50-Day Low" : 0.072, "Price" : 1.34, "50-Day High" : -0.2299, "Return on Investment" : -0.876, "Shares Float" : 15.11, "Industry" : "Education & Training Services", "Beta" : 1.7, "Sales growth quarter over quarter" : 0.059, "Operating Margin" : 0.048, "EPS (ttm)" : -2.06, "Float Short" : 0.0007, "52-Week Low" : 0.5952, "Average True Range" : 0.09, "Sales growth past 5 years" : 0.084, "Company" : "Cambium Learning Group, Inc.", "Gap" : 0, "Relative Volume" : 0.04, "Volatility (Month)" : 0.0584, "Market Cap" : 63.46, "Volume" : 1600, "Gross Margin" : 0.552, "Short Ratio" : 0.21, "Performance (Half Year)" : 0.1356, "Relative Strength Index (14)" : 48.07, "Insider Ownership" : 0.003, "20-Day Simple Moving Average" : 0.0037, "Performance (Month)" : -0.0074, "P/Free Cash Flow" : 2.47, "Institutional Transactions" : -0.095, "Performance (Year)" : 0.6543, "Average Volume" : 48.58, "EPS growth this year" : -1.533, "50-Day Simple Moving Average" : -0.064 }
{ "_id" : ObjectId("52853800bb1177ca391c1817"), "Ticker" : "ABFS", "Profit Margin" : -0.005, "Institutional Ownership" : 0.921, "EPS growth past 5 years" : -0.164, "Total Debt/Equity" : 0.31, "Current Ratio" : 1.3, "Return on Assets" : -0.01, "Sector" : "Services", "P/S" : 0.37, "Change from Open" : -0.006, "Performance (YTD)" : 2.3474, "Performance (Week)" : 0.1949, "Quick Ratio" : 1.3, "Insider Transactions" : 0.1293, "P/B" : 1.69, "EPS growth quarter over quarter" : -0.591, "Performance (Quarter)" : 0.3813, "Forward P/E" : 18.66, "200-Day Simple Moving Average" : 0.6449, "Shares Outstanding" : 25.69, "Earnings Date" : ISODate("2013-11-11T13:30:00Z"), "52-Week High" : -0.0166, "P/Cash" : 6.87, "Change" : -0.0082, "Analyst Recom" : 2.8, "Volatility (Week)" : 0.0625, "Country" : "USA", "Return on Equity" : -0.022, "50-Day Low" : 0.474, "Price" : 31.44, "50-Day High" : -0.0166, "Return on Investment" : -0.008, "Shares Float" : 24.3, "Dividend Yield" : 0.0038, "EPS growth next 5 years" : 0.1, "Industry" : "Trucking", "Beta" : 1.91, "Sales growth quarter over quarter" : 0.13, "Operating Margin" : -0.006, "EPS (ttm)" : -0.4, "Float Short" : 0.1176, "52-Week Low" : 3.9271, "Average True Range" : 1.58, "EPS growth next year" : 7.0142, "Sales growth past 5 years" : 0.024, "Company" : "Arkansas Best Corporation", "Gap" : -0.0022, "Relative Volume" : 0.73, "Volatility (Month)" : 0.0537, "Market Cap" : 814.5, "Volume" : 351906, "Gross Margin" : 0.212, "Short Ratio" : 5.44, "Performance (Half Year)" : 0.8592, "Relative Strength Index (14)" : 67.77, "Insider Ownership" : 0.034, "20-Day Simple Moving Average" : 0.1304, "Performance (Month)" : 0.3319, "P/Free Cash Flow" : 13.67, "Institutional Transactions" : 0.0328, "Performance (Year)" : 3.4336, "LT Debt/Equity" : 0.2, "Average Volume" : 525.42, "EPS growth this year" : -2.348, "50-Day Simple Moving Average" : 0.1974 }
{ "_id" : ObjectId("52853800bb1177ca391c181b"), "Ticker" : "ABMC", "Profit Margin" : -0.0966, "Institutional Ownership" : 0.12, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 0.63, "Current Ratio" : 1.74, "Return on Assets" : -0.1194, "Sector" : "Healthcare", "P/S" : 0.34, "Change from Open" : 0, "Performance (YTD)" : 0.3077, "Performance (Week)" : 0.1333, "Quick Ratio" : 0.57, "P/B" : 1, "EPS growth quarter over quarter" : -2.4252, "Performance (Quarter)" : 0, "200-Day Simple Moving Average" : 0.0413, "Shares Outstanding" : 21.74, "Earnings Date" : ISODate("2013-11-11T05:00:00Z"), "52-Week High" : -0.3929, "P/Cash" : 6.26, "Change" : 0, "Volatility (Week)" : 0.0695, "Country" : "USA", "Return on Equity" : -0.2455, "50-Day Low" : 1.4286, "Price" : 0.17, "50-Day High" : -0.0556, "Return on Investment" : -0.1961, "Shares Float" : 18.7, "Industry" : "Diagnostic Substances", "Beta" : 1.71, "Sales growth quarter over quarter" : -0.1896, "Operating Margin" : -0.0734, "EPS (ttm)" : -0.05, "Float Short" : 0.0003, "52-Week Low" : 1.4286, "Average True Range" : 0.02, "Sales growth past 5 years" : 0.0028, "Company" : "American Bio Medica Corp.", "Gap" : 0, "Relative Volume" : 0.04, "Volatility (Month)" : 0.0517, "Market Cap" : 3.7, "Volume" : 0, "Gross Margin" : 0.3916, "Short Ratio" : 0.43, "Performance (Half Year)" : 0.0625, "Relative Strength Index (14)" : 56.93, "Insider Ownership" : 0.14, "20-Day Simple Moving Average" : 0.1039, "Performance (Month)" : 0.2143, "Institutional Transactions" : -0.1183, "Performance (Year)" : -0.0556, "LT Debt/Equity" : 0.2, "Average Volume" : 13.73, "EPS growth this year" : 0.1416, "50-Day Simple Moving Average" : 0.1502 }
{ "_id" : ObjectId("52853800bb1177ca391c1821"), "Ticker" : "ABX", "Profit Margin" : -0.769, "Institutional Ownership" : 0.739, "EPS growth past 5 years" : -0.206, "Total Debt/Equity" : 1.13, "Current Ratio" : 1.8, "Return on Assets" : -0.241, "Sector" : "Basic Materials", "P/S" : 1.32, "Change from Open" : -0.0019, "Performance (YTD)" : -0.4728, "Performance (Week)" : -0.0131, "Quick Ratio" : 1, "P/B" : 1.33, "EPS growth quarter over quarter" : -0.727, "Performance (Quarter)" : -0.084, "Forward P/E" : 8.19, "200-Day Simple Moving Average" : -0.1368, "Shares Outstanding" : 1001, "Earnings Date" : ISODate("2011-02-17T13:30:00Z"), "52-Week High" : -0.4877, "P/Cash" : 7.94, "Change" : 0.0014, "Analyst Recom" : 2.6, "Volatility (Week)" : 0.0202, "Country" : "Canada", "Return on Equity" : -0.592, "50-Day Low" : 0.0581, "Price" : 18.13, "50-Day High" : -0.121, "Return on Investment" : -0.017, "Shares Float" : 997.93, "Dividend Yield" : 0.011, "EPS growth next 5 years" : 0.02, "Industry" : "Gold", "Beta" : 0.46, "Sales growth quarter over quarter" : -0.122, "Operating Margin" : 0.366, "EPS (ttm)" : -10.08, "Float Short" : 0.0118, "52-Week Low" : 0.3525, "Average True Range" : 0.57, "EPS growth next year" : -0.16, "Sales growth past 5 years" : 0.193, "Company" : "Barrick Gold Corporation", "Gap" : 0.0033, "Relative Volume" : 1.09, "Volatility (Month)" : 0.0277, "Market Cap" : 18118.1, "Volume" : 17478164, "Gross Margin" : 0.444, "Short Ratio" : 0.67, "Performance (Half Year)" : -0.0479, "Relative Strength Index (14)" : 41.96, "20-Day Simple Moving Average" : -0.0436, "Performance (Month)" : 0.018, "Institutional Transactions" : 0.0315, "Performance (Year)" : -0.474, "LT Debt/Equity" : 1.07, "Average Volume" : 17602.98, "EPS growth this year" : -1.147, "50-Day Simple Moving Average" : -0.0239 }
{ "_id" : ObjectId("52853800bb1177ca391c1826"), "Ticker" : "ACCL", "Profit Margin" : -0.014, "Institutional Ownership" : 0.911, "EPS growth past 5 years" : -0.421, "Total Debt/Equity" : 0, "Current Ratio" : 1.4, "Return on Assets" : -0.006, "Sector" : "Technology", "P/S" : 3.13, "Change from Open" : 0.0011, "Performance (YTD)" : 0.0331, "Performance (Week)" : 0.0108, "Quick Ratio" : 1.4, "Insider Transactions" : -0.1768, "P/B" : 2.1, "Performance (Quarter)" : 0.0331, "Forward P/E" : 24.35, "200-Day Simple Moving Average" : 0.0112, "Shares Outstanding" : 55.66, "Earnings Date" : ISODate("2013-10-30T20:30:00Z"), "52-Week High" : -0.071, "P/Cash" : 4.14, "Change" : -0.0064, "Analyst Recom" : 2.3, "Volatility (Week)" : 0.0189, "Country" : "USA", "Return on Equity" : -0.01, "50-Day Low" : 0.0322, "Price" : 9.29, "50-Day High" : -0.071, "Return on Investment" : -0.086, "Shares Float" : 55.4, "EPS growth next 5 years" : 0.2, "Industry" : "Application Software", "Beta" : 0.84, "Sales growth quarter over quarter" : 0.01, "Operating Margin" : -0.091, "EPS (ttm)" : -0.05, "Float Short" : 0.0179, "52-Week Low" : 0.1987, "Average True Range" : 0.21, "EPS growth next year" : 0.1294, "Sales growth past 5 years" : 0.153, "Company" : "Accelrys Inc.", "Gap" : -0.0075, "Relative Volume" : 0.31, "Volatility (Month)" : 0.0236, "Market Cap" : 520.42, "Volume" : 33912, "Gross Margin" : 0.679, "Short Ratio" : 8.32, "Performance (Half Year)" : 0.0872, "Relative Strength Index (14)" : 45.52, "Insider Ownership" : 0.0092, "20-Day Simple Moving Average" : -0.018, "Performance (Month)" : -0.0032, "Institutional Transactions" : 0.0133, "Performance (Year)" : 0.0747, "LT Debt/Equity" : 0, "Average Volume" : 118.95, "EPS growth this year" : -7.333, "50-Day Simple Moving Average" : -0.0226 }
{ "_id" : ObjectId("52853800bb1177ca391c182b"), "Ticker" : "ACFC", "Profit Margin" : -0.18, "Institutional Ownership" : 0.079, "EPS growth past 5 years" : -0.524, "Total Debt/Equity" : 0, "Return on Assets" : -0.007, "Sector" : "Financial", "P/S" : 0.27, "Change from Open" : 0, "Performance (YTD)" : 0.6667, "Performance (Week)" : -0.1184, "P/B" : 0.27, "EPS growth quarter over quarter" : 0.483, "Performance (Quarter)" : -0.1321, "200-Day Simple Moving Average" : -0.2118, "Shares Outstanding" : 2.5, "Earnings Date" : ISODate("2013-11-04T05:00:00Z"), "52-Week High" : -0.4956, "P/Cash" : 0.1, "Change" : 0.0358, "Analyst Recom" : 3, "Volatility (Week)" : 0.0508, "Country" : "USA", "Return on Equity" : -0.147, "50-Day Low" : 0.081, "Price" : 3.47, "50-Day High" : -0.2078, "Return on Investment" : 0.161, "Shares Float" : 1.72, "Industry" : "Regional - Southeast Banks", "Beta" : 0.83, "Sales growth quarter over quarter" : -0.14, "Operating Margin" : -0.18, "EPS (ttm)" : -2.22, "Float Short" : 0.0085, "52-Week Low" : 1.3767, "Average True Range" : 0.12, "Sales growth past 5 years" : -0.096, "Company" : "Atlantic Coast Financial Corporation", "Gap" : 0.0358, "Relative Volume" : 0, "Volatility (Month)" : 0.0228, "Market Cap" : 8.39, "Volume" : 0, "Short Ratio" : 6.07, "Performance (Half Year)" : -0.3667, "Relative Strength Index (14)" : 40.71, "Insider Ownership" : 0.001, "20-Day Simple Moving Average" : -0.0742, "Performance (Month)" : -0.1138, "Institutional Transactions" : -4.3825, "Performance (Year)" : 0.7539, "LT Debt/Equity" : 0, "Average Volume" : 2.41, "EPS growth this year" : 0.354, "50-Day Simple Moving Average" : -0.0993 }
{ "_id" : ObjectId("52853800bb1177ca391c182f"), "Ticker" : "ACH", "Profit Margin" : -0.051, "Institutional Ownership" : 0.02, "EPS growth past 5 years" : -0.227, "Total Debt/Equity" : 2.84, "Current Ratio" : 0.7, "Return on Assets" : -0.039, "Sector" : "Basic Materials", "P/S" : 0.19, "Change from Open" : -0.0032, "Performance (YTD)" : -0.2645, "Performance (Week)" : -0.0437, "Quick Ratio" : 0.7, "P/B" : 0.67, "EPS growth quarter over quarter" : 0.711, "Performance (Quarter)" : 0.0057, "200-Day Simple Moving Average" : -0.0544, "Shares Outstanding" : 540.98, "Earnings Date" : ISODate("2011-03-02T05:00:00Z"), "52-Week High" : -0.3369, "P/Cash" : 2.77, "Change" : 0.0059, "Analyst Recom" : 5, "Volatility (Week)" : 0.015, "Country" : "China", "Return on Equity" : -0.172, "50-Day Low" : 0.0176, "Price" : 8.81, "50-Day High" : -0.1117, "Return on Investment" : -0.029, "Shares Float" : 156.18, "Industry" : "Aluminum", "Beta" : 1.9, "Sales growth quarter over quarter" : 0.065, "Operating Margin" : -0.021, "EPS (ttm)" : -1.76, "Float Short" : 0.02, "52-Week Low" : 0.2154, "Average True Range" : 0.2, "EPS growth next year" : 0.487, "Sales growth past 5 years" : 0.119, "Company" : "Aluminum Corporation Of China Limited", "Gap" : 0.0091, "Relative Volume" : 1.05, "Volatility (Month)" : 0.0183, "Market Cap" : 4738.98, "Volume" : 78010, "Gross Margin" : 0.005, "Short Ratio" : 38.23, "Performance (Half Year)" : -0.124, "Relative Strength Index (14)" : 38.92, "20-Day Simple Moving Average" : -0.0477, "Performance (Month)" : -0.0405, "Institutional Transactions" : -0.0063, "Performance (Year)" : -0.1577, "LT Debt/Equity" : 1.19, "Average Volume" : 81.57, "EPS growth this year" : 0.839, "50-Day Simple Moving Average" : -0.0421 }
{ "_id" : ObjectId("52853800bb1177ca391c1832"), "Ticker" : "ACI", "Profit Margin" : -0.173, "Institutional Ownership" : 0.662, "EPS growth past 5 years" : -0.361, "Total Debt/Equity" : 1.97, "Current Ratio" : 3.5, "Return on Assets" : -0.058, "Sector" : "Basic Materials", "P/S" : 0.28, "Change from Open" : -0.0372, "Performance (YTD)" : -0.4019, "Performance (Week)" : -0.0183, "Quick Ratio" : 3, "Insider Transactions" : 0.0178, "P/B" : 0.35, "EPS growth quarter over quarter" : -5.455, "Performance (Quarter)" : -0.0549, "200-Day Simple Moving Average" : -0.1177, "Shares Outstanding" : 212.11, "Earnings Date" : ISODate("2013-10-29T12:30:00Z"), "52-Week High" : -0.4702, "P/Cash" : 0.66, "Change" : -0.0372, "Analyst Recom" : 2.8, "Volatility (Week)" : 0.0516, "Country" : "USA", "Return on Equity" : -0.207, "50-Day Low" : 0.104, "Price" : 4.14, "50-Day High" : -0.2114, "Return on Investment" : -0.047, "Shares Float" : 209.56, "Dividend Yield" : 0.0279, "EPS growth next 5 years" : 0.05, "Industry" : "Industrial Metals & Minerals", "Beta" : 1.61, "Sales growth quarter over quarter" : -0.272, "Operating Margin" : -0.04, "EPS (ttm)" : -3.16, "Float Short" : 0.1772, "52-Week Low" : 0.1997, "Average True Range" : 0.23, "EPS growth next year" : 0.143, "Sales growth past 5 years" : 0.115, "Company" : "Arch Coal Inc.", "Gap" : 0, "Relative Volume" : 0.66, "Volatility (Month)" : 0.0546, "Market Cap" : 912.08, "Volume" : 5417562, "Gross Margin" : 0.141, "Short Ratio" : 4.12, "Performance (Half Year)" : -0.1224, "Relative Strength Index (14)" : 43.64, "Insider Ownership" : 0.0054, "20-Day Simple Moving Average" : -0.0171, "Performance (Month)" : 0.0437, "Institutional Transactions" : 0.0024, "Performance (Year)" : -0.3741, "LT Debt/Equity" : 1.97, "Average Volume" : 9000.5, "EPS growth this year" : -5.378, "50-Day Simple Moving Average" : -0.0482 }
```
<br/>

> 3. Liste as 10 ações mais rentáveis 

```
db.stock.find({}).sort({"Profit Margin":-1}).limit(10)
```
```
{ "_id" : ObjectId("52853801bb1177ca391c1af3"), "Ticker" : "BPT", "Profit Margin" : 0.994, "Institutional Ownership" : 0.098, "EPS growth past 5 years" : 0.025, "Total Debt/Equity" : 0, "Sector" : "Basic Materials", "P/S" : 8.81, "Change from Open" : 0.0125, "Performance (YTD)" : 0.2758, "Performance (Week)" : -0.018, "P/B" : 2620, "EPS growth quarter over quarter" : -0.087, "Payout Ratio" : 1.001, "Performance (Quarter)" : -0.0556, "P/E" : 8.87, "200-Day Simple Moving Average" : -0.0305, "Shares Outstanding" : 21.4, "Earnings Date" : ISODate("2013-11-11T05:00:00Z"), "52-Week High" : -0.159, "P/Cash" : 1682.04, "Change" : 0.0064, "Volatility (Week)" : 0.0151, "Country" : "USA", "50-Day Low" : 0.0136, "Price" : 79.1, "50-Day High" : -0.0973, "Shares Float" : 21.4, "Dividend Yield" : 0.1103, "Industry" : "Oil & Gas Refining & Marketing", "Beta" : 0.77, "Sales growth quarter over quarter" : -0.086, "Operating Margin" : 0.994, "EPS (ttm)" : 8.86, "Float Short" : 0.0173, "52-Week Low" : 0.3422, "Average True Range" : 1.37, "Sales growth past 5 years" : 0.024, "Company" : "BP Prudhoe Bay Royalty Trust", "Gap" : -0.0061, "Relative Volume" : 0.93, "Volatility (Month)" : 0.016, "Market Cap" : 1682.04, "Volume" : 71575, "Short Ratio" : 4.41, "Performance (Half Year)" : 0.0022, "Relative Strength Index (14)" : 38.01, "20-Day Simple Moving Average" : -0.0318, "Performance (Month)" : -0.079, "Institutional Transactions" : -0.0057, "Performance (Year)" : 0.1837, "LT Debt/Equity" : 0, "Average Volume" : 84.15, "EPS growth this year" : -0.012, "50-Day Simple Moving Average" : -0.0496 }
{ "_id" : ObjectId("52853802bb1177ca391c1b69"), "Ticker" : "CACB", "Profit Margin" : 0.994, "Institutional Ownership" : 0.547, "EPS growth past 5 years" : -0.584, "Total Debt/Equity" : 0, "Return on Assets" : 0.039, "Sector" : "Financial", "P/S" : 4.66, "Change from Open" : -0.0137, "Performance (YTD)" : -0.1869, "Performance (Week)" : 0.0079, "Insider Transactions" : 1.0755, "P/B" : 1.28, "EPS growth quarter over quarter" : 25.422, "Payout Ratio" : 0, "Performance (Quarter)" : -0.1314, "Forward P/E" : 42.42, "P/E" : 4.71, "200-Day Simple Moving Average" : -0.1709, "Shares Outstanding" : 47.17, "Earnings Date" : ISODate("2013-11-13T21:30:00Z"), "52-Week High" : -0.2994, "P/Cash" : 2.26, "Change" : -0.0118, "Analyst Recom" : 3, "Volatility (Week)" : 0.0353, "Country" : "USA", "Return on Equity" : 0.336, "50-Day Low" : 0.006, "Price" : 5.03, "50-Day High" : -0.2066, "Return on Investment" : 0.346, "Shares Float" : 40.67, "EPS growth next 5 years" : 0.05, "Industry" : "Regional - Pacific Banks", "Beta" : 2.34, "Sales growth quarter over quarter" : -0.101, "Operating Margin" : 0.027, "EPS (ttm)" : 1.08, "PEG" : 0.94, "Float Short" : 0.0088, "52-Week Low" : 0.0817, "Average True Range" : 0.19, "EPS growth next year" : -0.8904, "Sales growth past 5 years" : -0.203, "Company" : "Cascade Bancorp", "Gap" : 0.002, "Relative Volume" : 1.35, "Volatility (Month)" : 0.0399, "Market Cap" : 240.11, "Volume" : 21432, "Short Ratio" : 20.55, "Performance (Half Year)" : -0.1239, "Relative Strength Index (14)" : 29.61, "Insider Ownership" : 0.009, "20-Day Simple Moving Average" : -0.0729, "Performance (Month)" : -0.1039, "Institutional Transactions" : 0.0004, "Performance (Year)" : 0.0241, "LT Debt/Equity" : 0, "Average Volume" : 17.39, "EPS growth this year" : 1.12, "50-Day Simple Moving Average" : -0.116 }
{ "_id" : ObjectId("5285380bbb1177ca391c2c3c"), "Ticker" : "ROYT", "Profit Margin" : 0.99, "Institutional Ownership" : 0.696, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 0, "Return on Assets" : 0.255, "Sector" : "Basic Materials", "P/S" : 7.62, "Change from Open" : 0, "Performance (YTD)" : -0.1408, "Performance (Week)" : -0.0447, "Insider Transactions" : -0.5437, "P/B" : 2.03, "EPS growth quarter over quarter" : 1.75, "Payout Ratio" : 0.338, "Performance (Quarter)" : -0.2202, "Forward P/E" : 7.92, "P/E" : 7.68, "200-Day Simple Moving Average" : -0.1864, "Shares Outstanding" : 38.58, "52-Week High" : -0.243, "Change" : 0.0037, "Analyst Recom" : 2.4, "Volatility (Week)" : 0.0174, "Country" : "USA", "Return on Equity" : 0.255, "50-Day Low" : 0.0088, "Price" : 13.72, "50-Day High" : -0.243, "Return on Investment" : 0.15, "Shares Float" : 38.58, "Dividend Yield" : 0.1295, "EPS growth next 5 years" : 0.126, "Industry" : "Independent Oil & Gas", "Sales growth quarter over quarter" : 1.6, "Operating Margin" : 0.99, "EPS (ttm)" : 1.78, "PEG" : 0.61, "Float Short" : 0.0042, "52-Week Low" : 0.0088, "Average True Range" : 0.3, "EPS growth next year" : -0.0655, "Company" : "Pacific Coast Oil Trust", "Gap" : 0.0037, "Relative Volume" : 0.75, "Volatility (Month)" : 0.0201, "Market Cap" : 527.43, "Volume" : 262050, "Short Ratio" : 0.42, "Performance (Half Year)" : -0.1978, "Relative Strength Index (14)" : 20.73, "Insider Ownership" : 0.5205, "20-Day Simple Moving Average" : -0.0644, "Performance (Month)" : -0.1237, "Institutional Transactions" : 0.0154, "Performance (Year)" : -0.1141, "LT Debt/Equity" : 0, "Average Volume" : 388.63, "EPS growth this year" : 0.745, "50-Day Simple Moving Average" : -0.1265 }
{ "_id" : ObjectId("52853808bb1177ca391c281b"), "Ticker" : "NDRO", "Profit Margin" : 0.986, "Institutional Ownership" : 0.532, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 0, "Return on Assets" : 0.078, "Sector" : "Basic Materials", "P/S" : 8.11, "Change from Open" : 0, "Performance (YTD)" : -0.2111, "Performance (Week)" : -0.0369, "Insider Transactions" : -0.3613, "P/B" : 0.67, "EPS growth quarter over quarter" : -0.378, "Payout Ratio" : 0.313, "Performance (Quarter)" : -0.1716, "Forward P/E" : 7.53, "P/E" : 8.23, "200-Day Simple Moving Average" : -0.1708, "Shares Outstanding" : 33, "Earnings Date" : ISODate("2013-11-11T05:00:00Z"), "52-Week High" : -0.2732, "Change" : -0.0073, "Analyst Recom" : 2.3, "Volatility (Week)" : 0.0224, "Country" : "USA", "Return on Equity" : 0.078, "50-Day Low" : 0.0437, "Price" : 12.17, "50-Day High" : -0.2028, "Return on Investment" : 0.091, "Shares Float" : 33, "Dividend Yield" : 0.1476, "EPS growth next 5 years" : -0.061, "Industry" : "Independent Oil & Gas", "Sales growth quarter over quarter" : -0.388, "Operating Margin" : 0.986, "EPS (ttm)" : 1.49, "Float Short" : 0.0011, "52-Week Low" : 0.0437, "Average True Range" : 0.26, "EPS growth next year" : 0.1097, "Company" : "Enduro Royalty Trust", "Gap" : -0.0073, "Relative Volume" : 1.43, "Volatility (Month)" : 0.0205, "Market Cap" : 404.58, "Volume" : 406061, "Short Ratio" : 0.12, "Performance (Half Year)" : -0.2106, "Relative Strength Index (14)" : 33.3, "Insider Ownership" : 0.6, "20-Day Simple Moving Average" : -0.0471, "Performance (Month)" : 0.0381, "Institutional Transactions" : 0.1111, "Performance (Year)" : -0.1987, "LT Debt/Equity" : 0, "Average Volume" : 311.39, "EPS growth this year" : 4.677, "50-Day Simple Moving Average" : -0.0824 }
{ "_id" : ObjectId("5285380fbb1177ca391c318e"), "Ticker" : "WHZ", "Profit Margin" : 0.982, "Institutional Ownership" : 0.199, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 0, "Return on Assets" : 0.321, "Sector" : "Basic Materials", "P/S" : 4.79, "Change from Open" : -0.0042, "Performance (YTD)" : 0.0782, "Performance (Week)" : 0.0369, "P/B" : 1.67, "EPS growth quarter over quarter" : -0.337, "Payout Ratio" : 1.003, "Performance (Quarter)" : 0.0955, "P/E" : 4.88, "200-Day Simple Moving Average" : 0.0993, "Shares Outstanding" : 18.4, "52-Week High" : -0.0668, "P/Cash" : 1319.28, "Change" : -0.0042, "Analyst Recom" : 3, "Volatility (Week)" : 0.0183, "Country" : "USA", "Return on Equity" : 0.321, "50-Day Low" : 0.12, "Price" : 14.28, "50-Day High" : -0.0138, "Return on Investment" : 0.28, "Shares Float" : 18.4, "Dividend Yield" : 0.2064, "Industry" : "Independent Oil & Gas", "Sales growth quarter over quarter" : -0.343, "Operating Margin" : 0.982, "EPS (ttm)" : 2.94, "Float Short" : 0.004, "52-Week Low" : 0.2081, "Average True Range" : 0.26, "Company" : "Whiting USA Trust II", "Gap" : 0, "Relative Volume" : 2.18, "Volatility (Month)" : 0.0194, "Market Cap" : 263.86, "Volume" : 244298, "Short Ratio" : 0.6, "Performance (Half Year)" : 0.1282, "Relative Strength Index (14)" : 68.85, "20-Day Simple Moving Average" : 0.0301, "Performance (Month)" : 0.0864, "Institutional Transactions" : 0.0834, "Performance (Year)" : -0.0311, "LT Debt/Equity" : 0, "Average Volume" : 123.73, "50-Day Simple Moving Average" : 0.0734 }
{ "_id" : ObjectId("52853808bb1177ca391c27bd"), "Ticker" : "MVO", "Profit Margin" : 0.976, "Institutional Ownership" : 0.048, "EPS growth past 5 years" : 0.044, "Total Debt/Equity" : 0, "Return on Assets" : 1.258, "Sector" : "Basic Materials", "P/S" : 8.25, "Change from Open" : 0.0176, "Performance (YTD)" : 0.2883, "Performance (Week)" : -0.0007, "P/B" : 11.04, "EPS growth quarter over quarter" : -0.147, "Payout Ratio" : 1, "Performance (Quarter)" : 0.0678, "P/E" : 8.43, "200-Day Simple Moving Average" : 0.0422, "Shares Outstanding" : 11.5, "Earnings Date" : ISODate("2013-11-11T05:00:00Z"), "52-Week High" : -0.0998, "Change" : 0.0131, "Analyst Recom" : 4, "Volatility (Week)" : 0.0108, "Country" : "USA", "Return on Equity" : 1.258, "50-Day Low" : 0.0765, "Price" : 27.75, "50-Day High" : -0.0611, "Return on Investment" : 1.355, "Shares Float" : 8.63, "Dividend Yield" : 0.1431, "EPS growth next 5 years" : 0.07, "Industry" : "Oil & Gas Drilling & Exploration", "Beta" : 0.45, "Sales growth quarter over quarter" : -0.143, "Operating Margin" : 0.979, "EPS (ttm)" : 3.25, "PEG" : 1.2, "Float Short" : 0.0123, "52-Week Low" : 0.3994, "Average True Range" : 0.54, "Sales growth past 5 years" : 0.043, "Company" : "MV Oil Trust", "Gap" : -0.0044, "Relative Volume" : 0.36, "Volatility (Month)" : 0.0202, "Market Cap" : 314.98, "Volume" : 14403, "Short Ratio" : 2.44, "Performance (Half Year)" : 0.0367, "Relative Strength Index (14)" : 55.11, "Insider Ownership" : 0.25, "20-Day Simple Moving Average" : 0.0181, "Performance (Month)" : 0.0092, "Institutional Transactions" : -0.0054, "Performance (Year)" : 0.2008, "LT Debt/Equity" : 0, "Average Volume" : 43.54, "EPS growth this year" : 0.029, "50-Day Simple Moving Average" : 0.0058 }
{ "_id" : ObjectId("52853801bb1177ca391c1895"), "Ticker" : "AGNC", "Profit Margin" : 0.972, "Institutional Ownership" : 0.481, "EPS growth past 5 years" : -0.0107, "Total Debt/Equity" : 8.56, "Return on Assets" : 0.022, "Sector" : "Financial", "P/S" : 3.77, "Change from Open" : 0.0102, "Performance (YTD)" : -0.1652, "Performance (Week)" : -0.017, "Insider Transactions" : 0.4931, "P/B" : 0.86, "EPS growth quarter over quarter" : -8.2, "Payout Ratio" : 0.79, "Performance (Quarter)" : -0.0083, "Forward P/E" : 7.64, "P/E" : 3.68, "200-Day Simple Moving Average" : -0.1282, "Shares Outstanding" : 390.6, "Earnings Date" : ISODate("2013-10-28T20:30:00Z"), "52-Week High" : -0.2938, "P/Cash" : 3.93, "Change" : 0.0131, "Analyst Recom" : 2.6, "Volatility (Week)" : 0.0268, "Country" : "USA", "Return on Equity" : 0.205, "50-Day Low" : 0.0695, "Price" : 21.71, "50-Day High" : -0.1066, "Return on Investment" : 0.015, "Shares Float" : 383.97, "Dividend Yield" : 0.1493, "EPS growth next 5 years" : 0.035, "Industry" : "REIT - Residential", "Beta" : 0.51, "Sales growth quarter over quarter" : 0.073, "Operating Margin" : 0.67, "EPS (ttm)" : 5.82, "PEG" : 1.05, "Float Short" : 0.0311, "52-Week Low" : 0.1117, "Average True Range" : 0.52, "EPS growth next year" : -0.3603, "Company" : "American Capital Agency Corp.", "Gap" : 0.0028, "Relative Volume" : 0.71, "Volatility (Month)" : 0.02, "Market Cap" : 8370.56, "Volume" : 4576064, "Gross Margin" : 0.746, "Short Ratio" : 1.69, "Performance (Half Year)" : -0.2136, "Relative Strength Index (14)" : 43.53, "Insider Ownership" : 0.003, "20-Day Simple Moving Average" : -0.0318, "Performance (Month)" : -0.042, "Institutional Transactions" : 0.0077, "Performance (Year)" : -0.1503, "LT Debt/Equity" : 0, "Average Volume" : 7072.83, "EPS growth this year" : -0.169, "50-Day Simple Moving Average" : -0.0376 }
{ "_id" : ObjectId("5285380ebb1177ca391c3101"), "Ticker" : "VOC", "Profit Margin" : 0.971, "Institutional Ownership" : 0.161, "EPS growth past 5 years" : 0, "Total Debt/Equity" : 0, "Return on Assets" : 0.253, "Sector" : "Basic Materials", "P/S" : 9.03, "Change from Open" : -0.0129, "Performance (YTD)" : 0.4186, "Performance (Week)" : 0.0103, "P/B" : 2.44, "EPS growth quarter over quarter" : -0.304, "Payout Ratio" : 1, "Performance (Quarter)" : 0.1116, "P/E" : 9.3, "200-Day Simple Moving Average" : 0.2104, "Shares Outstanding" : 17, "52-Week High" : -0.0417, "P/Cash" : 948.6, "Change" : 0.0024, "Analyst Recom" : 3, "Volatility (Week)" : 0.0289, "Country" : "USA", "Return on Equity" : 0.253, "50-Day Low" : 0.1106, "Price" : 16.78, "50-Day High" : -0.0417, "Return on Investment" : 0.304, "Shares Float" : 12.75, "Dividend Yield" : 0.1266, "Industry" : "Independent Oil & Gas", "Sales growth quarter over quarter" : -0.286, "Operating Margin" : 0.971, "EPS (ttm)" : 1.8, "Float Short" : 0.006, "52-Week Low" : 0.529, "Average True Range" : 0.47, "Company" : "VOC Energy Trust", "Gap" : 0.0155, "Relative Volume" : 0.47, "Volatility (Month)" : 0.0292, "Market Cap" : 284.58, "Volume" : 32718, "Short Ratio" : 0.98, "Performance (Half Year)" : 0.2847, "Relative Strength Index (14)" : 54.66, "Insider Ownership" : 0.3505, "20-Day Simple Moving Average" : 0.009, "Performance (Month)" : 0.0582, "Institutional Transactions" : -0.0349, "Performance (Year)" : 0.3892, "LT Debt/Equity" : 0, "Average Volume" : 77.47, "EPS growth this year" : 0.542, "50-Day Simple Moving Average" : 0.0418 }
{ "_id" : ObjectId("52853807bb1177ca391c279a"), "Ticker" : "MTR", "Profit Margin" : 0.97, "Institutional Ownership" : 0.024, "EPS growth past 5 years" : -0.217, "Total Debt/Equity" : 0, "Return on Assets" : 0.518, "Sector" : "Financial", "P/S" : 12.1, "Change from Open" : -0.0038, "Performance (YTD)" : 0.1833, "Performance (Week)" : -0.0241, "P/B" : 7.82, "EPS growth quarter over quarter" : -0.255, "Payout Ratio" : 0.997, "Performance (Quarter)" : 0.0156, "P/E" : 12.68, "200-Day Simple Moving Average" : -0.0568, "Shares Outstanding" : 1.86, "Earnings Date" : ISODate("2013-11-11T05:00:00Z"), "52-Week High" : -0.1539, "P/Cash" : 23.5, "Change" : -0.0135, "Volatility (Week)" : 0.018, "Country" : "USA", "Return on Equity" : 0.593, "50-Day Low" : 0.0168, "Price" : 21.14, "50-Day High" : -0.1062, "Return on Investment" : 0.655, "Shares Float" : 1.86, "Dividend Yield" : 0.0845, "Industry" : "Diversified Investments", "Beta" : 0.93, "Sales growth quarter over quarter" : -0.222, "Operating Margin" : 0.939, "EPS (ttm)" : 1.69, "Float Short" : 0.0004, "52-Week Low" : 0.2026, "Average True Range" : 0.53, "Sales growth past 5 years" : -0.208, "Company" : "Mesa Royalty Trust", "Gap" : -0.0098, "Relative Volume" : 1.14, "Volatility (Month)" : 0.0226, "Market Cap" : 39.95, "Volume" : 4150, "Short Ratio" : 0.2, "Performance (Half Year)" : -0.1221, "Relative Strength Index (14)" : 34.54, "Insider Ownership" : 0.0385, "20-Day Simple Moving Average" : -0.0408, "Performance (Month)" : -0.0294, "Institutional Transactions" : -0.4527, "Performance (Year)" : 0.0418, "LT Debt/Equity" : 0, "Average Volume" : 3.97, "EPS growth this year" : -0.348, "50-Day Simple Moving Average" : -0.0539 }
{ "_id" : ObjectId("52853809bb1177ca391c2946"), "Ticker" : "OLP", "Profit Margin" : 0.97, "Institutional Ownership" : 0.481, "EPS growth past 5 years" : 0.008, "Total Debt/Equity" : 0.91, "Return on Assets" : 0.072, "Sector" : "Financial", "P/S" : 8.28, "Change from Open" : 0.0072, "Performance (YTD)" : 0.0398, "Performance (Week)" : -0.0156, "Insider Transactions" : 0.0039, "P/B" : 1.2, "EPS growth quarter over quarter" : 1.261, "Payout Ratio" : 0.456, "Performance (Quarter)" : -0.0804, "Forward P/E" : 10.48, "P/E" : 22.12, "200-Day Simple Moving Average" : -0.0742, "Shares Outstanding" : 14.84, "Earnings Date" : ISODate("2013-05-06T04:00:00Z"), "52-Week High" : -0.2453, "P/Cash" : 7.31, "Change" : 0.0077, "Analyst Recom" : 3, "Volatility (Week)" : 0.0166, "Country" : "USA", "Return on Equity" : 0.146, "50-Day Low" : 0.027, "Price" : 20.28, "50-Day High" : -0.1166, "Return on Investment" : 0.051, "Shares Float" : 13.88, "Dividend Yield" : 0.0695, "EPS growth next 5 years" : 0.111, "Industry" : "REIT - Diversified", "Beta" : 2.2, "Sales growth quarter over quarter" : 0.099, "Operating Margin" : 0.537, "EPS (ttm)" : 0.91, "PEG" : 1.99, "Float Short" : 0.0126, "52-Week Low" : 0.2285, "Average True Range" : 0.45, "EPS growth next year" : 0.171, "Sales growth past 5 years" : 0.06, "Company" : "One Liberty Properties Inc.", "Gap" : 0.0005, "Relative Volume" : 0.2, "Volatility (Month)" : 0.023, "Market Cap" : 298.81, "Volume" : 6907, "Gross Margin" : 0.983, "Short Ratio" : 4.64, "Performance (Half Year)" : -0.2219, "Relative Strength Index (14)" : 37.17, "Insider Ownership" : 0.158, "20-Day Simple Moving Average" : -0.0315, "Performance (Month)" : -0.0455, "Institutional Transactions" : 0.0003, "Performance (Year)" : 0.1663, "LT Debt/Equity" : 0.91, "Average Volume" : 37.56, "EPS growth this year" : -0.013, "50-Day Simple Moving Average" : -0.0356 }
```
<br/>

> 4. Qual foi o setor mais rentável?

```
db.stock.aggregate([{$group:{_id:"$Sector", profit:{$avg:"$Profit Margin"}}},{$sort:{profit:-1}}])
```
```
{ "_id" : "Financial", "profit" : 0.16467639311043566 }
{ "_id" : "Utilities", "profit" : 0.06569026548672566 }
{ "_id" : "Consumer Goods", "profit" : 0.03624657534246575 }
{ "_id" : "Conglomerates", "profit" : 0.03486363636363637 }
{ "_id" : "Industrial Goods", "profit" : 0.03170316091954023 }
{ "_id" : "Services", "profit" : 0.024760843373493976 }
{ "_id" : "Basic Materials", "profit" : -0.018308565737051793 }
{ "_id" : "Technology", "profit" : -0.02344516129032258 }
{ "_id" : "Healthcare", "profit" : -0.931430882352941 }
```
<br/>

> 5. Ordene as ações pelo profit e usando um cursor, liste as ações.

```
var cursor = db.stock.find({}).sort({'$Profit Margin':1})
cursor.next()
```
```
{
        "_id" : ObjectId("52853800bb1177ca391c1800"),
        "Ticker" : "AA",
        "Profit Margin" : 0.013,
        "Institutional Ownership" : 0.599,
        "EPS growth past 5 years" : -0.439,
        "Total Debt/Equity" : 0.65,
        "Current Ratio" : 1.2,
        "Return on Assets" : 0.008,
        "Sector" : "Basic Materials",
        "P/S" : 0.41,
        "Change from Open" : -0.0022,
        "Performance (YTD)" : 0.0502,
        "Performance (Week)" : -0.0694,
        "Quick Ratio" : 0.7,
        "Insider Transactions" : 0.1031,
        "P/B" : 0.75,
        "EPS growth quarter over quarter" : 1.143,
        "Payout Ratio" : 0.429,
        "Performance (Quarter)" : 0.1058,
        "Forward P/E" : 21.35,
        "P/E" : 35.96,
        "200-Day Simple Moving Average" : 0.0823,
        "Shares Outstanding" : 1070,
        "Earnings Date" : ISODate("2013-10-08T20:30:00Z"),
        "52-Week High" : -0.0925,
        "P/Cash" : 9.46,
        "Change" : 0.0033,
        "Analyst Recom" : 3.1,
        "Volatility (Week)" : 0.0345,
        "Country" : "USA",
        "Return on Equity" : 0.023,
        "50-Day Low" : 0.1579,
        "Price" : 9.02,
        "50-Day High" : -0.0925,
        "Return on Investment" : 0.007,
        "Shares Float" : 1068.5,
        "Dividend Yield" : 0.0133,
        "EPS growth next 5 years" : 0.1747,
        "Industry" : "Aluminum",
        "Beta" : 2.02,
        "Sales growth quarter over quarter" : -0.012,
        "Operating Margin" : 0.049,
        "EPS (ttm)" : 0.25,
        "PEG" : 2.06,
        "Float Short" : 0.1129,
        "52-Week Low" : 0.1899,
        "Average True Range" : 0.3,
        "EPS growth next year" : 0.231,
        "Sales growth past 5 years" : -0.041,
        "Company" : "Alcoa, Inc.",
        "Gap" : 0.0056,
        "Relative Volume" : 0.6,
        "Volatility (Month)" : 0.0336,
        "Market Cap" : 9619.3,
        "Volume" : 14600992,
        "Gross Margin" : 0.163,
        "Short Ratio" : 4.51,
        "Performance (Half Year)" : 0.0652,
        "Relative Strength Index (14)" : 49.61,
        "Insider Ownership" : 0.0007,
        "20-Day Simple Moving Average" : -0.0192,
        "Performance (Month)" : 0.0766,
        "P/Free Cash Flow" : 33.17,
        "Institutional Transactions" : 0.0252,
        "Performance (Year)" : 0.0963,
        "LT Debt/Equity" : 0.6,
        "Average Volume" : 26728.11,
        "EPS growth this year" : -0.673,
        "50-Day Simple Moving Average" : 0.052
}
```
<br/>

> 6. Renomeie o campo “Profit Margin” para apenas “profit”.

```
db.stock.updateMany({}, {$rename:{"Profit Margin":"profit"}})
```
```
{ "acknowledged" : true, "matchedCount" : 6756, "modifiedCount" : 4302 }
```
<br/>

> 7. Agora liste apenas a empresa e seu respectivo resultado

```
db.stock.find({},{"Company":1,"profit":1})
```
```
{ "_id" : ObjectId("52853800bb1177ca391c1800"), "Company" : "Alcoa, Inc.", "profit" : 0.013 }
{ "_id" : ObjectId("52853800bb1177ca391c1801"), "Company" : "WCM/BNY Mellon Focused Growth ADR ETF" }
{ "_id" : ObjectId("52853800bb1177ca391c1802"), "Company" : "iShares MSCI AC Asia Information Tech" }
{ "_id" : ObjectId("52853800bb1177ca391c1803"), "Company" : "Altisource Asset Management Corporation" }
{ "_id" : ObjectId("52853800bb1177ca391c17ff"), "Company" : "Agilent Technologies Inc.", "profit" : 0.137 }
{ "_id" : ObjectId("52853800bb1177ca391c1804"), "Company" : "Atlantic American Corp.", "profit" : 0.056 }
{ "_id" : ObjectId("52853800bb1177ca391c1805"), "Company" : "Aaron's, Inc.", "profit" : 0.06 }
{ "_id" : ObjectId("52853800bb1177ca391c1806"), "Company" : "Applied Optoelectronics, Inc.", "profit" : -0.023 }
{ "_id" : ObjectId("52853800bb1177ca391c1808"), "Company" : "Advance Auto Parts Inc.", "profit" : 0.063 }
{ "_id" : ObjectId("52853800bb1177ca391c1807"), "Company" : "AAON Inc.", "profit" : 0.105 }
{ "_id" : ObjectId("52853800bb1177ca391c180a"), "Company" : "American Assets Trust, Inc.", "profit" : 0.155 }
{ "_id" : ObjectId("52853800bb1177ca391c180b"), "Company" : "Almaden Minerals Ltd." }
{ "_id" : ObjectId("52853800bb1177ca391c180c"), "Company" : "Advantage Oil & Gas Ltd.", "profit" : -0.232 }
{ "_id" : ObjectId("52853800bb1177ca391c180d"), "Company" : "Atlas Air Worldwide Holdings Inc.", "profit" : 0.071 }
{ "_id" : ObjectId("52853800bb1177ca391c180e"), "Company" : "iShares MSCI All Country Asia ex Jpn Idx" }
{ "_id" : ObjectId("52853800bb1177ca391c1809"), "Company" : "Apple Inc.", "profit" : 0.217 }
{ "_id" : ObjectId("52853800bb1177ca391c180f"), "Company" : "AllianceBernstein Holding L.P.", "profit" : 0.896 }
{ "_id" : ObjectId("52853800bb1177ca391c1811"), "Company" : "ABB Ltd.", "profit" : 0.069 }
{ "_id" : ObjectId("52853800bb1177ca391c1810"), "Company" : "Abaxis Inc.", "profit" : 0.1 }
{ "_id" : ObjectId("52853800bb1177ca391c1813"), "Company" : "AmerisourceBergen Corporation", "profit" : 0.005 }
Type "it" for more
```
<br/>

> 8. Analise as ações. É uma bola de cristal na sua mão... Quais as três ações você investiria?

```
//
```
<br/>

> 9. Liste as ações agrupadas por setor

```
db.stock.aggregate([{$group:{_id:"$Sector", stocks:{$addToSet:"$Ticker"}}}])
```
```
{ "_id" : "Financial", "stocks" : [ "LARK", "BEN", "EEB", "AMRE", "MPA", "NIO", "HTGC", "SCIF", "PRF", "AOD", "SBB", "STFC", "DFE", "TAN", "EU", "RWXL", "HTR", "SHBI", "XBKS", "BRT", "BOND", "ISHG", "OB", "IRL", "LYG", "IGN", "GBCI", "PSCU", "SIL", "VOT", "CORN", "ZROZ", "FIVZ", "JQC", "CHEP", "QAI", "SCHA", "EFX", "SIZ", "IDU", "SRS", "MTU", "TBAR", "JO", "MGK", "TFI", "TZV", "BLH", "VCIT", "XLV", "OLO", "ANH", "KOLD", "PHH", "EEMA", "BNA", "AKR", "FNX", "PSR", "PXH", "PSCT", "GYRO", "GBF", "CHI", "NYCB", "TRNO", "XSLV", "NMO", "AAT", "FMN", "PNBK", "SMPL", "EGBN", "SRV", "JRS", "SLG", "PPS", "AXEN", "CYB", "ALD", "TWOK", "USB", "SDOW", "MUB", "SH", "PIM", "PWV", "FRI", "RJF", "TYN", "EV", "PEO", "PPT", "SGB", "VNQI", "UINF", "EMIF", "TZI", "MSFG", "XXV", "BNCN", "ERC", "LAZ", "TOWN", "ENGN", "AGII", "AOM", "MLPI", "FNB", "DFVS", "BFR", "MXI", "ESD", "BKBK", "MARPS", "PEX", "PPBI", "EMLP", "AMP", "RJI", "ALLB", "SGL", "FFKT", "HCN", "RMT", "NGE", "DPU", "AMPS", "MLPW", "RM", "FEX", "SLRC", "YDIV", "RUDR", "TY", "WMW", "WEA", "FMAR", "FXCH", "EQS", "EWH", "PNX", "PLTM", "PXSV", "GSVC", "CBND", "BIV", "GRU", "HMH", "SST", "BDJ", "WSBF", "RYU", "BBDO", "FRT", "BSE", "IDV", "AF", "PHYS", "RWM", "SASR", "VTI", "VWO", "JPNS", "BOH", "REW", "FNDF", "OPY", "CATY", "GDF", "HMG", "TLL", "TNA", "PHDG", "ACG", "JPM", "IBCD", "PFI", "RPG", "TYBS", "DNL", "BDGE", "NPY", "DDP", "EVF", "OPHC", "PXSC", "PTH", "FIBK", "BRO", "BKLN", "EEN", "CSP", "PZD", "SCHB", "GXC", "IBOC", "SCHP", "SPHB", "TZA", "CVOL", "THRD", "MGF", "DGAZ", "ERH", "SRTY", "VLUE", "STBA", "FCCY", "CBAN", "DEAR", "RBL", "IOT", "BABZ", "PML", "SAR", "RSXJ", "NASB", "CEW", "SCHZ", "QABA", "MGC", "LABC", "PCC", "PEK", "PEY", "ABR", "SF", "ETB", "HTY", "FYX", "CNBKA", "FAD", "SNFCA", "EWQ", "URA", "FOR", "NCBC", "SCJ", "FILL", "IHY", "INP", "MDYG", "QTEC", "WFD", "MUAC", "NNI", "BFOR", "GTY", "EVP", "FCZA", "DUST", "PBJ", "UGAZ", "AMTG", "MIG", "TSH", "EPS", "VAW", "HIG", "GROW", "MUAG", "SIVR", "IWL", "BIS", "IVZ", "BIK", "EIP", "MDIV", "SZK", "CZNC", "VIIX", "PGF", "CMO", "HAO", "GIM", "MLVF", "CHSP", "MTUM", "UVG", "GDXJ", "TDH", "WIBC", "WMH", "GBDC", "EWRI", "SAN", "FBNC", "ICH", "CIFC", "PWP", "RSE", "PLD", "DEF", "SGM", "UCD", "SBV", "PPA", "IFN", "IYY", "EWA", "BJK", "FNIO", "MIN", "OFED", "FXI", "NEAR", "DFT", "UBG", "TRV", "ELD", "BYLK", "EVAL", "FRAK", "ERY", "MFL", "MXE", "VCV", "QTS", "CBOE", "FSGI", "AGO", "IBCA", "EQR", "LOAN", "MLPJ", "VIG", "AGG", "VNQ", "WTBA", "COR", "PFXF", "XBI", "EEA", "HLSS", "NICK", "FEZ", "SIZE", "ASG", "RNE", "SIGI", "CSLS", "EWM", "AXR", "HHC", "HTBK", "MATL", "TCI", "MLPX", "SMMF", "KED", "PMR", "DRH", "MPW", "PBNY", "RETL", "TCAP", "EIDO", "MCN", "UTF", "BGY", "CRD-B", "PFIG", "RYH", "IPS", "FRN", "IYT", "PWB", "QMN", "PFBX", "FCE-A", "MMT", "FXY", "TOFC", "BSCD", "DNBF", "JRO", "EFV", "CPF", "JMP", "COF", "GAB", "HVPW", "SIBC", "ITIP", "EGPT", "RSU", "PDT", "CBG", "PSK", "OZM", "BNY", "CHIX", "BUSE", "CMSB", "PFL", "VPL", "ASDR", "BXMT", "CWI", "KEY", "MRF", "NMA", "TTF", "MCBI", "PVI", "RJZ", "TSI", "IIH", "BPFH", "DXD", "VO", "GBL", "ITB", "MNR", "USCI", "OFS", "HGSH", "NBO", "CHIQ", "IDX", "CIT", "EWRS", "GASL", "RBS", "RFG", "MAIN", "UMX", "VKI", "ACCU", "PSJ", "PZA", "GGOV", "DIG", "HTD", "ADRU", "UOIL", "TPS", "CSD", "IWZ", "FDL", "VRTA", "AUBN", "ENH", "RPI", "BYFC", "NOVB", "IMCB", "UBNK", "STIP", "PWC", "NGZ", "MCGC", "TIPX", "RWO", "TDTF", "OAKS", "HBHC", "NXR", "MONY", "BWX", "EARN", "UFCS", "SGF", "FINF", "NFJ", "IPW", "GAM", "BTO", "SBND", "SSO", "STPP", "WTM", "ECH", "GFIG", "PFSI", "PSP", "GLV", "ICN", "IGU", "AAXJ", "QQQE", "CVLY", "JJA", "PHK", "HR", "EVER", "NMR", "FM", "NMB", "CII", "ESRT", "FPO", "EMHY", "NWLI", "IMH", "KNOW", "PSCM", "HCC", "JOE", "ACE", "HYF", "EDEN", "BKF", "FHY", "IYE", "FCHI", "JGV", "KIE", "KLD", "NNY", "PIN", "PXSG", "RRF", "SFK", "SGG", "SHM", "NUM", "EGRW", "TDTT", "ATLO", "MYF", "TWO", "DSUM", "HMNF", "BQR", "NBN", "IYJ", "OTP", "CONE", "PFBC", "CNBC", "JKH", "PSI", "SOCL", "UBD", "SFG", "BHD", "VNO", "PSBH", "AMU", "BPO", "IWS", "PRU", "ADRA", "FDD", "LEO", "XPP", "DGZ", "CMF", "SCC", "RZG", "BPY", "CCA", "BPK", "CMU", "DCT", "BX", "EUM", "HIX", "NNP", "RESI", "SDOG", "BSCF", "DJCI", "DOD", "ESXB", "GTS", "SFNC", "SONA", "TZL", "RTR", "VUG", "CNDA", "MINT", "XLY", "PXN", "JUNR", "DRV", "IAT", "IJK", "SJL", "PRFS", "VTIP", "NBG", "RYT", "VXF", "EWZS", "HSPX", "BSRR", "HBCP", "UBCP", "WU", "BXDB", "PSEC", "VDC", "SNH", "BVA", "YCL", "CTO", "MYY", "IBKC", "SOHO", "XOVR", "CBNJ", "MLPL", "NLP", "SOXX", "BMRC", "FDUS", "CCCR", "HRZN", "PRI", "WDTI", "IIM", "IXG", "MQY", "CMD", "FWDD", "MLPY", "EWD", "REM", "MIW", "CSJ", "IYR", "MAV", "EIG", "MCY", "MFM", "ICE", "MLP", "KEF", "CRBQ", "CHEV", "FEP", "HMPR", "JJT", "NPV", "ROMA", "SKT", "UPW", "DBBR", "ASRV", "EGP", "DON", "EIV", "FFC", "IYM", "WRB", "FBG", "LTS", "NLY", "RNP", "JFC", "UKW", "VYM", "BBVA", "BCM", "RDIV", "ERW", "FBT", "MLPG", "ZFC", "PBW", "FBC", "KRG", "CHOC", "WSH", "BRK-B", "FXZ", "IQDY", "DOC", "MYI", "SFBC", "TTT", "TZG", "INCO", "QLTA", "SPXU", "VSPY", "EMI", "PNNT", "EWHS", "ASBC", "FUR", "JNK", "AIG", "AMRB", "BFK", "IBDC", "INFL", "CIZN", "FBMS", "NPI", "EBSB", "VFL", "GCV", "DLBS", "EFR", "INKM", "EMHD", "PULB", "NXC", "RVNU", "FISI", "JPS", "FTY", "AEG", "EBND", "PCN", "CBU", "TPRE", "BCBP", "PRA", "PJP", "AMIC", "ACWI", "SCO", "GBLI", "JKI", "KRC", "LM", "AOA", "STND", "EWY", "GRT", "PTM", "HBNK", "ENX", "OIH", "GSG", "DCA", "FRNK", "HGI", "HUSE", "CHLC", "DOG", "EWSS", "VONV", "DWTI", "IRY", "DGL", "NUO", "TBX", "CVBF", "MUAE", "DX", "JAXB", "CBIN", "BBH", "COBK", "MCR", "HYEM", "JHI", "PFBI", "AFL", "OBAS", "BPOP", "VGLT", "MBG", "RWR", "CTBI", "EWS", "JFBI", "FXL", "MUAF", "DIM", "PROV", "CAFI", "FVI", "NPP", "OSHC", "PPR", "PSCI", "ESBK", "PSAU", "IST", "MUI", "QCLN", "ROOF", "SMBC", "TWTI", "AZIA", "IYH", "PMNA", "XMPT", "BHY", "AQQ", "FAS", "FSG", "PPH", "GRID", "PRFQ", "STBZ", "RPX", "UBFO", "VT", "ARCP", "MBWM", "VTN", "RSP", "GGT", "XLU", "FTC", "GHL", "KME", "CTC", "VMBS", "VV", "BHLB", "IIF", "PWY", "FSZ", "RUSS", "EMFN", "SDY", "FULT", "TYO", "FHK", "NASI", "MXN", "ESBF", "OVBC", "FGD", "LBJ", "VHT", "MFD", "SPPR", "EPHE", "COLE", "NNC", "TAI", "VTA", "BRZU", "FXF", "AWF", "HASI", "WOOD", "XOOM", "TD", "PXLV", "STL", "HDB", "ITA", "GRI", "CCNE", "ENY", "LEAF", "SRCE", "CMDT", "VMO", "BWZ", "DBUK", "DEX", "IX", "OLEM", "WAYN", "ASP", "USMI", "SWS", "DBEF", "UMH", "WMC", "TYG", "OTR", "FCAN", "BMTC", "TWGP", "PXMC", "VOE", "MMI", "FMBI", "VBFC", "JKD", "CU", "XGC", "HPT", "SMIN", "SCHC", "PMM", "PFA", "TCBK", "IESM", "EDV", "CXH", "TYY", "AYN", "DTO", "UMPQ", "DGS", "MMV", "NXM", "XLB", "PBE", "HTH", "QID", "BRXX", "IRV", "IBKR", "ONEQ", "O", "BLV", "C", "CBF", "SRLN", "HTS", "TECS", "BTF", "EVR", "FCLF", "IF", "AXTE", "AEL", "FCL", "DIV", "IWX", "FPT", "ORIT", "VXX", "AKP", "DOL", "FAUS", "DBV", "SNV", "WRE", "GNMA", "EFU", "MHLD", "IAE", "FSBK", "NQJ", "OPOF", "PEBK", "VEU", "AMJ", "PMT", "EMEY", "EWBC", "IWN", "CPER", "NPM", "OAK", "PFS", "BCH", "PST", "RBCAA", "SDK", "THFF", "SGOL", "V", "TBBK", "PHF", "DBJP", "WVFC", "BLMT", "MUJ", "UGL", "ORM", "EMJ", "GVT", "JSN", "EDIV", "MNP", "MZA", "FPX", "GNAT", "NTC", "PWO", "PLBC", "FUBC", "LQD", "STWD", "CMBS", "USV", "APAM", "GDL", "GOV", "TICC", "NQU", "UKK", "IPN", "PQSC", "EWAS", "BAC", "LPSB", "MSL", "CHXX", "IMF", "MCC", "INBK", "CIB", "SEA", "EVY", "RFI", "SPYV", "EVX", "FR", "TDIV", "TIP", "PEI", "OFG", "RHP", "VDE", "VR", "GARS", "EET", "SOYB", "GXF", "RCAP", "LFC", "IGA", "BKN", "NAC", "KWT", "PRK", "RSCO", "HBAN", "HIH", "NSEC", "NWBI", "STEL", "AGD", "FCVA", "FXG", "GPM", "BIE", "BCAR", "MDY", "MDYV", "FGM", "EUO", "MHN", "QDEF", "FNLC", "FSRV", "INDL", "CXE", "OFF", "RSO", "EPV", "SHO", "BFS", "TSBK", "UBM", "UWC", "PGP", "CPT", "PRFU", "RTH", "CHCO", "CTNN", "EMITF", "ADZ", "RLI", "CRVL", "CFNB", "GZT", "MXF", "DRW", "CSWC", "FSFG", "ONEF", "PXMV", "REZ", "SAGG", "SIEB", "SLY", "TINY", "EVBN", "TRND", "TSS", "MZZ", "SSFN", "NBCB", "UIHC", "FCAP", "CURE", "Z", "BSMX", "PNFP", "OLBK", "ASBB", "EXL", "TDBK", "GIY", "OCN", "NWFL", "AFH", "MFNC", "TCFC", "EMCD", "LSTK", "VXUS", "LION", "NEN", "SUB", "PGHY", "XLI", "STT", "VWOB", "IVW", "SDS", "FSE", "CNA", "RY", "GS", "DBIZ", "DMLP", "PCY", "BBNK", "BFY", "MBFI", "PHD", "FNHC", "FSU", "TZO", "SPE", "FDV", "UBT", "ETV", "CSMN", "ITR", "PSB", "FPE", "CZA", "FITB", "FRME", "FEU", "IVOG", "JPX", "FFBH", "GRWN", "KBWI", "AWH", "DBEM", "LCM", "PSCC", "PVD", "RWV", "CNPF", "CUBA", "CB", "DEM", "FEN", "INN", "IVE", "SCD", "DGRW", "RIVR", "CVCY", "SYLD", "TOTS", "CNOB", "FLTR", "UWM", "YANG", "LBAI", "GLQ", "KCLI", "TLO", "RKH", "AON", "BLK", "EEH", "IGV", "SPLV", "NMZ", "ANCX", "BAF", "HKK", "MYC", "NVSL", "JKF", "RINF", "GLU", "ERX", "NIB", "CUT", "PCBK", "ING", "SHY", "BKOR", "VIOV", "CRRB", "HYXU", "TLI", "RVSB", "XMLV", "FMD", "NHI", "RDN", "UNM", "DVYA", "FWV", "UCBI", "EMFT", "DIRT", "IQDE", "HTLF", "KSM", "FRBK", "HFFC", "DWX", "SPHQ", "CGO", "LD", "JJP", "JEM", "RCKB", "EWW", "MITT", "JNS", "BMA", "PSCF", "FNDB", "SBCF", "SBW", "XLP", "KFS", "BSCL", "DGT", "MUA", "NUGT", "SOXL", "AFG", "EHTH", "FUNC", "ILF", "GSGO", "BEE", "PWJ", "FXC", "VPV", "WIW", "EWRM", "CLY", "BSCM", "GASZ", "GMM", "DBC", "PIE", "UTH", "VBF", "NBHC", "VPFG", "FMY", "GLPI", "RJA", "MA", "IRE", "IJR", "CHMG", "VBK", "EFC", "GAL", "FDEF", "HOMB", "IRT", "GCH", "FBP", "IGM", "KYE", "TQQQ", "AAIT", "IQDF", "KBWB", "UMBF", "IGE", "MUAD", "SPXS", "DPK", "AXDI", "APTS", "KFFB", "RING", "PLMT", "FEMS", "AGF", "DRGS", "CISG", "VONG", "WTFC", "KRNY", "PHO", "NKX", "UDR", "ACC", "NCT", "FBSS", "CFR", "ESS", "EWV", "RSX", "MMC", "GBNK", "BAL", "SPYG", "IBTX", "RALS", "AIZ", "HSA", "HAP", "EWI", "ECON", "EWGS", "HCBK", "HMST", "DNP", "PEBO", "VOOV", "MTG", "WSFS", "JKL", "THD", "WITE", "BDCS", "MFLR", "UBOH", "UDN", "LAND", "SBR", "PSL", "LPHI", "PNQI", "FXO", "MPV", "BSP", "SBSI", "BKCC", "DVM", "PEJ", "FXA", "SQQQ", "MAB", "KKR", "MHY", "DGP", "HCI", "STC", "VIS", "CMA", "CSH", "IEI", "WASH", "XLG", "DOO", "XME", "BNDX", "IVOP", "BXUB", "RXI", "SLF", "ALEX", "CWH", "VIOG", "IOO", "EBTC", "EMCF", "FLRN", "SBY", "SFI", "UTG", "OABC", "EWJ", "HALL", "MSXX", "CRF", "NCP", "PRFE", "GLAD", "EDD", "PEZ", "PMX", "DTN", "MTK", "UCFC", "VTV", "SLYV", "IFGL", "TMP", "IPE", "FWDI", "KB", "AMH", "CUBI", "FVL", "BLJ", "CORP", "GEX", "GSBC", "DBP", "GAIN", "GREK", "AFFM", "MUC", "MYD", "DJP", "PMBC", "JLA", "BSCH", "EFO", "LWC", "SBRA", "CBNK", "TVIZ", "NUC", "PALL", "BIZD", "BRK-A", "UCO", "VBR", "GSY", "VIIZ", "FOF", "XHE", "FCH", "DGICB", "PDM", "GUT", "NVC", "CFNL", "EVT", "OVLY", "YCS", "MVF", "FXN", "DWM", "ITUB", "ARPI", "SMK", "TOK", "EWC", "AGM", "UVSP", "XVZ", "GERJ", "PRFZ", "BAB", "EAPS", "TBNK", "TDX", "BPS", "BTA", "TCB", "VEA", "BBT", "BRAF", "VTHR", "MCBC", "IJS", "EEM", "HFBC", "SCHO", "IOIL", "LXP", "DBGR", "BQH", "ACGL", "CHFC", "CAC", "GURU", "NNN", "UBSI", "CG", "QQQX", "MOO", "SUI", "PAGG", "BAP", "WAFD", "PGJ", "LVL", "RWK", "IVOO", "FNDC", "AGLS", "NAD", "SCHF", "BBK", "INXX", "BOXC", "BSCK", "ANAT", "PCEF", "PJG", "PRFM", "NKG", "BCSB", "FCTY", "JTP", "GHI", "PVTB", "DRN", "BNJ", "FKU", "FTF", "GSC", "PXMG", "JFR", "RBPAA", "FUE", "NXJ", "ROIC", "IPK", "AXIT", "NUV", "AV", "EJ", "IFT", "GRES", "RAVI", "EVO", "UCC", "PB", "FFKY", "XIV", "SDD", "RJN", "LAQ", "PBIB", "BSBR", "AHL", "IDOG", "PBCP", "SMLV", "TRSK", "DDR", "DSM", "INR", "UGA", "TRNM", "NRZ", "UHN", "NFBK", "MGU", "MGI", "GVI", "HDGI", "FXCM", "LTL", "MFG", "IGR", "KST", "IJT", "JDD", "RAND", "FXB", "EWN", "RQI", "MQT", "VGT", "SIVB", "BLX", "MTGE", "PJM", "CSFS", "IROQ", "QLD", "BDD", "MIDZ", "FHN", "RIT", "HTBI", "TTFS", "SIR", "CXA", "FDT", "BOKF", "PFF", "PKY", "DTYS", "UXJ", "MBVT", "MSD", "JJS", "ECNS", "FNI", "DBAP", "ELS", "REK", "SCHR", "CIA", "HIS", "DYY", "CLNY", "MHF", "MKTX", "PRFG", "LSE", "MBRG", "JMI", "SKYY", "IXC", "BOS", "GGAL", "BRKL", "HMN", "AXS", "GF", "HPS", "HAFC", "IWM", "GRF", "EZM", "JKJ", "JHS", "PACW", "RCD", "SIFI", "HT", "EIRL", "SKF", "ERO", "STI", "EAD", "CLGX", "CFFN", "CLM", "FSBW", "EMCI", "GSMA", "MFSF", "SBFG", "JOF", "TUR", "BUND", "VCR", "SJH", "DVYL", "MHD", "NQM", "SJF", "DTH", "NQI", "VXZ", "WETF", "DBEU", "NXZ", "RXL", "WSBC", "CYN", "EVG", "DGRE", "GDX", "GSAX", "PRN", "RWJ", "BFZ", "TDD", "RLGY", "WREI", "FXSG", "HBMD", "DBU", "IFMI", "DMF", "USL", "CYE", "IWO", "MS", "IYK", "ANGL", "SPGH", "CSBK", "THHY", "TLH", "IBND", "MBI", "BTAL", "MUE", "OLP", "PJF", "JSC", "QQXT", "UPV", "BKSC", "INDB", "UVE", "DOM", "PKW", "AGA", "PBHC", "WEAT", "TDN", "Y", "BBX", "CBSH", "UKF", "TWQ", "ESGR", "EPR", "FAN", "IWD", "VOOG", "RTLA", "TILT", "ATAX", "SOCB", "OFC", "SUSQ", "UWTI", "AEC", "EKH", "PRE", "CSM", "ORRF", "IWP", "QCCO", "HPF", "UCP", "INTG", "SUNS", "VGM", "AVK", "PZT", "EZA", "RIF", "FRF", "NKSH", "RWT", "MYN", "INTL", "IBCB", "VSBN", "HQH", "CHMI", "AUNZ", "TECL", "JXI", "PHT", "PSCH", "GNW", "GCAP", "FXS", "TCBI", "CZFC", "KFYP", "SMFG", "COPX", "PMF", "ISRA", "SOXS", "DVYE", "EIA", "GLDX", "IBN", "EDC", "PDP", "BIF", "YYY", "ANCB", "AUD", "JJG", "BOM", "CCX", "IJH", "ITF", "QQEW", "UNB", "GUNR", "BOE", "BWINB", "PXI", "VPU", "ACIM", "MDD", "TIPT", "NMFC", "NYF", "IYLD", "AWP", "TYNS", "URTY", "NXN", "PMO", "BKMU", "UBA", "URTH", "XSD", "CSE", "NMI", "SCBT", "KTF", "PFM", "TGR", "PFO", "MNRK", "FBNK", "AFB", "PFLT", "MHE", "BRAQ", "MGV", "BERK", "PUI", "BCV", "FXD", "CFBK", "IPD", "FUND", "ARE", "WFBI", "PLCC", "BANR", "PEOP", "ADRE", "BHV", "PFEM", "PSQ", "SFST", "PNF", "TMV", "LND", "SDIV", "PTY", "TFSL", "NYMT", "BABS", "MAYS", "RNST", "SMN", "TCO", "RWW", "BOCH", "NAN", "ESR", "AUSE", "AAMC", "VIXH", "AADR", "NBBC", "TVIX", "VLT", "BGR", "MKH", "FDI", "ITE", "IWB", "SDYL", "JKG", "NIM", "IID", "BANC", "LNC", "WHG", "DPD", "COY", "SVXY", "XRT", "APF", "BGCP", "FNDX", "IJJ", "SRC", "IPU", "PWT", "FBIZ", "NPBC", "FNDA", "NQS", "DSI", "FCG", "CCBG", "PWZ", "MEN", "VTR", "TBT", "VGIT", "AFK", "AI", "FDN", "CCG", "FAZ", "FHC", "FRA", "EFA", "EWT", "MBTF", "ASPS", "RPV", "TAGS", "XRO", "CSMB", "RWL", "CGW", "FBMI", "PXLG", "MINC", "IYZ", "KIM", "PBCT", "FBRC", "TLTD", "NTX", "DLN", "IBDA", "WAL", "XES", "LBND", "GAZ", "GCE", "DEI", "IAI", "IBCP", "IHC", "PID", "ZTR", "XTL", "BDH", "IWW", "NMY", "ASBI", "TCRD", "WPS", "YINN", "FLOT", "OEF", "SMDD", "MATH", "SILJ", "UJB", "NYH", "VB", "ADC", "COW", "BSCE", "EVBS", "FEFN", "HAWK", "RTL", "ERIE", "EIHI", "SHV", "YXI", "CAFE", "CHN", "EVJ", "MRLN", "BZM", "ICLN", "EXR", "TPGI", "ECPG", "BOFI", "IGF", "IELG", "JPG", "PUK", "CHIE", "MCA", "REXR", "PIC", "ZION", "PCQ", "DTUS", "KMPR", "NBW", "PGX", "CIF", "BTZ", "TPL", "VTWO", "FNFG", "MYM", "PRB", "YDKN", "AB", "KROO", "FLC", "LDF", "CAF", "VGK", "KCAP", "TAO", "GLPIV", "EBMT", "GCC", "ACWX", "CSFL", "GLRE", "MVC", "SGAR", "SMMU", "IWV", "HEVY", "XHB", "VSS", "KORZ", "GHYG", "FDTS", "NUJ", "RSW", "TZE", "XVIX", "DSU", "PRFF", "KMM", "IDHB", "UCBA", "MTR", "NCV", "DES", "PIO", "VQT", "BNO", "USBI", "GML", "PDN", "WDR", "JTA", "EXG", "PEB", "CWB", "NCZ", "OIA", "BSC", "ITIC", "RCG", "NMT", "AFSI", "INY", "OZRK", "ICF", "UCI", "REMX", "MCI", "ITG", "CASH", "EOI", "EZJ", "EVM", "ESSA", "FNGN", "HVB", "BHK", "ETJ", "GUR", "CSMA", "LSBK", "TMF", "SSS", "UBC", "BME", "AXHE", "VFH", "VVR", "AMT", "BKYF", "FLAG", "GOF", "ZIV", "LSBI", "FCF", "DSTJ", "MFA", "TIPZ", "BANF", "ASEA", "QLTB", "COB", "EWZ", "HOME", "APB", "MCBK", "OHI", "CPSS", "JJN", "IXN", "QQQC", "JGBS", "MLN", "SLA", "IVOV", "USD", "BBCN", "GULF", "NXQ", "DFS", "NVX", "EMLC", "MN", "DUC", "DNI", "DTYL", "NFO", "SCHW", "MZF", "TRCB", "USA", "EMDD", "BXP", "FONE", "HILO", "CACC", "NZH", "SVBI", "WBKC", "EVV", "HYB", "NEWS", "ONN", "HCAP", "BICK", "RAS", "FFNW", "YAO", "IDHQ", "PW", "GLCB", "SMB", "XAA", "AYT", "CFFI", "CIM", "CKX", "NCO", "PJB", "ILB", "UBN", "IXJ", "FIEU", "BNS", "GASX", "BKT", "EXT", "FIG", "CFP", "CINF", "GMTB", "ICI", "MAA", "JLL", "PFG", "UPRO", "WIA", "WRI", "XOP", "MVV", "FXE", "HYMB", "PKBK", "GLBZ", "RE", "XLF", "GOOD", "BQY", "KOL", "PLW", "RYE", "SUBK", "UNL", "EWX", "NVY", "SWH", "EOD", "JJC", "AGQ", "CHFN", "ADX", "GLDI", "MPB", "NBH", "NSL", "CIU", "BDN", "AXUT", "INDY", "LHO", "DTF", "AJG", "ETFC", "MSF", "MSP", "FXU", "PAF", "DVY", "HDGE", "AHH", "BCA", "LGLV", "MET", "QLTC", "HYG", "MJI", "FCCO", "PYZ", "QQQ", "EWCS", "DHG", "IEF", "NEA", "THG", "EDZ", "ETW", "EWO", "KBWC", "HIW", "GGP", "KYN", "RF", "WBS", "IFEU", "NAVG", "PKO", "SDP", "COWN", "TLTE", "BYM", "HYT", "WDIV", "MHI", "BSAC", "MNA", "FSC", "FXH", "IBDB", "DBA", "BRE", "MYJ", "NUCL", "UBR", "PIZ", "SPXL", "GLL", "LGI", "HYV", "AXJL", "TWM", "IFNA", "GOVT", "ACAS", "COBZ", "DRL", "HDG", "FLAT", "MIY", "VTWV", "PWOD", "APO", "SBNY", "HFBL", "BOTJ", "DEW", "EMB", "IDLV", "BHB", "AMTD", "CHW", "MUH", "NDAQ", "PLND", "PPLT", "SBBX", "SSBI", "JPP", "ETG", "EIM", "CME", "EWU", "CHIM", "HHY", "BK", "DBB", "GLD", "IEV", "IGOV", "LKFN", "AGZ", "LNBB", "MSBF", "DHIL", "NKY", "FEO", "GFY", "NSM", "OKSB", "BLW", "ONFC", "PBS", "SEF", "SMH", "SNLN", "BBRC", "SOIL", "CARV", "CVY", "ROM", "AMNB", "AXMT", "CHLN", "SCHE", "EEME", "DNY", "FTA", "METR", "IHT", "MFC", "EEHB", "LAG", "VLY", "CRUD", "NRO", "AINV", "EEV", "RTM", "VSB", "JPC", "VIXM", "UNAM", "GYLD", "MVT", "MXA", "VRTS", "ZSL", "EFSC", "RFV", "RCS", "FMER", "GABC", "CHII", "IHF", "TREE", "HYHG", "NQC", "PZC", "HFWA", "CH", "BJZ", "KXI", "SSG", "BKK", "NOAH", "ESNT", "CUZ", "BMO", "AGNC", "BGT", "HYLD", "PTP", "TMK", "FCNCA", "KBE", "UST", "TUZ", "NYC", "SWZ", "HPI", "NOBL", "FMO", "IPFF", "BRZS", "FXCB", "IYF", "RYF", "FIW", "FSA", "UVT", "NXP", "IFSM", "PRFN", "PSTB", "PXE", "PGC", "XL", "JJE", "HEOP", "WF", "CFT", "NBTB", "AFCB", "EMDG", "AAME", "SCPB", "BWV", "IYC", "MIDU", "WAC", "ERUS", "WBCO", "ATLC", "PCK", "CNO", "WPC", "FORX", "WHLR", "INDA", "JJU", "ALFA", "SOR", "SNBC", "IGD", "MAC", "MFV", "DRR", "FXP", "KCE", "DHS", "BRAZ", "ARGT", "SEIC", "BIB", "CANE", "CLDT", "ACFC", "EWUS", "IYG", "KBWR", "MES", "CDR", "ZIPR", "BLE", "AXFN", "FFCO", "DFJ", "PZI", "TTH", "HIFS", "ULQ", "UVU", "IRR", "DCOM", "LSC", "DZZ", "AIV", "EWL", "TBF", "EUFN", "UYG", "VRD", "IHE", "JPZ", "OIL", "L", "UYM", "GSP", "DZK", "HYD", "NQP", "NZF", "PHB", "VNM", "AMG", "APSA", "ICB", "URE", "VONE", "DDG", "NECB", "ECF", "PL", "UTLT", "AMSF", "SYA", "JTD", "FOL", "KBWX", "AOK", "WD", "AMLP", "SBM", "VOYA", "HBC", "HBOS", "MRH", "IVR", "KORU", "EES", "NPF", "NGPC", "ISBC", "CM", "ABCB", "KRE", "MUNI", "GSRA", "GFED", "DB", "EOS", "HAV", "KRU", "ONB", "PAI", "HIO", "PIV", "PZN", "RLJ", "CPI", "DIA", "EZU", "EVN", "FAM", "FCT", "IYW", "NPT", "BXS", "SAL", "CEF", "BRF", "CSGP", "AXJS", "CXP", "PCM", "STAG", "WBB", "PICK", "JFBC", "OILZ", "TENZ", "VEGI", "IAF", "PICB", "KHI", "VYFC", "BIL", "EQL", "CHY", "MGYR", "EELV", "EPU", "RVT", "WRLD", "CEE", "ITOT", "NRK", "NATL", "TEI", "HHH", "RWG", "CSQ", "EPP", "PKB", "TDV", "CSG", "MSB", "NORW", "FMK", "MFI", "STPZ", "UGE", "GPT", "SCHV", "UMDD", "IXP", "TRC", "VMM", "WABC", "EWEM", "TWN", "PGM", "CCXE", "SZO", "LOR", "RLY", "IQI", "BNCL", "CIK", "EWG", "ICGE", "PNI", "PRFH", "SYBT", "ENZL", "RWX", "TNDQ", "MCRO", "NXK", "TRST", "FII", "UNTY", "GXG", "VOX", "FT", "NBTF", "NVG", "IWY", "GMFS", "JCE", "NOM", "QEH", "GMF", "FFIC", "RXD", "IAU", "PCF", "SBI", "HBK", "SCIN", "AHT", "FFBC", "EIS", "HQL", "IEZ", "GEMS", "RNR", "FAB", "EZY", "SCHX", "UVXY", "LRY", "CBL", "GGN", "BRP", "CPTA", "NYX", "GRN", "FMNB", "KIPO", "MTS", "PSA", "PBIP", "PBP", "QIWI", "ISI", "EFG", "IHI", "KW", "ETF", "CET", "SAA", "TAYC", "ILTB", "PFN", "EDR", "HME", "PJC", "EEML", "SPBC", "TYD", "PXQ", "ULE", "WSR", "PGD", "BLNG", "DLLR", "LCNB", "QDF", "NCA", "BSCG", "SJNK", "IBDD", "EIO", "KBWY", "SAFT", "GNR", "CACB", "PXR", "TSRE", "CART", "FCBC", "GTIP", "ACRE", "BHH", "EWK", "CUNB", "EFZ", "GII", "REXI", "TLT", "ETY", "BBF", "EMDI", "FWDB", "MNE", "NLR", "VCSH", "XTN", "QDYN", "AROW", "DLS", "JPNL", "IWC", "MBB", "RYJ", "JHP", "JKK", "BSV", "FDM", "TAXI", "KBWD", "PXF", "BCS", "IEO", "IBCE", "ICOL", "KINS", "QCRH", "DXJ", "FLIC", "FCO", "BFO", "EQY", "FLM", "STRS", "VEGA", "VKQ", "WIP", "IDXJ", "IWF", "DPO", "ARI", "FCFS", "GCA", "LTPZ", "PGR", "ALX", "PNC", "PYH", "BZF", "REG", "BAM", "RPAI", "RRGR", "CITZ", "SLV", "GCBC", "STSA", "UDOW", "BZQ", "DDF", "WBK", "ASA", "CMK", "PERM", "IRC", "AXSL", "SIJ", "EUSA", "SLM", "BKJ", "VCF", "NTRS", "VCBI", "JEQ", "PXLC", "VIXY", "CUBE", "FGB", "ACNB", "DRE", "ETO", "GLCH", "CNS", "CEV", "ORI", "PCL", "EFT", "HTA", "JGBD", "BOIL", "NHTB", "SKK", "IBB", "GDV", "VGSH", "ZF", "NRF", "VCLT", "WMCR", "BONO", "KFN", "MUS", "KCG", "OCFC", "TZD", "ARK", "CZWI", "NY", "FAX", "IBCC", "SLVO", "KF", "USO", "PICO", "PYN", "TRF", "DDM", "LIT", "FULL", "EGF", "AXP", "NNJ", "RHS", "LBF", "NRIM", "LPLA", "EFNL", "GBB", "FAF", "UUP", "IPF", "GLTR", "SLX", "GTAA", "MOFG", "BFIN", "EWP", "SCZ", "USAG", "MLPN", "CUPM", "GRR", "BMR", "RGA", "TSC", "FFR", "UAG", "DNO", "XLK", "CHXF", "VIOO", "PCH", "UBSH", "BBD", "VOO", "ARCC", "ARR", "GWX", "IPCC", "JGG", "HST", "FSP", "CARZ", "XPH", "COLB", "CNY", "NAZ", "NCU", "CLBH", "JKE", "FTBK", "EMCB", "FRC", "IAH", "NASH", "AVIV", "PBD", "BCF", "DLR", "BSCI", "ONEK", "NINI", "NRT", "TROW", "CLI", "SHG", "DTD", "DCNG", "ITM", "DHY", "SLVP", "BKU", "BSD", "TDF", "DEE", "PXJ", "IVV", "HWBK", "AOR", "HPP", "ISL", "FAC", "IFAS", "SPY", "ADRD", "AMBC", "IRS", "CLMS", "PSCD", "PUW", "UHT", "PFD", "GAF", "DBS", "KBWP", "FFA", "FVD", "TKF", "UBS", "WEET", "WEBK", "HYS", "DUG", "CAD", "BSCJ", "GWL", "HBNC", "FFG", "MFT", "DBO", "DHF", "LTC", "RGI", "PNXQ", "KRS", "ROLA", "RPT", "TRMK", "SPG", "PTF", "JXSB", "ALL", "EMD", "JJM", "IWR", "MMU", "CWBC", "PSCE", "SLYG", "UNG", "OBAF", "VRTB", "IRET", "EPOL", "SCHG", "EHI", "NGX", "DBE", "SPXH", "FXR", "AIA", "OSBC", "AVB", "EXI", "FUD", "NHS", "ARL", "RUSL", "LATM", "XLE", "EPI", "BND", "FFNM", "RMAX", "FAV", "FNF", "EMF", "CYS", "RZV", "TBZ", "VTWG", "INB", "WFC", "MKL", "MTB", "UXI", "DAG", "EMMT", "PIQ", "CS", "HEDJ", "TELOZ", "IAK", "GTWN", "CQQQ", "DOIL", "FFIN", "HF", "HCP" ] }
{ "_id" : "Healthcare", "stocks" : [ "KYTH", "BDX", "DRTX", "MNK", "ENZ", "GENT", "ONTY", "ANGO", "FCSC", "HALO", "USPH", "FONR", "BIOD", "FMS", "WLP", "CEMP", "DYNT", "BSPM", "IMMY", "MLAB", "ZGNX", "CBM", "STAA", "OREX", "RGEN", "BIOS", "NEO", "SSY", "ELMD", "WST", "APPY", "CFN", "ARWR", "EW", "AIRM", "AMRN", "SCMP", "KND", "ATOS", "CMN", "NKTR", "QDEL", "SCR", "THOR", "ELGX", "USMD", "SVA", "ELOS", "DYAX", "DEPO", "LLY", "KOOL", "SGEN", "ABMD", "JNJ", "NUVA", "XRAY", "MYRX", "LXRX", "CNMD", "NEOG", "NURO", "GNVC", "CNDO", "BCR", "HUM", "DXCM", "ORMP", "TELK", "BRLI", "BCRX", "DXR", "ESPR", "KERX", "POZN", "CUTR", "IART", "IPXL", "PRAN", "STSI", "VIVO", "BONE", "HSP", "ECTE", "VOLC", "TSPT", "DNDN", "KPTI", "APRI", "PCYC", "MDXG", "TPI", "GIVN", "TGTX", "MSON", "CNAT", "WCG", "ABAX", "INSY", "MGNX", "AERI", "CBST", "MDCO", "NVDQ", "WMGI", "CCM", "ENMD", "MRK", "CBPO", "BOTA", "CO", "AGN", "LPTN", "COO", "SNN", "VSTM", "PMD", "CRL", "HSKA", "TECH", "DRAD", "ANIK", "ENDP", "LMAT", "IG", "CPRX", "HRT", "GSK", "RMD", "VRML", "CYTX", "MTD", "RNA", "RGDX", "ALR", "TMO", "ELN", "SNY", "XON", "IRWD", "ALKS", "MGLN", "EXEL", "EVHC", "ALNY", "LCI", "ALXA", "OCRX", "IMRS", "STML", "PTLA", "PBIO", "ACHN", "PBYI", "UTMD", "HNSN", "CLSN", "HOLX", "SRNE", "HTBX", "NPSP", "CYCC", "BKD", "NBS", "AFFY", "UTHR", "TFX", "SYN", "ALSE", "LFVN", "INSM", "SPEX", "DGX", "HBIO", "LDRH", "AEZS", "MGCD", "REGN", "ANTH", "ALIM", "ENZN", "NXTM", "BABY", "SKH", "VCYT", "STEM", "MRNA", "Q", "UNIS", "GENE", "FLML", "ZTS", "HGR", "CBMX", "IMMU", "OMER", "ACT", "EMIS", "OFIX", "ICEL", "SRPT", "MDVN", "IVC", "BAXS", "LGND", "CHTP", "PLX", "PRPH", "AVNR", "GALT", "GHDX", "ULGX", "ARAY", "ACOR", "INCY", "VNDA", "UAM", "ENTA", "CLDX", "ABIO", "ADUS", "SPHS", "ZLTQ", "STE", "HMA", "TRGT", "ISR", "SIRO", "TNGN", "NBIX", "STXS", "THLD", "NAII", "CCXI", "AMBI", "JAZZ", "APPA", "FOLD", "CYBX", "MEIP", "AFAM", "FVE", "DSCO", "CI", "PETX", "PGNX", "ALXN", "FMI", "MMSI", "HTWR", "ISRG", "RMTI", "SPAN", "CRY", "SSH", "VTUS", "RNN", "PBMD", "ASTM", "HZNP", "XOMA", "GNMK", "EXAC", "IDXX", "SCLN", "NAVB", "RELV", "CPHI", "HPTX", "CBLI", "SPPI", "SRDX", "UNH", "RDY", "TXMD", "OHRP", "TARO", "OVAS", "VASC", "MNKD", "NYMX", "STJ", "PTCT", "AMSG", "CRTX", "FPRX", "PTIE", "QCOR", "GNBT", "XLRN", "CELG", "FATE", "GILD", "RPRX", "TNXP", "CRDC", "XNPT", "AMED", "IMUC", "OCLS", "ONTX", "NNVC", "CUR", "SNTA", "CPIX", "EVOK", "FRX", "LMNX", "AVEO", "GTXI", "IBIO", "NWBO", "LH", "WX", "ACUR", "RVP", "AMS", "EBS", "SURG", "ARQL", "BSTC", "ATHX", "CYNO", "ESC", "VRTX", "CVM", "TEAR", "CSII", "ZIOP", "ARTC", "CYTR", "A", "MSA", "MYL", "NVS", "SYK", "VICL", "PIP", "ISIS", "TRNX", "PRSC", "ATRC", "RGLS", "RIGL", "PPHM", "USNA", "KBIO", "IPCI", "VSCI", "MSTX", "PRGO", "NATR", "ESMC", "ONVO", "ROSG", "SMA", "ANCI", "MR", "ZLCS", "THRX", "BMRN", "MAKO", "VRX", "AKRX", "CDXS", "ADXS", "CMRX", "CXM", "MDT", "ONCY", "THC", "CADX", "KIPS", "ACST", "ACAD", "VAR", "CSU", "ARRY", "OGXI", "PSTI", "DHRM", "HCA", "AMPE", "EXAS", "IPCM", "ITMN", "OXBT", "VPHM", "DVAX", "LCAV", "MACK", "INFI", "SLTM", "ENSG", "PRXL", "OXGN", "AHS", "ESRX", "ABT", "AIQ", "ANAC", "VRNM", "NLTX", "APT", "GEVA", "IDIX", "CBRX", "NVAX", "LPDX", "PCRX", "CRIS", "MDRX", "ADK", "CGEN", "PTN", "HEB", "LHCG", "NVO", "LIFE", "ENZY", "EPZM", "HRC", "OMED", "AEGR", "ATRS", "ABBV", "RCPT", "GTIV", "BAX", "MNTA", "SQNM", "ATEC", "MD", "CYTK", "IMGN", "MELA", "ILMN", "AMRI", "SGYP", "GB", "ROCM", "SUPN", "PODD", "TTHI", "ANIP", "TRIB", "DSCI", "NSTG", "PHMD", "OPXA", "UHS", "PTX", "AXGN", "DVA", "AMAG", "MDCI", "BDSI", "CRME", "CYAN", "DARA", "ETRM", "BIIB", "PATH", "OPK", "BIOL", "OSUR", "RDNT", "SNSS", "ACHC", "IDRA", "ERB", "INO", "SLXP", "CAPS", "MOH", "HIIQ", "NHC", "QLTI", "AZN", "HH", "NLNK", "SEM", "NDZ", "ARNA", "PDEX", "AUXL", "OGEN", "TSRO", "VVUS", "INFU", "BMY", "SNTS", "WAT", "PKI", "BTX", "NVGN", "ECYT", "OSIR", "CASM", "CNC", "PDLI", "LPNT", "MNOV", "DVCR", "HWAY", "TTPH", "BLUE", "SIGA", "CEMI", "BSDM", "BSX", "GALE", "HAE", "MASI", "UPI", "EDAP", "COV", "SGMO", "AET", "ICUI", "SKBI", "ZMH", "AMGN", "ATRI", "NSPR", "ABMC", "BGMD", "CORT", "GERN", "GWPH", "NSPH", "PETS", "SGNT", "ICLR", "HNT", "CVD", "DRRX", "ACRX", "PACB", "AGIO", "GMED", "IRIX", "ICPT", "TEVA", "SPNC", "PFE", "RPTP", "AXDX", "NBY", "HITK", "AGEN", "RTIX", "TGX", "LAKE", "AHPI", "TROV", "ADHD", "PSDV", "ARIA", "CTIC", "ALGN", "AXN", "CHE", "HLS", "BVX", "ICCC", "CRMD", "OPHT", "BEAT", "BIND", "CLVS", "PRTA", "CERS", "DCTH", "CYH" ] }
{ "_id" : "Technology", "stocks" : [ "DSPG", "CRAY", "NSYS", "PKT", "CYBE", "NETE", "NEWN", "IPGP", "SOFO", "OVRL", "TRT", "ACN", "SKM", "SYX", "TTWO", "ADP", "ELLI", "BDR", "MTSN", "CSGS", "RST", "USM", "VSAT", "WIFI", "ZNGA", "CSIQ", "VEEV", "IDT", "ICAD", "PCO", "INVN", "ALLT", "PLT", "KBALB", "GRVY", "INXN", "CTS", "NTAP", "ALAN", "GEOS", "AMBT", "MCZ", "ETAK", "FU", "DWCH", "EXA", "AMAP", "HSTM", "IIVI", "CSPI", "KEM", "FLTX", "CRM", "ISSI", "AXTI", "DYSL", "NVEC", "ATTU", "PACT", "EVTC", "PRGS", "SQI", "TER", "CCUR", "TIGR", "TISA", "TSTC", "VOCS", "MFLX", "NTE", "LOOK", "ACXM", "DGII", "XRX", "MIND", "GLW", "NMRX", "VOD", "JCS", "CMGE", "GIB", "CHU", "DTSI", "FENG", "IMN", "LXFT", "EOPN", "MEI", "OTEL", "CLRO", "PKE", "AFOP", "SEAC", "SPWR", "ATNY", "TNGO", "AMSWA", "TQNT", "TYL", "BV", "REDF", "SSYS", "LORL", "CIEN", "BRCM", "VLTC", "QLYS", "IPAS", "WIRE", "SPLK", "SWIR", "TST", "QUMU", "IBM", "CPHD", "FSL", "MCRS", "SMSI", "OIBR", "CPSI", "HRS", "EPAY", "TAOM", "CSUN", "QBAK", "OVTI", "ATE", "MEAS", "SFUN", "TSM", "VTSS", "ACLS", "CYNI", "VRSN", "WSTL", "YELP", "CBEY", "ATRM", "ALTV", "IRDM", "KNM", "SUPX", "BPHX", "CHKP", "IDSY", "BSQR", "STRM", "GILT", "TBOW", "MXL", "GTAT", "AVID", "ORBC", "UTSI", "ARUN", "PLXS", "ALOT", "DMRC", "ZOOM", "UBNT", "ST", "GIGM", "DMD", "KEYW", "SNDK", "MOLX", "ADBE", "NTWK", "NCTY", "CNET", "CTG", "NCIT", "ACCL", "RVLT", "DCM", "ENTR", "LNKD", "MSPD", "CRDS", "KT", "FORTY", "TI", "CREE", "CTRL", "LOCM", "GSB", "HTCO", "ELTK", "EXE", "JBL", "SOHU", "EIGI", "GRMN", "CNQR", "MORN", "ROVI", "SPRD", "INOD", "ADI", "PRFT", "UPIP", "RRST", "SMCI", "VNET", "VRTU", "LVLT", "ARRS", "WGA", "YHOO", "CKSW", "YNDX", "ZIGO", "SIMO", "EVOL", "EZCH", "MOSY", "CVT", "EA", "KVHI", "RBCN", "SPIR", "SREV", "DLB", "EPAM", "DIOD", "ELNK", "PHI", "COOL", "JKHY", "TLK", "ATGN", "PSEM", "SIFY", "VDSI", "DATE", "MKTY", "FIO", "CSOD", "HITT", "LOCK", "SANM", "SCTY", "LUNA", "LIVE", "FTNT", "FIS", "PLNR", "ORBT", "AUDC", "ONSM", "MNDO", "WAVX", "PNTR", "NXPI", "SWI", "XXIA", "PULS", "CRNT", "LTXC", "VRNT", "PDFS", "ULTI", "FALC", "MITK", "ESP", "VCLK", "QSII", "QNST", "BHE", "VMW", "CCMP", "NUAN", "SEV", "I", "PRSS", "PMCS", "PFPT", "JASO", "N", "ALTI", "TIBX", "CYOU", "WBMD", "EBIX", "SSNI", "NOK", "XRSC", "AAOI", "MANH", "RATE", "RALY", "CALL", "CY", "BT", "GIG", "SGMA", "TWTR", "PT", "TCL", "INFA", "CHT", "FNSR", "MBIS", "BBOX", "MTSL", "VSH", "OTIV", "MSCC", "TMUS", "SLTC", "VZ", "AOL", "RTEC", "SPNS", "VJET", "IMOS", "AMX", "NOW", "MKTO", "PINC", "TEO", "NSR", "NSIT", "ASML", "HSOL", "OLED", "CIS", "MERU", "ACTS", "OPAY", "SGI", "TEF", "SUNE", "ISNS", "NEON", "CTSH", "TCCO", "WDAY", "TDC", "UNXL", "ORCL", "CHA", "ITRI", "LXK", "RHT", "RNIN", "WIN", "DAIO", "ATEA", "DDD", "RMBS", "ASMI", "EMC", "NQ", "PAMT", "ATMI", "IHS", "NLST", "CLRX", "MBT", "ABTL", "QCOM", "EFII", "HCOM", "INFY", "ALOG", "QLIK", "JRJC", "MKTG", "RCI", "TNAV", "UBIC", "ADTN", "VIV", "EONC", "ASTI", "ESE", "SWKS", "ASUR", "IPHI", "LOGI", "NTT", "VELT", "BRKS", "ELSE", "CLS", "LPTH", "CAMP", "OIBR-C", "ORAN", "S", "SQNS", "VMEM", "ATNI", "API", "PCTI", "CRTO", "KTCC", "ENTG", "MGIC", "BCOR", "SCKT", "WWWW", "CTRX", "IFON", "CMTL", "DELL", "LLNW", "COMM", "SCMR", "PLCM", "STM", "BITA", "DPW", "ISS", "TRNS", "TSEM", "TXTR", "BIRT", "EMKR", "ALU", "YY", "CRUS", "AMCC", "DRWI", "TKC", "TDS", "KLAC", "SPA", "FARO", "MANT", "GOOG", "EXTR", "PERI", "APH", "SNCR", "ERIC", "ARMH", "ADVS", "MDSO", "MOCO", "SMIT", "CPWR", "OCLR", "RDA", "DNB", "ADNC", "IGT", "NINE", "RP", "SAIC", "QLGC", "XPLR", "GAME", "ARCW", "AVG", "BRC", "NVDA", "SYNC", "CODE", "HIMX", "CERN", "SGK", "SYMM", "VICR", "MX", "SIGM", "EFUT", "SINA", "RNET", "AEIS", "ATVI", "IEC", "SONS", "AWAY", "ATML", "HTCH", "LMOS", "QTM", "ZIXI", "IPDN", "XRTX", "AVGO", "CCOI", "CNTF", "MIXT", "BIDU", "MOVE", "ARX", "BMI", "IMI", "DTLK", "COHU", "FSLR", "MAMS", "EGHT", "CUB", "IGLD", "PRO", "DRAM", "LEAP", "CSC", "EGAN", "INAP", "FLDM", "MDAS", "MKSI", "MATR", "GNCMA", "ONNN", "CLFD", "MSCI", "BCOM", "CLIR", "RAX", "SHOR", "SILC", "SLH", "LOGM", "BR", "GOGO", "GCOM", "TRIP", "TRMB", "GLOW", "MCHP", "BLKB", "TZOO", "EQIX", "ININ", "NICE", "AVNW", "AERG", "ANEN", "BCOV", "CBR", "FORM", "MRGE", "ANAD", "CSCO", "DATA", "DLGC", "MXWL", "PTGI", "RFIL", "ADAT", "DSTI", "EMAN", "GA", "MPWR", "STRP", "AMBA", "STV", "BIO", "SNPS", "NATI", "ISIL", "NLSN", "EPIQ", "CCI", "JDSU", "ESIO", "MENT", "SABA", "LIQD", "SYMC", "TEL", "BOSC", "GIMO", "COHR", "INFN", "PGI", "GWAY", "AMAT", "LDR", "ADSK", "MITL", "MONT", "PANW", "NTGR", "ELON", "BTUI", "AKAM", "EXFO", "PTNR", "MTSC", "RITT", "EGOV", "CEL", "CALD", "SCSC", "GSAT", "BVSN", "SHEN", "FRP", "IXYS", "NVMI", "SMI", "SPCB", "EDGW", "RWC", "TYPE", "VHC", "PLUS", "DRIV", "VIMC", "FCS", "WIT", "UCTT", "RKUS", "LLTC", "GSIG", "IKAN", "LSCC", "CNSL", "ASYS", "CHYR", "CEVA", "TSYS", "ZHNE", "AOSL", "SMTX", "VG", "MRCY", "INPH", "COVR", "FEYE", "LRCX", "GTT", "KONG", "QADA", "RNG", "SYNT", "TSRI", "ORBK", "PLAB", "CALX", "JNPR", "TXN", "VCRA", "INVE", "KLIC", "CNIT", "LDOS", "VIP", "JST", "SPIL", "CA", "GUID", "KOPN", "YOKU", "HURC", "FFIV", "MARK", "IRF", "NANO", "BSFT", "CGNX", "ENVI", "MSFT", "PCYG", "NTS", "IDCC", "INTU", "KONE", "MSTR", "IL", "RNWK", "VECO", "RVBD", "ELX", "LRAD", "AVX", "TSU", "CBB", "AGYS", "TWER", "SCON", "DAEG", "HPQ", "AMKR", "ECOM", "LTON", "LTRX", "MU", "IGTE", "PSMI", "PEGA", "RDCM", "RSTI", "DGLY", "SIMG", "STRN", "FICO", "MOBI", "SYKE", "TI-A", "TWTC", "VRNG", "WDC", "GWRE", "IO", "TRMR", "GIGA", "SSNC", "WPCS", "XLNX", "YGE", "NTES", "SLAB", "IMPV", "WUBA", "LFUS", "CCIH", "UIS", "DQ", "BBRY", "CTXS", "SATS", "NTLS", "DST", "TCX", "TRAK", "EXAR", "GRPN", "PLXT", "INTT", "DOX", "HMNY", "IQNT", "SPSC", "BCE", "DVOX", "AMSC", "SYNA", "T", "ANGI", "DWRE", "AYI", "NIHD", "OPEN", "BRCD", "DBD", "SMTC", "MSI", "STP", "TTMI", "UTEK", "AFFX", "FTR", "LEDS", "NVTL", "VIDE", "STX", "TACT", "TIK", "LONG", "PMTC", "TLAB", "PWRD", "PTIX", "TXCC", "USMO", "ANSS", "WTT", "ASX", "MXT", "IACI", "ACIW", "AZPN", "KYO", "LPL", "LSI", "ACTV", "IGOI", "MLNX", "OMCL", "CHL", "SLP", "IT", "TSRA", "AUO", "INTC", "MRIN", "MTSI", "SYPR", "BRKR", "HILL", "CTL", "GSIT", "IIJI", "NTCT", "OESX", "QUIK", "CVLT", "ASIA", "DRCO", "FB", "COVS", "HAUP", "ALVR", "CAMT", "GKNT", "ENPH", "CSCD", "GLUU", "BLIN", "IMMR", "IRM", "ITI", "LDK", "DSGX", "FEIM", "MCRL", "NCR", "PLUG", "COGO", "AEHR", "ORCT", "POWI", "OTEX", "IDTI", "CTCH", "PRCP", "AMD", "MXIM", "INS", "NPTN", "MEET", "GVP", "BELFB", "OPLK", "MVIS", "RFMD", "TTGT", "BNFT", "FEIC", "SPRT", "PXLW", "RDWR", "ALSK", "SAP", "HLIT", "SLI", "TRLA", "TU", "VIAS", "RSYS", "VII", "CIMT", "CDNS", "FDS", "FLEX", "IVAC", "AWRE", "JIVE", "MRVL", "JCOM", "PRKR", "QIHU", "CAVM", "ALTR", "SOL", "TSL", "SAAS", "PAR", "SAPE", "OIIM", "UMC", "OCZ", "VPG", "NTL" ] }
{ "_id" : "Industrial Goods", "stocks" : [ "BEAV", "KAMN", "ARTX", "WSCI", "CAT", "NES", "FAST", "NOC", "WWD", "ECOL", "BRSS", "OC", "DCI", "AGCO", "DCO", "RXN", "DGI", "ALG", "HON", "KAI", "TILE", "UQM", "ESLT", "PKOH", "PPO", "EFOI", "CMI", "ESL", "SPB", "AMOT", "IEX", "THR", "GTI", "CBI", "LII", "PWR", "RSOL", "NFEC", "SMED", "EEI", "CREG", "MY", "NTK", "PNR", "TRR", "JCTCF", "MWA", "BIN", "CBAK", "MKTAY", "CECE", "LECO", "PGEM", "OFLX", "DEL", "CAS", "HII", "CSTE", "ITW", "FELE", "HNH", "RINO", "VMI", "MASC", "DOOR", "RS", "SPF", "GFA", "CLWT", "CLH", "AIN", "GE", "SVT", "USG", "BA", "USLM", "UTX", "MTH", "CNHI", "LNN", "CSTM", "CCF", "CW", "EME", "JBT", "MTW", "MRC", "NVR", "MTRX", "PFIN", "CFX", "CIR", "GLDD", "FLR", "PCP", "PHM", "AIMC", "PRIM", "TATT", "TDG", "WOR", "ATRO", "BZC", "SCX", "MNTX", "ENS", "SNHY", "CLC", "HCCI", "MDC", "GVA", "IDSA", "GV", "LYTS", "IGC", "AVHI", "GIFI", "HI", "PATK", "PLPC", "CVU", "FLIR", "CPST", "MFRI", "PRLB", "SI", "STCK", "TECUA", "THTI", "AZZ", "CCCL", "RAVN", "TMHC", "GFF", "TTC", "CCC", "HPJ", "JHX", "MHK", "GPRC", "PIKE", "GY", "TNC", "DHR", "XIN", "ZBRA", "BZH", "MAG", "CMCO", "BWEN", "HYGS", "SSD", "AMRC", "HXL", "MLM", "RYN", "NX", "LXFR", "PLL", "CLNT", "EML", "SCHN", "ADES", "EMR", "ASTE", "ABB", "CHCI", "AOS", "FLOW", "GD", "AAON", "CCIX", "IR", "DY", "ICA", "STRL", "BLT", "LEN", "SNA", "HUB-B", "HEI", "MAS", "WCN", "BECN", "DRC", "SPW", "NDSN", "PSIX", "ETN", "TDY", "RGR", "UFI", "ATK", "TWIN", "GTLS", "DXYN", "ERJ", "HW", "ADEP", "TOL", "SXI", "BNSO", "HAYN", "UFPI", "ATU", "CWST", "PH", "REFR", "CYD", "MEA", "NJ", "GRH", "FTEK", "AWI", "AME", "CVV", "KMT", "VTNR", "PGTI", "GGG", "MHO", "TEX", "WM", "GHM", "AGX", "XLS", "XONE", "SPR", "ATI", "ROP", "DE", "JKS", "ACFN", "XYL", "IIN", "AIXG", "HDNG", "TREX", "BLDP", "GNRC", "ROK", "BOOM", "LLL", "LAYN", "TXT", "AVAV", "BGG", "CRS", "TASR", "ARTW", "B", "MYRG", "TAYD", "CUO", "ZBB", "AERT", "KBH", "TPH", "LGL", "JOY", "PESI", "GRC", "HOLI", "SWHC", "ORN", "ULBI", "TRS", "TXI", "ERII", "MTZ", "APWC", "FIX", "APOG", "COL", "AIRI", "CAE", "AEGN", "BDC", "CR", "SWK", "FLS", "MIDD", "RBC", "TS", "CADC", "ASTC", "HEAT", "DOV", "OSIS", "POPE", "NCS", "ZEUS", "ZOLT", "LMT", "CPAC", "TKR", "DHI", "CUI", "BGC", "FWLT", "SRCL", "USCR", "AETI", "HIHO", "GLPW", "LMIA", "ACPW", "MOG-A", "CFI", "RYL", "TPC", "VE", "WTS", "ROLL", "BWC", "EAC", "HWG", "IESC", "CDTI", "GENC", "MLI", "TGI", "GAI", "NNBR", "CVCO", "RSG", "TOWR", "CRH", "CVR", "BCC", "DAR", "ISSC", "EXP", "ITT", "NPO", "CVA", "CX", "HOV", "AWX", "EVAC", "IDN", "ORB", "POWL", "HEES", "SKY", "TRIT", "MICT", "WY", "RTN", "HXM", "AP", "SIF", "VMC", "PMFG" ] }
{ "_id" : "Consumer Goods", "stocks" : [ "ACAT", "CTB", "BUD", "OME", "ALN", "DW", "ANDE", "BLL", "ATX", "CRMB", "KOSS", "LULU", "OSK", "POOL", "SCSS", "SCS", "PPC", "MDLZ", "SENEB", "CAG", "SNE", "SUP", "CENT", "DSKX", "SRI", "AVY", "MINI", "HELE", "TTM", "UFPT", "XRM", "TIS", "MOV", "MERC", "EVRY", "MWV", "ALSN", "CSL", "ALCO", "CPB", "RAI", "PBI", "SHOO", "PM", "HAR", "SQBG", "CAW", "KOF", "COKE", "DEO", "MLHR", "ENR", "SGC", "COH", "BTN", "FSYS", "SR", "BNNY", "SUMR", "MLR", "LZB", "TUP", "ICON", "STKL", "PII", "DLA", "BG", "CMT", "SNAK", "SON", "THRM", "TXIC", "UG", "FL", "FSS", "STLY", "AAPL", "DLPH", "MSN", "PHG", "DPS", "AGRO", "EVK", "LNCE", "MTOR", "OINK", "FLO", "KODK", "PAY", "DF", "CWTR", "GRO", "RKT", "SMP", "WBC", "ABV", "NP", "GT", "HOG", "TG", "KO", "CCH", "BEAM", "FN", "FARM", "LANC", "WWW", "DECK", "GPIC", "DAN", "MPAA", "ROG", "SEE", "BTI", "PBH", "JBSS", "RCKY", "CAJ", "AMTY", "HNI", "JOUT", "AMWD", "LEG", "ADM", "ECL", "FBR", "HMC", "LO", "MOD", "TBAC", "JCI", "THS", "WVVI", "LBIX", "NTIC", "OBCI", "TOF", "KID", "WHR", "FNP", "CRESY", "FOXF", "MPX", "GNTX", "TLF", "QTWW", "TSLA", "UFS", "GLT", "JJSF", "FLXS", "CQB", "JVA", "MNST", "BSET", "SHLO", "WGO", "ONP", "RL", "TM", "DMND", "EDS", "FFHL", "GLDC", "LWAY", "BORN", "BDE", "NTZ", "CCK", "FMX", "BREW", "BEST", "GMK", "SORL", "ETH", "HY", "RDEN", "BF-B", "F", "DAKT", "STZ", "KRFT", "MO", "COBR", "GIL", "KEQU", "NSANY", "LCUT", "EGT", "JAKK", "OI", "NLS", "REMY", "SEED", "KNDI", "ATR", "VRA", "ACU", "KTEC", "COT", "DSWL", "FHCO", "HOFT", "STS", "LEA", "BC", "CCE", "SYUT", "ZA", "FBHS", "PCAR", "VC", "AKO-B", "CROX", "GAGA", "CTIB", "INGR", "MFRM", "NCFT", "TR", "VIRC", "KNL", "UVV", "ZX", "CVGW", "AOI", "REV", "SANW", "UNF", "MNRO", "BRFS", "NPK", "COTY", "HBI", "SAFM", "HLF", "JAH", "SWSH", "ESYS", "PLOW", "CL", "POST", "DORM", "UN", "SAM", "GMCR", "LBY", "PKG", "ZEP", "MAT", "ACW", "FOSL", "VRS", "MKC", "SJM", "BERY", "CPGI", "SKX", "PERY", "ARCI", "CCU", "SLGN", "CELM", "OXM", "ESCA", "BTH", "ELY", "LUK", "RFP", "HRL", "SPAR", "TFCO", "CMFO", "BMS", "VGR", "RMCF", "DEER", "EBF", "HAS", "PVH", "SEB", "SCL", "GEF", "CHMP", "MTEX", "JSDA", "CLX", "UEIC", "CXDC", "GIII", "GM", "MJN", "XNY", "NUTR", "THO", "PF", "GPK", "ZQK", "ROX", "MYE", "DOLE", "IRBT", "BRID", "NKE", "REED", "TEN", "CRWS", "LKQ", "K", "NWL", "PRMW", "FIZZ", "CAAS", "EL", "LF", "SPU", "TWI", "CLW", "SHFL", "VCO", "CALM", "ACCO", "SENEA", "IP", "NUS", "NAV", "WILC", "THST", "LMNR", "WPRT", "SKUL", "TSN", "VFC", "IBA", "GRIF", "SWM", "PG", "AEPI", "STRT", "HSH", "IPAR", "FDML", "TPX", "CPS", "CRI", "KMB", "STRI", "UL", "JOEZ", "APP", "WPP", "WNC", "BGS", "AVP", "SODA", "SGOC", "TRW", "WWAV", "CELH", "OBT", "WEYS", "BWA", "COLM", "KS", "HSY", "TAP", "DFZ", "FDP", "GIS", "BDBD", "PEP", "UA", "AXL", "ALV", "CHD", "CHSCP", "AKO-A", "MGPI" ] }
{ "_id" : "Conglomerates", "stocks" : [ "EAGL", "HTWO", "HMTV", "GDEF", "MWRX", "PME", "HRG", "PBSK", "CACG", "LDL", "SAEX", "SPLP", "ANDA", "MMM", "AQU", "ENT", "IEP", "JACQ", "NC", "MITSY", "QPAC" ] }
{ "_id" : "Utilities", "stocks" : [ "CHC", "APU", "PEG", "SJI", "WTR", "FCEL", "XEL", "TRP", "CNP", "NWE", "ORA", "WGL", "ETR", "AES", "HTM", "CTWS", "ED", "PEGI", "ITC", "ATLS", "CNL", "EGAS", "MGEE", "DYN", "PNM", "UIL", "NEE", "MDU", "OPTT", "SPH", "VVC", "SJW", "AT", "CORR", "AWR", "LNT", "FE", "PCG", "EE", "TAC", "BIP", "DGAS", "POM", "CPK", "ATO", "SCG", "ADGE", "AWK", "TE", "HE", "MSEX", "PNY", "STR", "WEC", "KEP", "DTE", "SMLP", "AEP", "EXC", "ELP", "NRG", "CLNE", "AEE", "SWX", "CWT", "PPL", "EQT", "OKE", "NU", "EOC", "NKA", "CWCO", "UNS", "BKH", "ENI", "SO", "POR", "JE", "OTTR", "UTL", "CZZ", "EBR", "PNG", "GXP", "ARTNA", "NI", "CPN", "TEG", "NVE", "NGG", "DUK", "CMS", "PCYO", "EDE", "LG", "NYLD", "SBS", "HNP", "ALE", "IDA", "TGS", "OGE", "CDZI", "WR", "CPL", "RGCO", "UGI", "FNRG", "NWN", "PAM", "EDN", "SRE", "YORW", "SXE", "EIX", "PNW", "NJR", "AVA", "CIG", "BEP", "AMID", "D", "ELLO", "GAS" ] }
{ "_id" : "Services", "stocks" : [ "CRMT", "NCI", "CZR", "RAD", "TUC", "SFM", "ENL", "IM", "NAUH", "M", "CETV", "AEY", "AIR", "FRAN", "ASC", "GBX", "HTHT", "DJCO", "ANN", "CCL", "MOC", "GWR", "PNK", "STRZA", "TAIT", "UUU", "ULTA", "LUX", "RRD", "TRI", "CHH", "GSH", "CSX", "HA", "PAC", "BBBY", "CNTY", "QUAD", "ESI", "CPLA", "MCS", "BID", "CUK", "HOT", "HSIC", "SFLY", "EAT", "LPSN", "HOLL", "HUBG", "ABFS", "TGP", "HOTR", "SBH", "CBZ", "DAVE", "SWFT", "EXPR", "CNSI", "DIT", "GNK", "LAMR", "RENT", "TRK", "DRI", "FORD", "HHS", "CNI", "PSMT", "RNDY", "DLTR", "VAC", "WAG", "WLDN", "WNS", "TWMC", "RCMT", "XWES", "BONT", "CSV", "AL", "KEX", "LEE", "RT", "TIVO", "HRB", "MCRI", "RENN", "FRED", "NSSC", "AZO", "CPA", "RLJE", "ROIA", "VSR", "BLMN", "DHX", "TNK", "SNI", "PCMI", "RRTS", "DXPE", "AMCN", "CASY", "HIL", "DFRG", "IPG", "MNTG", "RLGT", "GFN", "FDX", "HSII", "KFY", "DHT", "PACR", "PTSX", "KBR", "SBUX", "SHIP", "WAGE", "WYNN", "ZUMZ", "RUTH", "TGH", "BH", "GPI", "MG", "RRGB", "CACH", "BSI", "THI", "WSTC", "DISCA", "AAWW", "BDMS", "RH", "NYNY", "DWA", "ASR", "FRS", "RICK", "CRRS", "SGMS", "USAT", "AYR", "ERA", "ABG", "ARCO", "CHRM", "CRRC", "DG", "CPRT", "EXAM", "CSS", "FRO", "KSS", "HVT", "KUTV", "ENG", "MELI", "P", "PRLS", "SED", "VIAB", "GES", "BKE", "RSH", "UACL", "WWE", "ACM", "BAMM", "KR", "NMM", "BOBE", "DV", "DLHC", "GMLP", "SSP", "ATAI", "WACLY", "DXLG", "PATR", "RGS", "VPRT", "MNI", "MEG", "PRGN", "CCGM", "BIG", "CODI", "ASFI", "RADA", "AH", "CHTR", "WCC", "ASGN", "CBS", "EEFT", "XPO", "SCI", "SYY", "UHAL", "VVTV", "EGLE", "CDI", "LCC", "BALT", "MLNK", "ROIAK", "SALE", "URBN", "PFMT", "KIRK", "MGRC", "HTZ", "AEO", "EXPD", "GTN", "IMKTA", "ISIG", "ASNA", "CVTI", "KTOS", "STEI", "TAL", "DRYS", "JACK", "QGEN", "LOW", "NSC", "IKGH", "CAST", "PFSW", "SBSA", "KELYA", "BBW", "HTLD", "RUSHB", "JRN", "MHGC", "TRN", "VALU", "JBHT", "BBRG", "AER", "MAR", "VOXX", "CNR", "ZAGG", "TJX", "LQDT", "VNTV", "GLOG", "NEWL", "SPRO", "CHRW", "DNKN", "STMP", "EMMS", "TESS", "TFM", "BWLD", "EZPW", "LACO", "EGL", "BURL", "CDII", "DCIX", "CAB", "DCIN", "LBTYA", "ATV", "CGI", "BYD", "LMCA", "FCN", "LUV", "BLC", "MUSA", "OMEX", "RMGN", "TTEC", "SBLK", "TTEK", "UEPS", "ESEA", "SCVL", "CHKE", "DSX", "TIF", "FLWS", "JCP", "DL", "AAN", "WSM", "CEA", "CTCT", "STNG", "CRV", "MHH", "ECHO", "GLBS", "GCFB", "KAR", "GSL", "BBY", "MW", "NTRI", "ELRC", "CKP", "OSTK", "TYC", "BEBE", "RDI", "IDI", "WSO", "G", "CLUB", "MATX", "MANU", "SAIA", "DM", "FINL", "ASEI", "SAVE", "GK", "ARDNA", "BAGL", "MGAM", "ALCS", "LTD", "LAD", "STRA", "CGX", "FUN", "DVD", "CALI", "NATH", "POWR", "CARB", "BFAM", "CHS", "PRAA", "AFCE", "HMIN", "GRAM", "JMBA", "NM", "NWY", "RELL", "MYCC", "RLH", "COST", "SMRT", "CVS", "SONC", "GWW", "SKS", "TMH", "TNP", "AMCO", "MTN", "MYGN", "NILE", "TUES", "TWX", "UPS", "OMX", "ATHN", "CTP", "EDMC", "LVS", "HPY", "BRS", "EVI", "GEO", "HDS", "HZO", "IMAX", "LINC", "LOPE", "NCMI", "NED", "NETC", "HTSI", "PDCO", "DGSE", "PDII", "PRXI", "PETM", "TAST", "DAL", "LABL", "TA", "TCS", "BWL-A", "ULTR", "UNTK", "VALV", "DENN", "DPZ", "WERN", "NEWP", "CDW", "FC", "GMAN", "AMCX", "MM", "RLOC", "APOL", "SPLS", "INOC", "MHFI", "KMX", "OEH", "SHOS", "GPN", "PCCC", "TECD", "TSCO", "CTAS", "UNP", "PBY", "VSCP", "WFM", "IILG", "SRT", "AIRT", "BKS", "YRCW", "RMKR", "ROST", "CATM", "CBD", "CTRP", "RCL", "BYI", "TUMI", "DSW", "VIPS", "WLFC", "CVC", "COSI", "SFE", "FORR", "CVO", "FSTR", "FLT", "PCLN", "SAH", "APEI", "AIT", "GMT", "CAH", "MGM", "SCHL", "STON", "TOO", "SUSP", "PIR", "VVI", "HAST", "FREE", "KSU", "SBAC", "GPC", "USAK", "ISH", "TGT", "VTNC", "DEG", "CECO", "ACTG", "EXPO", "HCKT", "HCSG", "LIN", "LVNTA", "MMYT", "ONE", "ONVI", "SCIL", "PSUN", "TLYS", "CNK", "MWIV", "CTCM", "UPG", "BONA", "FOXA", "PHII", "MAN", "LAS", "PSO", "RBA", "KKD", "DRII", "GDOT", "RGC", "RYAAY", "ATSG", "DIS", "ESSX", "EBAY", "SHLD", "TEU", "MCO", "VSI", "BODY", "WMK", "CVGI", "VLCCF", "VISN", "WAIR", "UNTD", "WEX", "INTX", "PTEK", "PERF", "DDS", "MCK", "DKS", "RHI", "SIX", "KONA", "ORLY", "SPTN", "UWN", "AXE", "YOD", "CRAI", "VITC", "PWX", "BGI", "WPO", "AHC", "CXW", "STN", "DGIT", "YUME", "CIX", "ZNH", "MATW", "BKW", "PAG", "LINTA", "FRM", "CCRN", "NEWT", "CPHC", "CTHR", "IRG", "LPS", "CTRN", "PZZI", "ARKR", "KORS", "RJET", "SSW", "LAWS", "PRTS", "STB", "PMC", "NGVC", "PZZA", "CVG", "HD", "CATO", "CHUY", "DLIA", "FLY", "LOJN", "AAP", "GTIM", "ACY", "NYT", "RCII", "SKYW", "BXC", "SSTK", "STAN", "SVU", "PENN", "SUSS", "MCHX", "TISI", "ALGT", "DSS", "MMS", "RTI", "EDU", "HSON", "EVC", "LTM", "URS", "WYY", "TOPS", "ARC", "CAP", "NPD", "COCO", "JOBS", "ENOC", "KNOP", "LRN", "CHDX", "XRS", "BASI", "EDUC", "BAH", "CJJD", "OUTR", "PRGX", "LL", "QKLS", "FWRD", "WSTG", "JOSB", "UTI", "PTNT", "CEDU", "MSG", "LOV", "DISH", "GLNG", "CCSC", "PRIS", "HWCC", "RECN", "XOXO", "FISV", "BWS", "QUNR", "NNA", "RPXC", "TV", "CPLP", "INUV", "EDG", "FTDDV", "MGA", "CEB", "PTRY", "TAX", "ALK", "BIDZ", "QLTY", "GLP", "BBSI", "GPS", "CEC", "HAIN", "CRWN", "ADT", "HIBB", "FDO", "ITRN", "MCD", "ARW", "DXM", "FWM", "CMRE", "MRTN", "ABCD", "MSM", "ABM", "ERS", "JOB", "GPX", "MCOX", "SB", "DIAL", "AVT", "HMSY", "FLL", "ARII", "MPEL", "CAR", "SFL", "ABC", "CACI", "SPCHB", "DANG", "DAC", "HURN", "TBI", "SEAS", "CHDN", "ENV", "MAGS", "TITN", "TK", "XUE", "CAKE", "AN", "VLRS", "CNW", "SINO", "ISCA", "LTRE", "ICLD", "NAFC", "GCO", "LITB", "EPAX", "CKH", "HSNI", "RAIL", "REIS", "NSP", "FURX", "PAYX", "CLCT", "HPOL", "SIG", "OWW", "SGRP", "FRGI", "CORE", "EXLS", "CST", "RLOG", "IHG", "CMCSA", "GOL", "GSOL", "HGG", "CMLS", "MDP", "BLOX", "BDL", "NFLX", "SBGI", "TMNG", "DEST", "KNX", "ANF", "UNFI", "URI", "SIRI", "JW-A", "USTR", "MGT", "WAB", "WMAR", "HDSN", "AMZN", "NDLS", "ARO", "MIC", "ABCO", "GNC", "VIFL", "VSEC", "LUB", "WTSL", "NXST", "WTW", "ASCMA", "SCOR", "DIN", "BLDR", "FIVE", "FTD", "III", "NAT", "FUEL", "WPPGY", "BBGI", "JWN", "LIME", "H", "CCO", "DTV", "KFRC", "BGFV", "DOVR", "ROL", "ADS", "NRCIB", "SWY", "ODFL", "LIOX", "CASS", "GME", "CBRL", "MED", "TW", "WYN", "UTIW", "LPX", "MNDL", "SJR", "VLGEA", "CRVP", "MWW", "CBK", "CKEC", "OMAB", "STNR", "LFL", "PLCE", "GCI", "INWK", "NTN", "BJRI", "JEC", "RLD", "WEN", "PNRA", "LSTR", "WEST", "WMT", "CHEF", "ICFI", "TWC", "TXRH", "DLX", "VCI", "BCO", "CNCO", "JBLU", "RUK", "SSI", "SGA", "TTS", "ZLC", "BPI", "NTSC", "OMC", "CONN", "GAIA", "EXPE", "LGF", "OMI", "PTSI", "MSO", "NWSA", "R", "ISLE", "SFN", "ETM", "WOOF", "CP", "MDCA", "SALM", "SPDC", "CMG", "BAGR", "GASS", "JNY", "LYV", "CIDM", "DDE", "PBPB", "CNYD", "ODP", "SFXE", "SNX", "UAL", "VRSK", "WINA", "YUM", "OCR" ] }
{ "_id" : "Basic Materials", "stocks" : [ "RIG", "COG", "SSRI", "XTEX", "VAL", "USAP", "CE", "CERP", "GFI", "AREX", "UNT", "WLT", "MUX", "APA", "EC", "EMES", "SYT", "MEIL", "CLMT", "URZ", "XOM", "ZN", "GSI", "CHKR", "AUY", "CNX", "ACET", "BCEI", "PGRX", "REN", "GEVO", "FPP", "TCK", "UGP", "WHZ", "COP", "NEM", "RIC", "ERF", "ANR", "RNF", "USU", "BVN", "SBGL", "DRD", "HGT", "FF", "HUN", "CMLP", "FMC", "TAT", "PURE", "AXAS", "SA", "YPF", "CHNR", "HNRG", "TORM", "WH", "WLL", "CAM", "LGP", "OLN", "XTXI", "TNH", "TCP", "GSJK", "SN", "WNRL", "BXE", "SIAL", "KALU", "FCX", "ALJ", "PAA", "APAGF", "CF", "HERO", "ESTE", "ETE", "KMG", "MTRN", "PBR", "HCLP", "CWEI", "MCP", "PX", "TAM", "TC", "TLLP", "RES", "CLB", "KBX", "WDFC", "ETP", "AKG", "CHOP", "APFC", "RBY", "EGI", "AUQ", "APL", "AAU", "NS", "EXK", "IFNY", "MUR", "PBF", "SXT", "NGD", "TDW", "TGE", "PBA", "PDCE", "TOT", "USEG", "PAL", "SJT", "ECT", "POT", "EQM", "MT", "CLR", "DBLE", "NBR", "PACD", "GEL", "PED", "SGU", "TGD", "X", "PVR", "KWR", "RGP", "ODC", "SAND", "KWK", "ANV", "MTX", "ISRL", "IAG", "PSXP", "SLW", "HP", "SU", "NSLP", "CEP", "ARP", "FES", "MDM", "SPN", "TRQ", "AGI", "CGA", "TAS", "NWPX", "REGI", "ATW", "DD", "GST", "SHW", "DNR", "CHK", "SXL", "SZYM", "BHP", "HES", "IPI", "KRA", "NDRO", "NRP", "YONG", "BCPC", "SYNM", "VGZ", "SXC", "MMP", "EMXX", "AG", "HSC", "AR", "SGY", "AVL", "MHR", "MVO", "PSE", "KMP", "HUSA", "KOS", "FTI", "NL", "OILT", "TRGP", "NBL", "WGP", "REE", "WES", "BOLT", "CPSL", "LNDC", "SWN", "DK", "CMC", "DVN", "KMI", "SARA", "CIE", "ROYL", "TGA", "GOLD", "SIM", "HMY", "ARSD", "ACI", "BBEP", "AZC", "E", "FRD", "HOS", "APD", "APC", "HWKN", "LXU", "MBLX", "ORIG", "PBT", "PHX", "SCEI", "TGC", "URG", "VET", "WMB", "GDP", "NGLS", "VTG", "PES", "AAV", "MDR", "AHGP", "EPL", "KMR", "PEIX", "GRA", "AXX", "BAS", "MTDR", "EROC", "LSG", "LYB", "AMCF", "NUE", "PZG", "USAC", "TLP", "IVAN", "GMET", "CVX", "OMG", "EXXI", "SD", "AUMN", "QRE", "JRCC", "CDE", "TLM", "RIOM", "EGN", "GSS", "PDS", "LINE", "FISH", "RRC", "MPLX", "CPE", "CXO", "GLF", "GSV", "PAGP", "PTR", "YZC", "SCOK", "SID", "DRQ", "BTE", "RIO", "SSLT", "AXLL", "EPD", "MPET", "CLF", "MNGA", "CGG", "PVA", "VALE", "CLD", "PBR-A", "PGH", "SYNL", "FGP", "AA", "ENB", "OKS", "RDC", "EPB", "GGS", "FET", "LEI", "BRD", "SWC", "THM", "MCF", "FSM", "MDW", "AEM", "ESV", "RNO", "VLO", "SRLP", "GTU", "SE", "HDY", "TPLM", "DO", "NSU", "PXD", "PTEN", "GG", "REX", "NG", "AMRS", "PKD", "ROC", "GURE", "HLX", "ZINC", "MPC", "CVI", "RECV", "KOP", "ASH", "SCCO", "BRN", "CRZO", "PNRG", "RGLD", "DKL", "NFG", "GNE", "CVE", "FNV", "IKNX", "PKX", "KIOR", "ROSE", "TESO", "GSM", "URRE", "ROYT", "EMN", "CHGS", "REI", "CERE", "WPZ", "KGJI", "PLG", "QEP", "OSN", "KOG", "MEMP", "MIL", "OCIP", "AU", "SNMX", "IIIN", "OAS", "ATL", "CEO", "HEP", "LIWA", "SDR", "NOV", "GBR", "SUTR", "WNR", "UPL", "TGB", "AGU", "CVRR", "BAK", "INT", "MMLP", "RDS-B", "FXEN", "BTU", "OMN", "ROCK", "PER", "LTBR", "SYMX", "LRE", "SFY", "TAHO", "VOC", "KEG", "WPX", "NOR", "END", "GPOR", "ACO", "PSX", "DDC", "MILL", "IMO", "CCJ", "BPZ", "HFC", "GTE", "LPI", "PLM", "QRM", "JONE", "IFF", "STO", "HK", "DPM", "MON", "MGH", "AKS", "SLB", "BWP", "TX", "QEPM", "HNR", "NAK", "EEP", "KGC", "NEU", "ANW", "NOA", "NSH", "MCEP", "CNQ", "TEP", "SDT", "VHI", "LNCO", "LODE", "PVG", "SMG", "WTI", "TSO", "UAN", "GSE", "OXF", "NTI", "MRO", "ALDW", "QMM", "SVBL", "UEC", "DOW", "SOQ", "CAK", "AVD", "BBG", "CMP", "BBL", "BIOF", "CJES", "FI", "OXY", "PWE", "WLB", "XPL", "STLD", "REXX", "WRES", "PPG", "BPL", "CYT", "HBM", "MGN", "PSTR", "GPL", "MWE", "AWC", "MPO", "AXU", "CQP", "EOG", "CENX", "SDRL", "MTL", "TRX", "MOS", "NOG", "SVM", "MXC", "DWSN", "TROX", "ACMP", "TTI", "WHX", "XEC", "NGS", "PAAS", "GGB", "SEMG", "ABX", "DNN", "NGL", "BIOA", "CEQP", "FUL", "RVM", "DEJ", "EXH", "FANG", "SQM", "NCQ", "SM", "SLCA", "CRR", "SSN", "SYRG", "MACE", "PDH", "WFT", "CDY", "FSI", "DVR", "BP", "BHI", "LGCY", "PENX", "SDLP", "PQ", "OII", "GPRE", "FTK", "NE", "EXLP", "GORO", "HL", "VNR", "CBT", "NR", "NFX", "CRT", "ACH", "RPM", "PZE", "RTK", "RCON", "ALB", "SSL", "CRK", "EEQ", "OCIR", "LLEN", "WLK", "POL", "TLR", "LNG", "CHMT", "SXCP", "EGO", "EVEP", "HAL", "IOC", "XRA", "IOSP", "EPM", "GMO", "ARLP", "BPT", "SNP", "XCO", "WG", "BRY", "BKEP", "EOX", "CGR", "SHLM", "AE", "BAA", "KRO", "SVLC", "FOE", "PPP", "OIS", "FST", "PBM", "PDO", "RRMS", "ASM", "ECA", "EQU", "ATHL", "MBII", "MVG", "ZAZA", "IPHS", "SEP", "GNI", "SHI", "UAMY", "ARG", "EGY", "MEOH" ] }
```
<br/>

### Exercício 4 - Fraude na Enron!

Um dos casos mais emblemáticos de fraude no mundo é o caso da Enron. A comunidade do MongoDB utiliza muito esse dataset pois o mesmo se tornou público, então vamos importar esse material também.

Para importar o arquivo <i>enron.json</i> do volume, deve ser executado o script abaixo no shell do mongo
```
docker exec -it mongodb_mongo-server_1 //bin//sh
```
```
mongoimport --db enron --collection enron --file /docker-entrypoint-initdb.d/enron.json
```
```
2020-04-27T03:08:36.865+0000    connected to: mongodb://localhost/
2020-04-27T03:08:37.731+0000    5929 document(s) imported successfully. 0 document(s) failed to import.
```
<br/>

> 1. Liste as pessoas que enviaram e-mails (de forma distinta, ou seja, sem repetir). Quantas pessoas são?

```
db.enron.aggregate([{$group:{_id:"$sender",count:{$sum:1}}},{$group: {_id: "result", count: {$sum: "$count"}}}])
```
```
{ "_id" : "result", "count" : 5929 }
```
<br/>

> 2. Contabilize quantos e-mails tem a palavra “fraud”

```
db.enron.find({text: {$regex: ".*fraud.*"}}).count()
```
```
23
```