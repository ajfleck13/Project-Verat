let ArrowMode = false;
let ArrowStartingFrom = {};
let ArrowsGoingTo = {};
let StartIssue = null;
let ArrowImg = "assets/images/arrowimg.svg";

const toggleArrowMode = function() {
    console.log("Toggling arrow mode");
    let button = $("#arrowbutton");
    let cards = $(".issuecard");
    let releasecards = $(".release").find(".issuecard");

    if(!ArrowMode)
    {
        if(SelectMode)
        {
            toggleSelectMode();
        }

        cards.off("mousedown");
        releasecards.click(doArrowModeClick);

        button.removeClass("btn-t");
        button.addClass("btn-active");
    }
    else
    {
        removeStartIssue();
        releasecards.off("click");    
        cards.mousedown(startDragging);

        button.addClass("btn-t");
        button.removeClass("btn-active");
    }
    ArrowMode = !ArrowMode;
}

$("#arrowbutton").click(toggleArrowMode);

const removeStartIssue = function() {
    $(`#issue${StartIssue}`).removeClass("card-arrowdraw");
    StartIssue = null;
}

const doArrowModeClick = function() {
    if(!StartIssue)
    {
        StartIssue = getIDFromIssueCard($(this));
        $(this).addClass("card-arrowdraw");
    }
    else
    {
        let endissue = getIDFromIssueCard($(this));
        tryAddArrow(endissue);
    }
}

const tryAddArrow = function(endissue) {
    if(StartIssue === endissue)
    {
        $(`#issue${StartIssue}`).removeClass("card-arrowdraw");
        StartIssue = null;
        // console.log("cannot draw to same issue");
        return;
    }

    // console.log(StartIssue);
    // console.log(endissue);
    let jqendissue = $(`#issue${endissue}`);
    let enddiv = parseInt(jqendissue.parent().attr('id'));
    let startdiv = parseInt($(`#issue${StartIssue}`).parent().attr('id'));

    if(enddiv >= startdiv)
    {
        addArrow(StartIssue, endissue);
    }
    else
    {
        // TODO: FLASH AN ERROR MESSAGE TO USER
        // console.log(`failed ${startdiv} to ${enddiv}`);
    }
}

const addArrow = function(startissue, endissue) {
    // console.log(`draw arrow ${startissue} to ${endissue}`);
    let arrowsStartingFromArray = ArrowStartingFrom[startissue] || [];
    let arrowsGoingToArray = ArrowsGoingTo[endissue] || [];

    if(arrowsStartingFromArray.includes(endissue) || arrowsGoingToArray.includes(startissue))
    {
        console.warn(`Add arrow attempted between ${startissue} and ${endissue} when arrow should already be drawn`);
    }

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

    const scrollcontainer = $(`#mainscrollcontainer`);

    let startoffsets = $(`#issue${startissue}`).offset();
    let startoffsetsX = startoffsets.left + $(`#issue${startissue}`).outerWidth() - 20;
    let startoffsetsY = startoffsets.top;

    let left = startoffsetsX + scrollcontainer.scrollLeft() - scrollcontainer.offset().left;
    let top = startoffsetsY - scrollcontainer.offset().top;

    let endoffsets = $(`#issue${endissue}`).offset();
    let endoffsetX = endoffsets.left;
    let endoffsetY = endoffsets.top;

    let xdiff = endoffsetX - startoffsetsX;
    // console.log(xdiff);
    let ydiff = endoffsetY - startoffsetsY;
    // console.log(ydiff);
    let magnitude = Math.sqrt((xdiff)**2 + (ydiff)**2);
    // console.log(magnitude);
    let angle = Math.atan2(ydiff, xdiff);

    let arrow = $("#svgarrow").clone();
    arrow.attr('id', `${startissue}and${endissue}`)
    arrow.css("top", `${top}px`);
    arrow.css("left", `${left}px`);
    arrow.css("width", `${magnitude}px`);
    arrow.css("-ms-transform", `rotate(${angle}rad`); /* IE 9 */
    arrow.css("-webkit-transform", `rotate(${angle}rad`); /* Safari 3-8 */
    arrow.css("transform", `rotate(${angle}rad`);

    console.log(arrow);

    $("#scrollcontainer").append(arrow);
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
        redrawArrowsForIssue(releaseTab[i]);
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

const removeArrowsForIssue = function(issueNumber) {
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
            $(`#${issueNumber}and${arrowsFromArray[i]}`).remove();
        }
    }
    delete ArrowStartingFrom[issueNumber];

    let arrowsGoingToArray = ArrowsGoingTo[issueNumber];
    if(arrowsGoingToArray && arrowsGoingToArray.length)
    {
        for(let i = 0; i < arrowsGoingToArray.length; i++)
        {
            $(`#${arrowsGoingToArray[i]}and${issueNumber}`).remove();
        }
    }
    delete ArrowsGoingTo[issueNumber];
}

const verifyCardMoveAllowed = function(issueNumber, newdivID) {
    if(newdivID === "loader" && 
    ((ArrowsGoingTo[issueNumber] && ArrowsGoingTo[issueNumber].length) || (ArrowStartingFrom[issueNumber] && ArrowStartingFrom[issueNumber].length)))
    {
        queryUserForTransfer(issueNumber, newdivID);
        return false;
    }

    let newdivIDNumber = parseInt(newdivID);

    let arrowsGoingToArray = ArrowsGoingTo[issueNumber];
    if(arrowsGoingToArray && arrowsGoingToArray.length)
    {
        for(let i = 0; i < arrowsGoingToArray.length; i++)
        {
            let startingfromissue = arrowsGoingToArray[i];
            let startingfromdiv = parseInt($(`#${startingfromissue}`).parent().attr('id'));

            if(newdivIDNumber < startingfromdiv)
            {
                queryUserForTransfer(issueNumber, newdivID);
                return false;
            }
        }
    }
    return true;
}

const queryUserForTransfer = function(issueNumber, newdivID) {
    $("#severAll").val(`${issueNumber},${newdivID}`);
    if(newdivID === "loader")
    {
        $("#sever").hide();
    }
    else
    {
        $("#sever").show();
    }

    $("#verifyCardMovement").modal();
}

const severAndTransfer = function() {
    // const severparams = $("#severAll").val().split(',');
    // const issueNumber = severparams[0];
    // const newdivID = severparams[1];
    // const parentID = $(`#issue${issueNumber}`).parent().attr('id');
    
    severAllAndTransfer(); //TODO: Write a function to make this work properly
}

const severAllAndTransfer = function() {
    const severparams = $("#severAll").val().split(',');
    const issueNumber = severparams[0];
    const newdivID = severparams[1];
    console.log(issueNumber);
    console.log(newdivID);
    const parentID = $(`#issue${issueNumber}`).parent().attr('id');
    console.log(parentID);

    removeArrowsForIssue(issueNumber);
    transferIssue(issueNumber, parentID, newdivID)
    $('#verifyCardMovement').modal('hide')
}

$("#sever").click(severAndTransfer);
$("#severAll").click(severAllAndTransfer);