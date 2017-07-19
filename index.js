// 数据对象
var dataObj = {
  // 格子个数
  size: 15,

  // 设置是否该轮到白棋
  isWhite: false,

  // 存储落子信息，0 即此处没有棋子，1 为白棋，2 为黑棋
  chessData: [],

  // 赢家
  winner: '',

  // 总步数
  step: 0,

  // 初始化
  init: function() {
    var size = this.size;
    var chessData = new Array(size);
    for (var i = 0; i < size; i++) {
      chessData[i] = new Array(size);
      for (var j = 0; j < size; j++) {
        chessData[i][j] = 0;
      }
    }
    this.chessData = chessData;
    this.step = size * size;
  },

  // 检查是否有一方胜利了
  checkWinner: function(x, y, cb) {
    // 默认黑色
    var temp = 2;

    if (this.isWhite) {
      temp = 1;
    }

    if (this._lrCount(x, y, temp, cb)) return;
    if (this._tbCount(x, y, temp, cb)) return;
    if (this._rtCount(x, y, temp, cb)) return;
    if (this._rbCount(x, y, temp, cb)) return;
  },

  // 左右计算
  _lrCount: function(x, y, temp, cb) {
    var count = 0;
    var chessData = this.chessData;
    var line = new Array(4);

    // 向左计算
    for (var i = x; i >= 0; i--) {
      if (chessData[i][y] !== temp) {
        break;
      }

      count += 1;
      line[0] = i;
      line[1] = y;
    }

    // 向右计算
    for (var j = x; j < 15; j++) {
      if (chessData[j][y] !== temp) {
        break;
      }

      count += 1;
      line[2] = j;
      line[3] = y;
    }

    if (count - 1 === 5) {
      this._success(line, temp, cb);
      return true;
    } else {
      return false;
    }
  },

  _tbCount: function(x, y, temp, cb) {
    var count = 0;
    var chessData = this.chessData;
    var line = new Array(4);

    // 向上计算
    for (var i = y; i >= 0; i--) {
      if (chessData[x][i] !== temp) {
        break;
      }

      count += 1;
      line[0] = x;
      line[1] = i;
    }

    // 向下计算
    for (var j = y; j < 15; j++) {
      if (chessData[x][j] !== temp) {
        break;
      }

      count += 1;
      line[2] = x;
      line[3] = j
    }

    if (count - 1 === 5) {
      this._success(line, temp, cb);
      return true;
    } else {
      return false;
    }
  },

  // 右斜上
  _rtCount: function(x, y, temp, cb) {
    var count = 0;
    var chessData = this.chessData;
    var line = new Array(4);

    for (var i = x, j = y; i < 15 && j >= 0;) {
      if (chessData[i][j] !== temp) {
        break;
      }

      count += 1;
      line[0] = i;
      line[1] = j;
      i += 1;
      j -= 1;
    }

    for (var i = x, j = y; i >= 0 && j < 15;) {
      if (chessData[i][j] !== temp) {
        break;
      }

      count += 1;
      line[2] = i;
      line[3] = j;
      i -= 1;
      j += 1;
    }

    if (count - 1 === 5) {
      this._success(line, temp, cb);
      return true;
    } else {
      return false;
    }
  },

  // 右斜下
  _rbCount: function(x, y, temp, cb) {
    var count = 0;
    var chessData = this.chessData;
    var line = new Array(4);

    for (var i = x, j = y; i < 15 && j < 15;) {
      if (chessData[i][j] !== temp) {
        break;
      }

      count += 1;
      line[0] = i;
      line[1] = j;
      i += 1;
      j += 1;
    }

    for (var i = x, j = y; i >= 0 && j >= 0;) {
      if (chessData[i][j] !== temp) {
        break;
      }

      count += 1;
      line[2] = i;
      line[3] = j;
      i -= 1;
      j -= 1;
    }

    if (count - 1 === 5) {
      this._success(line, temp, cb);
      return true;
    } else {
      return false;
    }
  },

  // 有一方胜利
  _success: function(line, temp, cb) {
    var winner = '黑棋胜利';

    if (temp === 1) {
      winner = '白棋胜利';
    }

    alert(winner);
    this.winner = winner;
    if (typeof cb === 'function') {
      cb(line);
    }

    document.getElementById('switch').disabled = true;
  }
};

// canvas 版本对象
var canvasObj = {
  el: document.getElementById('checkerboard'),

  // 画笔
  context: null,

  // 棋盘大小
  width: 450,

  // 棋盘间距
  padding: 15,

  // 格子大小
  rectWidth: 30,

  // 格子个数
  rectSize: dataObj.size,

  // 初始
  init: function() {
    this.context = this.el.getContext('2d');
    this._drawBoard();
    this._initData();
    this.el.onclick = this._handleClick.bind(this);
    this.el.style.display = 'block';
  },

  // 销毁
  destory: function() {
    this.context.clearRect(0, 0, this.width, this.width);
    this.context = null;
    this.el.onclick = null;
    this.el.style.display = 'none';
  },

  // 初始化数据
  _initData: function() {
   for (var i = 0; i < this.rectSize; i++) {
      for (var j = 0; j < this.rectSize; j++) {
        var data = dataObj.chessData[i][j];

        if (data === 1) {
          dataObj.isWhite = true;
          this._downCheck(i, j);
        } else if (data === 2) {
          dataObj.isWhite = false;
          this._downCheck(i, j);
        }
      }
    }
  },

  // 绑定点击事件
  _handleClick: function(e) {
    var e = e || event;
    var rectWidth = this.rectWidth;

    var px = e.offsetX;
    var py = e.offsetY;
    var x = Math.floor(px / rectWidth);
    var y = Math.floor(py / rectWidth);

    if (dataObj.chessData[x][y] !== 0) {
      return;
    }

    this._downCheck(x, y);
  },

  // 画棋盘
  _drawBoard: function() {
    var context = this.context;
    var width = this.width;
    var padding = this.padding;
    var rectWidth = this.rectWidth;

    context.strokeStyle = '#bfbfbf';

    for (var i = 0; i < this.rectSize; i++) {
      context.beginPath();
      context.moveTo(rectWidth * i + padding, padding);
      context.lineTo(rectWidth * i + padding, width - padding);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.moveTo(padding, rectWidth * i + padding);
      context.lineTo(width - padding, rectWidth * i + padding);
      context.closePath();
      context.stroke();
    }
  },

  // 画棋子
  _drawCheck: function(x, y) {
    var context = this.context;
    var color = '#0a0a0a';

    if (dataObj.isWhite) {
      color = '#d1d1d1';
    }

    context.fillStyle = color;
    context.beginPath();
    context.arc(x * 30 + 15, y * 30 + 15, 12, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
  },

  // 画赢的线
  _drawSuccessLine: function(line) {
    var context = this.context;
    var rectWidth = this.rectWidth;
    var padding = this.padding;

    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = 'red';
    context.moveTo(rectWidth * line[0] + padding, rectWidth * line[1] + padding);
    context.lineTo(rectWidth * line[2] + padding, rectWidth * line[3] + padding);
    context.closePath();
    context.stroke();
  },

  // 下棋
  _downCheck: function(x, y) {
    if (dataObj.winner) {
      alert(dataObj.winner);
      return;
    }

    if (dataObj.isWhite) {
      dataObj.chessData[x][y] = 1;
    } else {
      dataObj.chessData[x][y] = 2;
    }

    this._drawCheck(x, y);
    dataObj.checkWinner(x, y, this._drawSuccessLine.bind(this));

    dataObj.isWhite = !dataObj.isWhite;
    dataObj.step -= 1;
    if (dataObj.step === 0) {
      dataObj.winner = '和局';
      alert(dataObj.winner);
    }
  }
};

// dom 版本对象
var domObj = {
  el: document.getElementById('domBoard'),

  // 棋盘大小
  width: 450,

  // 棋盘间距
  padding: 15,

  // 格子大小
  rectWidth: 30,

  // 格子个数
  rectSize: dataObj.size,

  // 初始化
  init: function() {
    this._drawBoard();
    this._drawGhostCheck();
    this._initData();
    this.el.style.display = 'block';
  },

  // 销毁
  destory: function() {
    this.el.innerHTML = '';
    this.el.style.display = 'none';
  },

   // 初始化数据
  _initData: function() {
   for (var i = 0; i < this.rectSize; i++) {
      for (var j = 0; j < this.rectSize; j++) {
        var data = dataObj.chessData[i][j];

        if (data === 1) {
          dataObj.isWhite = true;
          this._downCheck(j, i);
        } else if (data === 2) {
          dataObj.isWhite = false;
          this._downCheck(j, i);
        }
      }
    }
  },

  // 画棋盘
  _drawBoard: function() {
    var table = document.createElement('table');
    table.style.marginTop = this.padding + 'px';
    table.style.marginLeft = this.padding + 'px';

    for (var i = 0; i < this.rectSize - 1; i++) {
      var tr = document.createElement('tr');

      for (var j = 0; j < this.rectSize - 1; j++) {
        var td = document.createElement('td');
        td.width = this.rectWidth;
        td.height = this.rectWidth;
        td.style.border = '2px solid #bfbfbf';
        td.style.boxSizing = 'border-box';
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    this.el.appendChild(table);
  },

  // 画出隐形的棋子
  _drawGhostCheck: function() {
    var self = this;
    var table = document.createElement('table');
    table.style.position = 'absolute';
    table.style.top = 0;
    table.style.left = 0;

    for (var i = 0; i < this.rectSize; i++) {
      var tr = document.createElement('tr');

      for (var j = 0; j < this.rectSize; j++) {
        var td = document.createElement('td');
        td.style.position = 'relative';
        td.width = this.rectWidth;
        td.height = this.rectWidth;
        td.style.boxSizing = 'border-box';

        var div = document.createElement('div');
        div.id = j + '-' + i;
        div.style.position = 'absolute';
        div.style.margin = 'auto';
        div.style.top = 0;
        div.style.left = 0;
        div.style.bottom = 0;
        div.style.right = 0;
        div.style.width = '24px';
        div.style.height= '24px';
        div.style,
        div.style.borderRadius = '50%';

        td.appendChild(div);
        tr.appendChild(td);

        // 绑定点击事件
        (function(i, j) {
          td.addEventListener('click', function() {
            self._handleClick(i, j);
          });
        })(i, j);
      }

      table.appendChild(tr);
    }

    this.el.appendChild(table);
  },

  // 画棋子
  _drawCheck: function(x, y) {
    var color = '#0a0a0a';

    if (dataObj.isWhite) {
      color = '#d1d1d1';
    }

    var id = y + '-' + x;
    document.getElementById(id).style.background = color;
  },

  // 画赢的线
  _drawSuccessLine: function(line) {
    var x1 = line[0];
    var y1 = line[1];
    var x2 = line[2];
    var y2 = line[3];

    var color = 'red';
    document.getElementById(x1 + '-' + y1).style.background = color;
    document.getElementById(x2 + '-' + y2).style.background = color;
  },

  // 绑定点击事件
  _handleClick(x, y) {
    if (dataObj.chessData[y][x] !== 0) {
      return;
    }

    this._downCheck(x, y);
  },

  // 下棋
  _downCheck: function(x, y) {
    if (dataObj.winner) {
      alert(dataObj.winner);
      return;
    }

    if (dataObj.isWhite) {
      dataObj.chessData[y][x] = 1;
    } else {
      dataObj.chessData[y][x] = 2;
    }

    this._drawCheck(x, y);
    dataObj.checkWinner(y, x, this._drawSuccessLine.bind(this));

    dataObj.isWhite = !dataObj.isWhite;
    dataObj.step -= 1;
    if (dataObj.step === 0) {
      dataObj.winner = '和局';
      alert(dataObj.winner);
    }
  }
};

dataObj.init();
canvasObj.init();

document.getElementById('switch').addEventListener('change', function() {
  var index = this.selectedIndex;
  var value = parseInt(this.options[index].value);

  if (value === 1) {
    // canvas
    domObj.destory();
    canvasObj.init();
  } else {
    // dom
    canvasObj.destory();
    domObj.init();
  }
});