const showIssueInformationModal = function() {
    console.log("hello world");
    let issueNumber = getIDFromIssueCard($(this));
    displayIssueInformation(issueNumber);
    $("#showIssueInformation").modal();
}

const displayIssueInformation = function(issueNumber) {
    $(`#issueComments`).empty();

    $.ajax({
        url: baseURL + `/repos/${username}/${repo}/issues/${issueNumber}`,
        method: "GET",
    }).then(function(response) {
        $("#issueTitle").prepnd(`${response.title} #${response.number}`);
        $("#issueTitle").append(`<br>Created at ${response.created_at}`);
        
        $("#issueComments").prepend(addComment(response));
    });

    $.ajax({
        url: baseURL + `/repos/${username}/${repo}/issues/${issueNumber}/comments`,
        method: "GET",
    }).then(function(response) {
        console.log(response);
        for(let i = 0; i < response.length; i++)
        {
            $("#issueComments").append(addComment(response[i]));
        }
    });
}

const addComment = function(commentobject) {
    let row = $(`<tr>`);

    let avatar = $(`<td>`);
    avatar.append(`<img src="${commentobject.user.avatar_url}" style="width: 64px; height: 64px;">`);

    let cardholder = $(`<td>`);
    let card = $(`<div class="card bg-light mb-3 issuecomment"></div>`);
    card.append(`<div class="card-header">${commentobject.user.login} commented at ${commentobject.created_at}</div>`);
    let body = $(`<div class="card-body">`);
    body.append(`<p class="card-text">${commentobject.body}</p>`);
    card.append(body);
    cardholder.append(card);

    row.append(avatar);
    row.append(cardholder);
    return row;
}
