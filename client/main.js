let stars = [];

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function showMenuAt(x,y)
{
    let menu = document.querySelector("#context-menu");
    menu.style.display = "block";
    menu.style.top = y+"px";
    menu.style.left = x+"px"; 
    menu.style.z
}
function hideMenu()
{
    let menu = document.querySelector("#context-menu");
    menu.style.display = "none";
}

var currentSelectedStar;
window.onload = function () {
    let canvas = document.getElementById("map");
    let context = canvas.getContext("2d");
    let background = new Image();
    background.src = "background.jpg";
    fetch("/api/stars").then(result=>result.json()).then(result=>stars = result);
    canvas.onmousemove = (event) => {
        var selectedStar = undefined;
        let e = getMousePos(canvas, event);
        for (let star of stars) {
            if (Math.abs(star.x - e.x) <= star.size + 10 && Math.abs(star.y - e.y) <= star.size + 10) {
                selectedStar = star;
                break;
            }
        }
        if (selectedStar != currentSelectedStar) {
            currentSelectedStar = selectedStar;
            draw(context, stars, currentSelectedStar);
        }
    }
    let sortFunction = (a, b) => {
        if (a.x > b.x) return 1;
        if (a.x < b.x) return -1;
        else
            return a.y - b.y;
    }
    let draw = (context, stars, selectedStar) => {
        stars = stars.sort(sortFunction);
        context.drawImage(background, 0, 0);
        context.fillStyle = "#ccc";
        context.font = "bold 12px arial";
        context.strokeStyle = "#ccc";
        context.beginPath();
        context.lineWidth = 20;
        for (let star of stars.filter(star => star.owner === "Federation")) {
            context.fillStyle = "rgba(135, 206, 250, 0.5)";
            context.strokeStyle = "rgba(135, 206, 250, 0.3)";
            context.lineTo(star.x, star.y)
            
        }
        context.fill();
        context.lineWidth = 1;
        context.closePath();
        for (let star of stars) {
            context.beginPath();
            context.strokeStyle = "#ccc";
            context.fillStyle = "#ccc";
            context.arc(star.x, star.y, star.size, 0, 2 * Math.PI)
            if (star.name)
                context.fillText(star.name, star.x + star.size + 2, star.y);
            if (!star.isDestroyed)
                context.fill();
            context.stroke();
        }
        if (selectedStar) {
            context.beginPath();
            context.strokeStyle = "rgba(224,224,224,0.3)";
            context.fillStyle = "rgba(224,224,224,0.3)";
            context.lineWidth = 5;
            context.arc(selectedStar.x, selectedStar.y, selectedStar.size + 4, 0, 2 * Math.PI)
            context.stroke();
        }
    }
    background.onload = () => {
        draw(context, stars);
    };
};