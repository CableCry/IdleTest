// Create gameData object

var gameData = {
  action: {
    click: 1
  },
  money: {
    total: 0,
    perSecond: 0
  }
};

const updateSpeed = 20;



function addMoney() {
  gameData.money.total += gameData.action.click;
};


function updateText() {
    document.getElementById("moneyTotal").innerHTML = gameData.money.total; 
};

function update() {
  updateText();
};


setInterval(update, 1000 / updateSpeed)