let elementToDrag = null;
let offsetX = 0;
let offsetY = 0;

const startDragging = function(e) {
    e = e || window.event;
    e.preventDefault();

    document.onmousemove = dragElement;
    document.onmouseup = endDragging;

    elementToDrag = this;
    let jqElement = $(this);
    position = jqElement.offset();

    this.style.top = position.top + "px";
    this.style.left = position.left  + "px";
    this.style.position = "fixed";
    this.style.pointerEvents = "none";

    offsetX = e.clientX - position.left;
    offsetY = e.clientY - position.top;

    $(".release").addClass("releasehover")
}

const dragElement = function(e) {
    e = e || window.event;
    e.preventDefault();

    elementToDrag.style.top = (e.clientY - offsetY) + "px";
    elementToDrag.style.left = (e.clientX - offsetX) + "px";
}

const endDragging = function(e) {
    e = e || window.event;
    e.preventDefault();

    document.onmouseup = null;
    document.onmousemove = null;

    if(!$(".releasehover" + ":hover").length)
    {
        resetDraggable()
    }

    $(".releaseHeader").removeClass("releasehover");
}

const resetDraggable = function() {
    elementToDrag.style.position = null;
    elementToDrag.style.top = null;
    elementToDrag.style.left = null;
    elementToDrag.style.pointerEvents = null;

    elementToDrag = null;
}