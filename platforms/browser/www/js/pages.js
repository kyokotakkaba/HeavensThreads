$$(document).on('page:init', '.page[data-name="welcome"]', function (e, page) {
	
	$$('.register-form-data').on('click', function(){
		var formData = myApp.form.convertToData('#register-form');
		alert(JSON.stringify(formData));
	});

	$$('.login-form-data').on('click', function(){
		var formData = myApp.form.convertToData('#login-form');
		alert(JSON.stringify(formData));
	});
});




$$(document).on('page:init', '.page[data-name="home"]', function (e, page) {
});