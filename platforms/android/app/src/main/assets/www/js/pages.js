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
						syncLoad(formData.username, 
							function(){
								// localStorage.setItem("username",formData.username);
								mainView.router.load({
									url:"pages/home.html"
								});
							}, 
							function(){
								myApp.dialog.alert("Sinkronisasi Gagal");
							});	
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

	//first category must be showed
	if (localStorage.getItem("categoryhide"+0)==null){
		localStorage.setItem("categoryhide"+0,"show");
	}
	//first part must be showed
	if (localStorage.getItem("parthide"+0+"|"+0)==null){
		localStorage.setItem("parthide"+0+"|"+0,"show"); 
	}

	
	$.getJSON("files/heaventhreadlist.json", function(data) {
		content = "";
		threadlistData = data;
		data.forEach(function(cat, idxcat){
			if (localStorage.getItem("categoryhide"+idxcat)=="show"){
				content = content + 
				"<div style='margin-top:5px' id='category"+idxcat+"'><h3>" + cat.category + "</h3>";
			}else{
				content = content + 
				"<div style='margin-top:5px' class='hide' id='category"+idxcat+"'><h3>" + cat.category + "</h3>";
			}
			
			cat.threads.forEach(function(thr, idxthr){

				if (localStorage.getItem("parthide"+idxcat+"|"+idxthr)=="show"){
					content = content + 
					"<div style='margin:10px;margin-left:5%' id='part"+idxcat+"|"+idxthr+"'>" + 
					"<div>" + thr.title + "</div>"+
					"<div>" + thr.players.length + " pemain bergabung</div>"+
					"<div> Posted by:" + thr.postedby + "</div>"+
					"<div>";
				}else{
					if (localStorage.getItem("parthide"+idxcat+"|"+idxthr)==null){
						localStorage.setItem("parthide"+idxcat+"|"+idxthr,"hide");
					}
					content = content + 
					"<div style='margin:10px;margin-left:5%' class='hide' id='part"+idxcat+"|"+idxthr+"'>" + 
					"<div>" + thr.title + "</div>"+
					"<div>" + thr.players.length + " pemain bergabung</div>"+
					"<div> Posted by:" + thr.postedby + "</div>"+
					"<div>";
				}

				thr.players.forEach(function(ply){
					content = content +
					"<span style='margin-right:2%'><img src='img/playericon/"+ply+".png' width='20px'></img> "+ply+" </span>";
				});


				if (thr.price<=0 || localStorage.getItem("partlock"+idxcat+"|"+idxthr)=="unlock") {
					content = content + 
					"<div>"+
					"<button class='col button button-fill color-black' onclick='openThread("+idxcat+","+idxthr+")'>Start spectating</button>"+
					"</div>";
				}else{
					content = content + 
					"<div>"+
					"<button class='col button button-fill color-gray' id='lockbutton"+idxcat+"|"+idxthr+"' onclick='lockedThread("+idxcat+","+idxthr+","+thr.price+")'>"+thr.price+" Gem to unlock</button>"+
					"</div>";
					content = content + 
					"<div>"+
					"<button class='col button button-fill color-black hide' id='openbutton"+idxcat+"|"+idxthr+"' onclick='openThread("+idxcat+","+idxthr+")'>Start spectating</button>"+
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
		logout();
	});
});




$$(document).on('page:init', '.page[data-name="content"]', function (e, page) {
	$$('#thread-title').html(threadlistData[currentIndexcat].threads[currentIndexthread].title);

	$.get('files/'+threadlistData[currentIndexcat].threads[currentIndexthread].fileid+'.txt', function(textData, status) {
		var aLines = textData.split("\n");
		content = "";
		aLines.forEach(function(textline, idxline){
			if(textline.charAt(0) == "#"){
				player = textline.substring(1).trim();
				position = threadlistData[currentIndexcat].threads[currentIndexthread].position[player];
				if (position === undefined) {position = "";}
				if (idxline>0) {
					content = content + "</div></div>"; //close body and container
				}
				content = content + 
				"<div style='border-style: solid; margin:2px; margin-bottom:30px;' class='postcontainer'>"+
				"<div style='border-style: solid;' class='posthead'>"+
				"<img src='img/playericon/"+player+".png' width='20px'></img>"+player+
				"<div>"+position+"</div>"+
				"</div>"+
				"<div class='postbody'>";
			}else{
				content = content + "<div>"+ textline.trim() + "</div>";
			}
		});
		content = content + "</div></div>"; //close body and container
		$$('#thread-content').append(content);
	}, 'text');



});