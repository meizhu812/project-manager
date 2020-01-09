import ajax from "../src/ajax.js"

const ROOT_URL = "http://localhost:3000/projects";

const projectCounts = {
  pending: 0,
  active: 0,
  closed: 0,
  all: 0
};

function ajaxFailed(text) {
  console.log("AJAX Failed" + text)
}

function getAllProjects() {
  ajax(
    {
      url: ROOT_URL,
      method: 'get',
      params: {},
      headers: {},
      data: "",
      success: initProjectsList,
      fail: ajaxFailed
    }
  );


}

function initProjectsList(allData) {
  let projectsList = document.getElementById("projects-list");
  for (let data of allData) {
    projectsList.innerHTML +=
      (`<tr data-id = ${data.id}>`
        + `<td>${data.name}</td>`
        + `<td>` + `<p>` + data.description + `</p>` + `</td>`
        + `<td>` + data.endTime + `</td>`
        + `<td class="status-${data.status.toLowerCase()}">${data.status.toUpperCase()}</td>`
        + `<td>` + `<button class="del-btn">删除</button>` + `</td>`
        + `</tr>`);
    updateProjectsCount(data.status.toLowerCase(), 1);
  }
}

function updateProjectsCount(statusType, offset) {
  projectCounts[statusType] += offset;
  projectCounts.all += offset;
  renderOverviewCards()
}

function renderOverviewCards() {
  let cards = document.getElementsByClassName("overview-card");
  for (let card of cards) {
    card.getElementsByClassName("projects-count")[0].innerHTML = projectCounts[card.id.replace("overview-", "")];
    if (card.id !== "overview-all") {
      card.getElementsByClassName("projects-percentage")[0].innerHTML
        = Math.round(projectCounts[card.id.replace("overview-", "")] / projectCounts.all * 100).toString() + "%";
    }
  }
}

window.onload = getAllProjects;