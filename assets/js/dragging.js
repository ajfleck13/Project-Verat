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

    let hoveringover = $(".releasehover" + ":hover");
    if(hoveringover.length)
    {
        dropCardInto(elementToDrag, hoveringover.first());
    }
    else
    {
        resetDraggable();
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

const dropCardInto = function(card, divelement)
{
    console.log(divelement);
    const jquerycard = $(card);
    console.log(jquerycard);
    const parent = jquerycard.parent();
    console.log(parent);
    const issueNumber = jquerycard.attr('id');
    const parentID = parent.attr('id');
    console.log(parentID);
    const newdivID = divelement.attr('id');

    transferIssue(issueNumber, parentID, newdivID);
}

const transferIssue = function(issueNumber, parentID, newdivID) {
    let issueobject = null;
    console.log(newdivID);

    $("#" + issueNumber).remove();
    if(parentID === "loader")
    {
        for(let i = 0; i < issueArray.length; i++)
        {
            if(issueArray[i].number == issueNumber)
            {
                issueobject = issueArray[i];
                issueArray.splice(i, 1);
            }
        }
    }
    else
    {
        const releaseindex = parseInt(parentID);
        let releaseTab = releaseTabIssues[releaseindex];
        for(let i = 0; i < releaseTab.length; i++)
        {
            if(releaseTab[i].number == issueNumber)
            {
                issueobject = issueArray[i];
                issueArray.splice(i, 1);
            }
        }
    }

    if(newdivID === "loader")
    {
        issueArray.push(issueobject);
    }
    else
    {
        console.log(newdivID);
        const releaseindex = parseInt(newdivID);
        console.log(releaseindex);
        console.log(releaseTabIssues[releaseindex]);
        releaseTabIssues[releaseindex].push(issueobject);
    }

    renderDivCards(newdivID);
}