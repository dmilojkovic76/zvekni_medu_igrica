/*!
 * VERSION: 1.0
 * DATE: 2016-11-5
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @licence Copyright (c) 2016, Dušan Milojković. All rights reserved.
 * This work is subject to the terms .......
 *
 * @author: Dušan Milojković, dmilojkovic76@gmail.com
 */
/*jslint browser: true*/
/*global $, alert, Audio, TweenLite*/

$(document).ready(function () {
    "use strict";

    var sistem = navigator.appVersion,
        hasStorage = false,
        WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        score = 0,
        highScore = 0,
        level = 1,
        speed,
        bgAudio,
        krajZvuk,
        zvekZvuk,
        levelZvuk,
        sviraMuzika = false,
        igranje = false,
        pozadinaImgFile = 'url("img/bg.png")',
        pozadinaAudioFile = "sound/bensound-ukulele.ogg",
        krajZvukFile = "sound/sad_trombone.ogg",
        zvekZvukFile = "sound/smack.ogg",
        levelZvukFile = "sound/levelup.ogg",
        medaOk = 'url("img/meda1.png")',
        medaJoj = 'url("img/meda2.png")',
        medaVrh = 'url("img/meda3.png")',
        poen = 0,
        debug = false;

    var mainDebug = function () {
        if (debug) {
            $("#debugDiv").removeClass("hidden");
            $("#debugData").text("Width: " + WIDTH + " | Height: " + HEIGHT + " | poen: " + poen);
        }
        WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        //        window.setTimeout(mainDebug, 500);
        window.requestAnimationFrame(mainDebug);
    };

    //    window.setTimeout(mainDebug, 500);
    window.requestAnimationFrame(mainDebug);

    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        hasStorage = true;
        if (!localStorage.score) {
            highScore = 0;
        } else {
            highScore = parseInt(localStorage.score, 10);
        }
    } catch (e) {
        hasStorage = false;
        alert(e);
    }

    ucitavanje();

    function ucitavanje() {

        if (sistem.match("Android")) {
            $(".cssload-loader").text("Android Loading...");
        } else {
            $(".cssload-loader").text("Loading...");
        }

        bgAudio = new Audio(pozadinaAudioFile);
        krajZvuk = new Audio(krajZvukFile);
        zvekZvuk = new Audio(zvekZvukFile);
        levelZvuk = new Audio(levelZvukFile);

        $(".cssload-loader").addClass("hidden");
        $("#intro-c").removeClass("hidden");
    }

    function randMedaPos() {
        return +(5 + Math.floor(Math.random() * 75)) + "%";
    }

    function krajIgre() {
        TweenLite.killTweensOf($(".meda"));
        bgAudio.pause();
        sviraMuzika = false;
        bgAudio.currentTime = 0;
        krajZvuk.play();
        igranje = false;
        $("#krajigre").css({
            "visibility": "visible"
        });
        $(".meda").off("click");
        if (score > highScore) {
            highScore = score;
        }
        if (hasStorage) {
            localStorage.score = highScore;
        }
        $("#hiscore").text("Rekord: " + highScore);
    }

    function medaClick() {
        return function () {
            var meda = $(this),
                zvek = $(".zvek"),
                kliknutoy = parseFloat(meda.css("top")),
                kliknutox = parseFloat(meda.css("left"));
            // poen je promenljiv: (visina:100% = trenutno:x% => x% = (trenutno*100%)/visina) * 1.level
            poen = Math.floor(((HEIGHT - kliknutoy) * 100) / (HEIGHT) * (1 + (level / 10)));

            zvekZvuk.play();

            zvek.css({
                "top": kliknutoy,
                "left": kliknutox
            });

            zvek.text(poen);

            TweenLite.to(zvek, 0.1, {
                autoAlpha: 1,
                onComplete: TweenLite.to(zvek, 1, {
                    autoAlpha: 0,
                    top: kliknutoy - 50,
                    delay: 0.3
                })
            });

            meda.css("background-image", medaJoj);
            TweenLite.to(meda, 0.2, {
                "top": "100%",
                onComplete: function () {
                    //                        meda.css({
                    //                            "background-image": medaVrh
                    //                        });
                    //                        krajIgre();
                    //                    }
                    //                });
                    //            meda.stop(true, false).animate({
                    //                "top": "100%"
                    //            }, 200, function () {
                    score += poen;
                    if (speed > 100) {
                        speed -= 100;
                    } else if (speed <= 100) {
                        speed -= 10;
                    } else if (speed <= 0) {
                        speed = 1;
                    }

                    if (speed % 1000 === 0) {
                        level += 1;
                        levelZvuk.play();
                        score += 200;
                        $("#level").text("Nivo: " + level);
                    }

                    $("#score").text("Rezultat: " + score);

                    meda.css({
                        "left": randMedaPos(),
                        "background-image": medaOk
                    });

                    TweenLite.to(meda, speed / 1000, {
                        "top": "0%",
                        onComplete: function () {
                            meda.css({
                                "background-image": medaVrh
                            });
                            krajIgre();
                        }
                    });
                }
            });
        };
    }

    function pocniIgru() {
        $("#krajigre").css({
            "visibility": "hidden"
        });
        $(".site-wrapper").css({
            "background-image": pozadinaImgFile,
            "background-size": "auto 100%"
        });
        igranje = true;
        score = 0;
        speed = 10000;
        level = 1;
        if (!sviraMuzika) {
            bgAudio.play();
            sviraMuzika = true;
        }
        $("#score").text("Rezultat: " + score);
        $("#level").text("Nivo: " + level);
        $("#hiscore").text("Rekord: " + highScore);
        $(".meda").css("background-image", medaOk);
        $("#meda1").css({
            "left": +(5 + Math.floor(Math.random() * 25)) + "%"
        });
        $("#meda2").css({
            "left": +(30 + Math.floor(Math.random() * 30)) + "%"
        });
        $("#meda3").css({
            "left": +(60 + Math.floor(Math.random() * 20)) + "%"
        });
        $(".meda").css({
            "top": "100%"
        });
        TweenLite.to(".meda", speed / 1000, {
            "top": "0%",
            onComplete: function () {
                $(this).css({
                    "background-image": medaVrh
                });
                krajIgre();
            }
        });
        $(".meda").click(medaClick());
    }

    $(".zvukOnOff").click(function () {
        if (sviraMuzika) {
            bgAudio.pause();
            sviraMuzika = false;
        } else if (!sviraMuzika && igranje) {
            bgAudio.play();
            sviraMuzika = true;
        }
    });

    $(".iskljuci").click(function () {
        if (igranje) {
            krajIgre();
        }
    });

    $("#hiscore").click(function () {
        if (hasStorage) {
            $("#resetScore").css({
                'visibility': 'visible'
            });
        }
    });

    $('#obrisi').click(function () {
        if (hasStorage) {
            localStorage.score = 0;
            highScore = 0;
            $("#hiscore").text("Rekord: " + highScore);
        }
        $("#resetScore").css({
            'visibility': 'hidden'
        });
    });

    $('#nemoj').click(function () {
        $("#resetScore").css({
            'visibility': 'hidden'
        });
    });

    $("#home-b").click(function () {
        $("#features-b, #contact-b").removeClass("active");
        $("#home-b").addClass("active");
        $("#intro-c").removeClass("hidden");
        $("#game, #features-c, #contact-c").addClass("hidden");
    });

    $("#features-b").click(function () {
        $("#home-b, #contact-b").removeClass("active");
        $("#features-b").addClass("active");
        $("#features-c").removeClass("hidden");
        $("#intro-c, #game, #contact-c").addClass("hidden");
    });

    $("#contact-b").click(function () {
        $("#home-b, #features-b").removeClass("active");
        $("#contact-b").addClass("active");
        $("#contact-c").removeClass("hidden");
        $("#intro-c, #game, #features-c").addClass("hidden");
    });

    $("#start-b").click(function () {
        $("#intro-c").toggleClass("hidden");
        $("#game").toggleClass("hidden");
        $("#header, #footer").addClass("hidden");
        $("body").css({
            "overflow": "hidden"
        });

        pocniIgru();
    });

    $("#novaIgra").click(function () {
        pocniIgru();
        $("#krajigre").css({
            "visibility": "hidden"
        });
    });

    $("#izlaz").click(function () {
        bgAudio.pause();
        sviraMuzika = false;
        bgAudio.currentTime = 0;
        $("#krajigre").css({
            "visibility": "hidden"
        });
        $(".site-wrapper").css({
            "background-image": ""
        });
        $("#features-b, #contact-b").removeClass("active");
        $("#home-b").addClass("active");
        $("#intro-c").removeClass("hidden");
        $("#game, #features-c, #contact-c").addClass("hidden");
        $("#header, #footer").removeClass("hidden");
        $("body").css({
            "overflow": "visible"
        });
    });

    $("#submit-b").click(function () {
        var ime = $("#ime").val(),
            email = $("#email").val(),
            poruka = $("#tekst-poruke"),
            name_regex = /^[a-zA-Z]+$/,
            email_regex = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;

        // Proverava da li su sva polja popunjena.
        if (ime.length === 0 || email.length === 0 || poruka.length === 0) {
            $("#head").removeClass("hidden").text("* Sva polja su obavezna! Pokušajte ponovo! *");
            $("#ime").addClass("has-error").focus();
            return false;
        } else {
            $("#head").removeClass("hidden").addClass("hidden").text("");
            $("#p1").removeClass("hidden").addClass("hidden").text("");
            $("#p2").removeClass("hidden").addClass("hidden").text("");
            $("#ime").removeClass("has-error");
            $("#email").removeClass("has-error");
        }
        // Provera validnosti imena.
        if (!ime.match(name_regex) || ime.length === 0) {
            $("#p1").removeClass("hidden").text("* Molio bih vas da koristite samo slova prilikom unosa vašeg imena. *");
            $("#ime").addClass("has-error").focus();
            return false;
        }
        // Provera validnosti emaila.
        if (!email.match(email_regex) || email.length === 0) {
            $("#p2").removeClass("hidden").text("* Molio bih vas da unesete ispravnu email adresu. *");
            $("#email").addClass("has-error").focus();
            return false;
        }

        $("#head").removeClass("hidden").addClass("hidden").text("");
        $("#p1").removeClass("hidden").addClass("hidden").text("");
        $("#p2").removeClass("hidden").addClass("hidden").text("");
        $("#ime").removeClass("has-error");
        $("#email").removeClass("has-error");
        alert("Poruka je uspešno poslata!");
        return true;
    });

});
