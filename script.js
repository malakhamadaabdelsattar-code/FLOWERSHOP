function toggleMode() {
    const element = document.body;
    element.classList.toggle("dark");
}
function validateLogin() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let error = document.getElementById("errorBox");

    if (user === "malak" && pass === "888") {
        window.location.href = "shop.html";
    } else {
        error.innerHTML = "❌ Wrong username or password!";
    }
}
 counter = 0; 

function startMiniSlides() {
    let images = document.getElementsByClassName("MySlide");
    
    
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";  
    }
    
    counter++;
    
  
    if (counter > images.length) { counter = 1; }    
    
    
    if (images.length > 0) {
        images[counter - 1].style.display = "block";  
        setTimeout(startMiniSlides, 3000); 
    }
}


window.onload = startMiniSlides;