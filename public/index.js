import ajax from "../src/ajax.js"

const ROOT_URL = "http://localhost:3000/projects";
const projectCounts = {
  pending: 0,
  active: 0,
  closed: 0,
  all: 0
};
const idRowMap = new Map();

window.onload = () => {
  getAllProjects();
  let projectsList = document.getElementById("projects-list");
  projectsList.addEventListener("click", handleButtonCLick, false);
};

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
    let rowElement = renderRow(data);
    projectsList.appendChild(rowElement);
    idRowMap.set(data.id, rowElement);
    updateProjectsCount(data.status.toLowerCase(), 1);
  }
}

function renderRow(data) {
  let row = document.createElement("tr");
  row.setAttribute("data-id", data.id);
  row.innerHTML
    = `<td>${data.name}</td>`
    + `<td><p>${data.description}</p</td>`
    + `<td>${data.endTime}</td>`
    + `<td class="status-${data.status.toLowerCase()}">${data.status.toUpperCase()}</td>`
    + `<td><button class="del-btn">删除</button></td>`;
  return row
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

function handleButtonCLick(outEvt) {
  let bodyElement = document.body;
  let target = outEvt.target;
  if (target.tagName === "BUTTON") {
    let boxWithMask = renderConfirmBox();
    bodyElement.appendChild(boxWithMask);
    boxWithMask.children[0].addEventListener('click', (inEvt => {
      switch (inEvt.target.id) {
        case("close-button"):
        case ("cancel-button"):
          boxWithMask.parentElement.removeChild(boxWithMask);
          break;
        case ("confirm-button"):
          deleteProject(Number(outEvt.target.parentElement.parentElement.getAttribute("data-id")));
          boxWithMask.parentElement.removeChild(boxWithMask);
          break;
      }
    }))
  }
}

function renderConfirmBox() {
  let boxWithMask = document.createElement("div");
  boxWithMask.setAttribute("id", "mask");
  boxWithMask.innerHTML
    = '<div class="confirm-box">'
    + '<span class="iconfont icon-guanbi" id="close-button"></span>'
    + '<div class="hint-box">'
    + '<p class="iconfont icon-wenhao hint-icon"></p>'
    + '<div class="hint-body">'
    + '<p class="hint-title">提示</p>'
    + '<p class="hint-text">确认删除该项目吗?</p>'
    + '</div></div>'
    + '<div id="buttons">'
    + '<button id="confirm-button">确认</button>'
    + '<button id="cancel-button">取消</button>'
    + '</div></div>';
  return boxWithMask
}

function deleteProject(id) {
  ajax({
    url: ROOT_URL + '/' + id.toString(),
    method: 'delete',
    headers: {},
    data: "",
    success: removeProjectFromList,
    successParams: [id],
    fail: ajaxFailed
  })
}

function removeProjectFromList(id) {
  let target = idRowMap.get(id);
  let status = target.querySelector('td[class^=status]').innerHTML.toLowerCase();
  target.parentElement.removeChild(target);
  updateProjectsCount(status, -1);
}

function ajaxFailed(text) {
  console.log("AJAX Failed" + text)
}
