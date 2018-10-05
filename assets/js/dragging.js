let elementToDrag = null;
let offsetX = 0;
let offsetY = 0;

//Called when we first click on a card to start trying to drag the card
const startDragging = function(e) {
    e = e || window.event;
    e.preventDefault();

    //Add listeners to the document to drag the card around and end the drag
    document.onmousemove = dragElement;
    document.onmouseup = endDragging;

    //Find the initial position of the card
    elementToDrag = this;
    let jqElement = $(this);
    position = jqElement.offset();

    //Set the position to fixed so we can manually set top and left
    this.style.top = position.top + "px";
    this.style.left = position.left  + "px";
    this.style.position = "fixed";
    //Set pointer event to none so we can hover over release div without card interference
    this.style.pointerEvents = "none";

    //Find the initial offset between cursor/card position to maintain while dragging
    offsetX = e.clientX - position.left;
    offsetY = e.clientY - position.top;

    //Adds a class that adds hover behavior to the releases
    $(".release").addClass("releasehover");
    jqElement.addClass("draggingcard");
}

//Called when moving the mouse while dragging a card
//We used the stored initial card/cursor offset and the current cursor position to reposition card
const dragElement = function(e) {
    e = e || window.event;
    e.preventDefault();

    elementToDrag.style.top = (e.clientY - offsetY) + "px";
    elementToDrag.style.left = (e.clientX - offsetX) + "px";
}

//Called when ending the drag by doing the mouseup
const endDragging = function(e) {
    e = e || window.event;
    e.preventDefault();

    //End current drag-relevant listeners
    document.onmouseup = null;
    document.onmousemove = null;

    //Find the release which we are currently hovering over
    let hoveringover = $(".releasehover" + ":hover");
    if(hoveringover.length)
    {
        //If we found a release we are hovering over, drop the card into it
        dropCardInto(elementToDrag, hoveringover.first());
    }
    else
    {
        //If we didn't find a release, reset the card's position and style
        resetDraggable();
    }

    //Remove the hover behavior via class removal from the releases
    $(".release").removeClass("releasehover");
}

//We dropped a card onto non-droppable space
//Reset the formatting used for dragging
const resetDraggable = function() {
    $(elementToDrag).removeClass("draggingcard");
    elementToDrag.style.position = null;
    elementToDrag.style.top = null;
    elementToDrag.style.left = null;
    elementToDrag.style.pointerEvents = null;

    elementToDrag = null;
}

//Dropping a card into a particular div
//Gets the current id of the card's parent, the id of the new div to drop on, and the card issue number
const dropCardInto = function(card, divelement)
{
    const jquerycard = $(card);
    const parent = jquerycard.parent();
    const issueNumber = jquerycard.attr('id');
    const parentID = parent.attr('id');
    const newdivID = divelement.attr('id');

    tryTransferIssue(issueNumber, parentID, newdivID);
}

const tryTransferIssue = function(issueNumber, parentID, newdivID) {
    if(verifyCardMoveAllowed(issueNumber, newdivID))
    {
        transferIssue(issueNumber, parentID, newdivID);
    }
}

//Removes the current card from the html entirely
//Splices out the issue from the old div, adds it to the new div
//Re-renders the cards in the new div
const transferIssue = function(issueNumber, parentID, newdivID) {
    let issueobject = null;
    //Remove the current card representing this issue from the html
    $("#" + issueNumber).remove();

    if(parentID === "loader")
    {
        //Find the issue if its in the issue loader and grab it and splice it out
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
        //Same as above, but this time use the parentID to get the right array to search/splice from
        const releaseindex = parseInt(parentID);
        let releaseTab = releaseTabIssues[releaseindex];
        for(let i = 0; i < releaseTab.length; i++)
        {
            if(releaseTab[i].number == issueNumber)
            {
                issueobject = releaseTab[i];
                releaseTab.splice(i, 1);
            }
        }
    }

    //Something has gone wrong if this occurs, log an error
    if(issueobject === null)
    {
        console.log(`ERROR: Unable to find issue ${issueNumber}`);
        return;
    }

    //Add the issue to the relevant issue holder
    if(newdivID === "loader")
    {
        issueArray.push(issueobject);
    }
    else
    {
        const releaseindex = parseInt(newdivID);
        releaseTabIssues[releaseindex].push(issueobject);
    }

    //Re-render the div elements that issue holder has
    renderDivCards(newdivID);

    //The latest experimental arrow technology
    redrawArrowsForIssue(issueNumber);
    redrawArrowsForDiv(parentID);
}