// Following MVC Model -> View -> Controller 


// Model
const gameModel = {
  data: {
    action: {
      click: 0.01
    },
    money: {
      total: 0,
      perSecond: 0
    }
  },
  addMoney() {
    let tempVal = this.data.money.total;
    this.data.money.total = parseFloat((this.data.money.total + this.data.action.click).toFixed(2));
    this.moneyPerSecond(tempVal);
  },
  moneyPerSecond(tempVal) {
    if (this.data.money.total - tempVal > 0) {
      this.data.money.perSecond = parseFloat(((this.data.money.total - tempVal) * 50).toFixed(2));
    } else {
      this.data.money.perSecond = 0;
    }
  },
  // Future logic
};



// View 
const gameView = {
  updateMoneyDisplay() {
    document.getElementById("moneyTotal").innerHTML = gameModel.data.money.total;
    document.getElementById("moneyPerSecond").innerHTML = gameModel.data.money.perSecond;
  },
  // Future logic
};



// Controller
const gameController = {
  init() {
    this.setupEventListeners();
    this.startGameLoop();
  },
  setupEventListeners() { 
    document.getElementById("clickMe").addEventListener("click", () => {
      gameModel.addMoney();
      gameView.updateMoneyDisplay();
    })
  },
  startGameLoop() {
    setInterval(() => {
      gameView.updateMoneyDisplay();
    }, 1000 / 20)
  }
  // Future logic
};

gameController.init();
// console.log('Game initialized');