var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app = express();
app.get('/:cep', function(req, res) {
    var cep = req.params.cep;//"13565090";
    res.set({"Content-Type":"application/json; charset=iso-8859-1"});
    //res.header();
    request.post({url:"http://m.correios.com.br/movel/buscaCepConfirma.do", 
        form:{cepEntrada:cep, tipoCep:"",cepTemp:"", metodo:"buscarCep"}
       }, 
        function (error, response, body) {
        if (!error && response.statusCode == 200) {
                var $ = cheerio.load(body);
            try{
                        var resultados = $('span[class=respostadestaque]');
                        var logradouro = formatLogradouro(resultados);
                        var bairro = formatBairro(resultados);
                        var localidade = formatLocalidade(resultados); 
                        var uf = formatUF(resultados);
                        var dados = {
                            numero: cep,
                            logradouro: logradouro,
                            bairro:bairro,
                            localidade: localidade,
                            uf: uf
                        };
                        
                        res.send(JSON.stringify(dados));
            }catch(error){
                var message = $(".erro").text().trim();
                res.send(JSON.stringify({message:message}));
            }
        }            
        
    });    
});
app.listen(process.env.PORT || 8088);

var formatLogradouro = function (resultados){
    return resultados.eq(0).text().trim();
};

var formatBairro = function (resultados){
    return resultados.eq(1).text().trim();
};

var formatLocalidade = function (resultados){
    return resultados.eq(2).text().split("/")[0].trim();
};

var formatUF = function (resultados){
  return resultados.eq(2).text().split("/")[1].trim();  
};