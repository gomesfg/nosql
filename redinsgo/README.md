## Redinsgo

Banco de Dados Não-Relacionais<br/>
Aluno: Felipe Eduardo Gomes

## Sobre
O Redinsgo é um jogo de bingo que utiliza estruturas em um banco chave/valor. Para seu desenvolvimento foi utilizado o node.js e o banco de dados não relacional Redis.
<br/>
![alt text](https://raw.githubusercontent.com/gomesfg/nosql/master/redinsgo/img/redinsgo.PNG)
<br/>

### Iniciar ambiente
NODE JS
<br/>
Baixar pacote do node.js

REDIS
<br/>
// Baixar a imagem do redis
```
docker pull redis
```

// Rodar a instancia do redis na porta 6379
```
docker run --name instancia_redis -p 6379:6379 -d redis redis-server --appendonly no
```

// Acessar o cliente do redis dento do contêiner
```
docker exec -it instancia_redis redis-cli
```