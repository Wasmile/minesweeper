function Point() {
    this.isMine = false;
    this.mineAround = 0;
    this.isOpen = false;
    this.isLocked = false;
}

const game = {
    width: 10,
    height: 10,
    mineCount: 10,
    openCount: 0,
    gameOver: false,
    field: [],

    createField() {
        this.field = [];
        for (let i = 0; i < this.width; i++) {
            let tmp = [];
            for (let j = 0; j < this.height; j++) {
                tmp.push(new Point());
            }
            this.field.push(tmp);
        }
    },

    fillField(first) {
        for (let i = 0; i < this.mineCount;) {
            let x = parseInt(Math.random() * this.width - 0.005),
                y = parseInt(Math.random() * this.height - 0.005);
            if (!(this.field[x][y].isMine) && first.x !== x && first.y !== y) {
                this.field[x][y].isMine = true;
                i++;
            }
        }

    },

    mineAroundCounter(x, y) {
        var x_start = x > 0 ? x - 1 : x;
        var y_start = y > 0 ? y - 1 : y;
        var x_end = x < this.width - 1 ? x + 1 : x;
        var y_end = y < this.height - 1 ? y + 1 : y;
        let count = 0;
        for (let i = x_start; i <= x_end; i++) {
            for (let j = y_start; j <= y_end; j++) {
                if (this.field[i][j].isMine && !(x === i && y === j)) count++;
            }

        }
        this.field[x][y].mineAround = count;
    },

    startMineCounter() {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.mineAroundCounter(i, j);
            }
        }
    },

    start() {
        this.openCount = 0;
        this.gameOver = false;
        game.createField();
    },

//var page = {
    init() {
        this.gameInterface.init();
    },
    gameInterface: {
        table: null,

        init() {
            game.start();
            this.div = document.querySelector('.field');
            this.drawField();
            var self = this,
                first = {};
            this.div.addEventListener('click', function (e) {
                if (e.target.matches('td') && !(e.target.matches('.lock')) && !game.gameOver) {
                    if (game.openCount === 0) {
                        first.x = e.target.cellIndex;
                        first.y = e.target.parentNode.rowIndex;
                        game.fillField(first);
                        game.startMineCounter();
                    }
                    self.open(e);
                }
            });
            this.div.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if (e.target.matches('td') && !game.gameOver) {
                    self.lock(e);
                }
            });
        },

        drawField() {
            this.div.innerHTML = "";
            var table = document.createElement('table');
            this.table = table;
            for (let i = 0; i < game.height; i++) {
                let tr = document.createElement('tr');
                for (let j = 0; j < game.width; j++) {
                    var td = document.createElement('td');
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            this.div.appendChild(table);
        },

        open(e) {
            x = e.target.cellIndex;
            y = e.target.parentNode.rowIndex;
            if (!game.field[x][y].isLocked) {
                this.recurseOpen(x, y);
            }
        },

        boom() {
            for (let i = 0; i < game.width; i++) {
                for (let j = 0; j < game.height; j++) {
                    var td = this.table.rows[j].children[i];
                    game.field[i][j].isOpen = true;
                    td.classList.add('open');
                    td.innerHTML = game.field[i][j].mineAround;
                    game.gameOver = true;
                    if (game.field[i][j].isMine) {

                        td.classList.add('mine');
                        td.innerHTML = '';
                    }
                    if (i === this.lastPosX && j === this.lastPosY) {
                        td.classList.add('last');
                        td.innerHTML = '';
                    }
                }
            }
        },


        recurseOpen: function (x, y) {
            let td = this.table.rows[y].children[x];
            if (game.field[x][y].isOpen) {
                return true;
            }
            if (game.field[x][y].isMine) {
                this.lastPosX = x;
                this.lastPosY = y;
                this.boom();
                setTimeout(alert('GAME OVER!'), 2000);
            } else {
                td.innerHTML = game.field[x][y].mineAround;
                game.field[x][y].isOpen = true;
                td.classList.add('open');
                game.openCount++;
                if (game.width * game.height - game.mineCount === game.openCount) {
                    alert('YOU WIN');
                    //setTimeout(alert("ЭТО WIN!"), 2000);
                    game.gameOver = true;
                    //game.start();
                    //this.drawField();
                }
                if (!game.field[x][y].mineAround) {
                    var x_start = x > 0 ? x - 1 : x;
                    var y_start = y > 0 ? y - 1 : y;
                    var x_end = x < game.width - 1 ? x + 1 : x;
                    var y_end = y < game.height - 1 ? y + 1 : y;
                    for (let i = x_start; i <= x_end; i++) {
                        for (let j = y_start; j <= y_end; j++) {
                            if (!(game.field[i][j].isLocked)) {
                                this.recurseOpen(i, j);
                            }
                        }
                    }
                }
            }
        },

        lock(e) {
            x = e.target.cellIndex;
            y = e.target.parentNode.rowIndex;
            if (game.field[x][y].isOpen) {
                return;
            }
            e.target.classList.toggle('lock');
            game.field[x][y].isLocked = !game.field[x][y].isLocked;
        }
    }
};

window.onload = function () {
    game.gameOver = false;
    game.init();
};