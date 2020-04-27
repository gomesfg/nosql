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

### Exercício 1 - Aquecendo com alguns dados

> 1. Crie a tabela com 2 famílias de colunas:
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

> 2. Importe o arquivo via linha de comando
```
docker-compose exec hbase-server hbase shell /hbase-seed/italians.txt
Took 0.6745 seconds
```
<br/>

### Exercício 2 - Agora execute as seguintes operações:

> 1. Adicione mais 2 italianos mantendo adicionando informações como data de nascimento nas informações pessoais e um atributo de anos de experiência nas informações profissionais.

```

```
```

```
<br/>

> 2. Adicione o controle de 5 versões na tabela de dados pessoais.

```

```
```

```
<br/>

> 3. Faça 5 alterações em um dos italianos.

```

```
```

```
<br/>

> 4. Com o operador get, verifique como o HBase armazenou o histórico.

```

```
```

```
<br/>

> 5. Utilize o scan para mostrar apenas o nome e profissão dos italianos.

```

```
```

```
<br/>

> 6. Apague os italianos com row id ímpar.

```

```
```

```
<br/>

> 7. Crie um contador de idade 55 para o italiano de row id 5.

```

```
```

```
<br/>

> 8. Incremente a idade do italiano em 1

```

```
```

```
<br/>

### Exercício 3 - Os italianos voltaram!

Com base no script de italianos utilizado no exercício de MongoDB, altere ele para uma versão do HBase. Você pode transformar ele para Ruby ou gerar os comandos para HBase a partir do JavaScript mesmo.
<br/>

// EXERCÍCIO OPCIONAL