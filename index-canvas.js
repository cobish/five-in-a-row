var canvas, context;

var isWhite = false;

var step = 15 * 15;

// 存储棋盘落子信息
var chessData = new Array(15);
for (var x = 0; x < 15; x++) {
  chessData[x] = new Array(15);
  for (var y = 0; y < 15; y++) {
    chessData[x][y] = 0;
  }
}

drawBoard();

/**
 * 画棋盘
 */
function drawBoard() {
  canvas = document.getElementById('checkerboard');
  context = canvas.getContext('2d');

  // 背景
  context.fillStyle = '#FFA500';
  context.fillRect(0, 0, 1024, 768);
  
  //棋盘纵横线
  context.fillStyle = '#00f';
  for (var i = 1; i < 16; i++) {
    context.beginPath();
    context.moveTo(40 * i + 140, 80);
    context.lineTo(40 * i + 140, 640);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.moveTo(180, 40 * i + 40);
    context.lineTo(740, 40 * i + 40);
    context.closePath();
    context.stroke();
  }
}

// 点击下棋
function play(e) {
  var e = e || event;
  var px = e.clientX - 160;
  var py = e.clientY - 60;
  var x = parseInt(px / 40);
  var y = parseInt(py / 40);

  if (px < 0 || py < 0 || x > 14 || y > 14 || chessData[x][y] !== 0) {
    debugger;
    return;
  }

  doCheck(x, y);
}

/**
 * 画棋子
 */
function doCheck(x, y) {
  var color;

  if (isWhite) {
    color = '#fff';
    chessData[x][y] = 1;
  } else {
    color = '#000';
    chessData[x][y] = 2;
  }

  isWhite = !isWhite;
  drawCheck(x, y, color);
}

/**
 * 画棋子
 */
function drawCheck(x, y, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x * 40 + 180, y * 40 + 80, 15, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}