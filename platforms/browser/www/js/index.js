/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('backbutton', this.onBackKeyDown, false);
        document.addEventListener('admob.reward_video.reward', () => {
            myApp.dialog.alert("Anda mendapatkan 1 Gem");
            addGem(1);
            currentFreeGem = parseInt(localStorage.getItem("freeGemQuota")) - 1;
            localStorage.setItem("freeGemQuota", currentFreeGem);
            $$('#rewardvideoads').html("Watch Video for free gem : "+ localStorage.getItem("freeGemQuota"));
        });
        document.addEventListener('admob.reward_video.load', () => {
            myApp.preloader.hide();
        });
        document.addEventListener('admob.reward_video.load_fail', () => {
            myApp.preloader.hide();
            myApp.dialog.alert("Gagal memutar video");
        });
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        disabledback = false;
        // splash screen timeout
        setTimeout(function(){ 
            //if logged in
            if (localStorage.getItem("username")!=null){
                mainView.router.load({
                    url:"pages/home.html"
                });
            }else{
                mainView.router.load({
                    url:"pages/welcome/welcome.html"
                });
            } 
        }, 3000);

        
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },



    onBackKeyDown:function(event){
        if (!disabledback) {
            disabledback = true;
            if (mainView.history.length > 1){
                mainView.router.back();
                disabledback = false;    
            }else{
                myApp.dialog.confirm('Yakin ingin keluar?', function () {
                    disabledback = false;
                    navigator.app.exitApp();
                }, function () {
                    disabledback = false;
                });
            }
        } 
    }
};

app.initialize();








//custom function
function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function syncLoad(username, onsuccess, onerror){
    myApp.preloader.show();
    db.collection("users").doc(username).get().then(function(doc) {
        if (doc.exists) {
            myApp.preloader.hide();
            localStorage.setItem("gem",doc.data().gem);
            onsuccess();
        } else {
            myApp.preloader.hide();
            myApp.dialog.alert("Error: username tidak ada");
            onerror();
        }
    }).catch(function(error) {
        myApp.preloader.hide();
        myApp.dialog.alert("Gagal sinkronisasi<br><br>" + error);
        onerror();
    });
}

function syncSave(username){
    myApp.preloader.show();
    db.collection("users").doc(username).get().then(function(doc) {
        if (doc.exists) {
            db.collection("users").doc(username).update({
                gem: parseInt(localStorage.getItem("gem")),
            }).then(function() {
                myApp.preloader.hide();
                // myApp.dialog.alert("Save berhasil");
            }).catch(function(error) {
                myApp.preloader.hide();
                // myApp.dialog.alert("Save gagal<br><br>"+ error);
            });
        } else {
            myApp.preloader.hide();
            myApp.dialog.alert("Error: username tidak ada");
        }
    }).catch(function(error) {
        myApp.preloader.hide();
        myApp.dialog.alert("Gagal sinkronisasi<br><br>" + error);
    });
}


function addGem(value){
    gems = parseInt(localStorage.getItem("gem")) + value;
    localStorage.setItem("gem",gems);
    $$('#gem').html("gem: "+ localStorage.getItem("gem"));
    syncSave(localStorage.getItem("username"));
}


function refreshFreeGem(){
    nextday = new Date((new Date()).valueOf() + 1000*3600*24);
    nextday.setHours(0,0,0,0);
    localStorage.setItem("freeGemTimer", nextday);
    localStorage.setItem("freeGemQuota", 2);
}

var threadlistData;
function openThread(indexcat,indexthread){
    myApp.dialog.alert(threadlistData[indexcat].threads[indexthread].fileid+".txt");
    if (localStorage.getItem("parthide"+indexcat+"|"+(indexthread+1))==null){
        console.log("#category"+(indexcat+1));
        console.log("#part"+(indexcat+1)+"|"+0);
        $$("#category"+(indexcat+1)).removeClass("hide");
        $$("#part"+(indexcat+1)+"|"+0).removeClass("hide");
    }else{
        $$("#part"+indexcat+"|"+(indexthread+1)).removeClass("hide");
    }
    
}

function lockedThread(indexcat,indexthread, price){
    myApp.dialog.alert("Locked! Required "+price+" Gem to unlock<br>"+threadlistData[indexcat].threads[indexthread].fileid+".txt");
}
