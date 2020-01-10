import {ajax} from "./ajax.js"

const ROOT_URL = "http://ali-ecs.truman.pro:26000/projects";
const counter = {
  PENDING: 0,
  ACTIVE: 0,
  CLOSED: 0,
  ALL: 0
};
const idRowMap = new Map();

window.onload = () => {
  getAllProjects();
  document.querySelector("#entries").addEventListener("click", handleCLick, false);
};

function getAllProjects() {
  ajax(
    {
      url: ROOT_URL,
      method: 'get',
      success: initEntries,
      fail: ajaxFailed
    }
  );
}

function initEntries(allData) {
  let entries = document.querySelector("#entries");
  allData.forEach(data => {
    let entryRow = renderEntry(data);
    entries.appendChild(entryRow);
    idRowMap.set(data.id, entryRow);
    updateProjectsCount(data.status, 1);
  });
}

function renderEntry(data) {
  let entryRow = document.createElement("tr");
  entryRow.innerHTML
    = `<td>${data.name}</td>`
    + `<td><p title="${data.description}">${data.description}</p</td>`
    + `<td>${data.endTime}</td>`
    + `<td class="status-${data.status.toLowerCase()}">${data.status}</td>`
    + `<td><button class="del-btn" data-id =${data.id}>删除</button></td>`;
  return entryRow;
}

function updateProjectsCount(status, offset) {
  counter[status] += offset;
  counter.ALL += offset;
  renderOverview();
}

function renderOverview() {
  document.querySelectorAll("#overview-cards article").forEach(card => {
    let status = card.id.substring(5).toUpperCase();  // "card-".length = 5
    card.querySelector(".card-count").innerHTML = counter[status];
    if (status !== "ALL") {
      card.querySelector(".card-percent").innerHTML = Math.round(counter[status] / counter.ALL * 100).toString() + "%";
    }
  });
}

function handleCLick(entryEvt) {
  if (entryEvt.target.tagName === "BUTTON") {
    let dialog = renderDialog();
    document.body.appendChild(dialog);
    dialog.firstElementChild.addEventListener('click', (dialogEvt => {  // #dialog -> .dialog-box
      switch (dialogEvt.target.id) {
        case("close-btn"):
        case ("cancel-btn"):
          dialog.remove();
          break;
        case ("confirm-btn"):
          deleteProject(entryEvt.target.getAttribute("data-id"));
          dialog.remove();
          break;
      }
    }), false);
  }
}

function renderDialog() {
  let dialogDiv = document.createElement("div");
  dialogDiv.setAttribute("id", "dialog");
  dialogDiv.innerHTML
    = '<div class="dialog-box">'
    + '<p class="iconfont" id="close-btn"></p>'
    + '<div class="hint-msg">'
    + '<p class="iconfont hint-icon"></p>'
    + '<div class="hint-body">'
    + '<p class="hint-title">提示</p>'
    + '<p class="hint-text">确认删除该项目吗？</p>'
    + '</div></div>'
    + '<div id="buttons">'
    + '<button id="confirm-btn">确认</button>'
    + '<button id="cancel-btn">取消</button>'
    + '</div></div>';
  return dialogDiv
}

function deleteProject(id) {
  ajax({
    url: ROOT_URL + '/' + id.toString(),
    method: 'delete',
    success: removeEntry,
    successParams: [Number(id)],
    fail: ajaxFailed
  })
}

function removeEntry(id) {
  let target = idRowMap.get(id);
  let status = target.querySelector('td[class^=status]').innerHTML;
  target.parentElement.removeChild(target);
  updateProjectsCount(status, -1);
}

function ajaxFailed(text) {
  console.log("AJAX Failed" + text);
}
