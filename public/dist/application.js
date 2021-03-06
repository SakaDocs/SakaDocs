'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'SakaDocs - Your document finding solution';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);


// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);
angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$anchorScroll" , function ($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", function() {
                $anchorScroll();
    });
}]);
//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('atms');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('blogs');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('certificates');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('dls');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('nationals');


'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('nhifs');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('passports');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('staffs');

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('students');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

//Setting up route
angular.module('atms').config(['$stateProvider',
	function($stateProvider) {
		// Atms state routing
		$stateProvider.
		state('claimatm', {
			url: '/claimatm/:id',
			templateUrl: 'modules/atms/views/claimatm.client.view.html'
		}).
		state('postatm', {
			url: '/postatm',
			templateUrl: 'modules/atms/views/postatm.client.view.html'
		}).
		state('atms', {
			url: '/atms',
			templateUrl: 'modules/atms/views/atms.client.view.html'
		});
	}
]);
'use strict';

angular.module('atms').controller('AtmsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            // init function for fetching all unclaimed atms
            $scope.find = function() {
                $http.get('/atms').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            // function for getting subscription alerts for atms
            $scope.getAlert = function() {
                $scope.atm.mobileNumber = Authentication.user.username;
                $http.post('/atmalert', $scope.atm).success(function(response) {
                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.atm.fullNames = "";
                    $scope.atm.cardType = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('atms').controller('ClaimatmController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/atm/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('atms').controller('PostatmController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postatm'
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/atms')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('atms').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('atms').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

//Setting up route
angular.module('blogs').config(['$stateProvider',
	function($stateProvider) {
		// Blogs state routing
		$stateProvider.
		state('blog/howtoclaimpayment', {
			url: '/blog/howtoclaimpayment',
			templateUrl: 'modules/blogs/views/howtoclaimpayment.client.view.html'
		}).
		state('blog/howtoclaimadoc', {
			url: '/blog/howtoclaimadoc',
			templateUrl: 'modules/blogs/views/howtoclaimadoc.client.view.html'
		}).
		state('blog/howtopostadoc', {
			url: '/blog/howtopostadoc',
			templateUrl: 'modules/blogs/views/howtopostadoc.client.view.html'
		});
	}
]);
'use strict';

angular.module('blogs').controller('HowtoclaimadocController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
'use strict';

angular.module('blogs').controller('HowtoclaimpaymentController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
'use strict';

angular.module('blogs').controller('HowtopostadocController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
'use strict';

//Setting up route
angular.module('certificates').config(['$stateProvider',
	function($stateProvider) {
		// Certificates state routing
		$stateProvider.
		state('claimcertificate', {
			url: '/claimcertificate/:id',
			templateUrl: 'modules/certificates/views/claimcertificate.client.view.html'
		}).
		state('postcertificate', {
			url: '/postcertificate',
			templateUrl: 'modules/certificates/views/postcertificate.client.view.html'
		}).
		state('certificates', {
			url: '/certificates',
			templateUrl: 'modules/certificates/views/certificates.client.view.html'
		});
	}
]);
'use strict';

angular.module('certificates').controller('CertificatesController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/certificates').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.certificate.mobileNumber = Authentication.user.username;
                $http.post('/certificatealert', $scope.certificate).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.certificate.institutionName = "";
                    $scope.certificate.fullNames = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('nationals').controller('ClaimcertificateController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/certificate/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('certificates').controller('PostcertificateController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postcertificate';
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/certificates')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('certificates').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('certificates').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('admindashboard', {
			url: '/admindashboard',
			templateUrl: 'modules/core/views/admindashboard.client.view.html'
		}).
		state('privacypolicy', {
			url: '/privacypolicy',
			templateUrl: 'modules/core/views/privacypolicy.client.view.html'
		}).
		state('dl', {
			url: '/dl',
			templateUrl: 'modules/dls/views/dls.client.view.html'
		}).
		state('passport', {
			url: '/passport',
			templateUrl: 'modules/passports/views/passports.client.view.html'
		}).
		state('certificate', {
			url: '/certificate',
			templateUrl: 'modules/certificates/views/certificates.client.view.html'
		}).
		state('nhifcard', {
			url: '/nhifcard',
			templateUrl: 'modules/nhifs/views/nhifs.client.view.html'
		}).
		state('staffid', {
			url: '/staffid',
			templateUrl: 'modules/staffs/views/staffids.client.view.html'
		}).
		state('studentid', {
			url: '/studentid',
			templateUrl: 'modules/students/views/studentids.client.view.html'
		}).
		state('pricingplan', {
			url: '/pricingplan',
			templateUrl: 'modules/core/views/pricingplan.client.view.html'
		}).
		state('termsofuse', {
			url: '/termsofuse',
			templateUrl: 'modules/core/views/termsofuse.client.view.html'
		}).
		state('payment', {
			url: '/payment',
			templateUrl: 'modules/core/views/payment.client.view.html'
		}).
		state('footer', {
			url: '/footer',
			templateUrl: 'modules/core/views/footer.client.view.html'
		}).
		state('atm', {
			url: '/atm',
			templateUrl: 'modules/atms/views/atms.client.view.html'
		}).
		state('national', {
			url: '/national',
			templateUrl: 'modules/nationals/views/nationals.client.view.html'
		}).
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('AdmindashboardController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user && $scope.authentication.user["roles"][0] === "admin") {
            $scope.countUsers = function() {

                $http.get('/countusers').success(function(res) {
                    $scope.users = res["usersCount"].toString();
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', '$location', 'Authentication', 'Menus', '$window',
    function($scope, $http, $location, Authentication, Menus, $window) {
        $scope.authentication = Authentication;
        $scope.isCollapsed = false;
        $scope.menu = Menus.getMenu('topbar');
        $scope.search = function() {

            $location.path($scope.docType);
        };
        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });
        $scope.signout = function() {
            $http.get('/auth/signout').success(function(res) {
                $window.sessionStorage["user"] = null;
                $location.path('/');
            }).error(function(res) {
                
            });
        }


    }
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location', '$window',
    function($scope, Authentication, $http, $location, $window) {
    	$scope.authentication = Authentication;
    	if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        $scope.signout = function() {
            $http.get('/auth/signout').success(function(res) {
                $window.sessionStorage['user'] = null;
                // $location.path('/#!/signup');
            }).error(function(res) {});
        }
    }
]);
'use strict';

angular.module('core').controller('PricingplanController', ['$scope', 'Authentication', '$window',
    function($scope, Authentication, $window) {
        // Controller Logic
        // ...
        $scope.authentication = Authentication;

        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
    }
]);
'use strict';

angular.module('core').controller('PrivacypolicyController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
	}
]);
'use strict';

angular.module('core').controller('TermsofuseController', ['$scope', 'Authentication', '$window',
    function($scope) {

        $scope.authentication = Authentication;

        if ($window.sessionStorage["user"]) {
            $scope.authentication.user = JSON.parse($window.sessionStorage["user"]);
        }
    }
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('dls').config(['$stateProvider',
	function($stateProvider) {
		// Dls state routing
		$stateProvider.
		state('claimdl', {
			url: '/claimdl/:id',
			templateUrl: 'modules/dls/views/claimdl.client.view.html'
		}).
		state('postdl', {
			url: '/postdl',
			templateUrl: 'modules/dls/views/postdl.client.view.html'
		}).
		state('dls', {
			url: '/dls',
			templateUrl: 'modules/dls/views/dls.client.view.html'
		});
	}
]);
'use strict';

angular.module('dls').controller('ClaimdlController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/dl/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('dls').controller('DlsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/dls').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.dl.mobileNumber = Authentication.user.username;
                $http.post('/dlalert', $scope.dl).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.dl.fullNames = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('dls').controller('PostdlController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postdl'
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/dls')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('dls').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('dls').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);

'use strict';

//Setting up route
angular.module('nationals').config(['$stateProvider', 
	function($stateProvider) {
		// Nationals state routing
		$stateProvider.
		state('editid', {
			url: '/editid/:id',
			templateUrl: 'modules/nationals/views/editid.client.view.html'
		}).
		state('claimid', {
			url: '/claimid/:id',
			templateUrl: 'modules/nationals/views/claimid.client.view.html'
		}).
		state('postid', {
			url: '/postid',
			templateUrl: 'modules/nationals/views/postid.client.view.html'
		}).
		state('nationals', {
			url: '/nationals',
			templateUrl: 'modules/nationals/views/nationals.client.view.html'
		});
	}
]);
'use strict';

angular.module('nationals').controller('ClaimController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function () {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function () {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                $http.get('/nationalid/' + $stateParams.id).success(function(res) {
                    $scope.id = res;
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('nationals').controller('EditidController', ['$scope', '$window', 'Authentication', '$http', '$stateParams', '$location',
    function($scope, $window, Authentication, $http, $stateParams, $location) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        }
        // check if user is signed in
        if ($scope.authentication) {
            $scope.id = {};
            // fetch document using isValid
            $scope.getId = function() {
                $http.get('/nationalid/' + $stateParams.id).success(function(res) {
                    $scope.id = res;
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            // Update a user profile
            $scope.updateDocument = function(isValid) {
                if (isValid) {
                    $scope.success = $scope.error = null;
                    var user = new Users($scope.user);

                    user.$update(function(response) {
                        $scope.success = true;
                        Authentication.user = response;
                    }, function(response) {
                        $scope.error = response.data.message;
                    });
                } else {
                    $scope.submitted = true;
                }
            };
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('nationals').controller('NationalsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {

                $http.get('/nationalids').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.national.mobileNumber = Authentication.user.username;
                $http.post('/nationalalert', $scope.national).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.national.idNumber = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('nationals').controller('PostController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postnationalid';
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/nationals')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('nationals').directive('fileModel', ['$parse',
	function($parse) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var parsedFile = $parse(attrs.fileModel);
				var parsedFileSetter = parsedFile.assign;

				element.bind('change', function () {
					scope.$apply(function () {
						parsedFileSetter(scope, element[0].files[0]);
					})
				})	
			}
		};
	}
]);
'use strict';

angular.module('students').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

//Setting up route
angular.module('nhifs').config(['$stateProvider',
	function($stateProvider) {
		// Nhifs state routing
		$stateProvider.
		state('claimnhif', {
			url: '/claimnhif/:id',
			templateUrl: 'modules/nhifs/views/claimnhif.client.view.html'
		}).
		state('postnhif', {
			url: '/postnhif',
			templateUrl: 'modules/nhifs/views/postnhif.client.view.html'
		}).
		state('nhifs', {
			url: '/nhifs',
			templateUrl: 'modules/nhifs/views/nhifs.client.view.html'
		});
	}
]);
'use strict';

angular.module('nhifs').controller('ClaimnhifController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/nhifcard/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('nhifs').controller('NhifsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/nhifs').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.nhif.mobileNumber = Authentication.user.username;
                $http.post('/nhifalert', $scope.nhif).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.nhif.companyName = "";
                    $scope.nhif.cardNumber = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('nhifs').controller('PostnhifController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postnhifcard'
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/nhifs')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('nhifs').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('nhifs').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

//Setting up route
angular.module('passports').config(['$stateProvider',
	function($stateProvider) {
		// Passports state routing
		$stateProvider.
		state('claimpassports', {
			url: '/claimpassport/:id',
			templateUrl: 'modules/passports/views/claimpassports.client.view.html'
		}).
		state('postpassport', {
			url: '/postpassport',
			templateUrl: 'modules/passports/views/postpassport.client.view.html'
		}).
		state('passports', {
			url: '/passports',
			templateUrl: 'modules/passports/views/passports.client.view.html'
		});
	}
]);
'use strict';

angular.module('passports').controller('ClaimpassportController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/passport/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('passports').controller('PassportsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/passports').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.passport.mobileNumber = Authentication.user.username;
                $http.post('/passportalert', $scope.passport).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.passport.passportNumber = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('passports').controller('PostpassportController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/postpassport'
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/passports')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('passports').directive('fileModel', ['$parse',
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// File model directive logic
				// ...

				element.text('this is the fileModel directive');
			}
		};
	}
]);
'use strict';

angular.module('passports').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

//Setting up route
angular.module('staffs').config(['$stateProvider',
	function($stateProvider) {
		// Staffs state routing
		$stateProvider.
		state('claimstaffid', {
			url: '/claimstaffid/:id',
			templateUrl: 'modules/staffs/views/claimstaffid.client.view.html'
		}).
		state('poststaffid', {
			url: '/poststaffid',
			templateUrl: 'modules/staffs/views/poststaffid.client.view.html'
		}).
		state('staffids', {
			url: '/staffids',
			templateUrl: 'modules/staffs/views/staffids.client.view.html'
		});
	}
]);
'use strict';

angular.module('staffs').controller('ClaimstaffidController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/staffid/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('staffs').controller('PoststaffidController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadfileservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/poststaffid'
                Uploadfileservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/staffids')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('staffs').controller('StaffidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/staffids').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }

            $scope.getAlert = function() {
                $scope.staffId.mobileNumber = Authentication.user.username;
                $http.post('/staffidalert', $scope.staffId).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.staffId.companyName = "";
                    $scope.staffId.fullName = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }

        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('staffs').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('staffs').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

//Setting up route
angular.module('students').config(['$stateProvider',
	function($stateProvider) {
		// Students state routing
		$stateProvider.
		state('claimstudentid', {
			url: '/claimstudentid/:id',
			templateUrl: 'modules/students/views/claimstudentid.client.view.html'
		}).
		state('poststudentid', {
			url: '/poststudentid',
			templateUrl: 'modules/students/views/poststudentid.client.view.html'
		}).
		state('studentids', {
			url: '/studentids',
			templateUrl: 'modules/students/views/studentids.client.view.html'
		});
	}
]);
'use strict';

angular.module('students').controller('ClaimstudentidController', ['$scope', '$http', '$location', 'Authentication', '$stateParams', '$window',
    function($scope, $http, $location, Authentication, $stateParams, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.showMpesa = false;
            $scope.showAirtel = false;
            $scope.toggleMpesa = function() {
                $scope.showMpesa = true;
                $scope.showAirtel = false;
            }
            $scope.toggleAirtel = function() {
                $scope.showAirtel = true;
                $scope.showMpesa = false;
            }
            $scope.claim = function() {
                if ($scope.authentication.user.accountBalance < 200) {
                    $http.get('/studentid/' + $stateParams.id).success(function(res) {
                        $scope.id = res;
                    }).error(function(res) {
                        $scope.error = res.message;
                    });
                }

            }

        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('students').controller('PoststudentidController', ['$scope', '$timeout', '$location', '$interval', 'Authentication', 'Uploadfileservice', '$window',
    function($scope, $timeout, $location, $interval, Authentication, Uploadstudentidservice, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // check if user is logged in
        if ($scope.authentication.user) {
            $scope.file = {};
            $scope.Submit = function() {
                $scope.uploading = true;
                // set the users number as finderNumber 
                $scope.id.finderNumber = $scope.authentication.user.username;
                var url = '/poststudentid'
                Uploadstudentidservice.upload($scope.file, $scope.id, url).then(function(data) {
                    if (data.data.success) {
                        $scope.alert = 'alert alert-success';
                        $scope.message = data.data.message;
                        $scope.file = {};
                        $scope.uploading = false;
                        $interval(function() {
                            $location.path('/studentids')
                        }, 2000, 1, false);

                    } else {
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-danger';
                        $scope.message = data.data.message;
                        $scope.file = {};
                    }
                })
            }
            $scope.photoChanged = function(files) {
                if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg)$/)) {
                    $scope.uploading = true;
                    var file = files[0];
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.thumbnail = {};
                            $scope.thumbnail.dataUrl = e.target.result;
                            $scope.uploading = false;
                            $scope.message = false;
                        });
                    }

                } else {
                    $scope.thumbnail = {};
                    $scope.message = false;
                }
            }
        } else {
            $location.path('/signin');
        }
    }
]);
'use strict';

angular.module('students').controller('StudentidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $http.get('/studentids').success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.getAlert = function() {
                $scope.studentId.mobileNumber = Authentication.user.username;
                $http.post('/studentidalert', $scope.studentId).success(function(response) {

                    // If successful we assign the response to the success message
                    $scope.message = response.message;
                    $scope.studentId.admissionNumber = "";
                    $scope.studentId.schoolName = "";
                }).error(function(response) {
                    $scope.error = response.message;
                });
            }
        } else {
            $location.path('/signin');
        }

    }
]);
'use strict';

angular.module('students').directive('fileModel', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parsedFile = $parse(attrs.fileModel);
                var parsedFileSetter = parsedFile.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        parsedFileSetter(scope, element[0].files[0]);
                    })
                })
            }
        };
    }
]);
'use strict';

angular.module('students').service																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																												('Uploadfileservice', ['$http',
	function($http) {
		this.upload = function (file, id, url) {
			var data = {
				model: id,
				file: file
			};
			var fd = new FormData();
			fd.append('iddetails', angular.toJson(data.model));
			fd.append('idphoto', data.file.upload);
		     return  $http.post(url, fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}

			});

		}

		
		
	}
]);


'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('adminsignup', {
			url: '/adminsignup',
			templateUrl: 'modules/users/views/adminsignup.client.view.html'
		}).
		state('mypassports', {
			url: '/mypassports',
			templateUrl: 'modules/users/views/mypassports.client.view.html'
		}).
		state('mydls', {
			url: '/mydls',
			templateUrl: 'modules/users/views/mydls.client.view.html'
		}).
		state('mycertificates', {
			url: '/mycertificates',
			templateUrl: 'modules/users/views/mycertificates.client.view.html'
		}).
		state('mynhifs', {
			url: '/mynhifs',
			templateUrl: 'modules/users/views/mynhifs.client.view.html'
		}).
		state('myatms', {
			url: '/myatms',
			templateUrl: 'modules/users/views/myatms.client.view.html'
		}).
		state('mystaffids', {
			url: '/mystaffids',
			templateUrl: 'modules/users/views/mystaffids.client.view.html'
		}).
		state('mystudentids', {
			url: '/mystudentids',
			templateUrl: 'modules/users/views/mystudentids.client.view.html'
		}).
		state('myids', {
			url: '/myids',
			templateUrl: 'modules/users/views/myids.client.view.html'
		}).
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AdminsignupController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');
        $scope.signup = function() {

            $http.post('/auth/adminsignup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                // we also save response to sessionStorage
                $window.sessionStorage["user"] = JSON.stringify(response);
                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });

        };
    }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window ) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        // If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');


        $scope.signup = function() {

            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                // we also save response to sessionStorage
                $window.sessionStorage["user"] = JSON.stringify(response);
                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });

        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;
                // we also save response to sessionStorage
                $window.sessionStorage["user"] = JSON.stringify(response);

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
'use strict';

angular.module('users').controller('MyatmsController', ['$scope', '$http', '$location', 'Authentication', '$window',

    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication) {
            $scope.show = false;
            $scope.credentials = {};
            $scope.find = function() {
                $http.get('/atms/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "atm";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    }else{
                        if (id.claimed === false) {
                            $scope.error = "This ATM has not been claimed yet";                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MycertificatesController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/certificates/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "certificate";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MydlsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.show = false;
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/dls/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "dl";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MyidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.show = false;
            $scope.credentials = {};
            $scope.find = function() {
                $http.get('/nationalids/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "national";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MynhifsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/nhifcards/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "nhif";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MypassportsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/passports/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "passport";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MystaffidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/staffids/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "staffid";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('MystudentidsController', ['$scope', '$http', '$location', 'Authentication', '$window',
    function($scope, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        if ($scope.authentication.user) {
            $scope.find = function() {
                $scope.show = false;
                $scope.credentials = {};
                $http.get('/studentids/' + $scope.authentication.user.username).success(function(res) {
                    $scope.ids = res;
                    $scope.alert = 'alert alert-danger';
                }).error(function(res) {
                    $scope.error = res.message;
                });
            }
            $scope.toggle = function() {
                $scope.show = true;
            }
            $scope.payUser = function() {
                $scope.ids.forEach(function(id) {
                    if (id.claimed === true && id.sakaDocsCode.toUpperCase() === $scope.credentials.sakaDocsCode.toUpperCase()) {
                        $scope.credentials.userNumber = $scope.authentication.user.username;
                        $scope.credentials.docType = "studentid";
                        $http.post('/payuser', $scope.credentials).success(function(res) {
                            $scope.message = res.message;
                        }).error(function(res) {
                            $scope.error = res.message;
                        });
                    } else {
                        if (id.claimed === false) {
                            $scope.error = "This ID has not been claimed yet";
                        }
                    }
                });
            }
        } else {
            $location.path('/signin');
        }


    }
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', '$window',
    function($scope, $stateParams, $http, $location, Authentication, $window) {
        $scope.authentication = Authentication;
        if ($window.sessionStorage['user']) {
            $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
        };
        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        // Submit forgotten password account id
        $scope.askForPasswordReset = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/forgot', $scope.credentials).success(function(response) {
                // Show user success message and clear form
                $scope.credentials = null;
                $scope.success = response.message;

            }).error(function(response) {
                // Show user error message and clear form
                $scope.credentials = null;
                $scope.error = response.message;
            });
        };

        // Change user password
        $scope.resetUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.passwordDetails = null;

                // Attach user profile
                Authentication.user = response;

                // And redirect to the index page
                $location.path('/password/reset/success');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
// 'use strict';

// angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$window',
//     function($scope, $http, $location, Users, Authentication, $window) {
//         $scope.authentication = Authentication;
//         if ($window.sessionStorage['user']) {
//             $scope.authentication.user = JSON.parse($window.sessionStorage['user']);
//         };
//         // If user is not signed in then redirect back home
//         if (!$scope.user) $location.path('/');

//         // Check if there are additional accounts 
//         $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
//             for (var i in $scope.user.additionalProvidersData) {
//                 return true;
//             }

//             return false;
//         };

//         // Check if provider is already in use with current user
//         $scope.isConnectedSocialAccount = function(provider) {
//             return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
//         };

//         // Remove a user social account
//         $scope.removeUserSocialAccount = function(provider) {
//             $scope.success = $scope.error = null;

//             $http.delete('/users/accounts', {
//                 params: {
//                     provider: provider
//                 }
//             }).success(function(response) {
//                 // If successful show success message and clear form
//                 $scope.success = true;
//                 $scope.user = Authentication.user = response;
//             }).error(function(response) {
//                 $scope.error = response.message;
//             });
//         };

//         // Update a user profile
//         $scope.updateUserProfile = function(isValid) {
//             if (isValid) {
//                 $scope.success = $scope.error = null;
//                 var user = new Users($scope.user);

//                 user.$update(function(response) {
//                     $scope.success = true;
//                     Authentication.user = response;
//                 }, function(response) {
//                     $scope.error = response.data.message;
//                 });
//             } else {
//                 $scope.submitted = true;
//             }
//         };

//         // Change user password
//         $scope.changeUserPassword = function() {
//             $scope.success = $scope.error = null;

//             $http.post('/users/password', $scope.passwordDetails).success(function(response) {
//                 // If successful show success message and clear form
//                 $scope.success = true;
//                 $scope.passwordDetails = null;
//             }).error(function(response) {
//                 $scope.error = response.message;
//             });
//         };
//     }
// ]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$window',
    function($scope, $http, $location, Users, Authentication, $window) {
        $scope.user = Authentication.user;
        if ($window.sessionStorage['user']) {
            $scope.user = JSON.parse($window.sessionStorage['user']);
        }

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Check if there are additional accounts 
        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }

            return false;
        };

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        // Remove a user social account
        $scope.removeUserSocialAccount = function(provider) {
            $scope.success = $scope.error = null;

            $http.delete('/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function(isValid) {
            if (isValid) {
                $scope.success = $scope.error = null;
                var user = new Users($scope.user);

                user.$update(function(response) {
                    $scope.success = true;
                    Authentication.user = response;
                }, function(response) {
                    $scope.error = response.data.message;
                });
            } else {
                $scope.submitted = true;
            }
        };

        // Change user password
        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
'use strict';

angular.module('users').directive('equals', [
    function() {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function() {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function(val) {
                    validate();
                });

                var validate = function() {
                    // values
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;

                    // set validity
                    ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
                };
            }
        }
    }
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);