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
        // console.log(response);
        for (let i = 0; i < response.length; i++) {
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
        rendercard();
    })
}

let modalsubmit = $('#submit');
modalsubmit.click(run);

let issueArray = [];
run();

let renamingId;
const renameRelease = function() {
    $("#modalRelease").show();
    renamingId = $(this).attr("id");
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

console.log(issueArray);

const rendercard = function(cardinfo){
    for(let i = 0; i < issueArray.length; i++){
        let card = $(`<div class = "card">`)
        let title = issueArray[i].title;
        card.append(`<p class = "title">${title}</p>`);
        $("#loader").append(card);
    }
}
