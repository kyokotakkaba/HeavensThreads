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
		// alert(JSON.stringify(formData));
		if (formData.username== "") {
			myApp.dialog.alert("Username tidak boleh kosong");
		}else{
			if (formData.password == formData.confirmpassword) {
				myApp.preloader.show();
				db.collection("users").doc(formData.username).get(
					).then(function(doc) {
						if (doc.exists) {
							myApp.preloader.hide();
							myApp.dialog.alert("Username sudah dipakai");
						} else {
							db.collection("users").doc(formData.username).set({
								username: formData.username,
								password: formData.password,
								gem: 0,
								survey: {
									alasanmendaftar: formData.alasanmendaftar,
									apakahmembusuk: formData.apakahmembusuk,
									keluardaridunia: formData.keluardaridunia,
									apakahpercaya: formData.apakahpercaya,
									apakahinginsurga: formData.apakahinginsurga
								}
							}).then(function() {
								myApp.preloader.hide();
								myApp.dialog.alert("Registrasi Berhasil");
								localStorage.setItem("username",formData.username);
								localStorage.setItem("gem",0);
								mainView.router.load({
									url:"pages/home.html"
								});
							}).catch(function(error) {
								myApp.preloader.hide();
								myApp.dialog.alert("Registrasi gagal<br><br>"+ error);
							});
						}
					}).catch(function(error) {
						myApp.preloader.hide();
						myApp.dialog.alert("Gagal mengecek ketersediaan username<br><br>" + error);
					});
				}else{
					myApp.dialog.alert("Password anda tidak cocok dengan kolom konfirmasi password");
				}
			}

		});
});


$$(document).on('page:init', '.page[data-name="login"]', function (e, page) {

	$$('#login-form-data').on('click', function(){
		var formData = myApp.form.convertToData('#login-form');
		// alert(JSON.stringify(formData));
		if (formData.username== "") {
			myApp.dialog.alert("Username tidak boleh kosong");
		}else{
			myApp.preloader.show();
			db.collection("users").doc(formData.username).get().then(function(doc) {
				if (doc.exists) {
					if (doc.data().password == formData.password) {
						myApp.preloader.hide();
						localStorage.setItem("username",formData.username);
						syncLoad(formData.username, 
							function(){
								mainView.router.load({
									url:"pages/home.html"
								});
							}, 
							function(){});	
					}else{
						myApp.preloader.hide();
						myApp.dialog.alert("Login Gagal");
					}
					
				} else {
					myApp.preloader.hide();
					myApp.dialog.alert("Username tidak ada");
				}
			}).catch(function(error) {
				myApp.preloader.hide();
				myApp.dialog.alert("Gagal mengecek username<br><br>" + error);
			});
		}
	});
});




$$(document).on('page:init', '.page[data-name="home"]', function (e, page) {
	mainView.router.clearPreviousHistory();
	$$('#currentuser').html("CURRENT USER: "+ localStorage.getItem("username"));

	//gem load
	if (localStorage.getItem("gem")==null){
		localStorage.setItem("gem",0);
	} 
	$$('#gem').html("gem: "+ localStorage.getItem("gem"));
	
	if (localStorage.getItem("freeGemTimer")==null){
		refreshFreeGem();
	}else{
		now = new Date().getTime();
		refreshdate = new Date(localStorage.getItem("freeGemTimer")).getTime();
		distance = refreshdate - now;
		$$('#freecountdown').html("Countdown to refresh: "+ Math.ceil(distance/(1000*60*60)) + " hours");
		if (distance < 0) {
			refreshFreeGem();
		}
	}

	$$('#rewardvideoads').html("Watch Video for free gem : "+ localStorage.getItem("freeGemQuota"));

	// $.get('files/test.txt', function(textData, status) {
	// 	var aLines = textData.split("\n")
	// 	$.each(aLines, function(n, sLine) {
	// 		$('#textFromFile').append( sLine + '<br>');
	// 	});
	// }, 'text');

	$.getJSON("files/threadlist.json", function(data) {
		content = "";
		threadlistData = data;
		data.forEach(function(cat, idxcat){
			content = content + 
			"<div style='margin-top:5px'><h3>" + cat.category + "</h3>";
			cat.threads.forEach(function(thr, idxthr){
				content = content + 
				"<div style='margin:10px;margin-left:5%'>" + 
				"<div>" + thr.title + "</div>"+
				"<div>" + thr.players.length + " pemain bergabung</div>"+
				"<div> Posted by:" + thr.postedby + "</div>"+
				"<div>";

				thr.players.forEach(function(ply){
					content = content +
					"<span style='margin-right:2%'><img src='img/playericon/"+ply+".png' width='20px'></img> "+ply+" </span>";
				});


				if (thr.price>0) {
					content = content + 
					"<div>"+
					"<button class='col button button-fill color-gray' onclick='lockedThread("+idxcat+","+idxthr+","+thr.price+")'>"+thr.price+" Gem to unlock</button>"+
					"</div>";
				}else{
					content = content + 
					"<div>"+
					"<button class='col button button-fill color-black' onclick='openThread("+idxcat+","+idxthr+")'>Start spectating</button>"+
					"</div>";
				}

				content = content + 
				"</div></div>";
			});
			content = content + "</div>";
		});
		$$('#threads').append(content);
	});

	$$('#gem+1').on('click', function(){
		addGem(1);
	});


	$$('#rewardvideoads').on('click', function(){
		if (parseInt(localStorage.getItem("freeGemQuota"))>0){
			myApp.preloader.show();
			admob.rewardVideo.load({
				id: {
					android: 'ca-app-pub-3940256099942544/5224354917',
					ios: 'ca-app-pub-3940256099942544/5224354917',
				},
			}).then(() => admob.rewardVideo.show()).catch(console.log)
		}else{
			myApp.dialog.alert("Gem gratis sudah habis. Silahkan coba lagi besok.");
		}
	});


	$$('#logoutbutton').on('click', function(){
		localStorage.clear();
		mainView.router.load({
			url:"pages/welcome/welcome.html"
		});
	});
});