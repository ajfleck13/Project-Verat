$('#Modalsubmit').show();

let run = function(repositorytext) {
    const baseURL = "https://api.github.com";

    $('#Modalsubmit').hide();

    let inputArray = repositorytext.split("/");
    let username = inputArray[0];
    let repo = inputArray[1];

    let params = "?" + $.param({
        "state": "all"
    })

    urlRepo = baseURL + `/repos/${username}/${repo}/issues` + params,

    $.ajax({
        url: urlRepo,
        method: "GET",
    }).then(function(response) {
        // console.log(response);
        for (let i = 0; i < response.length; i++) {
            if(response[i].pull_request){
                continue;
            }
            let issueslabelArray = [];
            for(let a = 0; a < response[i].labels.length; a++){
                issueslabelArray.push(`${response[i].labels[a].id}`);
            }
            let issues = {
                title: response[i].title,
                body: response[i].body,
                number: response[i].number,
                login: response[i].user.login,
                avatar: response[i].user.avatar_url,
                html: response[i].user.html_url,
                labels: issueslabelArray,
                state: response[i].state,
            };
            issueArray.push(issues);
            
        }
        $('#title').append(`<a href=${urlRepo}>${repo}</a>`)
        renderDivCards("loader");
    })

    // label dropdown

    // 


    // creating an array of the labels which are assigned to the issues in github. 


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

    let labelArray = [];

const renderLabel = function(labelinfo){
    console.log(labelArray)
    let dropdownmenu = $("#labels")
    dropdownmenu.append('<button class="dropdown-item labels none" href="# id = "none">None</button>')
    for(let i=0; i < labelArray.length; i++){
        let name = labelArray[i].name;
        let description = labelArray[i].description;
        let color = labelArray[i].color;
        let id = labelArray[i].id;
        dropdownmenu.append(`<button class="dropdown-item labels" href="#" id = "${id}">${name}</button>`)
        if(description !== undefined)
        // card.append(`${name}`),
        {
            // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${description}</a>`)            
        }
        // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${color}</a>`)
        }
    }
}

let activeLabels = [];

$(".labels").length

console.log($(".labels").length);

$("#filter").on("click", ".labels", function() {
    let id = $(this).attr("id");
    $(this).addClass('button-clicked');
    activeLabels.push(id);
    filter();
    console.log("hello", id);
})


$("#filter").on("click", ".none", function(){
    activeLabels = [];
    $(".labels").removeClass('button-clicked');
    filter();
})
// changes color of filter button once it is clicked

 

// this loops through the issue array and retrieves its info
// then it loops through the issuelabelarray, and finds if it does not match the elements in the issuearray
// if so, then it does not display said card. 
let filter = function(){
    $(".card").show();
    for(let i = 0; i < issueArray.length; i++){
        let issue = issueArray[i];
        for(let j = 0; j < activeLabels.length; j++){
            if(!issue.labels.includes(activeLabels[j]))
            {
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

    run(repotext);
});

let issueArray = [];
let releaseTabIssues = [];

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
    newheader.append(`<button class="releaseHeader" id="button${newreleaseID}">NewRelease</button>`);
    releaseheader.append(newheader)

    let newdiv = $(`<td>`);
    newdiv.append(`<div class="release" id="${newreleaseID}">`);
    releasebody.append(newdiv);

    releaseTabIssues.push([]);
}

for (let i = 0; i < 3; i++) {
    addNewRelease();
}

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
        for (let i = 0; i < issueArray.length; i++) {
            divtoappend.append(rendercard(issueArray[i]));
        }
    } else {
        const releaseindex = parseInt(divtorender);
        let releaseTab = releaseTabIssues[releaseindex];
        for (let i = 0; i < releaseTab.length; i++) {
            divtoappend.append(rendercard(releaseTab[i]));
        }
    }
    $(".card").mousedown(startDragging);
}

// dynamically generating cards 

const rendercard = function(issueobject) {
    let number = issueobject.number;
    let card = $(`<div class = "card" id="${number}">`);
    let title = issueobject.title;
    card.append(`<p class = "card-header">${title}</p>`);

    let body = issueobject.body;
    card.append(`<p class = "card-body">${body}</p>`);

    card.append(`<p class = "card-footer">${number}</p>`);
    return card;
}

let modalclose = $('#close');
modalclose.click(function() {
    $("#modalRelease").hide();
});

const label = function() {}



//the reset button function
const reset = function() {
    location.reload();
}
$("#resetButton").on("click", reset);


//***************************************************************/
//****************************************************************/

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
if(data)
{
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
    if(!reposArray.includes(input.val()))
    {
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