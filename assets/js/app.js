const baseURL = "https://api.github.com";

let username = null;
let repo = null;
let issueArray = {};
let loaderArray = [];
let releaseTabIssues = [];

$('#Modalsubmit').show();

let run = function(repositorytext, saveobject) {
    $('#Modalsubmit').hide();

    let inputArray = repositorytext.split("/");
    username = inputArray[0];
    repo = inputArray[1];

    console.log(inputArray);

    urlRepo = baseURL + `/repos/${username}/${repo}/issues`

    $('#title').html(`<a href="https://github.com/${username}/${repo}">${repo}</a>`)

    retrieveIssues(urlRepo, saveobject, 1);

    $.ajax({
        url: baseURL + `/repos/${username}/${repo}/labels`,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            let labels = {
                name: response[i].name,
                description: response[i].description,
                color: response[i].color,
                id: response[i].id,
            };
            labelArray.push(labels);
        }
        renderLabel();
    })
};

const retrieveIssues = function(urlRepo, saveobject, page) {
    let params = "?" + $.param({
        "state": "all",
        'per_page': 100,
        // 'page': page,
    })
    
    $.ajax({
        url: urlRepo + params,
        method: "GET",
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            if (response[i].pull_request) {
                continue;
            }
            let issueslabelArray = [];
            for (let a = 0; a < response[i].labels.length; a++) {
                issueslabelArray.push(`${response[i].labels[a].id}`);
            }
            let issue = {
                title: response[i].title,
                body: response[i].body,
                number: response[i].number,
                login: response[i].user.login,
                avatar: response[i].user.avatar_url,
                html: response[i].user.html_url,
                labels: issueslabelArray,
                state: response[i].state,
            };
            issueArray[`${issue.number}`] = issue;
            loaderArray.push(`${issue.number}`);
        }
        renderDivCards("loader");

        if(issueArray.length < 30)
        {
            // page++;

            // retrieveIssues(urlRepo, saveobject, page)
        }
        else
        {
            if (saveobject) {
                completeLoad(saveobject);
            }
        }
    })
}

let labelArray = [];

const renderLabel = function(labelinfo) {
    console.log(labelArray)
    let dropdownmenu = $("#labels")
    dropdownmenu.append('<button class="dropdown-item labels none" href="# id = "none">None</button>')
    for (let i = 0; i < labelArray.length; i++) {
        let name = labelArray[i].name;
        let description = labelArray[i].description;
        let color = labelArray[i].color;
        let id = labelArray[i].id;
        dropdownmenu.append(`<button class="dropdown-item labels" href="#" id = "${id}">${name}</button>`)
        if (description !== undefined)
        // card.append(`${name}`),
        {
            // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${description}</a>`)            
        }
        // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${color}</a>`)
    }
}


let activeLabels = [];

$(".labels").length;

$("#filter").on("click", ".labels", function() {
    let id = $(this).attr("id");

    if($(this).hasClass('button-clicked'))
    {
        let index = activeLabels.indexOf(id);
 
        if (index > -1)
        {
            activeLabels.splice(index, 1);
        }
        $(this).removeClass('button-clicked');
    }
    else
    {
        $(this).addClass('button-clicked');
        activeLabels.push(id);
    }

    filter();
})


$("#filter").on("click", ".none", function() {
    activeLabels = [];
    $(".labels").removeClass('button-clicked');
    filter();
})
    // changes color of filter button once it is clicked



// this loops through the issue array and retrieves its info
// then it loops through the issuelabelarray, and finds if it does not match the elements in the issuearray
// if so, then it does not display said card. 
let filter = function() {
    $(".issuecard").show();
    for (let i = 0; i < loaderArray.length; i++) {
        let issue = issueArray[loaderArray[i]];
        for (let j = 0; j < activeLabels.length; j++) {
            if (!issue.labels.includes(activeLabels[j])) {
                $(`#${issue.number}`).hide();
            }
        }
    }
}

const formatUsernameAndRepo = function(text) {
    const inputArray = text.split("/");
    const indexG = inputArray.indexOf("github.com");

    const username = inputArray[indexG + 1];
    const repo = inputArray[indexG + 2];
    return `${username}/${repo}`;
}

let modalsubmit = $('#submit');
modalsubmit.click(function() {
    if (!$("#repository").val()) {
        return;
    }

    const repositoryinput = $("#repository").val();
    const repotext = formatUsernameAndRepo(repositoryinput);

    run(repotext, null);
});

const addNewRelease = function() {
    const releaseheader = $("#releaseheader");
    const releasebody = $("#releasebody");
    const lastrelease = releasebody.find(".release").last();

    //Is also the index of the releaseTabIssues array
    let newreleaseID = "0";
    if (lastrelease.length) {
        //Get the index of the last tab and increment it for the new release id
        const lastreleaseID = lastrelease.attr('id');
        newreleaseID = `${parseInt(lastreleaseID) + 1}`;
    }

    let newheader = $(`<th scope="col">`);
    newheader.append(`<button class="releaseHeader btn btn-outline-success" id="button${newreleaseID}">NewRelease</button>`);
    releaseheader.append(newheader)

    let newdiv = $(`<td>`);
    newdiv.append(`<div class="release" id="${newreleaseID}">`);
    releasebody.append(newdiv);

    releaseTabIssues.push([]);
}

for (let i = 0; i < 3; i++) {
    addNewRelease();
}


//creates new release tab buttons
$("#addbutton").on("click", addNewRelease);

let newIdNum = []; //collecting ids of subsequent NewRelease tabs
let count = 3; //original loop stooped at 3
const attr = "button";

//makes the new release tab buttons function like the original three
$("#addbutton").on("click", function(event) {
    event.preventDefault();
    count++;
    // console.log(count);
    newIdNum.push("button" + count); //populating newDivs with ids
    // console.log(newDivs);
    for (let i = 0; i < newIdNum.length; i++) {
        if (newIdNum[i]) {
            $(".releaseHeader").click(renameRelease);
            $("#submitRelease").click(finishRename);
        }
    }
});

let renamingId;
const renameRelease = function() {
    $("#modalRelease").show();
    renamingId = $(this).attr('id');
}
$(".releaseHeader").click(renameRelease);

const finishRename = function() {
    let buttonToRename = $("#" + renamingId);
    let newName = $("#renameRelease").val().trim();

    if (!newName) {
        return;
    }
    buttonToRename.text(newName);
    $("#modalRelease").hide();
    $("#renameRelease").val("");
}

let renamesubmit = $('#submitRelease');
renamesubmit.click(finishRename);

const renderDivCards = function(divtorender) {
    let divtoappend = $("#" + divtorender);
    divtoappend.empty();
    if (divtorender === "loader") {
        for (let i = 0; i < loaderArray.length; i++) {
            divtoappend.append(rendercard(issueArray[loaderArray[i]]));
        }
    } else {
        const releaseindex = parseInt(divtorender);
        let releaseTab = releaseTabIssues[releaseindex];
        for (let i = 0; i < releaseTab.length; i++) {
            divtoappend.append(rendercard(issueArray[parseInt(releaseTab[i])]));
        }
    }
    //$(".issuecard").click(showIssueInformationModal);
    $(".issuecard").mousedown(startDragging);
}

// dynamically generating cards 
let githubcolorOpen = "#2cbe4e";
let githubcolorClosed = "#cb2431";

const rendercard = function(issueobject) {
    let number = issueobject.number;
    let card = $(`<div class = "card issuecard" id="${number}">`);
    let title = issueobject.title;
    card.append(`<p class = "card-header" style="background-color: ${issueobject.state === "open"? githubcolorOpen : githubcolorClosed};">${title}</p>`);

    let body = issueobject.body;
    card.append(`<p class = "card-body">${body}</p>`);

    card.append(`<p class = "card-footer">${number}</p>`);
    return card;
}

let modalclose = $('#close');
modalclose.click(function() {
    $("#modalRelease").hide();
});

//the reset button function
const reset = function() {
    location.reload();
}
$("#resetbutton").on("click", reset);


//the array that holds the repos to be displayed
let reposArray = [];

//function that appends the repos 
const placeRepo = function(repotext) {
    const text = formatUsernameAndRepo(repotext);
    $("#recentRepos").append(`<li class="repolinks"><span class="badge badge-pill badge-primary">${text}</span></li>`);
}

// localstorage to ensure that the data persists
if (localStorage.getItem("recentrepos")) {
    reposArray = JSON.parse(localStorage.getItem("recentrepos"));
}

const data = JSON.parse(localStorage.getItem("recentrepos"));
//looping through data and calling the appending function
if (data) {
    data.forEach(item => {
        placeRepo(item);
    });

    $(".repolinks").click(function() {
        run($(this).text());
    })
}

//function for storing the input values in the reposArray
$("#submit").on("click", function(event) {
    event.preventDefault();

    const input = $("#repository");
    if (!reposArray.includes(input.val())) {
        reposArray.unshift(input.val());
    }
    reposArray = reposArray.slice(0, 4);
    localStorage.setItem("recentrepos", JSON.stringify(reposArray));
});

//clear local storage
$("#clearStorage").on("click", function() {
    localStorage.clear();
    $("#recentRepos").empty();
});


//SAVING && LOADING

const CreateSave = function() {
    let saveobject = {
        version: 1,
        ArrowsStartingFrom: ArrowStartingFrom,
        ArrowsGoingTo: ArrowsGoingTo,
        LoaderArray: loaderArray,
        releaseTabIssues: releaseTabIssues,
        Username: username,
        Repo: repo,
    }

    $('#saveModal').modal();
    $('#savetext').val(JSON.stringify(saveobject));
}

$("#savebutton").click(CreateSave);

const CopyTextToClipboard = function() {
    var copyText = document.getElementById("savetext");
    copyText.select();
    document.execCommand("copy");
}

$("#copytext").click(CopyTextToClipboard);

const TryLoadSave = function() {
    let savestring = $("#loadtext").val();

    console.log(savestring);

    if(savestring)
    {
        $("#loadModal").modal('toggle');
        $("#loadtext").val("");

        LoadSave(savestring);
    }
}

$("#buttonloadmodal").click(TryLoadSave);

$("#loadbutton").click(function() {
    $("#loadModal").modal();
    $("#loadtext").focus();
});

$('#loadModal').on('shown.bs.modal', function() {
    $("#loadtext").focus();
})
  

const LoadSave = function(json) {
    let jsonobject = JSON.parse(json);

    // console.log(jsonobject);

    ClearInfo();

    run(`${jsonobject.Username}/${jsonobject.Repo}`, jsonobject);
}

const completeLoad = function(jsonobject) {
    let releasedivsquantity = jsonobject.releaseTabIssues.length;

    for (let i = 0; i < releasedivsquantity; i++) {
        addNewRelease();
    }

    releaseTabIssues = jsonobject.releaseTabIssues;
    loaderArray = jsonobject.LoaderArray;
    renderDivCards("loader");

    for (let i = 0; i < releasedivsquantity; i++) {
        renderDivCards(`${i}`);
    }

    ArrowsStartingFrom = jsonobject.ArrowsStartingFrom;
    ArrowsGoingTo = jsonobject.ArrowsGoingTo;

    for (let i = 0; i < releasedivsquantity; i++) {
        redrawArrowsForDiv(`${i}`);
    }
}

const ClearInfo = function() {
        let scrollcontainer = $("#scrollcontainer").empty();
        scrollcontainer.append(`
    <thead>
        <tr id="releaseheader"></tr>
    </thead>
    <tbody>
        <tr id="releasebody"></tr>
    </tbody>`);

        $("#loader").empty();
        issueArray = {};
        releaseTabIssues = [];
        username = null;
        repo = null;
        ArrowStartingFrom = {};
        ArrowsGoingTo = {};
    }
    //controls the tooltips functionality on the right sidebar
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});