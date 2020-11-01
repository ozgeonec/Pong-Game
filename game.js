$(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            left: 888,
            top: 150
        },
        score1: {
            color: '#C6A62F',
            fontSize: '60px',
            position: 'absolute',
            left: 400,
            top: -60
        },
        score2: {
            color: '#C6A62F',
            fontSize: '60px',
            position: 'absolute',
            left: 470,
            top: -60
        },
        info: {
            color: '#C6A62F',
            fontFamily: 'monospace'
        }
    };

    var CONSTS = {
        gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0
    };

    function start() {
        draw();
        setEvents();
        reloadScore();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo('#pong-game');
        $('<div/>', { id: "score-1" }).css(CSS.score1).appendTo("#pong-game").text(CONSTS.score1);
        $('<div/>', { id: "score-2" }).css(CSS.score2).appendTo("#pong-game").text(CONSTS.score2);
        $('<div/>', { id: "info" }).css(CSS.info).appendTo("#pong-game").text("Press P to Save");
    }

    function setEvents() {
        //Stick 1
        $(document).on('keydown', function (e) {
            if (e.keyCode === 87) {
                CONSTS.stick1Speed = -10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode === 87) {
                CONSTS.stick1Speed = 0;
            }
        });
        $(document).on('keydown', function (e) {
            if (e.keyCode === 83) {
                CONSTS.stick1Speed = 10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode === 83) {
                CONSTS.stick1Speed = 0;
            }
        });

        //Stick 2
        $(document).on('keydown', function (e) {
            if (e.keyCode === 38) {
                CONSTS.stick2Speed = -10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode === 38) {
                CONSTS.stick2Speed = 0;
            }
        });

        $(document).on('keydown', function (e) {
            if (e.keyCode === 40) {
                CONSTS.stick2Speed = 10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode === 40) {
                CONSTS.stick2Speed = 0;
            }
        });
        // Save Score with "p"
        $(document).on('keyup', function (e) {
            if (e.keyCode === 80) {
                saveScore();
            }
        });

    }


    function loop() {
        window.pongLoop = setInterval(function () {
            CSS.stick1.top += CONSTS.stick1Speed;
            $('#stick-1').css('top', CSS.stick1.top);
            CSS.stick2.top += CONSTS.stick2Speed;
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            if (CSS.ball.left <= CSS.stick.width) {
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height
                && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || scoreCounter(2);
            }
            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height
                && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || scoreCounter(1);
            }

            ////For sticks to stay in the arena
            if (CSS.stick1.top <= 0) {
                $('#stick-1').css('top', 0);
                CSS.stick1.top = 0;
            }
            if (CSS.stick1.top + CSS.stick.height >= CSS.arena.height) {
                $('#stick-1').css('top',CSS.arena.height - CSS.stick1.height);
                CSS.stick1.top = CSS.arena.height - CSS.stick1.height;
            }
            if (CSS.stick2.top <= 0) {
                $('#stick-2').css('top', 0);
                CSS.stick2.top = 0;
            }
            if (CSS.stick2.top + CSS.stick.height >= CSS.arena.height) {
                $('#stick-2').css('top',CSS.arena.height - CSS.stick2.height);
                CSS.stick2.top = CSS.arena.height -CSS.stick2.height;
            }

        }, CONSTS.gameSpeed);
    }

    function scoreCounter(goal){
        if(goal===1){
            CONSTS.score1++;
            $("#score-1").text(CONSTS.score1);
        }else{
            CONSTS.score2++;
            $("#score-2").text(CONSTS.score2);
        }
        if(CONSTS.score1 === 5){
            alert("Player 1 is the Winner!");
            CONSTS.score1 = 0;
            CONSTS.score2 = 0;
            $("#score-1").text(CONSTS.score1);
            $("#score-2").text(CONSTS.score2);
            localStorage.clear();
        }
        else if(CONSTS.score2 === 5){
            alert("Player 2 is the Winner!");
            CONSTS.score1 = 0;
            CONSTS.score2 = 0;
            $("#score-1").text(CONSTS.score1);
            $("#score-2").text(CONSTS.score2);
            localStorage.clear();
        }
        roll();
    }

    function saveScore() {
        localStorage.setItem("score1", CONSTS.score1);
        localStorage.setItem("score2", CONSTS.score2);
    }
    function reloadScore(){
        CONSTS.score1 = localStorage.getItem("score1") || 0;
        CONSTS.score2 = localStorage.getItem("score2") || 0;
        $("#score-1").text(CONSTS.score1);
        $("#score-2").text(CONSTS.score2);
    }

    function roll() {
        CSS.ball.top = 250;
        CSS.ball.left = 350;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    start();
})();