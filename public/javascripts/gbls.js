var data;
var nameElement;
var deckElement;
var dataArray = [];
var isFillDataRunning;
var currentBackground = 1;
var intervalId;


async function startLoadingScreen(){
    fillData();
    nextScreen();
}

async function nextScreen(){
    await setScreen();

    return setTimeout(nextScreen, 10000);
}

function getNextImage(){
    if(dataArray.length > 0){
        return dataArray[0].Image;
    }

    return "";
}

async function retrieveData(){
    
    console.log("Array length: " + dataArray.length);

    if(dataArray.length <= 10 && !isFillDataRunning)
    {
        fillData();
    }

    if(dataArray.length > 0)
    {
        return dataArray.shift();
    }
    else
    {
        var response;

        try{
            response = await fetch('/screen');
        }
        catch{
            return await retrieveData();
        }

        if(response.ok)
        {
            return await response.json();
        }
        else{
            return await retrieveData();
        }
        
    }
}

async function fillData(){

    isFillDataRunning = true;
    console.log("Fill data starting.")

    while(dataArray.length < 20){
        console.log("Array length: " + dataArray.length);
        var response = await fetch('/screen');
        var tempData = await response.json();
        dataArray.push(tempData);
    }

    console.log("Fill data ending.")
    isFillDataRunning = false;
}

async function clickSetScreen(){
    clearInterval(intervalId);
    setScreen();
}

async function setScreen(){
    data = await retrieveData();
    nameElement = document.getElementById("name");
    deckElement = document.getElementById("deck");
    
    console.log(data);
    console.log(data.Image);
    console.log(data.Deck);

    var currentPosition = 0;

    intervalId = setInterval(frame, 10);

    function frame(){
        if(currentPosition == -100){
            clearInterval(intervalId);
            setScreen2();
        }
        else{
            currentPosition--;
            nameElement.style.left = currentPosition + "%";
            deckElement.style.bottom = currentPosition + "%";
        }
    }
}

function setScreen2(){

    var displayedBackground;
    var nextBackground;

    if(currentBackground == 1){
        displayedBackground = document.getElementById("background1");
        nextBackground = document.getElementById("background2");
        currentBackground = 2;
    }
    else
    {
        displayedBackground = document.getElementById("background2");
        nextBackground = document.getElementById("background1");
        currentBackground = 1;
    }

    nextBackground.style.backgroundImage = "url('" + data.Image + "')";
    nextBackground.style.opacity = 1;

    var currentOpacity = 100;

    intervalId = setInterval(frame, 10);

    function frame(){
        if(currentOpacity == 0){
            clearInterval(intervalId);
            displayedBackground.style.zIndex = -2;
            nextBackground.style.zIndex = -1;
            var nextImage = getNextImage();
            displayedBackground.style.backgroundImage = "url('" + nextImage + "')";
            setScreen3();
        }
        else{
            currentOpacity--;
            displayedBackground.style.opacity = currentOpacity * .01;
        }
    }
}


function setScreen3(){
    nameElement.innerHTML = data.Name + "&nbsp; <img src='../images/favicon.ico'/>";
    deckElement.innerHTML = data.Deck;

    var currentPosition = -100;

    intervalId = setInterval(frame, 10);

    function frame(){
        if(currentPosition == 0){
            clearInterval(intervalId);
        }
        else{
            currentPosition++;
            nameElement.style.left = currentPosition + "%";
            deckElement.style.bottom = currentPosition + "%";
        }
    }
}