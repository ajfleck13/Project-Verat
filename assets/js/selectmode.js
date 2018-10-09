let SelectMode = false;
let SelectedIssue = null;
let UndoIssues = [];
let UndoArrows = [];

const toggleSelectMode = function() {
    console.log("toggling select mode");
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
    }
    else
    {
        releasecards.off("click");
        cards.mousedown(startDragging);

        RemoveSelectedIssue();
    }
}

$("#selectbutton").click(toggleSelectMode);

const doSelectModeClick = function() {
    if(SelectedIssue && $(this).attr('id') === SelectedIssue)
    {
        RemoveSelectedIssue();
        return;
    }
    else if(SelectedIssue)
    {
        RemoveSelectedIssue();
    }

    let jqueryselection = $(this);
    SelectedIssue = jqueryselection.attr('id');

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
        $(`#${processedissues[i]}`).addClass("selectmodeclass");
    }

    for(let i = 0; i < arrows.length; i++)
    {
        let arrowsvgelements = $(`${arrows[i]}`).children();
        arrowsvgelements.addClass("highlightarrow");
    }

    $(`#${SelectedIssue}`).removeClass("selectmodeclass");
    $(`#${SelectedIssue}`).addClass("selectmodeclassfinal");

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
        $(`#${UndoIssues[i]}`).removeClass("selectmodeclass");
    }

    for(let i = 0; i < UndoArrows.length; i++)
    {
        let arrowsvgelements = $(`${UndoArrows[i]}`).children();
        arrowsvgelements.removeClass("highlightarrow");
    }

    $(`#${SelectedIssue}`).removeClass("selectmodeclassfinal");
    SelectedIssue = null;
}