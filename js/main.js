/**
 * Created by Loïc on 11/03/2016.
 */



window.onload = function() {

    // Variables FPS et animations
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;

    // Variables de jeu.
    var lifes = 5;
    var i = 0;
    var coord1 = {x:-1,y:-1};
    var pos = {x:-1,y:-1};

    function runIt(div) {
        div.animate({ opacity: '-=1.0' }, 1000, function(){
            div.html("<img src='img/lifes/life_"+(lifes-i)+".png' width='50' height='50'>");
        });
        div.animate({
            opacity: '+=1.0'
        }, 1000);
    }

    // Initialisation du jeu
    function init() {
        // Ajout de la lecture des evenements.
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseOut);

        var txt = "Scores : ";
        for (var  j=0; j<5; j++) {
            txt += "<img src='"+dirImg[j] +"' width='20' height='20'> "+ scores[j];
        }

        $("#score").html(txt);

        $("#vies").html("<img src='img/lifes/life_"+(lifes-i)+".png' width='50' height='50'>");

        loadPlateau(8);

        for (var j = 0; j < 5; j++) {
            scores.push(0);
        }


        $("#reset").css("visibility","hidden");

        context.clearRect(0, 0, canvas.width, canvas.height);
        render();
        // On lance la loop main.
        main(0);
    }

    // Main loop
    function main(tframe) {
        if (i < lifes && score < 200000) {
            $("#reset").css("visibility","hidden");

            window.requestAnimationFrame(main);
            render();


            if (gamestarted == false) {
                if (checkLignes(entities) == true) {
                    refillPlateau(entities);
                }
                if (update(tframe) == false) {
                }
            }
            else {
                if (checkLignes(entities) == true) {
                    refillPlateau(entities);
                }
                render();
                if (update(tframe) == false) {
                    render();
                }
            }
            render();

        }
        else if (i>= lifes){

            context.drawImage(gameImages[0],(level.width-gameImages[0].width)/2,(level.width-gameImages[0].width)/2,gameImages[0].width,gameImages[0].height);
            $("#reset").css("visibility","visible");
        }
        else if (score >= 200000){

            context.drawImage(gameImages[1],(level.width-gameImages[1].width)/2,(level.width-gameImages[1].width)/2,gameImages[1].width,gameImages[1].height);
            $("#reset").css("visibility","visible");
        }
    }

    // On mets a jour les entitées selon leur vitesse.
    function update(tframe) {
        
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update the fps counter
        updateFps(dt);

        var tmp = false;
        var moved = false;
        // Update entities
        for (var i = 0; i < entities.length; i++) {
            var str="";
            for (var j = 0; j < entities[i].length; j++) {
                if (entities[i][j].y < j*(level.height/size)+level.y) {
                    if((dt * entities[i][j].speed * entities[i][j].ydir) + entities[i][j].y < j*(level.height/size)+level.y) {
                        entities[i][j].y += dt * entities[i][j].speed * entities[i][j].ydir;
                    }
                    else{
                        entities[i][j].y = j*(level.height/size)+level.y;
                    }
                    tmp = true;
                    moved = true;
                    str += entities[i][j].y+  "<" + (j*(level.height/size)+level.y)+":";
                }
                tmp = false;
            }
        }
        return moved;
    }

    //Fonctiond e calcul des fps (non utilisée).
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);

            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }

        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }

    // On qffiche les entités.
    function render() {
        context.clearRect(level.x,level.y,level.width,level.height);

        for (var k=0; k<entities.length; k++) {
            var st="";
            for (var j=0; j<entities[k].length; j++) {
                var entity = entities[k][j];
                st+=("  "+pos.x+"=="+k+" && "+pos.y+" == "+j);
                if(pos.x==k && pos.y == j)
                {
                    context.drawImage(entity.selected_i,entity.x, entity.y, entity.width, entity.height);
                }
                else {
                    context.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
                }
            }
        }

        var txt = "Scores : ";
        for (var  j=0; j<5; j++) {
            txt += "<img src='"+dirImg[j] +"' width='20' height='20'> "+ scores[j];
        }

        $("#score").html(txt);

    }



    // Mouse event handlers
    function onMouseMove(e) {}
    function onMouseDown(e) {

        if(i<lifes) {
            var canSwap = false;
            gamestarted = true;
            var clic = getMousePos(canvas, e);
            if (coord1.x != -1) {
                clic.x = Math.floor((clic.x - level.x) / (level.width / size));
                clic.y = Math.floor((clic.y - level.y) / (level.width / size));
                if (clic.x != pos.x && clic.y == pos.y) {
                    if (pos.x - 1 == clic.x || pos.x + 1 == clic.x) {
                        canSwap = true;
                    }
                }
                if (clic.y != pos.y && clic.x == pos.x) {
                    if (pos.y - 1 == clic.y || pos.y + 1 == clic.y || pos.y == clic.y) {
                        canSwap = true;
                    }
                }
            }
            if (canSwap == true) {
                if (swapCases(pos.x, pos.y, clic.x, clic.y) == false) {
                    i++;
                    runIt($("#vies"));
                }
                coord1.x = -1;
                coord1.y = -1;
                pos.x = -1;
                pos.y = -1;
            }
            else {
                coord1 = getMousePos(canvas, e);
                pos.x = Math.floor((coord1.x - level.x) / (level.width / size));
                pos.y = Math.floor((coord1.y - level.y) / (level.width / size));
            }

            render();
        }
    }

    function onMouseUp(e) {}
    function onMouseOut(e) {}

    // Get the mouse position
    function getMousePos(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }


    // Call init to start the game
    init();

    $("#reset").click(function() {
        console.log("clicked");
        i=0;
        score = 0;
        multiplicateur = 0;
        gamestarted = false;
        entities = new Array();
        init();
    });
};