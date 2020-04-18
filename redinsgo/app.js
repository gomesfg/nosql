const redis = require("redis");
const client = redis.createClient();
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

client.on("error", function(){
	//console.error(error);
});

client.on('connect', function () {
    //console.log('connected');
});

console.log('##############################################');
console.log('################## Redinsgo ##################');
console.log('##############################################');
console.log('                                              ');
console.log('Pressione qualquer tecla para sortear uma pedra...');

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    } else {
      //console.log('Você pressionou a tecla ' + str);
      //console.log(key);
      //console.clear();
      sortearPedra();
    }
});

inicializar();
//listarUsuarios();
//listarCartelas();

/*for(var i=1; i<=99; i++){
    sortearPedra();
}*/

function inicializar(){
    
    // Criar set com 99 numeros
    for(var i=1; i<=99; i++){
        client.sadd(['numeros_sorteio', i]);
    }

    // Limpar pedras sorteadas
    client.spop('pedras_sorteadas', 99); 
    
    // Criar usuários e cartelas
    for(var i=1; i<=50; i++){
        criarUsuarios(i);
        criarCartelas(i);
    }
}

function formatarMascara(num, tamanho) {
    var s = "0" + num;
    return s.substr(s.length - tamanho);
}

function criarUsuarios(num){
    // Criar hash de pessoas
    // user:01 -> name: “user01”, bcartela: “cartela:01”, bscore: “score:01”
    // user:02 -> name: “user02”, bcartela: “cartela:02”, bscore: “score:02”
    var numero = formatarMascara(num,2);
    var user = 'user:' + numero;
    var name = 'user:' + numero
    var cartela = 'cartela:' + numero;
    var score = 'score:00';
    
    client.del(user, function(err, object) {
        if(!err){
            client.hset(user, 'name', name, 'bcartela', cartela, 'bscore', score);
        }
    });
}

function criarCartelas(num){
    // Criar hash de cartelas com set de 1 a 99
    // cartela:01 -> [10, 23, ..., 58]
    // cartela:02 -> [3, 16, ..., 65]
    var numero = formatarMascara(num,2);
    var cartela = 'cartela:' + numero;
    var numero_aleatorio = [];
    
    // Limpar set de cartelas
    client.del(cartela, function(err,object){
        if(!err){
            
        }
    });
    client.srandmember('numeros_sorteio', 15, function (err, numero_aleatorio) {
        for(var j=0; j<numero_aleatorio.length; j++) {
            client.sadd([cartela, numero_aleatorio[j]]);
        }
    })

    // Limpar ranking do bingo
    client.zrem('bingoRank', cartela, function(err,object){
        if(!err){
            client.zadd('bingoRank', 1, cartela);  
        }
    }); 
}

function listarUsuarios(){
    for(var i=1; i<=50; i++){
        var numero = formatarMascara(i,2);
        var user = 'user:' + numero;
        
        client.hgetall(user, function (err, object) {
            console.log(object);
        });
    }
} 

function listarCartelas(){
    for(var i=1; i<=50; i++){
        var numero = formatarMascara(i,2);
        var cartela = 'cartela:' + numero;
        
        client.smembers(cartela, function (err, object) {
            console.log(object);
        })
        
        
    }
} 

function sortearPedra(){
    client.spop('numeros_sorteio', 1, function (err, object) {
        var pedra = object[0];
        client.sadd(['pedras_sorteadas', pedra], function(err,object){
            if(!err){
                for(i=1; i<=50; i++){
                    var numero = formatarMascara(i,2);
                    var cartela = 'cartela:' + numero;
                    
                    client.sismember(cartela, pedra, function(err,reply){
                        if(reply == 1){
                            //client.zadd('bingoRank', 1, cartela)
                            client.zincrby('bingoRank', 1, cartela);
                        }                    
                    });
                }
            }
        });       
        console.log(pedra);
    });
}