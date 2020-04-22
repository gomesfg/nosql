## MongoDB

Banco de Dados Não-Relacionais<br/>
Aluno: Felipe Eduardo Gomes

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
MATCH (m:Movie {released: 1999}) RETURN m.title,m.released
```
<br/>

> 3. Identifique todos os jovens (pessoas entre 12 a 18 anos).

```
call db.propertyKeys
```
<br/>

> 4. Identifique quantas pessoas tem gatos, quantas tem cachorro e quantas não tem nenhum dos dois

```
MATCH (m:Movie {released: 1999}) RETURN m.title
```
<br/>

> 5. Liste/Conte todas as pessoas acima de 60 anos que tenham gato

```
MATCH (m:Movie) RETURN m.title,m.released,m.tagline
```
<br/>

> 6. Liste/Conte todos os jovens com cachorro

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 7. Utilizando o $where, liste todas as pessoas que tem gato e cachorro

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 8. Liste todas as pessoas mais novas que seus respectivos gatos.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 9. Liste as pessoas que tem o mesmo nome que seu bichano (gatou ou cachorro)

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 10. Projete apenas o nome e sobrenome das pessoas com tipo de sangue de fator RH negativo

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 11. Projete apenas os animais dos italianos. Devem ser listados os animais com nome e idade. Não mostre o identificado do mongo (ObjectId)

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 12. Quais são as 5 pessoas mais velhas com sobrenome Rossi?

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 13. Crie um italiano que tenha um leão como animal de estimação. Associe um nome e idade ao bichano

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 14. Infelizmente o Leão comeu o italiano. Remova essa pessoa usando o Id.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 15. Passou um ano. Atualize a idade de todos os italianos e dos bichanos em 1.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 16. O Corona Vírus chegou na Itália e misteriosamente atingiu pessoas somente com gatos e de 66 anos. Remova esses italianos.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 17. Utilizando o framework agregate, liste apenas as pessoas com nomes iguais a sua respectiva mãe e que tenha gato ou cachorro.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 18. Utilizando aggregate framework, faça uma lista de nomes única de nomes. Faça isso usando apenas o primeiro nome

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 19. Agora faça a mesma lista do item acima, considerando nome completo

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

> 20. Procure pessoas que gosta de Banana ou Maçã, tenham cachorro ou gato, mais de 20 e menos de 60 anos.

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
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