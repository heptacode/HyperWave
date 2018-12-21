/*
    GLOBAL VARIABLES
*/
var timer_fetchData, timer_updateData, code;

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
} else {
    $(".form-account").css("display", "flex");
}
var minSizeDelay = true;
window.onresize = function() {
    if (window.innerWidth < 1000 || window.innerHeight < 720) {
        if (minSizeDelay) {
            minSizeDelay = false;
            $(".notice-minSize")
                .slideDown()
                .delay(2000)
                .slideUp();
            setTimeout(function() {
                minSizeDelay = true;
            }, 5000);
        }
    } else {
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
            uPw: $("#inputPw").val(),
            level: JSON.stringify({
                Warrior: 1,
                Lancer: 1,
                Summoner: 1
            })
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
                $(".notice-registered")
                    .slideDown()
                    .delay(800)
                    .slideUp();
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
    $.post("proxy.php", { do: "signIn", uId: $("#inputId").val(), uPw: $("#inputPw").val() }, function(response) {
        if (response) {
            Cookies.set("uId", $("#inputId").val(), { expires: 1, secure: true });
            $("html").css("cursor", "none");
            $(".form-account").fadeOut();
            $("#canvas").addClass("canvas-active");
            $(".notice-error").css("display", "none");
        } else {
            $(".notice-error")
                .slideDown()
                .delay(800)
                .slideUp();
        }
    });
}

function codeView() {
    $(".btn-codeView")
        .text(Cookies.get("code"))
        .addClass("btn-codeView-active");
    setTimeout(function() {
        $(".btn-codeView")
            .text("#")
            .removeClass("btn-codeView-active");
    }, 4000);
}

$(window).load(function() {
    if (!Cookies.get("reload")) {
        Cookies.set("reload", true, { expires: 1, secure: true });
        location.reload();
    }
    Cookies.set("reload", false, { expires: 1, secure: true });
});

window.onbeforeunload = function(e) {
    queLeave();
    return "게임을 종료하시겠습니까?";
};
