/**
 * Created by Loïc on 11/03/2016.
 */

// Get a random int between low and high, inclusive
function randRange(low, high) {
    return Math.floor(low + Math.random()*(high-low+1));
}

// Load images
function loadImages(imagefiles) {
    // Initialize variables
    loadcount = 0;
    loadtotal = imagefiles.length;
    preloaded = false;

    // Load the images
    var loadedimages = [];
    for (var i=0; i<imagefiles.length; i++) {
        // Create the image object
        var image = new Image();

        // Add onload event handler
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                // Done loading
                preloaded = true;
            }
        };

        // Set the source url of the image
        image.src = imagefiles[i];

        // Save to the image array
        loadedimages[i] = image;
    }

    // Return an array of images
    return loadedimages;
}

//-----------GESTION PLATEAU------------------//
// Images
var images = [];
images = loadImages(["img/plaine.png", "img/montagne.png", "img/ile.png","img/marais.png","img/foret.png"]);
// Array of entities
var entities = new Array();
//Taille du quadrillage
var size = 8;

function createEntity(x,y)
{
    var scalex = level.width/(size);
    var scaley = level.height/(size);
    var imageindex = randRange(0,4);
    var xdir = 0;
    var ydir = 1;
    var entity = new Entity(imageindex,images[imageindex], x, y, scalex, scaley, xdir, ydir, 600);

    // Add to the entities array
    return entity;
}

var loadPlateau = function(){
    for (var i = 0; i < size; i++) {
        entities.push(new Array());
        for (var j = 0; j < size; j++) {
            this.entities[i][j] = createEntity(i,j);
        }
    }
};

var checkLignes = function(){
    var deleted = false;
    for (var i=0; i<entities.length-2; i++) {
        for (var j=0; j<entities[i].length; j++) {
            if(entities[i][j].index == entities[i+1][j].index && entities[i][j].index == entities[i+2][j].index)
            {
                entities[i].splice(j, 1);
                entities[i+1].splice(j, 1);
                entities[i+2].splice(j, 1);
                deleted = true;
                break;
            }
        }
    }

    for (var i=0; i<entities.length; i++) {
        for (var j=0; j<entities[i].length-2; j++) {
            if (entities[i][j].index == entities[i][j + 1].index && entities[i][j].index == entities[i][j + 2].index) {
                entities[i].splice(j, 3);
                deleted = true;
                break;
            }
        }
    }
    return deleted;
};

var refillPlateau=function()
{
    for (var i=0; i<entities.length; i++) {
        while(entities[i].length != size)
        {
            entities[i].unshift(createEntity(i,0));
        }
    }
};

var swapCases = function(a,b){

};