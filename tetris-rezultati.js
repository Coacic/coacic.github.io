function init() {
  let names = localStorage.getItem("names").split(" ");
  let scores = localStorage.getItem("scores").split(" ");
  for (let index = 0; index < names.length - 1; index++) {
    let elem =
      "<tr><td>" + names[index] + "</td><td>" + scores[index] + "</td></tr>";
    $(".table").append(elem);
  }
}
function clearStorage() {
  localStorage.clear();
  $(".table").find("tr:gt(0)").remove();
  // $(".table").empty();
}
function returnToTheGame() {
  location.href = "tetris-igra.html";
}

function returnToTheInstructions() {
  location.href = "tetris-uputstvo.html";
}
