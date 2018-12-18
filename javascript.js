var code,
    randomString = "0123456789";

$.ajaxSetup({ cache: false });
window.addEventListener("offline", function() {
    $(".notice-offline").slideDown();
    $(".notice-online").fadeOut();
});
window.addEventListener("online", function() {
    $(".notice-online").slideDown();
    $(".notice-offline").fadeOut();
    setTimeout(function() {
        $(".notice-online").slideUp();
    }, 3000);
});

if (Cookies.get("uId")) {
    $("#canvas").addClass("canvas-active");
    $("html").css("cursor", "none");
    $(".form-account").css("display", "none");
    $(".notice-error").css("display", "none");
}
window.onresize = function() {
    if (window.innerWidth < 1000 || window.innerHeight < 720) alert("[HYPERWAVE]\n최소 창 크기에 도달했습니다.\n창 크기를 늘려주세요.");
    else {
        $(".sizing")
            .css("display", "flex")
            .delay(100)
            .fadeOut("slow");
        document.getElementById("canvas").width = window.innerWidth;
        document.getElementById("canvas").height = window.innerHeight;
        $("#canvas")
            .removeClass("canvas-active")
            .addClass("canvas-active")
            .on("error", function() {
                location.reload();
            });
    }
};
document.addEventListener("keydown", function() {
    if (event.keyCode == 13 && !Cookies.get("uId")) signIn();
});
function register() {
    if (!$("#inputId").val() || $("#inputId").val() < 6) {
        $("#inputId").focus();
        return false;
    }
    if (!$("#inputPw").val() || $("#inputPw").val() < 6) {
        $("#inputPw").focus();
        return false;
    }
    $.post(
        "proxy.php",
        {
            do: "register",
            uId: $("#inputId").val(),
            uPw: $("#inputPw").val()
        },
        function(response) {
            if (response) {
                Cookies.set("uId", $("#inputId").val(), {
                    expires: 1,
                    secure: true
                });
                $("html").css("cursor", "none");
                $(".form-account").fadeOut();
                $("#canvas").addClass("canvas-active");
                $(".notice-error").css("display", "none");
            } else {
                alert("가입에 실패하였습니다.");
            }
        }
    );
}

function signIn() {
    if (!$("#inputId").val() || $("#inputId").val() < 6) {
        $("#inputId").focus();
        return false;
    }
    if (!$("#inputPw").val() || $("#inputPw").val() < 6) {
        $("#inputPw").focus();
        return false;
    }
    $.post(
        "proxy.php",
        {
            do: "signIn",
            uId: $("#inputId").val(),
            uPw: $("#inputPw").val()
        },
        function(response) {
            if (response) {
                Cookies.set("uId", $("#inputId").val(), {
                    expires: 1,
                    secure: true
                });
                $("html").css("cursor", "none");
                $(".form-account").fadeOut();
                $("#canvas").addClass("canvas-active");
                $(".notice-error").css("display", "none");
            } else {
                $(".notice-error").slideDown();
            }
        }
    );
}

function logOut() {
    Cookies.remove("uId");
    $("#canvas").removeClass("canvas-active");
    $(".notice-error").css("display", "none");
    location.reload();
}

function queCreate() {
    code = "";
    for (var i = 0; i < 5; i++) code += randomString.charAt(Math.floor(Math.random() * randomString.length));
    $.post("proxy.php", { do: "codeSet", uId: Cookies.get("uId"), code: code }, function(response) {
        response ? queCreate() : alert(code);
    });
}

function queJoin(){
    var code = prompt("참가할 큐 코드 입력");
    $.post(
        "proxy.php",
        {
            do: "queJoin",
            uId: Cookies.get("uId"),
            code: code
        },
        function(response) {
            console.log(response);
        }
    );
}

function fetchLevel() {
    $.post(
        "proxy.php",
        {
            do: "fetchLevel",
            uId: Cookies.get("uId")
        },
        function(response) {
            console.log("레벨: " + response);
        }
    );
}

function fetchHighScore() {
    $.post(
        "proxy.php",
        {
            do: "fetchHighScore",
            uId: Cookies.get("uId")
        },
        function(response) {
            console.log("최고점수: " + response);
        }
    );
}

function fetchData() {
    $.post(
        "proxy.php",
        {
            do: "fetchData",
            uId: Cookies.get("uId")
        },
        function(response) {
            console.log("데이터:" + response);
        }
    );
}

function updateData(map, wave, hp, posX, posY, rot) {
    $.post(
        "proxy.php",
        {
            do: "updateData",
            uId: Cookies.get("uId"),
            map: map,
            wave: wave,
            hp: hp,
            posX: posX,
            posY: posY,
            rot: rot
        },
        function(response) {
            console.log(response);
        }
    );
}

$(window).load(function() {
    if (!Cookies.get("reload")) {
        Cookies.set("reload", true, { expires: 1, secure: true });
        location.reload();
    }
    Cookies.set("reload", false, { expires: 1, secure: true });
});
window.onbeforeunload = function() {
    return true;
};
