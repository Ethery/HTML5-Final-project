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

    var initialized = false;


    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;



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
        main(0);

    }

    // Main loop
    function main(tframe){
        // Request animation frames
        window.requestAnimationFrame(main);
        var move = true;
        while(move==true || i < 300) {
            // Update and render the game
            checkLignes();
            move = update(tframe);
            render();
            refillPlateau();
            i++;
        }
    }

    // Update the game state
    function update(tframe) {

        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;

        // Update the fps counter
        updateFps(dt);

        var moved = true;
        // Update entities
        for (var i=0; i<entities.length; i++) {
            for (var j=0; j<entities[i].length; j++) {
                // Move the entity, time-based
                entities[i][j].y += dt * entities[i][j].speed * entities[i][j].ydir;


                if (j < entities[i].length - 1) {
                    if (entities[i][j].y + entities[i][j].height > entities[i][j + 1].y) {
                        entities[i][j].y = entities[i][j + 1].y - entities[i][j].height;
                        moved = false;
                    }
                }
                if (entities[i][j].y + entities[i][j].height >= level.y + level.height) {
                    entities[i][j].y = level.y + level.height - entities[i][j].height;
                    moved = false;
                }
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
            var str="";
            for (var j=0; j<entities[i].length; j++) {
                str += entities[i][j].index+";";
                // Draw the entity
                var entity = entities[i][j];
                context.drawImage(entity.image, entity.x, entity.y, entity.width, entity.height);
            }
            console.log(str);
        }
        console.log("-----------------------------------");
    }



    // Mouse event handlers
    function onMouseMove(e) {}
    function onMouseDown(e) {}
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