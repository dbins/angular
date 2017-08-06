angular.module('minhasDiretivas', []).directive('isNumberKey', function() {
	return {
		require: '?ngModel',
		link: function(scope, element, attrs, ngModelCtrl) {
		  if(!ngModelCtrl) {
			return; 
		  }

		  ngModelCtrl.$parsers.push(function(val) {
			if (angular.isUndefined(val)) {
				var val = '';
			}
			var clean = val.replace( /[^0-9]+/g, '');
			if (val !== clean) {
			  ngModelCtrl.$setViewValue(clean);
			  ngModelCtrl.$render();
			}
			return clean;
		  });

		  element.bind('keypress', function(event) {
			if(event.keyCode === 32) {
			  event.preventDefault();
			}
		  });
		}
	  };
})

.directive('validarEmail', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, control) {
            control.$parsers.push(function (viewValue) {
                var newEmail = control.$viewValue;
                control.$setValidity("invalidEmail", true);
                if (typeof newEmail === "object" || newEmail == "") return newEmail;  // pass through if we clicked date from popup
                if (!newEmail.match(/^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/))
                    control.$setValidity("invalidEmail", false);
                return viewValue;
            });
        }
    };
})

.directive('cpfValidator', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            
            function customValidator(ngModelValue) {
                function getFirstDigit(v) {
                    var matriz = [10, 9, 8, 7, 6, 5, 4, 3, 2];
                    var total = 0,
                        verifc;
                    for (var i = 0; i < 9; i++) {
                        total += v[i] * matriz[i];
                    }
                    verifc = ((total % 11) < 2) ? 0 : (11 - (total % 11));
                    return verifc;
                }
                
                function getSecondDigit(v) {
                    var matriz = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
                    var total = 0,
                        verifc;
                    for (var i = 0; i < 10; i++) {
                        total += v[i] * matriz[i];
                    }
                    verifc = ((total % 11) < 2) ? 0 : (11 - (total % 11));
                    return verifc;
                }
                
                if (ngModelValue.length >= 11) {
                    ctrl.$setValidity('cpfIncomplet', true);
                    var digits = ngModelValue.replace(/\D+/g, '');
                    var dig1 = getFirstDigit(digits.substr(0, 9));                    
                    var dig2 = getSecondDigit(digits.substr(0, 10));
                    var final = digits.substr(9,2);
                    var val = ""+dig1+dig2;
                    if (final === val) {
                        ctrl.$setValidity('cpfInvalid', true);
                    }
                    else
                    {
                        ctrl.$setValidity('cpfInvalid', false);
                    }
                } else {
                    ctrl.$setValidity('cpfIncomplet', false);                    
                }
                return ngModelValue;
            }
            ctrl.$parsers.push(customValidator);
        }
    };
})

.directive('validarData', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ctrl) {
            if (!ctrl) {
                return;
            }

            function customValidator(ngModelValue) {
				
				function validarData(data_informada){
					var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(data_informada);
					if(matches){
					var d = matches[1];
					var m = matches[2] - 1;
					var y = matches[3];
					var composedDate = new Date(y, m, d); 
					var valid = composedDate.getDate() == d &&
						composedDate.getMonth() == m &&
						composedDate.getFullYear() == y;
					}
					return valid;
				}
				
				if (ngModelValue.length >= 10) {
					ctrl.$setValidity('dataInvalida', true);
					var data_valida = validarData(ngModelValue);
					console.log(data_valida);
					if(!data_valida){
						elm.attr('style', 'border:solid 3px #FE2E2E');
						ctrl.$setValidity('dataInvalida', false);
					} else {
						elm.removeAttr('style');
					}
				} 
				
				return ngModelValue;
            }
			ctrl.$parsers.push(customValidator);
        }
    };
})

.directive('validarIdade', function () {
	return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            function customValidator(ngModelValue) {
				function calculaIdade(dataNasc){ 
					var dataAtual = new Date();
					var anoAtual = dataAtual.getFullYear();
					var anoNascParts = dataNasc.split('/');
					var diaNasc =anoNascParts[0];
					var mesNasc =anoNascParts[1];
					var anoNasc =anoNascParts[2];
					var idade = anoAtual - anoNasc;
					var mesAtual = dataAtual.getMonth() + 1; 

					//se mês atual for menor que o nascimento, nao fez aniversario ainda; (26/10/2009) 
					if(mesAtual < mesNasc){
						idade--; 
					} else {
						//se estiver no mes do nasc, verificar o dia
						if(mesAtual == mesNasc){ 
							if(dataAtual.getDate() < diaNasc ){ 
								//se a data atual for menor que o dia de nascimento ele ainda nao fez aniversario
								idade--; 
							}
						}
					} 
					return idade; 
				}
				
			    if (ngModelValue.length >= 10) {
					ctrl.$setValidity('idadeInvalid', true);
					var idade = calculaIdade(ngModelValue);
					if (parseInt(idade) < 18) {
						ctrl.$setValidity('idadeInvalid', false);
					}
				} 
				return ngModelValue;
			}
            ctrl.$parsers.push(customValidator);
        }
    };
})

.directive('onlyLettersInput', function() {
return {
	require: 'ngModel',
	link: function(scope, element, attr, ngModelCtrl) {
	  function fromUser(text) {
		var transformedInput = text.replace(/[^a-zA-Zà-üÀ-Ü\s@]/g, '');
		//console.log(transformedInput);
		if (transformedInput !== text) {
		  ngModelCtrl.$setViewValue(transformedInput);
		  ngModelCtrl.$render();
		}
		return transformedInput;
	  }
	  ngModelCtrl.$parsers.push(fromUser);
	}
  }

})

.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})

.directive('numbersOnly2', numbersOnly2)
 .directive('allowOnlyNumbers', function () {  
            return {  
                restrict: 'A',  
                link: function (scope, elm, attrs, ctrl) {  
                    elm.on('keydown', function (event) {  
                        if (event.which == 64 || event.which == 16) {  
                            // to allow numbers  
                            return false;  
                        } else if (event.which >= 48 && event.which <= 57) {  
                            // to allow numbers  
                            return true;  
                        } else if (event.which >= 96 && event.which <= 105) {  
                            // to allow numpad number  
                            return true;  
                        } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {  
                            // to allow backspace, enter, escape, arrows  
                            return true;  
                        } else {  
                            event.preventDefault();  
                            // to stop others  
                            return false;  
                        }  
                    });  
                }  
            }  
        });  
 
  function numbersOnly2() {
 
        var directive = {
            restrict: 'A',
			require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
				function fromUser(text) {
					if (text) {
						var transformedInput = text.replace(/[^0-9-]/g, '');
						if (transformedInput !== text) {
							ngModelCtrl.$setViewValue(transformedInput);
							ngModelCtrl.$render();
						}
						return transformedInput;
					}
					return undefined;
				}
				ngModelCtrl.$parsers.push(fromUser);
			}
		};
        return directive;
    };