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
hbase(main):003:0> put 'italians', '11', 'personal-data:name', 'Felipe Eduardo Gomes'
Took 0.0375 seconds
hbase(main):004:0> put 'italians', '11', 'personal-data:city', 'Blumenau'
Took 0.0079 seconds
hbase(main):005:0> put 'italians', '11', 'professional-data:role', 'Analista de Sistemas'
Took 0.0041 seconds
hbase(main):006:0> put 'italians', '11', 'professional-data:salary', '10.000'
Took 0.0076 seconds
hbase(main):007:0> put 'italians', '12', 'personal-data:name', 'Fernando Luiz Gomes'
Took 0.0046 seconds
hbase(main):008:0> put 'italians', '12', 'personal-data:city', 'Blumenau'
Took 0.0048 seconds
hbase(main):009:0> put 'italians', '12', 'professional-data:role', 'Analista Administrativo'
Took 0.0049 seconds
hbase(main):010:0> put 'italians', '12', 'professional-data:salary', '5.000'
Took 0.0059 seconds
```
<br/>

> 2. Adicione o controle de 5 versões na tabela de dados pessoais.

```
hbase(main):011:0> alter 'italians', { NAME=>'personal-data', VERSIONS=>5 }
Updating all regions with the new schema...
1/1 regions updated.
Done.
Took 2.1956 seconds
```
<br/>

> 3. Faça 5 alterações em um dos italianos.

```
hbase(main):027:0> put 'italians', '11', 'personal-data:city', 'Florianopolis'
Took 0.0061 seconds
hbase(main):028:0> put 'italians', '11', 'personal-data:city', 'Sao Jose'
Took 0.0079 seconds
hbase(main):029:0> put 'italians', '11', 'personal-data:city', 'Gaspar'
Took 0.0126 seconds
hbase(main):030:0> put 'italians', '11', 'personal-data:city', 'Joinville'
Took 0.0045 seconds
hbase(main):031:0> put 'italians', '11', 'personal-data:city', 'Curitiba'
Took 0.0108 seconds
```
<br/>

> 4. Com o operador get, verifique como o HBase armazenou o histórico.

```
hbase(main):032:0> get 'italians', '11', { COLUMN=>'personal-data:city', VERSIONS=>5 }
COLUMN                                              CELL
 personal-data:city                                 timestamp=1587963546457, value=Curitiba
 personal-data:city                                 timestamp=1587963545359, value=Joinville
 personal-data:city                                 timestamp=1587963545301, value=Gaspar
 personal-data:city                                 timestamp=1587963545243, value=Sao Jose
 personal-data:city                                 timestamp=1587963545204, value=Florianopolis
1 row(s)
Took 0.0266 seconds
```
<br/>

> 5. Utilize o scan para mostrar apenas o nome e profissão dos italianos.

```
hbase(main):033:0> scan 'italians', { COLUMNS => ['personal-data:name','professional-data:role']}
ROW                                                 COLUMN+CELL
 1                                                  column=personal-data:name, timestamp=1587961479612, value=Paolo Sorrentino
 1                                                  column=professional-data:role, timestamp=1587961479660, value=Gestao Comercial
 10                                                 column=personal-data:name, timestamp=1587961479918, value=Giovanna Caputo
 10                                                 column=professional-data:role, timestamp=1587961479930, value=Comunicacao Institucional
 11                                                 column=personal-data:name, timestamp=1587962851473, value=Felipe Eduardo Gomes
 11                                                 column=professional-data:role, timestamp=1587962851578, value=Analista de Sistemas
 12                                                 column=personal-data:name, timestamp=1587962851669, value=Fernando Luiz Gomes
 12                                                 column=professional-data:role, timestamp=1587962851734, value=Analista Administrativo
 2                                                  column=personal-data:name, timestamp=1587961479674, value=Domenico Barbieri
 2                                                  column=professional-data:role, timestamp=1587961479686, value=Psicopedagogia
 3                                                  column=personal-data:name, timestamp=1587961479704, value=Maria Parisi
 3                                                  column=professional-data:role, timestamp=1587961479719, value=Optometria
 4                                                  column=personal-data:name, timestamp=1587961479734, value=Silvia Gallo
 4                                                  column=professional-data:role, timestamp=1587961479750, value=Engenharia Industrial Madeireira
 5                                                  column=personal-data:name, timestamp=1587961479765, value=Rosa Donati
 5                                                  column=professional-data:role, timestamp=1587961479785, value=Mecatronica Industrial
 6                                                  column=personal-data:name, timestamp=1587961479802, value=Simone Lombardo
 6                                                  column=professional-data:role, timestamp=1587961479815, value=Biotecnologia e Bioquimica
 7                                                  column=personal-data:name, timestamp=1587961479829, value=Barbara Ferretti
 7                                                  column=professional-data:role, timestamp=1587961479846, value=Libras
 8                                                  column=personal-data:name, timestamp=1587961479859, value=Simone Ferrara
 8                                                  column=professional-data:role, timestamp=1587961479874, value=Engenharia de Minas
 9                                                  column=personal-data:name, timestamp=1587961479888, value=Vincenzo Giordano
 9                                                  column=professional-data:role, timestamp=1587961479905, value=Marketing
12 row(s)
Took 0.1051 seconds
```
<br/>

> 6. Apague os italianos com row id ímpar.

```
hbase(main):036:0> deleteall 'italians', 1
Took 0.0069 seconds
hbase(main):037:0> deleteall 'italians', 3
Took 0.0028 seconds
hbase(main):038:0> deleteall 'italians', 5
Took 0.0036 seconds
hbase(main):039:0> deleteall 'italians', 7
Took 0.0036 seconds
hbase(main):040:0> deleteall 'italians', 9
Took 0.0047 seconds
hbase(main):041:0> deleteall 'italians', 11
Took 0.0067 seconds
```
<br/>

> 7. Crie um contador de idade 55 para o italiano de row id 5.

```
hbase(main):034:0> incr 'italians', 5, 'personal-data:age', 55
COUNTER VALUE = 55
Took 0.0339 seconds
```
<br/>

> 8. Incremente a idade do italiano em 1

```
hbase(main):035:0> incr 'italians', 5, 'personal-data:age', 1
COUNTER VALUE = 56
Took 0.0078 seconds
```
<br/>

### Exercício 3 - Os italianos voltaram!

Com base no script de italianos utilizado no exercício de MongoDB, altere ele para uma versão do HBase. Você pode transformar ele para Ruby ou gerar os comandos para HBase a partir do JavaScript mesmo.
<br/>

// EXERCÍCIO OPCIONAL