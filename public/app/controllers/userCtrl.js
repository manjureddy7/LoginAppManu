angular.module('userControllers',['userServices'])

.controller('regCtrl',function($http,$location,$timeout,User){

	var msg=this;
	 this.regUser=function(regData,valid){
	 	msg.errorMsg=false;
	 	msg.loading=true;
		console.log("data submitetd:");

		if(valid){
			User.create(msg.regData).then(function(data){
				console.log(data.data.success);
				console.log(data.data.message);
				if(data.data.success){
					// print success message
					// redirect to home page
					msg.loading=false;
					msg.successMsg=data.data.message+' '+'Redirecting wait a second';
					$timeout(function() {
						$location.path('/');
					}, 2000);
					
				}
				else{
					// print error message
					msg.loading=false;
					msg.errorMsg=data.data.message;
				}
		});
		}else{
			// print error message
					msg.loading=false;
					msg.errorMsg="Please ensure form filled properly..!!";
		}

		// this.regData="";
	};
	// checkUsername(regData);
	this.checkUsername=function(regData){
		msg.usernameMsg=false;
		msg.usernameInvalid=false;
		msg.checkingUsername=false;

		User.checkUsername(msg.regData).then(function(data){
			if(data.data.success){
				msg.checkingUsername=true;
				msg.usernameInvalid=false;
				msg.usernameMsg=data.data.message;
				console.log(data.data.message);
			}else{
				msg.checkingUsername=true;
				msg.usernameInvalid=true;
				msg.usernameMsg=data.data.message;
				console.log(data.data.message);
			}
		});
	}

		this.checkEmail=function(regData){
			msg.checkingEmail=false;
			msg.emailMsg=false;
			msg.emailInvalid=false;
		
		User.checkEmail(msg.regData).then(function(data){
			if(data.data.success){
				msg.checkingEmail=true;
				msg.emailInvalid=false;
				msg.emailMsg=data.data.message;
			}else{
				msg.checkingEmail=true;
				msg.emailInvalid=true;
				msg.emailMsg=data.data.message;
			}
		});
	}
})

.directive('match', function() {
	  return {
	    	restrict:'A',
	    	controller:function($scope){
	    		$scope.confirmed=false;
	    		$scope.doConfirm=function(values){
	    			values.forEach(function(ele){

	    				if($scope.confirm == ele){
	    					$scope.confirmed=true;
	    				}else{
	    					$scope.confirmed=false;
	    				}
	    				
	    			});
	    		}
	    	},
	    	link:function(scope,element,attrs){

	    		attrs.$observe('match',function(){
	    			scope.matches=JSON.parse(attrs.match);
	    			scope.doConfirm(scope.matches);
	    		});

	    		scope.$watch('confirm',function(){
	    			scope.matches=JSON.parse(attrs.match);
	    			scope.doConfirm(scope.matches);
	    		})
	    	}

	  };
})


.controller('facebookCtrl',function($routeParams,Auth,$location,$window){
	
	var msg=this;

	if($window.location.pathname == '/facebookerror'){
		msg.errorMsg='Facebook email not found in database ';
	}else{
		Auth.facebook($routeParams.token);
		$loaction.path('/');
	}
	
});



