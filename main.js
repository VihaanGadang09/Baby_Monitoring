img = "";
status = "";
objects = [];
detecting = false;  // true while the model is busy

function preload(){
    song = loadSound("alarm.mp3");
}

function setup(){
    canvas = createCanvas(380, 380);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(380, 380);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Baby";
}

function modelLoaded(){
    console.log("Model Loaded!");
    status = true;
}

function gotResults(error, results){
    detecting = false;
    if(error){
        console.log(error);
        return;
    }
    console.log(results);
    objects = results;
}

function draw(){
    image(video, 0, 0, 380, 380);
    if(status != ""){
        r = random(255);
        g = random(255);
        b = random(255);
        if(!detecting){
            detecting = true;
            objectDetector.detect(video, gotResults);
        }
        baby_found = false;

        for(i = 0; i < objects.length; i++){
            document.getElementById("status").innerHTML = "Status: Object Detected";
            fill(r, g, b);
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke(r, g, b);
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);
            
            if(objects[i].label == "person"){
                baby_found = true;
            }
        }

        // only start the alarm if it isn't already ringing (otherwise it restarts 60 times a second)
        if(baby_found){
            document.getElementById("no_of_objects").innerHTML = "Baby Found";
            if(song.isPlaying()){
                song.stop();
            }
        }
        else{
            document.getElementById("no_of_objects").innerHTML = "Baby not found!";
            if(!song.isPlaying()){
                song.play();
            }
        }
    }
}