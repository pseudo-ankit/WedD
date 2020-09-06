function rollDicee() {
    var num = Math.random();
    num *= 6;
    num = Math.floor(num);
    num += 1;
    return String(num);
}

document.querySelector(".container .dice .img1").setAttribute("src", "images/dice" + rollDicee() + ".png");
document.querySelector(".container .dice .img2").setAttribute("src", "images/dice" + rollDicee() + ".png");
