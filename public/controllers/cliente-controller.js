angular.module('teste').controller('ClienteController', function($scope, $rootScope, $http) {
	$scope.dados = {};
	$scope.pesquisar= function(){
      var data = {
        cep: $scope.dados.CEP
      };
      $http.post("/cep", data).success(function(data, status) {
        var endereco = data.Endereco;
		$scope.dados.cidade = endereco.city;
		$scope.dados.bairro = endereco.neighborhood;
		$scope.dados.estado = endereco.state;
		$scope.dados.endereco = endereco.street;
		if (endereco.street == ''){
			document.getElementById("endereco").readOnly=false;
			document.getElementById("bairro").readOnly=false;
		} else {
			document.getElementById("endereco").readOnly=true;
			document.getElementById("bairro").readOnly=true;
		}
      })
   }
	
	$scope.gravar = function() {
		
		if ($scope.form1.$valid) {
			alert('Dados preenchidos corretamente!');
		}
	};
	
	
});