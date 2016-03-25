/**
 * Created by Loïc on 11/03/2016.
 */
window.onload = function() {

    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var i = 0;
    var coord1 = {x:-1,y:-1};
    var x;
    var y;


    // Image loading global variables



    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseOut);

        loadPlateau();

        context.clearRect(0, 0, canvas.width, canvas.height);
        render();
        // Enter main loop
        console.log("/------------------INIT DONE----------------------/");
        if(checkLignes() == true) {
            refillPlateau();
        }
        main(0);
    }

    // Main loop
    function main(tframe) {
        //if (i < 100) {
            //console.log(i);
            // Request animation frames
            window.requestAnimationFrame(main);
            render();
            /*console.log(checkLignes());
            if(checkLignes() == true) {
                refillPlateau();
            }*/

            if(checkLignes() == true) {
                refillPlateau();
            }
            render();
            if(update(tframe) == false)
            {
                render();
            }
            render();
            i++;
        //}
    }

    // Update the game state
    function update(tframe) {
        
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        var basedy = 0;

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

    // Render the game
    function render() {
        // Draw background and a border
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e8eaec";
        context.fillRect(1, 1, canvas.width-2, canvas.height-2);

        // Display fps
        context.fillStyle = "#000";
        context.font = "12px Verdana";
        context.fillText("Fps: " + fps, 0, level.y-2);



        for (var i=0; i<entities.length; i++) {
            for (var j=0; j<entities[i].length; j++) {

                // Draw the entity
                var entity = entities[i][j];
                context.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);

            }
        }
        if(coord1.x != -1) {
            context.fillStyle = "#000";
            context.arc((x*(level.width / size))+level.x,(y*(level.height / size))+level.y, level.width / (size), level.height / (size), Math.PI);
        }
        //console.log(score);
        $("#score").html("Score : "+score);
        $("#multiplicateur").html("Multiplicateur : "+multiplicateur);
    }



    // Mouse event handlers
    function onMouseMove(e) {}

    function onMouseDown(e) {
        var clic = getMousePos(canvas,e);
        var canSwap = false;
        if(coord1.x != -1)
        {
            clic.x = Math.floor((clic.x-level.x)/(level.width/size));
            clic.y = Math.floor((clic.y-level.y)/(level.width/size));
            if(clic.x != x && clic.y == y) {
                if (x - 1 == clic.x || x + 1 == clic.x) {
                    canSwap = true;
                }
            }
            if(clic.y != y && clic.x == x)
            {
                if (y - 1 == clic.y || y + 1 == clic.y || y == clic.y) {
                    canSwap = true;
                }
            }
            //console.log("Tested on : ("+x+"-"+y+")<->("+clic.x+"-"+clic.y+")");
        }
        //console.log(x+","+y+":"+clic.x+","+clic.y);
        if(canSwap == true)
        {
            swapCases(x,y,clic.x,clic.y);
            coord1.x = -1;
            coord1.y = -1;
            x = -1;
            y = -1;
        }
        else{
            coord1 = getMousePos(canvas,e);
            x = Math.floor((coord1.x-level.x)/(level.width/size));
            y = Math.floor((coord1.y-level.y)/(level.width/size));
        }
        render();
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
};