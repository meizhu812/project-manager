import ajax from "../src/ajax.js"

const ROOT_URL = "http://localhost:3000/projects";

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
      success: initProjects,
      fail: ajaxFailed
    }
  );

  function initProjects(allData) {
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
    }
  }
}

window.onload = getAllProjects;