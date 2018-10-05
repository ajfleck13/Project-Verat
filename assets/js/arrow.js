let ArrowMode = false;
let ArrowStartingFrom = {};
let ArrowsGoingTo = {};
let StartIssue = null;
let ArrowImg = "assets/images/arrowimg.svg";

const toggleArrowMode = function() {
    console.log("Toggling arrow mode");
    let releasecards = $(".release").find(".card");
    if(!ArrowMode)
    {
        releasecards.off("mousedown");
        releasecards.click(doArrowModeClick);
    }
    else
    {
        removeStartIssue();
        releasecards.off("click");    
        releasecards.mousedown(startDragging);
    }
    ArrowMode = !ArrowMode;
}

$("#arrowbutton").click(toggleArrowMode);

const removeStartIssue = function() {
    $(`#${StartIssue}`).removeClass("card-arrowdraw");
    StartIssue = null;
}

const doArrowModeClick = function() {
    if(!StartIssue)
    {
        StartIssue = $(this).attr('id');
        $(this).addClass("card-arrowdraw");
    }
    else
    {
        let endissue = $(this).attr('id');
        addArrow(StartIssue, endissue);
    }
}

const addArrow = function(startissue, endissue) {
    let arrowsStartingFromArray = ArrowStartingFrom[startissue] || [];
    let arrowsGoingToArray = ArrowsGoingTo[endissue] || [];
    arrowsStartingFromArray.push(endissue);
    arrowsGoingToArray.push(startissue);

    ArrowStartingFrom[startissue] = arrowsStartingFromArray;
    ArrowsGoingTo[endissue] = arrowsGoingToArray;

    drawArrow(startissue, endissue);

    removeStartIssue();
}

//Warning: if cards and arrow images are not the same css height this function as it is written will fail
const drawArrow = function(startissue, endissue) {
    $(`#${startissue}and${endissue}`).remove();
    let startoffsets = $(`#${startissue}`).offset();
    let startoffsetsX = startoffsets.left + $(`#${startissue}`).outerWidth() - 20;
    let startoffsetsY = startoffsets.top;
    let top = startoffsetsY;
    let left = startoffsetsX;

    let endoffsets = $(`#${endissue}`).offset();
    let endoffsetX = endoffsets.left;
    let endoffsetY = endoffsets.top;

    let xdiff = endoffsetX - startoffsetsX;
    // console.log(xdiff);
    let ydiff = endoffsetY - startoffsetsY;
    // console.log(ydiff);
    let magnitude = Math.sqrt((xdiff)**2 + (ydiff)**2);
    // console.log(magnitude);
    let angle = Math.atan2(ydiff, xdiff);


    let image = `<img class="arrow" src="${ArrowImg}" id="${startissue}and${endissue}"
    style="top: ${top}px; 
    left: ${left}px;
    width: ${magnitude}px;
    -ms-transform: rotate(${angle}rad); /* IE 9 */
    -webkit-transform: rotate(${angle}rad); /* Safari 3-8 */
    transform: rotate(${angle}rad);
    ">`

    $("#scrollcontainer").append(image);
}

const redrawArrowsForDiv = function(releasediv) {
    if(releasediv === "loader")
    {
        return;
    }

    const releaseindex = parseInt(releasediv);
    let releaseTab = releaseTabIssues[releaseindex];
    for(let i = 0; i < releaseTab.length; i++)
    {
        redrawArrowsForIssue(releaseTab[i].number);
    }
}

const redrawArrowsForIssue = function(issueNumber) {
    if(!issueNumber)
    {
        console.warn(`No issue number passed to redraw arrows for issue, sent: ${issueNumber}`);
        return;
    }

    let arrowsFromArray = ArrowStartingFrom[issueNumber];
    if(arrowsFromArray && arrowsFromArray.length)
    {
        for(let i = 0; i < arrowsFromArray.length; i++)
        {
            drawArrow(issueNumber, arrowsFromArray[i]);
        }
    }

    let arrowsToArray = ArrowsGoingTo[issueNumber];
    if(arrowsToArray && arrowsToArray.length)
    {
        for(let i = 0; i < arrowsToArray.length; i++)
        {
            drawArrow(arrowsToArray[i], issueNumber);
        }
    }
}