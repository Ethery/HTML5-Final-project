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
images = loadImages(["img/ile.png", "img/montagne.png", "img/marais.png","img/plaine.png","img/foret.png","img/blank.png"]);
var selected = [];
selected = loadImages(["img/ile_s.png", "img/montagne_s.png", "img/marais_s.png","img/plaine_s.png","img/foret_s.png"]);

// Array of entities
var entities = new Array();

//Nombre d'elementspar ligne & colonne dans le plateau.
var size = 8;

//Score;
var score = 0;

var multiplicateur = 0;

function createEntity(x,y)
{
    var scalex = level.width/(size);
    var scaley = level.height/(size);
    var imageindex = randRange(0,4);
    var xdir = 0;
    var ydir = 1;
    var entity = new Entity(imageindex,images[imageindex],selected[imageindex], x, y, scalex, scaley, xdir, ydir, 1200);

    // Add to the entities array
    return entity;
}
function createNullEntity(x,y)
{
    var scalex = level.width/(size);
    var scaley = level.height/(size);
    var imageindex = 5;
    var xdir = 0;
    var ydir = 1;
    var entity = new Entity(imageindex,images[imageindex],images[imageindex], x, y, scalex, scaley, xdir, ydir, 1200);

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

var checkSize = function(tab,nb){
    var bool = false;
    var nbCheck = nb;

    for (var i=0; i<tab.length-nbCheck+1; i++) {
        for (var j=0; j<tab[i].length; j++) {
            var index = tab[i][j].index;
            var same = true;
            for (var k = 0; k < nbCheck; k++) {
                if (index != tab[i + k][j].index) {
                    same = false;
                    break;
                }
            }
            if (same == true) {
                for (var l = 0; l < nbCheck; l++) {
                    tab[i + l].splice(j, 1);
                }
                bool = same;
            }
        }
    }

    for (var i=0; i<tab.length; i++) {
        for (var j=0; j<tab[i].length-nbCheck+1; j++) {
            var index = tab[i][j].index;
            var same = true;
            for(var k = 0;k<nbCheck;k++){
                if(index != tab[i][j+k].index){
                    same = false;
                    break;
                }
            }
            if(same == true) {
                tab[i].splice(j, nbCheck+1);
                bool = same;
            }
        }
    }
    return bool;
};


//Decompte du score et du multiplicateur.(remplissage du tableau par les valeures blank des jetons.
var fillNulls = function()
{
    for (var i=0; i<entities.length; i++) {
        while(entities[i].length != size)
        {
            entities[i].unshift(createNullEntity(i,0));
            multiplicateur = Math.floor(score /1000);
            if(gamestarted == true) {
                if (multiplicateur > 0) {
                    score += (10 * multiplicateur);
                }
                else {
                    score += 10;
                }
            }
        }
    }
};

var checkLignes = function(tab){
    var deleted = false;//Sert a verifier si un objet a étè supprimé lors de la verification de la grille.


    //Verification des Lignes/colonnes de 5 à 3. (Les suites de 5 sont prioritaires).

    for(var i = 5; i>= 3 ; i--)
    {
        if(checkSize(tab,i))
        {
            deleted = true;
            fillNulls();
        }
    }



    /*Ancien systeme de verification des Lignes/colonnes de 3 (pas viable pour les verifications plus élevées mais fonctionnel).
    for (var i=0; i<entities.length-2; i++) {
        for (var j=0; j<entities[i].length; j++) {
            if(entities[i][j].index == entities[i+1][j].index && entities[i][j].index == entities[i+2][j].index && entities[i][j].index != 5)
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
            if (entities[i][j].index == entities[i][j + 1].index && entities[i][j].index == entities[i][j + 2].index && entities[i][j].index != 5) {
                entities[i].splice(j, 3);
                deleted = true;
                break;
            }
        }
    }
    */

    return deleted;
};

var refillPlateau=function()
{
    for (var i=0; i<entities.length; i++) {
        for (var j=0; j<entities[i].length; j++) {
            if(entities[i][j].index == 5)
            {
                entities[i][j] = createEntity(i,(j-size+1)*2);
            }
        }
    }
};

var swapCases = function(ia,ja,ib,jb){
    //consolePlateau(-1,-1);

    /*var tmptab = entities.slice();
    var tmp = tmptab[ia][ja];
    tmptab[ia][ja] = tmptab[ib][jb];
    tmptab[ib][jb] = tmp;

    var tmp = tmptab[ia][ja].x;
    tmptab[ia][ja].x = tmptab[ib][jb].x;
    tmptab[ib][jb].x = tmp;

    var tmp = tmptab[ia][ja].y;
    tmptab[ia][ja].y = tmptab[ib][jb].y;
    tmptab[ib][jb].y = tmp;

    if(checkLignes(tmptab)==true)
    {*/
        var tmp = entities[ia][ja];
        entities[ia][ja] = entities[ib][jb];
        entities[ib][jb] = tmp;

        var tmp = entities[ia][ja].x;
        entities[ia][ja].x = entities[ib][jb].x;
        entities[ib][jb].x = tmp;

        var tmp = entities[ia][ja].y;
        entities[ia][ja].y = entities[ib][jb].y;
        entities[ib][jb].y = tmp;

  //  }

    //consolePlateau(-1,-1);
};

var consolePlateau = function(x,y){
    var str;
    for (var i=0; i<entities.length; i++) {
        str = "";
        for (var j=0; j<entities[i].length; j++) {
            if(x == i && y == j)
            {
                str += "|" + entities[i][j].index + "|;";
            }
            else
            {
                str += entities[i][j].index+";";
            }
        }
        console.log (str);
    }
    console.log("-----------------------------------");
};