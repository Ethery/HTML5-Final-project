/**
 * Created by Loïc on 12/03/2016.
 */

// Get the canvas and context
var canvas = document.getElementById("viewport");
var context = canvas.getContext("2d");

var gamestarted = false;

// Level properties
var level = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

// Define an entity class
var Entity = function(index,image,selected_i, arrayPosx, arrayPosy, width, height, xdir, ydir, speed) {
    this.index = index;
    this.image = image;
    this.selected_i = selected_i;
    this.x = arrayPosx*(level.width/size)+level.x;
    this.y = arrayPosy*(level.height/size)+level.y;
    this.width = width;
    this.height = height;
    this.xdir = xdir;
    this.ydir = ydir;
    this.speed = speed;
};



function sleep(milliSeconds){
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}
