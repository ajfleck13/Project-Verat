let SelectMode = false;
let SelectedIssue = null;
let UndoIssues = [];
let UndoArrows = [];

const toggleSelectMode = function() {
    console.log("toggling select mode");
    let button = $("#selectbutton");
    let cards = $(".issuecard");
    let releasecards = $(".release").find(".issuecard");

    if(!SelectMode)
    {
        if(ArrowMode)
        {
            toggleArrowMode();
        }

        cards.off("mousedown");
        releasecards.click(doSelectModeClick);

        button.removeClass("btn-t");
        button.addClass("btn-active");
    }
    else
    {
        RemoveSelectedIssue();

        releasecards.off("click");
        cards.mousedown(startDragging);

        button.addClass("btn-t");
        button.removeClass("btn-active");
    }
    SelectMode = !SelectMode
}

$("#selectbutton").click(toggleSelectMode);

const doSelectModeClick = function() {
    if(SelectedIssue && getIDFromIssueCard($(this)) === SelectedIssue)
    {
        RemoveSelectedIssue();
        return;
    }
    else if(SelectedIssue)
    {
        RemoveSelectedIssue();
    }

    let jqueryselection = $(this);
    SelectedIssue = getIDFromIssueCard(jqueryselection);

    let processedissues = []
    let arrows = [];
    let issuestoprocess = [SelectedIssue];

    while(issuestoprocess.length > 0)
    {
        let issue = issuestoprocess[0];
        processedissues.push(issue);
        issuestoprocess.splice(0, 1);

        let newfoundissues = ArrowsGoingTo[issue];
        if(newfoundissues && newfoundissues.length)
        {
            for(let i = 0; i < newfoundissues.length; i++)
            {
                let newissue = newfoundissues[i];
                arrows.push(`#${newissue}and${issue}`);
                if(!processedissues.includes[newissue])
                {
                    issuestoprocess.push(newissue);
                }
            }
        }
    }

    for(let i = 0; i < processedissues.length; i++)
    {
        $(`#issue${processedissues[i]}`).addClass("selectmodeclass");
    }

    for(let i = 0; i < arrows.length; i++)
    {
        let arrowsvgelements = $(`${arrows[i]}`).children();
        arrowsvgelements.addClass("highlightarrow");
    }

    $(`#issue${SelectedIssue}`).removeClass("selectmodeclass");
    $(`#issue${SelectedIssue}`).addClass("selectmodeclassfinal");

    UndoIssues = processedissues.slice(0);
    UndoArrows = arrows.slice(0);
}

const RemoveSelectedIssue = function() {
    if(!SelectedIssue)
    {
        return;
    }

    for(let i = 0; i < UndoIssues.length; i++)
    {
        $(`#issue${UndoIssues[i]}`).removeClass("selectmodeclass");
    }

    for(let i = 0; i < UndoArrows.length; i++)
    {
        let arrowsvgelements = $(`${UndoArrows[i]}`).children();
        arrowsvgelements.removeClass("highlightarrow");
    }

    $(`#issue${SelectedIssue}`).removeClass("selectmodeclassfinal");
    SelectedIssue = null;
}