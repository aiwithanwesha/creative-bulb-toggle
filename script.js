const handle = document.getElementById("handle");
const wire = document.getElementById("wire");
const body = document.body;

let isDragging = false;
let startY = 0;
let currentLength = 150;
const maxLength = 400;

function startDrag(clientY) {
    isDragging = true;
    startY = clientY;
}

function onDrag(clientY) {
    if (!isDragging) return;

    let diff = clientY - startY;
    if (diff < 0) diff = 0;
    if (diff > maxLength - 100) diff = maxLength - 100;

    currentLength = 100 + diff;
    
    wire.setAttribute("x1", 50);
    wire.setAttribute("x2", 50);
    wire.setAttribute("y2", currentLength);
    handle.setAttribute("cx", 50);
    handle.setAttribute("cy", currentLength);
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    if (currentLength > 140) {
        body.classList.toggle("light-on");
    }

    let startTime = null;
    let startLength = currentLength;
    
    function animateSpring(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / 750; 
        
        if (progress < 1) {
            currentLength = startLength + (100 - startLength) * Math.sin(progress * Math.PI);
            
            wire.setAttribute("x1", 50);
            wire.setAttribute("x2", 50);
            wire.setAttribute("y2", currentLength);
            handle.setAttribute("cx", 50);
            handle.setAttribute("cy", currentLength);
            
            requestAnimationFrame(animateSpring);
        } else {
            currentLength = 100;
            wire.setAttribute("x1", 50);
            wire.setAttribute("x2", 50);
            wire.setAttribute("y2", 100);
            handle.setAttribute("cx", 50);
            handle.setAttribute("cy", 100);
        }
    }

    requestAnimationFrame(animateSpring);
}

handle.addEventListener("mousedown", (e) => {
    startDrag(e.clientY);
    e.preventDefault();
});
window.addEventListener("mousemove", (e) => {
    onDrag(e.clientY);
});
window.addEventListener("mouseup", () => {
    endDrag();
});

handle.addEventListener("touchstart", (e) => {
    startDrag(e.touches[0].clientY);
    e.preventDefault();
}, { passive: false });

window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    onDrag(e.touches[0].clientY);
    e.preventDefault(); 
}, { passive: false });

window.addEventListener("touchend", () => {
    endDrag();
});