var admin = require('firebase-admin');
var serviceAccount = require('./preciobtc-firebase-adminsdk-nktyd-8c7f1e38eb.json');
var _ = require('lodash');
var twit = require('twit');
var cron = require('node-cron');
var config = require('./config.js');
var Twitter = new twit(config);

var Raven = require('raven');
Raven.config('https://69f18dde66224e53acd47f44e31373ca@sentry.io/1222237').install();

// STREAM BOT ==========================

var stream = Twitter.stream('user');
//listens to the event when someone follows and calls 
//callback function followed 
stream.on('follow', followed);

function followed(eventmsg) {
	//getting name and username of the user
    var name = eventmsg.source.name;
    var screenName = eventmsg.source.screen_name;
    //since twitter blocks tweets of same type so we'll associate a
    //unique number using Math.random() or anything you like
    tweetPost('Gracias @' + screenName + ' por el follow! deseamos que PrecioBTC.com te ayude a encontrar el mejor precio para tu próxima operación en Bitcoin. ' + Math.floor(Math.random()*10));
}
//Posting the tweet!
function tweetPost(msg) {
    var tweet = {
        status: msg
    }
    Twitter.post('statuses/update', tweet, function(err, data) {
        if (err) {
        	Raven.captureException(err, { extra: { msg: msg } });
            //console.log(err);
        } else {
            //console.log(data);
        }
    });
}

// END STREAM BOT ==========================

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://preciobtc.firebaseio.com'
});

var db = admin.database();

var msgBestTransferencia;
var msgBestMercadopago;
var msgBestRapipago;
var msgBestWallet;
var msgBestDeposito;
var msgBestSellMercadopago;

var refSitios = db.ref("sitios/ARS");
refSitios.on("value", function(snapshot) {
    var json = snapshot.val();
	var arr = []
	arr.push({
		name: "ArgenBTC",
		buy: json["ArgenBTC"].buy,
		sell: json["ArgenBTC"].sell,
		timestamp: json["ArgenBTC"].timestamp,
		cargar: json["ArgenBTC"].cargar,
		comprar: json["ArgenBTC"].comprar,
		vender: json["ArgenBTC"].vender,
		retirar: json["ArgenBTC"].retirar,
		twitter: json["ArgenBTC"].twitter,
		type: json["ArgenBTC"].type
	})
	arr.push({
		name: "Bitinka",
		buy: json["Bitinka"].buy,
		sell: json["Bitinka"].sell,
		timestamp: json["Bitinka"].timestamp,
		cargar: json["Bitinka"].cargar,
		comprar: json["Bitinka"].comprar,
		vender: json["Bitinka"].vender,
		retirar: json["Bitinka"].retirar,
		twitter: json["Bitinka"].twitter,
		type: json["Bitinka"].type
	})
	arr.push({
		name: "Buda",
		buy: json["Buda"].buy,
		sell: json["Buda"].sell,
		timestamp: json["Buda"].timestamp,
		cargar: json["Buda"].cargar,
		comprar: json["Buda"].comprar,
		vender: json["Buda"].vender,
		retirar: json["Buda"].retirar,
		twitter: json["Buda"].twitter,
		type: json["Buda"].type
	})
	arr.push({
		name: "BuenBit",
		buy: json["BuenBit"].buy,
		sell: json["BuenBit"].sell,
		timestamp: json["BuenBit"].timestamp,
		cargar: json["BuenBit"].cargar,
		comprar: json["BuenBit"].comprar,
		vender: json["BuenBit"].vender,
		retirar: json["BuenBit"].retirar,
		twitter: json["BuenBit"].twitter,
		type: json["BuenBit"].type
	})
	arr.push({
		name: "CryptoMKT",
		buy: json["CryptoMKT"].buy,
		sell: json["CryptoMKT"].sell,
		timestamp: json["CryptoMKT"].timestamp,
		cargar: json["CryptoMKT"].cargar,
		comprar: json["CryptoMKT"].comprar,
		vender: json["CryptoMKT"].vender,
		retirar: json["CryptoMKT"].retirar,
		twitter: json["CryptoMKT"].twitter,
		type: json["CryptoMKT"].type
	})
	arr.push({
		name: "Ripio",
		buy: json["Ripio"].buy,
		sell: json["Ripio"].sell,
		timestamp: json["Ripio"].timestamp,
		cargar: json["Ripio"].cargar,
		comprar: json["Ripio"].comprar,
		vender: json["Ripio"].vender,
		retirar: json["Ripio"].retirar,
		twitter: json["Ripio"].twitter,
		type: json["Ripio"].type
	})
	arr.push({
		name: "Saldo",
		buy: json["Saldo"].buy,
		sell: json["Saldo"].sell,
		timestamp: json["Saldo"].timestamp,
		cargar: json["Saldo"].cargar,
		comprar: json["Saldo"].comprar,
		vender: json["Saldo"].vender,
		retirar: json["Saldo"].retirar,
		twitter: json["Saldo"].twitter,
		type: json["Saldo"].type
	})
	arr.push({
		name: "SatoshiTango",
		buy: json["SatoshiTango"].buy,
		sell: json["SatoshiTango"].sell,
		timestamp: json["SatoshiTango"].timestamp,
		cargar: json["SatoshiTango"].cargar,
		comprar: json["SatoshiTango"].comprar,
		vender: json["SatoshiTango"].vender,
		retirar: json["SatoshiTango"].retirar,
		twitter: json["SatoshiTango"].twitter,
		type: json["SatoshiTango"].type
	})
	arr.push({
		name: "VentaBTC",
		buy: json["VentaBTC"].buy,
		sell: json["VentaBTC"].sell,
		timestamp: json["VentaBTC"].timestamp,
		cargar: json["VentaBTC"].cargar,
		comprar: json["VentaBTC"].comprar,
		retirar: json["VentaBTC"].retirar,
		twitter: json["VentaBTC"].twitter,
		type: json["VentaBTC"].type
	})
	var buyASC = arr.slice(0);
	buyASC = buyASC.sort(function(a, b){
		return Math.round(a.buy) - Math.round(b.buy);
	})
	var sellDESC = arr.slice(0);
	sellDESC = sellDESC.sort(function(a, b){
		return Math.round(b.sell) - Math.round(a.sell);
	})

	buyASC = _.filter(buyASC, function(o) {
		return o.buy != 0
	});
	sellDESC = _.filter(sellDESC, function(o) {
		return o.sell != 0
	});

	var onlyTransferencia = _.filter(buyASC, function(o) {
		return o.cargar.transferencia !== undefined;
	});
	var bestTransferencia = tableSort(addFee("Transferencia", onlyTransferencia), "asc");

	var onlyMercadopago = _.filter(buyASC, function(o) {
		return o.cargar.mercadopago !== undefined;
	});
	var bestMercadopago = tableSort(addFee("Mercadopago", onlyMercadopago), "asc");

	var onlyeRapipago = _.filter(buyASC, function(o) {
		return o.cargar.rapipago_pagofacil !== undefined;
	});
	var bestRapipago = tableSort(addFee("Rapipago/Pagofacil", onlyeRapipago), "asc");

	var onlyWallet = _.filter(sellDESC, function(o) {
		return o.vender !== undefined && o.vender > 0;
	});
	var bestWallet = tableSort(addFee("Wallet", onlyWallet), "desc");

	var onlyDeposito = _.filter(sellDESC, function(o) {
		return o.retirar !== undefined && o.retirar.transferencia !== undefined;
	});
	var bestDeposito = tableSort(addFee("Deposito", onlyDeposito), "desc");

	var onlySellMercadopago = _.filter(sellDESC, function(o) {
		return o.retirar !== undefined && o.retirar.mercadopago !== undefined;
	});
	var bestSellMercadopago = tableSort(addFee("sellMercadopago", onlySellMercadopago), "desc");

	msgBestTransferencia = "Por Transferencia Bancaria el mejor precio de Compra lo encontrás en " + bestTransferencia[0].twitter + " a " + bestTransferencia[0].buy.toFixed(2) + " ARS (FEES INCLUIDOS).";
	msgBestMercadopago = "Por Mercadopago el mejor precio de Compra lo encontrás en " + bestMercadopago[0].twitter + " a " + bestMercadopago[0].buy.toFixed(2) + " ARS (FEES INCLUIDOS).";
	msgBestRapipago = "Por Rapipago/Pagofacil el mejor precio de Compra lo encontrás en " + bestRapipago[0].twitter + " a " + bestRapipago[0].buy.toFixed(2) + " ARS (FEES INCLUIDOS).";
	msgBestWallet = "Por Wallet el mejor precio de Venta lo encontrás en " + bestWallet[0].twitter + " a " + bestWallet[0].sell.toFixed(2) + " ARS (FEES INCLUIDOS).";
	msgBestDeposito = "Por Depósito Bancario el mejor precio de Venta lo encontrás en " + bestDeposito[0].twitter + " a " + bestDeposito[0].sell.toFixed(2) + " ARS (FEES INCLUIDOS).";
	msgBestSellMercadopago = "Por Mercadopago el mejor precio de Venta lo encontrás en " + bestSellMercadopago[0].twitter + " a " + bestSellMercadopago[0].sell.toFixed(2) + " ARS (FEES INCLUIDOS).";

}, function (errorObject) {
	Raven.captureException(errorObject, { extra: { msg: "Twitter Bot - Error al leer en firebase" } });
  //console.log("The read failed: " + errorObject.code);
});

// cada 3 horas
cron.schedule('0 */3 * * *', function(){
	tweetPost(msgBestTransferencia);
	tweetPost(msgBestMercadopago);
	tweetPost(msgBestRapipago);
	tweetPost(msgBestWallet);
	tweetPost(msgBestDeposito);
	tweetPost(msgBestSellMercadopago);
})

function tableSort(json, mode) {
	if (mode == "asc") {
		return json.sort(function(a, b) {
			return Math.round(a.buy) - Math.round(b.buy);
		})
	}
	else if (mode == "desc") {
		return json.sort(function(a, b) {
			return Math.round(b.sell) - Math.round(a.sell);
		})
	}
}

function addFee(modo, sitios) {
	if (modo == "Transferencia") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			_sitio.buy = ((_sitio.buy * (1 + _sitio.cargar.transferencia)) * (1 + _sitio.comprar))
			newSitios.push(_sitio)
		})
	}
	else if (modo == "Mercadopago") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			_sitio.buy = _sitio.buy = ((_sitio.buy * (1 + _sitio.cargar.mercadopago)) * (1 + _sitio.comprar))
			newSitios.push(_sitio)
		})
	}
	else if (modo == "Rapipago/Pagofacil") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			_sitio.buy = _sitio.buy = ((_sitio.buy * (1 + _sitio.cargar.rapipago_pagofacil)) * (1 + _sitio.comprar))
			newSitios.push(_sitio)
		})
	}
	else if (modo == "Wallet") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			if (_sitio.vender !== undefined) {
				_sitio.sell = _sitio.sell * (1 - _sitio.vender)
				newSitios.push(_sitio)
			}
		})
	}
	else if (modo == "Deposito") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			if (_sitio.retirar !== undefined && _sitio.retirar.transferencia !== undefined) {
				_sitio.sell = _sitio.sell * (1 - _sitio.retirar.transferencia)
				newSitios.push(_sitio)
			}
		})
	}
	else if (modo == "sellMercadopago") {
		var newSitios = [];
		(sitios).forEach(function(sitio){
			var _sitio = _.clone(sitio, true);
			if (_sitio.retirar !== undefined && _sitio.retirar.mercadopago !== undefined) {
				_sitio.sell = _sitio.sell * (1 - _sitio.retirar.mercadopago)
				newSitios.push(_sitio)
			}
		})
	}
	return newSitios
}

