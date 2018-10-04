$('#Modalsubmit').show();

let run = function() {
    const baseURL = "https://api.github.com";

    if (!$("#repository").val()) {
        return;
    }

    $('#Modalsubmit').hide();

    let repositoryinput = $("#repository").val();
    let inputArray = repositoryinput.split("/");

    let indexG = inputArray.indexOf("github.com");
    let username = inputArray[indexG + 1];
    let repo = inputArray[indexG + 2];

    $.ajax({
        url: baseURL + `/repos/${username}/${repo}/issues`,
        method: "GET",
    }).then(function(response) {
        console.log(response);
        for (let i = 0; i < response.length; i++) {
            let issueslabelArray = [];
            for (let a = 0; a < response[i].labels.length; a++) {
                issueslabelArray.push(response[i].labels[a].id);
            }
            console.log(issueslabelArray)
            let issues = {
                title: response[i].title,
                body: response[i].body,
                number: response[i].number,
                login: response[i].user.login,
                avatar: response[i].user.avatar_url,
                html: response[i].user.html_url,
            };
            issueArray.push(issues);
        }
        renderDivCards("loader");
    })

    // label dropdown

    let labelArray = [];

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
            };
            labelArray.push(labels);
        }
        renderLabel();
    })

    const renderLabel = function(labelinfo) {
        console.log(labelArray)
        let dropdownmenu = $("#labels")
        for (let i = 0; i < labelArray.length; i++) {
            let name = labelArray[i].name;
            let description = labelArray[i].description;
            let color = labelArray[i].color;
            dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${name}</a>`)
            if (description !== undefined) {
                // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${description}</a>`)            
            }
            // dropdownmenu.append(`<a class="dropdown-item" href="#" id = "#labels">${color}</a>`)
        }
    }
}

let modalsubmit = $('#submit');
modalsubmit.click(run);

let issueArray = [];
let releaseTabIssues = [];

const addNewRelease = function() {
    const releaseheader = $("#releaseheader");
    const releasebody = $("#releasebody");
    const lastrelease = releasebody.find(".release").last();
<<<<<<< HEAD

    //Is also the index of the releaseTabIssues array
=======
    
//Is also the index of the releaseTabIssues array
>>>>>>> master
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




//**************************************************************************/
let repoArray = [];
const storageMaker = function() {


}

<<<<<<< HEAD

//function that stores repo urls
const repoHolder = function() {
    let item = $("#repository").val().toString();




}

$("#submit").on("click", repoHolder);
=======
>>>>>>> master
