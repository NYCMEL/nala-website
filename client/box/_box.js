const items = [
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor",
  "Incididunt ut labore",
  "Et dolore magna aliqua",
  "Ut enim ad minim veniam",
  "Quis nostrud exercitation",
  "Ullamco laboris nisi",
  "Ut aliquip ex ea commodo",
  "Consequat duis aute irure"
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
