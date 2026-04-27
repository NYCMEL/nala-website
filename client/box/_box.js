const items = [
  "Residential lock service",
  "Commercial hardware support",
  "Safe lockout fundamentals",
  "Automotive lock basics",
  "Key cutting and duplication",
  "Rekeying practice",
  "Tool selection guidance",
  "Customer service basics",
  "Business setup support",
  "Course progress tracking"
];

const list = document.getElementById("md-list");

items.forEach(text => {
  const li = document.createElement("li");

  const icon = document.createElement("span");
  icon.className = "checkmark";
  icon.innerHTML = "✓";

  const content = document.createElement("span");
  content.textContent = text;

  li.appendChild(icon);
  li.appendChild(content);
  list.appendChild(li);
});
