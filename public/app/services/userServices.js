angular.module('userServices',[])

.factory('User',function($http){
	var userFactory={};
	// User.create(regData)
	userFactory.create=function(regData){
		return $http.post('/api/users',regData)
	};

// User.checkUsername(regData);
	userFactory.checkUsername=function(regData){
		return $http.post('/api/checkuname',regData);
	};

// User.checkEmail(regData);
	userFactory.checkEmail=function(regData){
		return $http.post('/api/checke',regData);
	}

	userFactory.activeAccount=function(token){
		return $http.put('/api/activate/'+token);
	}


	return userFactory;
});


