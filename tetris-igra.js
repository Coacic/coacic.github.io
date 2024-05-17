let blockNames = {
  0: "square",
  1: "line",
  2: "lProfile",
  3: "lProfileReverse",
  4: "z",
  5: "reverseZ",
  6: "t",
};

const blocksValues = [
  "01100110",
  "11110000",
  "10001110",
  "00101110",
  "11000110",
  "01101100",
  "01001110",
];

// const centerPoints = ["", "1", "5", "5", "4", "5", 3];
let arrayOfBlocks = [];
let grid;
let username;
let fields = [];
let fieldsJQ = [];
let score = 0;
let calculate = true;

function appendToStorage(name, data) {
  var old = localStorage.getItem(name);
  if (old === null) old = "";
  localStorage.setItem(name, old + data);
}

function restartGame() {
  score = 0;
  $(".block").css("background-color", "#f0f0f0").removeClass("block");
  $(".player").css("background-color", "#f0f0f0").removeClass("player");
  $(".destroyed").css("background-color", "#f0f0f0").removeClass("destroyed");
  arrayOfBlocks.length = 0;
  username = prompt("Type in your username:");
  if (username == "") username = "Unknown_Player";
  clearInterval(gameTimeHandle);
  gameTimeHandle = setInterval(StartGame, 1000);
}

function repaintGrid() {
  $("#tetris-grid").empty();
  let rows = 20,
    cols = 10,
    iterPlayers = 0;
  let tetrisGrid = document.getElementById("tetris-grid");
  for (let i = 0; i < 20; i++) {
    let row = document.createElement("tr");
    let trAttr = "tr" + i;
    row.setAttribute("class", trAttr);
    for (let j = 0; j < 10; j++) {
      // let tdStr = ".td" + i + "_" + j;
      // $(tdStr).attr("background-color", grid[i][j].attr("background-color"));
      // console.log(grid[i][j]);
      let cell = grid[i][j];
      if ($(cell).hasClass("player")) {
        $(cell).removeClass("player").css("background-color", "#f0f0f0");
      }
      // console.log(arrayOfBlocks[iterPlayers]);
      row.append(cell[0]);
    }
    tetrisGrid.appendChild(row);
    for (let index = 0; index < arrayOfBlocks.length; index++) {
      let cell = $(
        ".td" + arrayOfBlocks[index].y + "_" + arrayOfBlocks[index].x
      );
      $(cell)
        .addClass("player")
        .css("background-color", arrayOfBlocks[iterPlayers].color);
      arrayOfBlocks[index].ref = $(cell);
    }
    // $(tdStr).replaceWith(grid[i][j]);
  }
}

function renderNextFrame() {
  // console.log(arrayOfBlocks);
  let didHitBlock = false;
  let playerBlocks = $(".player");
  let collision = ["0", "0", "0", "0"];
  for (let i = 0; i < playerBlocks.length; i++) {
    let k = getCollision(playerBlocks[i]);
    if (k[0] == "1") collision[0] = "1";
    if (k[1] == "1") collision[1] = "1";
    if (k[2] == "1") collision[2] = "1";
    if (k[3] == "1") collision[3] = "1";
  }
  if (collision[2] != "0") {
    playerBlocks.addClass("block").removeClass("player");
    arrayOfBlocks.length = 0;
  }
  // console.log(collision);
  for (let i = 19; i > 0; i--) {
    for (let j = 0; j < 10; j++) {
      // let tdStrNext = ".td" + (i + 1) + "_" + j;
      // console.log($(".player"));
      // console.log("\n");
      // if ($(tdStrNext).hasClass("blocks")) {
      //   let blocks = $(".player");
      //   blocks.addClass("blocks").removeClass("player");
      //   continue;
      // }
      let tdStr = ".td" + i + "_" + j;
      if (i == 19 && $(tdStr).hasClass("player")) {
        let blocks = $(".player");
        blocks.addClass("block").removeClass("player");
        let element = arrayOfBlocks.find((item) => {
          return item.ref[0] == $(tdStr)[0];
        });
        let index = arrayOfBlocks.indexOf(element);
        arrayOfBlocks.splice(index, 1);
        continue;
      }
      let tdStrPrev = ".td" + (i - 1) + "_" + j;
      let tdStrAfter = ".td" + (i + 1) + "_" + j;
      // //   console.log("writing from " + tdStrPrev + " to " + tdStr);
      // if ($(tdStr).hasClass("blocks")) {
      //   continue;
      // }
      console.log($(tdStr).css("background-color"));
      if (
        $(tdStr).css("background-color") != "rgb(240, 240, 240)" &&
        $(tdStrPrev).hasClass("block") &&
        $(tdStrAfter).hasClass("player")
      ) {
        $(tdStr).css("background-color", "#f0f0f0");
        console.log("ima");
      }
      if ($(tdStr).hasClass("block") || $(tdStrPrev).hasClass("block"))
        continue;
      $(tdStr).css("background-color", $(tdStrPrev).css("background-color"));
      if ($(tdStrPrev).hasClass("player")) {
        let index = findIndexOfField($(tdStr));
        let element = arrayOfBlocks.find((item) => {
          // console.log(item[ref]);
          // console.log($(tdStrPrev));
          return item.ref[0] == $(tdStrPrev)[0];
        });
        element.x = index[1];
        element.y = index[0];
        element.ref = $(tdStr);
        // console.log(element);
        $(tdStr).addClass("player");
        $(tdStrPrev).removeClass("player");
      }
    }
  }
  for (let i = 0; i < 10; i++) {
    let tdStr = ".td0" + "_" + i;
    $(tdStr).css("background-color", "#f0f0f0");
  }
  for (let i = 19; i > 0; i--) {
    for (let j = 0; j < 10; j++) {
      //for each destroyed tile, move every other one downwards
      let str = ".td" + i + "_" + j;
      // let strPrev = ".td" + i - 1 + "_" + j;
      if ($(str).hasClass("destroyed")) {
        $(str).removeClass("destroyed");
        for (let index = i; index > 0; index--) {
          let curr = ".td" + index + "_" + j;
          let prev = ".td" + (index - 1) + "_" + j;
          if (!$(prev).hasClass("player")) {
            $(curr).css("background-color", $(prev).css("background-color"));
            if ($(prev).hasClass("block")) {
              $(curr).addClass("block");
              $(prev).removeClass("block");
            }
            if ($(prev).hasClass("destroyed")) {
              $(curr).addClass("destroyed");
              $(prev).removeClass("destroyed");
            }
          } else {
            $(curr).css("background-color", "#f0f0f0").removeClass("block");
            break;
          }
        }
        // $(str)
        //   .addClass("block")
        //   .removeClass("destroyed")
        // .css("background-color", $(strPrev).css("background-color"));
        // $(strPrev).addClass("move");
      }
    }
  }
  //Original destroy
  // for (let i = 19; i > 0; i--) {
  //   for (let j = 0; j < 10; j++) {
  //     //for each destroyed tile, move every other one downwards
  //     let str = ".td" + i + "_" + j;
  //     // let strPrev = ".td" + i - 1 + "_" + j;
  //     if ($(str).hasClass("destroyed")) {
  //       for (let index = i; index > 0; index--) {
  //         let curr = ".td" + index + "_" + j;
  //         let prev = ".td" + (index - 1) + "_" + j;
  //         if ($(curr).hasClass("destroyed") && $(prev).hasClass("block")) {
  //           $(curr)
  //             .removeClass("destroyed")
  //             .css("background-color", $(prev).css("background-color"));
  //         } else if ($(curr).hasClass("block") && $(prev).hasClass("block")) {
  //           $(curr).css("background-color", $(prev).css("background-color"));
  //         } else if ($(curr).hasClass("block") && !$(prev).hasClass("block")) {
  //           $(curr).css("background-color", "#f0f0f0").removeClass("block");
  //           break;
  //         } else if (!$(curr).hasClass("block")) {
  //           $(curr).removeClass("destroyed");
  //           break;
  //         }
  //       }
  //       // $(str)
  //       //   .addClass("block")
  //       //   .removeClass("destroyed")
  //       // .css("background-color", $(strPrev).css("background-color"));
  //       // $(strPrev).addClass("move");
  //     }
  //   }
  // }

  //Block logic for destruction
  let arrayOfSelectedBlocks = $(".block:not(.destroyed)");
  // console.log(arrayOfSelectedBlocks);
  arrayOfSelectedBlocks.sort((a, b) => {
    return $(a).attr("class").split(" ") < $(b).attr("class").split(" ");
  });
  let numOfElementsInEachCol = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  if (arrayOfSelectedBlocks.length > 9) {
    for (let i = 0; i < arrayOfSelectedBlocks.length; i++) {
      const element = arrayOfSelectedBlocks[i];
      let str = $(element).attr("class").split(" ")[0];
      str = str.split("d")[1];
      str = str.split("_")[0];
      numOfElementsInEachCol[str]++;
    }
  }
  let factor = 0;
  for (let i = 0; i < numOfElementsInEachCol.length; i++) {
    if (numOfElementsInEachCol[i] > 9) factor++;
  }
  let newScore = 0;
  for (let i = 0; i < numOfElementsInEachCol.length; i++) {
    const element = numOfElementsInEachCol[i];
    if (element > 9) {
      for (let j = 0; j < 10; j++) {
        let str = ".td" + i + "_" + j;
        blck = $(str);
        $(blck)
          .css("background-color", "red")
          .addClass("destroyed")
          .removeClass("block");
      }
      numOfElementsInEachCol[i] = 0;
    }
  }
  if (calculate) {
    addScoreValue = 100 * factor;
    for (let index = 0; index < factor; index++) {
      newScore += addScoreValue;
    }
    score += newScore;
    $(".score").text("Score: " + score);
    console.log(
      "faktor je " +
        factor +
        " newscore je " +
        newScore +
        "Krajnji score " +
        score
    );
    // newScore = +100;
    clearInterval(gameTimeHandle);
    gameTimeHandle = setInterval(StartGame, 1000 - (100 + score / 15));
    // let str = $(element).attr("class").split(" ")[0];
    // str = str.split("d")[1];
    // str = str.split("_")[0];
    // numOfElementsInEachCol[str]++;
  }
  if ($(".destroyed").length == 0) calculate = true;
  else calculate = false;
  // return factor;
  // console.log(arrayOfBlocks);
}

function findIndexOfField(item) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // console.log($(grid[i][j]).attr("class").split(" ")[0]);
      // console.log($(item).attr("class").split(" ")[0]);
      let classGrid = $(grid[i][j]).attr("class");
      if (classGrid) {
        classGrid = classGrid.split(" ")[0];
      } else {
        // console.log("class grid" + classGrid);
      }
      let itemGrid = $(item).attr("class");
      if (itemGrid) {
        itemGrid = itemGrid.split(" ")[0];
      } else {
        // console.log("item grid " + item);
      }
      if (classGrid == itemGrid) {
        return [i, j];
      }
    }
  }
  return false;
}

function getCollision(field) {
  let str = ["0", "0", "0", "0"];
  let hasRef = field.hasOwnProperty("ref");
  let indexOfField = [];
  if (hasRef) {
    indexOfField = [field.y, field.x];
  } else {
    indexOfField = findIndexOfField(field);
  }
  if (indexOfField == false) return -1;
  let topField = [indexOfField[0] - 1, indexOfField[1]];
  let rightField = [indexOfField[0], indexOfField[1] + 1];
  let bottomField = [indexOfField[0] + 1, indexOfField[1]];
  let leftField = [indexOfField[0], indexOfField[1] - 1];

  if (
    (topField[0] > 0 &&
      topField[0] < 20 &&
      topField[1] > 0 &&
      topField[1] < 10 &&
      $(grid[topField[0]][topField[1]]).hasClass("block")) ||
    topField[0] < 0
  )
    str[0] = "1";
  if (
    (rightField[0] > 0 &&
      rightField[0] < 20 &&
      rightField[1] > 0 &&
      rightField[1] < 10 &&
      $(grid[rightField[0]][rightField[1]]).hasClass("block")) ||
    rightField[1] > 9
  )
    str[1] = "1";
  if (
    (bottomField[0] > 0 &&
      bottomField[1] > -1 &&
      bottomField[1] < 10 &&
      bottomField[0] < 20 &&
      $(grid[bottomField[0]][bottomField[1]]).hasClass("block")) ||
    bottomField[0] > 19
  )
    str[2] = "1";
  if (
    (leftField[0] > 0 &&
      leftField[0] < 20 &&
      leftField[1] > 0 &&
      leftField[1] < 10 &&
      $(grid[leftField[0]][leftField[1]]).hasClass("block")) ||
    leftField[1] < 0
  )
    str[3] = "1";
  // if (indexOfField[0] == 19) {
  //   str[2] = "1";
  // }
  return str;
}

function moveLeft() {
  let playerFields = $(".player");
  // for (let index = 0; index < playerFields.length; index++) {
  //   coordArr.push(findIndexOfField(playerFields[index]));
  // }
  // coordArr.sort((a, b) => {
  //   return a[0] - b[0];
  // });
  for (let index = 0; index < playerFields.length; index++) {
    let collision = getCollision(playerFields[index]);
    if (collision[3] == "1") return -1;
  }
  for (let index = 0; index < playerFields.length; index++) {
    let cord = findIndexOfField(playerFields[index]);
    let collision = getCollision(playerFields[index]);
    // console.log(cord);
    // console.log(playerFields[index]);
    let tmp;
    if (collision[3] == "0" && cord[1] - 1 >= 0) {
      // grid[cord[0]][cord[1] - 1] = $(grid[cord[0]][cord[1]]);
      let element = arrayOfBlocks.find((item) => {
        return item.ref[0] == $(playerFields[index])[0];
      });
      element.y = cord[0];
      element.x = cord[1] - 1;
      element.ref = $(grid[cord[0]][cord[1] - 1]);
      $(grid[cord[0]][cord[1] - 1]).addClass("player");
      $(grid[cord[0]][cord[1] - 1]).css(
        "background-color",
        grid[cord[0]][cord[1]].css("background-color")
      );
      // console.log(grid[cord[0]][cord[1]].css("background-color"));
      grid[cord[0]][cord[1]].css("background-color", "#f0f0f0");
      grid[cord[0]][cord[1]].removeClass("player");
      // tmp = $(grid[cord[0]][cord[1] - 1]);
      // grid[cord[0]][cord[1]] = $(tmp);
    }
    // console.log($(grid[cord[0]][cord[1]]).css("background-color"));
    // console.log($(grid[cord[0]][cord[1] - 1]).css("background-color"));
    // console.log($(tmp).css("background-color"));
    let cssField = $(playerFields[index]).css("background-color");
    // repaintGrid();
    // console.log(cssField);
    // const element = playerFields[0];
    // console.log(cord);
  }
  // checkLeft();
}

function moveRight() {
  let playerFields = $(".player");
  // let coordArr = [];
  // for (let index = 0; index < playerFields.length; index++) {
  //   coordArr.push(findIndexOfField(playerFields[index]));
  // }
  playerFields.sort((a, b) => {
    return findIndexOfField(b)[1] - findIndexOfField(a)[1];
  });

  // coordArr.sort((a, b) => {
  //   return b[1] - a[1];
  // });
  // console.log(coordArr);
  for (let index = 0; index < playerFields.length; index++) {
    let collision = getCollision(playerFields[index]);
    if (collision[1] == "1") return -1;
  }
  for (let index = 0; index < playerFields.length; index++) {
    let cord = findIndexOfField(playerFields[index]);
    let collision = getCollision(playerFields[index]);
    let tmp;
    let element = arrayOfBlocks.find((item) => {
      return item.ref[0] == $(playerFields[index])[0];
    });
    element.y = cord[0];
    element.x = cord[1] + 1;
    element.ref = $(grid[cord[0]][cord[1] + 1]);
    // console.log(element);
    $(grid[cord[0]][cord[1] + 1]).addClass("player");
    $(grid[cord[0]][cord[1] + 1]).css(
      "background-color",
      grid[cord[0]][cord[1]].css("background-color")
    );
    // console.log(grid[cord[0]][cord[1]].css("background-color"));
    grid[cord[0]][cord[1]].css("background-color", "#f0f0f0");
    grid[cord[0]][cord[1]].removeClass("player");
  }
  // let cssField = $(playerFields[index]).css("background-color");
  // }
  // console.log(arrayOfBlocks);
}

function dropDown() {
  while ($(".player").length != 0) renderNextFrame();
}

function moveDown() {
  renderNextFrame();
}

function rotateTile(originPos, block) {
  let currentCoordinates = [block.y, block.x];
  let relativePos = [
    currentCoordinates[0] - originPos.y,
    currentCoordinates[1] - originPos.x,
  ];
  let rotMatrix = [
    [0, -1],
    [1, 0],
  ];
  let newYPos =
    rotMatrix[0][0] * relativePos[0] + rotMatrix[0][1] * relativePos[1];
  let newXPos =
    rotMatrix[1][0] * relativePos[0] + rotMatrix[1][1] * relativePos[1];
  let newPos = [newYPos, newXPos];
  newPos[0] += originPos.y;
  newPos[1] += originPos.x;
  const newBlock = {
    x: newPos[1],
    y: newPos[0],
    color: block.color,
    ref: $(".td" + block.y + "_" + block.x),
    type: block.type,
    isCenterBlock: block.isCenterBlock,
  };
  return newBlock;
}

function checkCollision(block) {
  if (
    $(".td" + block.y + "_" + block.x).hasClass("block") ||
    $(".td" + block.y + "_" + block.x).hasClass("destroyed") ||
    block.x < 0 ||
    block.x > 9 ||
    block.y < 0 ||
    block.y > 19
  ) {
    return true;
  }
  return false;
}

function rotateBlock(block) {
  let coordinates = [];
  let rotatedCoords = [];
  let maxRow = 1,
    maxCol = 1,
    minRow = 20,
    minCol = 10;
  for (let index = 0; index < arrayOfBlocks.length; index++)
    coordinates.push([arrayOfBlocks[index].x, arrayOfBlocks[index].y]);

  // console.log(coordinates);
  // const blockMatrixBinary = createGrid(coordinates, 20, 10);
  let element = blocksValues.find((item) => {
    return item == arrayOfBlocks[0].type;
  });
  let index = blocksValues.findIndex((item) => {
    return item == element;
  });
  let name = blockNames[index];
  if (name === "square") return;
  else if (name === "line") {
    // let centerOfRotation = centerPoints[1];
    // let centerBlock = arrayOfBlocks[centerOfRotation];
    // console.log(centerBlock);
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[2], arrayOfBlocks[index]));
  } else if (name === "lProfile") {
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[2], arrayOfBlocks[index]));
  } else if (name === "lProfileReverse") {
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[2], arrayOfBlocks[index]));
  } else if (name === "z") {
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[2], arrayOfBlocks[index]));
  } else if (name === "reverseZ") {
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[3], arrayOfBlocks[index]));
  } else {
    for (let index = 0; index < arrayOfBlocks.length; index++)
      rotatedCoords.push(rotateTile(arrayOfBlocks[2], arrayOfBlocks[index]));
    // let centerOfRotation = centerPoints[6];
    // let centerBlock;
    // for (let m = 0; m < arrayOfBlocks.length; m++) {
    //   const block = arrayOfBlocks[m];
    //   if (block.isCenterBlock == true) {
    //     centerBlock = block;
    //     break;
    //   }
    // }
    // Example usage:
    // const blx = [
    //   [1, 1, 1], // Example block
    //   [0, 0, 1],
    // ];
    // console.log(kekw(blx));
    // let res = rotateBlockInGrid(
    //   blockMatrixBinary,
    //   centerBlock,
    //   centerBlock.y,
    //   centerBlock.x
    // );
    // console.log(res);
  }
  // let collision = ["0", "0", "0", "0"];
  for (let index = 0; index < rotatedCoords.length; index++) {
    let res = checkCollision(rotatedCoords[index]);
    if (res == true) return;
    // if (res[0] == "1") collision[0] = "1";
    // if (res[1] == "1") collision[1] = "1";
    // if (res[2] == "1") collision[2] = "1";
    // if (res[3] == "1") collision[3] = "1";
  }
  // if (
  //   collision[0] == "1" ||
  //   collision[1] == "1" ||
  //   collision[2] == "1" ||
  //   collision[3] == "1"
  // )
  // return;
  for (let index = 0; index < arrayOfBlocks.length; index++)
    arrayOfBlocks[index] = rotatedCoords[index];
  repaintGrid();
  // 0: "square",
  // 1: "line",
  // 2: "lProfile",
  // 3: "lProfileReverse",
  // 4: "z",
  // 5: "reverseZ",
  // 6: "t",
}

function startRender(block) {
  let i = 0,
    counterForCenter = 0;
  arrayOfBlocks.length = 0;
  let randomColor = "f";
  while (randomColor[0] == "f" || randomColor == "f0f0f0")
    randomColor = (Math.random() * 0xfffff * 1000000).toString(16);
  randomColor = "#" + randomColor.slice(0, 6);
  for (let j = 0; j < fieldsJQ.length; j++) {
    const element = fieldsJQ[j];
    if (element.hasClass("block")) return 1;

    if (block[i] == "1") {
      counterForCenter++;
      element.css("background-color", randomColor);
      element.addClass("player");
      const b = {
        x: findIndexOfField(fieldsJQ[j])[1],
        y: findIndexOfField(fieldsJQ[j])[0],
        color: randomColor,
        ref: fieldsJQ[j],
        type: block,
      };
      arrayOfBlocks.push(b);
    } else {
      element.css("background-color", "#f0f0f0");
    }
    if (j == 4 && randomColor == "#f0f0f0") {
      console.log("Jeste");
    }
    // console.log(element.css("background-color"));
    i++;
  }
  // console.log(block);
}

function spawnNextBlock() {
  let num = Math.floor(Math.random() * 10) % 7;
  // console.log(num);
  let res = startRender(blocksValues[num]);
  if (res == 1) return 1;
}

function StartGame() {
  let players = $(".player");
  renderNextFrame();
  if (players.length == 0) {
    let res = spawnNextBlock();
    if (res == 1) {
      // alert("Kraj igre");
      appendToStorage("names", username + " ");
      appendToStorage("scores", score + " ");
      location.href = "tetris-rezultati.html";
    }
  }
}

function init() {
  $(document).ready(() => {
    $(".score").text("Score: " + score);
    state = "playing";
    started = true;
    let rows = 20;
    let cols = 10;
    let gameTimeHandle;
    grid = new Array(20);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = new Array(10);
    }
    let tetrisGrid = document.getElementById("tetris-grid");
    for (let i = 0; i < rows; i++) {
      let row = document.createElement("tr");
      let trAttr = "tr" + i;
      row.setAttribute("class", trAttr);
      for (let j = 0; j < cols; j++) {
        let cell = document.createElement("td");
        let tdAttr = "td" + i + "_" + j;
        cell.setAttribute("class", tdAttr);
        grid[i][j] = $(cell);
        row.appendChild(cell);
      }
      tetrisGrid.appendChild(row);
    }
    addEventListener("keypress", (event) => {
      if (event.key == " ") {
        dropDown();
      }
      if (event.key == "r") {
        restartGame();
      }
    });

    addEventListener("keydown", (event) => {
      if (event.key == "ArrowLeft") {
        moveLeft();
      }
      if (event.key == "ArrowRight") {
        moveRight();
      }
      if (event.key == "ArrowDown") {
        moveDown();
      }
      if (event.key == "ArrowUp") {
        rotateBlock();
      }
    });

    fieldsJQ = [
      $(".td0_3"),
      $(".td0_4"),
      $(".td0_5"),
      $(".td0_6"),
      $(".td1_3"),
      $(".td1_4"),
      $(".td1_5"),
      $(".td1_6"),
    ];
  });
  username = prompt("Type in your username:");
  if (username == "") username = "Unknown_Player";
  gameTimeHandle = setInterval(StartGame, 1000);
}
