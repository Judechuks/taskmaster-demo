// alert message
const alertContainer = document.querySelector(".alert-container");
const alertText = document.querySelector(".alert-container .text");
function displayAlertMessage(msg, action) {
  alertText.textContent = msg;
  alertContainer.classList.add(`alert-${action}`);

  // remove alert message
  setTimeout(function () {
    alertContainer.classList.remove(`alert-${action}`);
  }, 2000);
  setTimeout(function () {
    alertText.textContent = ""; // remove the content afterwards
  }, 2500);
}
