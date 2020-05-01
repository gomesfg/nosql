## Redinsgo

Banco de Dados Não-Relacionais<br/>
Aluno: Felipe Eduardo Gomes

## Sobre
O Redinsgo é um jogo de bingo que utiliza estruturas em um banco chave/valor. Para seu desenvolvimento foi utilizado o node.js e o banco de dados não relacional Redis.
<br/>
![alt text](https://github.com/gomesfg/nosql/tree/master/redinsgo/img/redinsgo.PNG?raw=true)
<br/>

### Iniciar ambiente
NODE JS
Baixar pacote do node.js

REDIS
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