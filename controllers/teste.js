const rp = require('request-promise'); 
module.exports = function (app){
	app.get("/", function(req,res){
		res.render("teste/index");
	});
	
	app.post("/", function(req,res){
		var opcoes = {  
		  method: 'GET',
		  uri: 'https://api.pagar.me/1/transactions/card_hash_key',
		  qs: {
			encryption_key: "ek_test_E8SxpgBoEr1GBBWiXXcVHP4mIiShsw"
		  }
		  
		}
		rp(opcoes).then((data) => {
			var qs = require('querystring');
			var crypto = require("crypto");
			var resultados = JSON.parse(data);	
			var date_created = resultados.date_created;
			var id = resultados.id;
			var ip = resultados.ip;
			var public_key = resultados.public_key;
			var querystring = 'card_number=' + qs.escape(req.body.card_number) + '&card_holder_name=' + qs.escape(req.body.card_holder_name) + '&card_expiration_date=' + qs.escape(req.body.card_expiration_month) + qs.escape(req.body.card_expiration_year) + '&card_cvv=' + qs.escape(req.body.card_cvv);
			var query_buffer = new Buffer(querystring, "binary")
			var encrypted = crypto.publicEncrypt({"key":public_key, padding:crypto.RSA_PKCS1_PADDING}, query_buffer).toString("base64");
			var cardhash = id + "_" + encrypted;
			res.status(200).json({"resultado":"OK", "CardHash": cardhash});	

		}).catch((err) => {
			var codigo_erro = err.statusCode;
			var detalhes_erro = err.message;
			var resposta = {
				"resultado":"erro",
				"codigo": codigo_erro,
				"detalhes":detalhes_erro
			}
			res.status(500).json(resposta);	
		});
	});
	
	app.get("/cliente", function(req,res){
		res.render("teste/cliente");
	});
	
	app.post("/cep", function(req,res){
		var cep = req.body.cep;
		var url = 'https://api.pagar.me/1/zipcodes/' + cep;
		var opcoes = {  
		  method: 'GET',
		  uri: url
		}
		rp(opcoes).then((data) => {
			res.status(200).json({"resultado":"OK", "Endereco": JSON.parse(data)});	
		}).catch((err) => {
			res.status(500).json({"resultado":"ERRO DE COMUNICACAO"});	
		});
		
	});
	
	app.get("/banner", function(req,res){
		res.render("teste/banner");
	});
	
}
