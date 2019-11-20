// require Inquirer node package
// require axios for github
// require fs
// require path
// require util (maybe)
// require HTML - PDF converter

// run Inquirer function

// Prompts:
// color
// profile image
// user name
// Location
// github profile
// blog
// About me
// number of repos
// number of followers
// number of github stars
// number of users you follow

// make axios call to github

// write information to an HTML file

const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const HTMLToPDF = require("html5-to-pdf");
const path = require("path");
let starNumber = 0;

inquirer
  .prompt({
    message: "Enter your GitHub username",
    name: "username"
  })
  .then(function({ username }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(res => {
      const gitPic = res.data.avatar_url;
      const gitName = res.data.name;
      const gitComp = res.data.company;
      const gitURL = res.data.blog;
      const gitLoco = res.data.location;
      const gitBio = res.data.bio;
      const gitRepos = res.data.public_repos;
      const followers = res.data.followers;
      const following = res.data.following;
      const gitStarredURL = `https://api.github.com/users/${username}/starred`;

      axios.get(gitStarredURL).then(res => {
        res.data.forEach(element => {
          starNumber += element.stargazers_count;
        });

        // // const repoNames = res.data.map(function(repo) {
        // //   return repo.name;
        // });

        // const repoNamesStr = repoNames.join("\n");

        htmlStr = `<!DOCTYPE html>
        <html lang="en">
        <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <link
              rel="stylesheet"
              href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
              integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
              crossorigin="anonymous"
            />
              <title>${gitName}'s GitHub</title>
        </head>
        <body>
          <div class="container-fluid text-center">
            <div>
              <img src="${gitPic}" height="200" width="200">
            </div>  
            <div>
              <h1>Hi! My name is ${gitName}</h1>
            </div>
            <div>
              <h3>Currently at ${gitComp}</h3>
            </div>
            <div class="row">
              <h5 class="col col-6">${gitLoco}</h5>
              <h5 class="col col-6"> 
                <a href="${gitURL}">GitHub</a></h5>
            </div>
          </div>
          <div>
            <h3>${gitBio}</h3>
          </div>
          <div class="row justify-content-center">
          <h3 class="col col-6 text-center">
            GitHub Repositories:
            <p>${gitRepos}</p>
          </h3>
          <h3 class="col col-6 text-center">
            Followers:
            <p>${followers}</p>
          </h3>
        </div>
        <div class="row justify-content-center">
          <h3 class="col col-6 text-center">
            GitHub Stars
            <p>${starNumber}</p>
          </h3>
          <h3 class="col col-6 text-center">
            Following:
            <p>${following}</p>
          </h3>
        </div>
        </body>
        </html>`;

        fs.writeFile(`profile.html`, htmlStr, () => {
          const htmlPDF = async () => {
            const htmlToPdf = new HTMLToPDF({
              inputPath: path.join(__dirname, `./profile.html`),
              outputPath: path.join(__dirname, `./profile.pdf`),
              options: { printBackground: true }
            });
            await htmlToPdf.start();
            await htmlToPdf.build();
            await htmlToPdf.close();
            process.exit(0);
          };
          return { html: htmlStr, pdf: htmlPDF() };
        });
      });
    });
  });
