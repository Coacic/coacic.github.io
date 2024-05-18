const text = ["Lako", "Srednje", "Tesko"];
let index = 1;
function returnToTheGame() {
  let clickedBoxes = [];
  let clickedBoxesNums = [];
  $("input:checkbox[name=blockSelect]:checked").each(function () {
    clickedBoxes.push($(this).val());
  });
  for (let i = 0; i < clickedBoxes.length; i++) {
    clickedBoxesNums.push(clickedBoxes[i].split("k")[1] - 1);
  }
  console.log(clickedBoxesNums);
  localStorage.setItem("clickedBoxes", clickedBoxesNums);
  localStorage.setItem("tezina", text[index]);
  console.log(localStorage.getItem("clickedBoxes"));
  location.href = "tetris-igra.html";
}

function returnToTheResults() {
  location.href = "tetris-rezultati.html";
}

function drawText(index) {
  $("h3").text("Tezina: " + text[index]);
}

function init() {
  $("#tezina").on("input", function () {
    index = $(this).val();
    drawText(index);
  });
}
