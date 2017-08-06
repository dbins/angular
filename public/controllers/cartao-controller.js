angular.module('teste').controller('CartaoController', function($scope, $rootScope, $http) {
	$scope.dados = {};
	
	$scope.gravar = function() {
		
		if ($scope.form1.$valid) {
			alert('Dados preenchidos corretamente! Aguarde enquanto geramos o hash do cartão...');
			//Gerar o HASH do cartao
			  var data = {
				card_number: $scope.dados.card_number,
				card_holder_name: $scope.dados.card_holder_name,
				card_expiration_month: $scope.dados.card_expiration_month,
				card_expiration_year: $scope.dados.card_expiration_year,
				card_cvv: $scope.dados.card_cvv,
			};
			  $http.post("/", data).success(function(data, status) {
				alert(data.CardHash);
			});
	    }
	}
	
});