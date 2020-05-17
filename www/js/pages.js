$$(document).on('page:init', '.page[data-name="welcome"]', function (e, page) {
	mainView.router.clearPreviousHistory();
	$$('#registerbutton').on('click', function(){
		mainView.router.load({
			url:"pages/welcome/register.html"
		});
	});

	$$('#loginbutton').on('click', function(){
		mainView.router.load({
			url:"pages/welcome/login.html"
		});
	});
});


$$(document).on('page:init', '.page[data-name="register"]', function (e, page) {
	
	$$('#register-form-data').on('click', function(){
		var formData = myApp.form.convertToData('#register-form');
		alert(JSON.stringify(formData));
	});
});


$$(document).on('page:init', '.page[data-name="login"]', function (e, page) {

	$$('#login-form-data').on('click', function(){
		var formData = myApp.form.convertToData('#login-form');
		alert(JSON.stringify(formData));
	});
});




$$(document).on('page:init', '.page[data-name="home"]', function (e, page) {
});