## Neo4j

Banco de Dados Não-Relacionais
Aluno: Felipe Eduardo Gomes

### Exercício 1 - Retrieving Nodes

> Exercise 1.1: Retrieve all nodes from the database

```
match (n) return (n)
```
<br/>

> Exercise 1.2: Examine the data model for the graph.

```
call db.schema()
```
<br/>

> Exercise 1.3: Retrieve all Person nodes.

```
match (p:Person) return (p)
```
<br/>

> Exercise 1.4: Retrieve all Movie nodes.

```
match (m:Movie) return (m)
```
<br/>

### Exercício 2 - Filtering queries using property values

> Exercise 2.1: Retrieve all movies that were released in a specific year.

```
MATCH (m:Movie {released: 1999}) RETURN m
```
<br/>

> Exercise 2.2: View the retrieved results as a table.

```
MATCH (m:Movie {released: 1999}) RETURN m.title,m.released
```
<br/>

> Exercise 2.3: Query the database for all property keys

```
call db.propertyKeys
```
<br/>

> Exercise 2.4: Retrieve all Movies released in a specific year, returning their titles.

```
MATCH (m:Movie {released: 1999}) RETURN m.title
```
<br/>

> Exercise 2.5: Display title, released, and tagline values for every Movie node in the graph.

```
MATCH (m:Movie) RETURN m.title,m.released,m.tagline
```
<br/>

> Exercise 2.6: Display more user-friendly headers in the table

```
MATCH (m:Movie) RETURN m.title AS `Título`,m.released AS `Data de Lançamento`,m.tagline AS `Slogan`
```
<br/>

### Exercício 3 - Filtering queries using relationships

> Exercise 3.1: Display the schema of the database.

```
call db.schema
```
<br/>

> Exercise 3.2: Retrieve all people who wrote the movie Speed Racer.

```
match (p:Person)-[:WROTE]->(:Movie {title: 'Speed Racer'}) return p.name
```
<br/>

> Exercise 3.3: Retrieve all movies that are connected to the person, Tom Hanks.

```
match (m:Movie)<--(:Person {name: 'Tom Hanks'}) return m.title
```
<br/>

> Exercise 3.4: Retrieve information about the relationships Tom Hanks had with the set of movies retrieved earlier.

```
match (m:Movie)-[rel]-(:Person {name: 'Tom Hanks'}) return m.title, type(rel)
```
<br/>

> Exercise 3.5: Retrieve information about the roles that Tom Hanks acted in.

```
match (m:Movie)-[rel:ACTED_IN]-(:Person {name: 'Tom Hanks'}) return m.title, rel.roles
```
<br/>