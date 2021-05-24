let currVideoURL;
let downloadlink = document.getElementById("dlink");

//recording api functions

async function getScreenStream(constraints) {
    return await navigator.mediaDevices.getDisplayMedia(constraints);
}

function getCameraStream(constraints) {
    return navigator.mediaDevices.getUserMedia(constraints)
}

function createRecorder(mediaStream) {
    let mediaRecorder = new MediaRecorder(mediaStream, {"mimeType": "video/webm"})

    let chunks = [];

    mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
    };

    mediaRecorder.onstop = function(e){
        const blob = new Blob(chunks, { 'type' : 'video/webm' });

        chunks = [];
        currVideoURL = window.URL.createObjectURL(blob);

        window.open(currVideoURL, "download");

        dlink.innerHTML = "Download Video";
        dlink.href = currVideoURL;
        dlink.download = "video.webm";

        recordingActive = false;
    };

    return mediaRecorder
}

// website setup

let mediaStream, mediaRecorder;

let streamActive = false, recordingActive = false;

let streamToggle = document.getElementById("streamtoggle");
let recordingToggle = document.getElementById("recordingtoggle");

let streamVideo = document.getElementById("videostream");
let recordingState = document.getElementById("recordingstate");

streamVideo.width = Math.ceil(window.screen.width/4);
streamVideo.height = Math.ceil(window.screen.height/4);

streamToggle.addEventListener("click", async function() 
    {
        if (streamActive == false) {
            mediaStream = await getScreenStream({video: true});
            streamVideo.srcObject = mediaStream;
            
            mediaRecorder = createRecorder(mediaStream);

            streamToggle.innerHTML = "STOP VIDEO RECORDING";

            streamActive = true;
        } else if (streamActive == true && recordingActive == false) {
            streamVideo.srcObject = null;

            mediaStream = undefined;
            mediaRecorder = undefined;

            streamToggle.innerHTML = "START VIDEO";

            streamActive = false;
        } 
    }
);
recordingToggle.addEventListener("click", function() 
    {
        if (recordingActive == false && streamActive == true) {
            mediaRecorder.start();

            recordingState.innerHTML = "Recording...";
            recordingToggle.innerHTML = "STOP RECORDING";

            recordingActive = true;
        } else if (recordingActive == true) {
            mediaRecorder.stop();

            recordingState.innerHTML = "";
            recordingToggle.innerHTML = "RECORD";

            recordingActive = false;
        }
    }
);
