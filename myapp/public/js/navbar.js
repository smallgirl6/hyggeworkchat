
export function initNavbar() {
    //檢查localStorage中是否有token
    if (!localStorage.getItem('token')) {
        console.log('沒有token,請登入');
        window.location.href = '/';
    } else {
        console.log('有token,繼續使用'+ localStorage.getItem('token'));
    }
    //頁面載入前先顯示一個 loading 圖片
    document.querySelector(".loading").style.display = "block";
    setTimeout(function() {
    document.querySelector(".loading").style.display = "none";
    document.querySelector(".content").style.display = "block";
    }, 2000);

    //fetch 使用者資訊的API

    fetch('/api/userinfo', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        // 將圖片網址放入userpic區塊的img
        document.querySelector('.userpic img').src = data.pic;
        // 將文字放入username
        document.querySelector('.username').innerText = data.name;
    })
    .catch(err => {
        console.log(err);
    });

    //自由切換忙碌或是聯絡可能的狀態
    var statusSelect = document.querySelector(".status-select");
    var username = document.querySelector(".username");
    var userpic = document.querySelector(".userpic");
    var colorball = document.querySelector(".colorball img");
    statusSelect.addEventListener("change", function() {
        var status = statusSelect.value;
        if (status === "busy") {
            userpic.style.boxShadow = "0px 0px 20px white, 0 0 30px red";
            username.style.textShadow = "0px 0px 20px white, 0 0 30px red";
            colorball.src = "/icon/status/red-status.png";
        } else if (status === "available") {
            userpic.style.boxShadow = "0px 0px 20px white, 0 0 30px green";
            username.style.textShadow = "0px 0px 20px white, 0 0 30px green";
            colorball.src = "/icon/status/green-status.png";
        } else if (status === "away") {
            userpic.style.boxShadow = "0px 0px 20px white, 0 0 30px yellow";
            username.style.textShadow = "0px 0px 20px white, 0 0 30px yellow";
            colorball.src = "/icon/status/yellow-status.png";
        } else if (status === "offline") {
            userpic.style.boxShadow = "0px 0px 20px white, 0 0 30px black";
            username.style.textShadow = "0px 0px 20px white, 0 0 30px black";
            colorball.src = "/icon/status/black-status.png";
        }
    });

    $(document).ready(function(){
        $('.userpic').click(function(){
        $('.status-select').toggle();
        });
    });

    document.getElementById("index-link").addEventListener("click", function() {
        window.location.href = '/index';
    });
    document.getElementById("profiles-link").addEventListener("click", function() {
        window.location.href = '/profiles';
    });
    document.getElementById("chat-link").addEventListener("click", function() {
        window.location.href = '/chat';
    });
    document.getElementById("document-link").addEventListener("click", function() {
        window.location.href = '/document';
    });
}
