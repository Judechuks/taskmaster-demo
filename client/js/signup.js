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

// Handle registration form submission
document
  .getElementById("register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstname = document.getElementById("first-name").value;
    const lastname = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    // check if fields are empty space
    if (!firstname.trim() || !lastname.trim()) {
      displayAlertMessage("You have to enter your names", "danger");
    } else if (!password.trim()) {
      displayAlertMessage("password can not be empty spaces", "danger");
    } else if (password !== confirmPassword) {
      displayAlertMessage("Both passwords do not match", "danger");
    } else {
      // sending signup request to API
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // displayAlertMessage("Registration successful!", "success");
        displayAlertMessage(`${data.message}`, "success");
        window.location.href = "login.html";
      } else if (response.status === 400) {
        // displayAlertMessage(`Email already exists.`, "danger");
        displayAlertMessage(`${data.error}`, "danger");
      } else {
        displayAlertMessage(
          `Opps! Registration failed: ${data.error}`,
          "danger"
        );
      }
    }
  });
