async function setScreen(){
    var response = await fetch('/screen');
    var data = await response.json();
    var nameElement = document.getElementById("name");
    
    console.log(data);
    console.log(data.Image);
    console.log(data.Deck);
    document.getElementById("main").style.backgroundImage = "url('" + data.Image + "')";
    // await animateOutLeft(nameElement);

    // var pos = 0;
    // var endWidth = -nameElement.offsetWidth;
    // var id = await setInterval(frame, 5);
    // var isAnimating = true;
    // function frame(){
    //     if(pos == endWidth){
    //         clearInterval(id);
    //         isAnimating = false;
    //     }
    //     else{
    //         pos--;
    //         nameElement.style.left = pos + "px";
    //     }
    // }

    // while(isAnimating){
    //     //Don't do anything while the animation is going.
    // }

    nameElement.innerHTML = data.Name + "&nbsp; <img src='../images/favicon.ico'/>";
    document.getElementById("deck").innerHTML = data.Deck;
}


async function startLoadingScreen(){
    nextScreen();
}

async function nextScreen(){
    await setScreen();

    return setTimeout(nextScreen, 10000);
}

async function animateOutLeft(element){
    var width = element.offsetWidth;
    console.log(width);

    var id = await setInterval(await frame(element, 0, -width, id), 5);
}

async function frame(element, currentPosition, stopPosition, id){
    if(currentPosition == stopPosition){
        clearInterval(id);
    }
    else{
        currentPosition--;
        element.style.left = currentPosition + "px";
    }
}