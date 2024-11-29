// const apiUrl = "http://localhost:8080"; // Base URL of the API
const apiUrl = "https://taskmaster-demo-api.vercel.app"; // Base URL of the API

// Toggle hide and show password
const showPassword = document.querySelectorAll(".show-password");
showPassword.forEach((item) => {
  item.addEventListener("click", () => {
    const input = item.parentElement.nextElementSibling;
    const icon = item.firstElementChild;
    if (input.type === "password") {
      input.type = "text";
      icon.nextSibling.textContent = " Hide ";
    } else {
      input.type = "password";
      icon.nextSibling.textContent = " Show ";
    }
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });
});

// Handle login form submission
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // check if fields are empty space
    if (!password.trim()) {
      displayAlertMessage("password can not be empty spaces", "danger");
    } else {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      /* if (response.ok) {
        localStorage.setItem("taskmasterToken", data.token); // Store token in local storage
        displayAlertMessage("Login successful!", "success");
        window.location.href = "dashboard.html";
      } else {
        displayAlertMessage(`Login failed! ${data.error}`, "danger");
      } */
      displayAlertMessage("Login successful!", "success");
      window.location.href = "dashboard.html";
    }
  });
