import ajax from "./ajax.js"

const ROOT_URL = "http://localhost:3000/projects";
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
  for (let data of allData) {
    let rowElement = renderRow(data);
    entries.appendChild(rowElement);
    idRowMap.set(data.id, rowElement);
    updateProjectsCount(data.status, 1);
  }
}

function renderRow(data) {
  let row = document.createElement("tr");
  row.innerHTML
    = `<td>${data.name}</td>`
    + `<td><p title="${data.description}">${data.description}</p</td>`
    + `<td>${data.endTime}</td>`
    + `<td class="status-${data.status}">${data.status}</td>`
    + `<td><button class="del-btn" data-id =${data.id}>删除</button></td>`;
  return row;
}

function updateProjectsCount(statusType, offset) {
  counter[statusType] += offset;
  counter.ALL += offset;
  renderOverviewCards();
}

function renderOverviewCards() {
  let cards = document.querySelectorAll("#overview-cards article");
  for (let card of cards) {
    let status = card.id.substring(5);  // "card-".length = 5
    card.querySelector(".card-count").innerHTML = counter[status];
    if (status !== "ALL") {
      card.querySelector(".card-percent").innerHTML = Math.round(counter[status] / counter.ALL * 100).toString() + "%";
    }
  }
}

function handleCLick(outEvt) {
  if (outEvt.target.tagName === "BUTTON") {
    let popupBox = renderPopupBox();
    document.body.appendChild(popupBox);
    popupBox.children[0].addEventListener('click', (inEvt => {
      switch (inEvt.target.id) {
        case("close-btn"):
        case ("cancel-btn"):
          popupBox.parentElement.removeChild(popupBox);
          break;
        case ("confirm-btn"):
          deleteProject(Number(outEvt.target.getAttribute("data-id")));
          popupBox.parentElement.removeChild(popupBox);
          break;
      }
    }), false);
  }
}

function renderPopupBox() {
  let boxWithMask = document.createElement("div");
  boxWithMask.setAttribute("id", "mask");
  boxWithMask.innerHTML
    = '<div class="msg-box">'
    + '<p class="iconfont icon-guanbi" id="close-btn"></p>'
    + '<div class="hint-msg">'
    + '<p class="iconfont icon-wenhao hint-icon"></p>'
    + '<div class="hint-body">'
    + '<p class="hint-title">提示</p>'
    + '<p class="hint-text">确认删除该项目吗？</p>'
    + '</div></div>'
    + '<div id="buttons">'
    + '<button id="confirm-btn">确认</button>'
    + '<button id="cancel-btn">取消</button>'
    + '</div></div>';
  return boxWithMask
}

function deleteProject(id) {
  ajax({
    url: ROOT_URL + '/' + id.toString(),
    method: 'delete',
    success: removeEntry,
    successParams: [id],
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
