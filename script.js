const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("dropdownMenu");

menuBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  menu.classList.toggle("show");
});

/* cerrar si haces clic fuera */
document.addEventListener("click", function () {
  menu.classList.remove("show");
});