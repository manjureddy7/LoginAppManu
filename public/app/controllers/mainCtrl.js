angular.module('mainController',['authServices'])

.controller('mainCtrl',function(Auth,$timeout,$location,$rootScope,$window){

	var msg=this;
	var loadme=false;

	$rootScope.$on('$routeChangeStart',function(){

		if(Auth.isLoggedIn()){
			console.log("User is logged in");
			msg.isLoggedIn=true;
			Auth.getUser().then(function(data){
				console.log(data.data.username);
				msg.username=data.data.username;
				msg.useremail=data.data.email;
				msg.loadme=true;
			})
		}
		else{
			console.log("User not loged");
			msg.isLoggedIn=false;
			msg.username='';
			msg.loadme=true;
		}
		if($location.hash() == '_-_'){
			$location.hash(null);
		}
	});

	this.facebook=function(){
		// console.log($window.location.host);
		// console.log($window.location.protocol);
		$window.location=$window.location.protocol+'//'+$window.location.host+'/auth/facebook';
	}
	
	 this.doLogin=function(loginData){
	 	msg.errorMsg=false;
	 	msg.successMsg=false;
	 	msg.loading=true;
		console.log("data submitetd:");

		Auth.login(msg.loginData).then(function(data){
			console.log("Came here");
			
			if(data.data.success){
				// print success message
				// redirect to home page
				msg.loading=false;
				msg.successMsg=data.data.message+' '+'Redirecting wait a second';
				$timeout(function() {
					$location.path('/about');
				}, 2000);
				
			}
			else{
				// print error message
				msg.loading=false;
				msg.errorMsg=data.data.message;
			}
		});
		this.loginData="";
	};
	this.logout=function(){
		Auth.logout();
		$location.path('/logout');
		$timeout(function() {
			$location.path('/');
		}, 2000);
	}
});


