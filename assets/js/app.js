let run = function(){
const baseURL = "https://api.github.com";

let login = prompt("Please provide your repository URL.");

let loginArray = login.split("/");

let indexG = loginArray.indexOf("github.com");

let username = loginArray[indexG + 1];

let repo = loginArray[indexG + 2];



$.ajax({
    url: baseURL + `/repos/${username}/${repo}/issues`,
    method: "GET", 
}) .then (function(response){
    // console.log(response);
    for(let i = 0; i < response.length; i++){
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

let issueArray = [];
run();



console.log(issueArray);

const rendercard = function(cardinfo){
    let card = $(`<div class = "card">`)
    
    let title = issueArray[0].title
    
    card.append(`<p class = "title">${title}</p>`);

    $("#loader").append(card);
}
