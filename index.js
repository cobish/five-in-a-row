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
    this.el.addEventListener('click', this._handleClick.bind(this));
  },

  // 销毁
  destory: function() {
    this.el.removeEventListener('click', this._handleClick.bind(this));
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

dataObj.init();
canvasObj.init();