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
            myApp.dialog.alert("Berhasil memutar video reward");
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
        if (mainView.history.length > 1){
            mainView.router.back();    
        }else{
            myApp.dialog.confirm('Yakin ingin keluar?', function () {
                navigator.app.exitApp();
            });
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