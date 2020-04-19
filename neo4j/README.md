## Neo4j

Banco de Dados Não-Relacionais<br/>
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

### Exercício 4 - Filtering queries using WHERE clause

> Exercise 4.1: Retrieve all movies that Tom Cruise acted in

```
match (a:Person)-[:ACTED_IN]->(m:Movie) where a.name = 'Tom Cruise' return m.title as Filme
```
<br/>

> Exercise 4.2: Retrieve all people that were born in the 70’s.

```
match (a:Person) where a.born >= 1970 and a.born < 1980 return a.name as Nome, a.born as `Data Nascimento`
```
<br/>

> Exercise 4.3: Retrieve the actors who acted in the movie The Matrix who were born after 1960.

```
match (a:Person)-[:ACTED_IN]->(m:Movie) where a.born > 1960 and m.title = 'The Matrix' return a.name as Nome, a.born as `Ano Nascimento`
```
<br/>

> Exercise Exercise 4.4: Retrieve all movies by testing the node label and a property

```
match (m) where m:Movie and m.released = 2000 return m.title
```
<br/>

> Exercise 4.5: Retrieve all people that wrote movies by testing the relationship between two nodes.

```
match (a)-[rel]->(m) where a:Person and type(rel) = 'WROTE' and m:Movie return a.name as Nome, m.title as Filme
```
<br/>

> Exercise 4.6: Retrieve all people in the graph that do not have a property.

```
match (a:Person) where not exists(a.born) return a.name as Nome
```
<br/>

> Exercise 4.7: Retrieve all people related to movies where the relationship has a property

```
match (a:Person)-[rel]->(m:Movie) where exists(rel.rating) return a.name as Nome, m.title as Filme, rel.rating as Nota
```
<br/>

> Exercise 4.8: Retrieve all actors whose name begins with James.

```
match (a:Person)-[:ACTED_IN]->(:Movie) where a.name starts with 'James' return a.name
```
<br/>

> Exercise 4.9: Retrieve all all REVIEW relationships from the graph with filtered results.

```
match (:Person)-[r:REVIEWED]->(m:Movie) where toLower(r.summary) contains 'football' return m.title as Filme, r.summary as Revisao, r.rating as Nota
```
<br/>

> Exercise 4.10: Retrieve all people who have produced a movie, but have not directed a movie

```
match (a:Person)-[:PRODUCED]->(m:Movie) where not ((a)-[:DIRECTED]->(:Movie)) return a.name, m.title
```
<br/>

> Exercise 4.11: Retrieve the movies and their actors where one of the actors also directed the movie.

```
match (a1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(a2:Person) where exists( (a2)-[:DIRECTED]->(m) ) return  a1.name as Ator, a2.name as `Ator/Diretor`, m.title as Filme
```
<br/>

> Exercise 4.12: Retrieve all movies that were released in a set of years.

```
match (m:Movie) where m.released in [1999, 2000, 2003] return m.title, m.released
```
<br/>

> Exercise 4.13: Retrieve the movies that have an actor’s role that is the name of the movie.

```
match (a:Person)-[r:ACTED_IN]->(m:Movie) where m.title in r.roles return  m.title as Filme, a.name as Ator
```
<br/>

### Exercício 5 - Controlling query processing

> Exercise 5.1: Retrieve data using multiple MATCH patterns

```
match (a:Person)-[:ACTED_IN]->(m:Movie)<-[:DIRECTED]-(d:Person),(a2:Person)-[:ACTED_IN]->(m) where a.name = 'Gene Hackman' return m.title as Filme, d.name AS Diretor , a2.name AS `Atores`
```
<br/>

> Exercise 5.2: Retrieve particular nodes that have a relationship

```
match (p1:Person)-[:FOLLOWS]-(p2:Person) where p1.name = 'James Thompson' return p1, p2
```
<br/>

> Exercise 5.3: Modify the query to retrieve nodes that are exactly three hops away.

```
match (p1:Person)-[:FOLLOWS*3]-(p2:Person) where p1.name = 'James Thompson' return p1, p2
```
<br/>

> Exercise 5.4: Modify the query to retrieve nodes that are one and two hops away.

```
match (p1:Person)-[:FOLLOWS*1..2]-(p2:Person) where p1.name = 'James Thompson' return p1, p2
```
<br/>

> Exercise 5.5: Modify the query to retrieve particular nodes that are connected no matter how many hops are required

```
match (p1:Person)-[:FOLLOWS*]-(p2:Person) where p1.name = 'James Thompson' return p1, p2
```
<br/>

> Exercise 5.6: Specify optional data to be retrieved during the query.

```
match (p:Person) where p.name starts with 'Tom' optional match (p)-[:DIRECTED]->(m:Movie) return p.name, m.title
```
<br/>

> Exercise 5.7: Retrieve nodes by collecting a list.

```
match (p:Person)-[:ACTED_IN]->(m:Movie) return p.name as Ator, collect(m.title) AS `Lista de Filmes`
```
<br/>

> Exercise 5.9: Retrieve nodes as lists and return data associated with the corresponding lists

```
match (p:Person)-[:REVIEWED]->(m:Movie) return m.title as Filme, count(p) as `Número de Revisões`, collect(p.name) as Criticos
```
<br/>

> Exercise 5.10: Retrieve nodes and their relationships as lists.

```
match (d:Person)-[:DIRECTED]->(m:Movie)<-[:ACTED_IN]-(a:Person)
return d.name AS Diretor, count(a) AS `Número Atores` , collect(a.name) AS `Trabalhou com os atores`
```
<br/>

> Exercise 5.11: Retrieve the actors who have acted in exactly five movies.

```
match (a:Person)-[:ACTED_IN]->(m:Movie) 
with  a, count(a) AS numeroFilmes, collect(m.title) AS Filmes 
where numeroFilmes = 5 return a.name, Filmes
```
<br/>

> Exercise Exercise 5.12: Retrieve the movies that have at least 2 directors with other optional data.

```
match (m:Movie) 
with m, size((:Person)-[:DIRECTED]->(m)) as Diretores 
where Diretores >= 2 
optional match (p:Person)-[:REVIEWED]->(m) return  m.title, p.name
```
<br/>

### Exercício 6 - Controlling results returned

> Exercise 6.1: Execute a query that returns duplicate records.

```
match (a:Person)-[:ACTED_IN]->(m:Movie)
where m.released >= 1990 AND m.released < 2000
return distinct m.released, m.title, collect(a.name)
```
<br/>

> Exercise 6.2: Modify the query to eliminate duplication.

```

```
<br/>

> Exercise 6.3: Modify the query to eliminate more duplication.

```

```
<br/>

> Exercise 6.4: Sort results returned.

```

```
<br/>

> Exercise 6.5: Retrieve the top 5 ratings and their associated movies.

```

```
<br/>

> Exercise 6.6: Retrieve all actors that have not appeared in more than 3 movies.

```

```
<br/>

### Exercício 7 - Working with cypher data

> Exercise 7.1: Collect and use lists

```

```
<br/>

> Exercise 7.2: Collect a list

```

```
<br/>

> Exercise 7.3: Unwind a list

```

```
<br/>

> Exercise 7.4: Perform a calculation with the date type.

```

```
<br/>

### Exercício 8 - Creating nodes

> Exercise 8.1: Create a Movie node.

```

```
<br/>

> Exercise 8.2: Retrieve the newly-created node.

```

```
<br/>

> Exercise 8.3: Create a Person node.

```

```
<br/>

> Exercise 8.4: Retrieve the newly-created node.

```

```
<br/>

> Exercise 8.5: Add a label to a node.

```

```
<br/>

> Exercise 8.6: Retrieve the node using the new label.

```

```
<br/>

> Exercise 8.7: Add the Female label to selected nodes.

```

```
<br/>

> Exercise 8.8: Retrieve all Female nodes.

```

```
<br/>

> Exercise Exercise 8.9: Remove the Female label from the nodes that have this label.

```

```
<br/>

> Exercise 8.10: View the current schema of the graph.

```

```
<br/>

> Exercise 8.11: Add properties to a movie.

```

```
<br/>

> Exercise 8.12: Retrieve an OlderMovie node to confirm the label and properties.

```

```
<br/>

> Exercise 8.13: Add properties to the person, Robin Wright.

```

```
<br/>

> Exercise 8.14: Retrieve an updated Person node.

```

```
<br/>

> Exercise 8.15: Remove a property from a Movie node.

```

```
<br/>

> Exercise 8.16: Retrieve the node to confirm that the property has been removed.

```

```
<br/>

> Exercise 8.17: Remove a property from a Person node.

```

```
<br/>

> Exercise 8.18: Retrieve the node to confirm that the property has been removed.

```

```
<br/>

### Exercício 9 - Creating relationships

> Exercise 9.1: Create ACTED_IN relationships.

```

```
<br/>

> Exercise 9.2: Create DIRECTED relationships.

```

```
<br/>

> Exercise 9.3: Create a HELPED relationship.

```

```
<br/>

> Exercise 9.4: Query nodes and new relationships.

```

```
<br/>

> Exercise 9.5: Add properties to relationships.

```

```
<br/>

> Exercise 9.6: Add a property to the HELPED relationship.

```

```
<br/>

> Exercise 9.7: View the current list of property keys in the graph.

```

```
<br/>

> Exercise 9.8: View the current schema of the graph.

```

```
<br/>

> Exercise 9.9: Retrieve the names and roles for actors.

```

```
<br/>

> Exercise 9.10: Retrieve information about any specific relationships.

```

```
<br/>

> Exercise 9.11: Modify a property of a relationship.

```

```
<br/>

> Exercise 9.12: Remove a property from a relationship.

```

```
<br/>

> Exercise Exercise 9.13: Confirm that your modifications were made to the graph.

```

```
<br/>

### Exercício 10 - Deleting nodes and relationships

> Exercise 10.1: Delete a relationship.

```

```
<br/>

> Exercise 10.2: Confirm that the relationship has been deleted.

```

```
<br/>

> Exercise 10.3: Retrieve a movie and all of its relationships.

```

```
<br/>

> Exercise 10.4: Try deleting a node without detaching its relationships.

```

```
<br/>

> Exercise 10.5: Delete a Movie node, along with its relationships.

```

```
<br/>

> Exercise 10.6: Confirm that the Movie node has been deleted.

```

```
<br/>
