const baseURL = "https://api.github.com";

let login = prompt("Please provide your repository URL.");

let loginArray = login.split("/");

let indexG = loginArray.indexOf("github.com");

let username = loginArray[indexG + 1];

let repo = loginArray[indexG + 2];

let issueArray = [];


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
})

console.log(issueArray);
