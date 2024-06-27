// Model
const gameModel = {
  data: {
    action: {
      click: 0.01
    },
    money: {
      total: 0,
      perSecond: 0
    },
    neuralNetwork: {
      layers: [6, 6, 6], 
      maxNeuronsToShow: 5
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
  addNeuron(layerIndex) {
    if (layerIndex >= 0 && layerIndex < this.data.neuralNetwork.layers.length) {
      this.data.neuralNetwork.layers[layerIndex]++;
    }
  },
  removeNeuron(layerIndex) {
    if (layerIndex >= 0 && layerIndex < this.data.neuralNetwork.layers.length && this.data.neuralNetwork.layers[layerIndex] > 1) {
      this.data.neuralNetwork.layers[layerIndex]--;
    }
  }
};





// View 
const gameView = {
  updateMoneyDisplay() {
    document.getElementById("moneyTotal").innerHTML = gameModel.data.money.total;
    document.getElementById("moneyPerSecond").innerHTML = gameModel.data.money.perSecond;
  },
  renderNetwork() {
    const network = document.getElementById('neural-network');
    network.innerHTML = '';
    gameModel.data.neuralNetwork.layers.forEach((neuronCount) => {
      const layer = document.createElement('div');
      layer.className = 'layer';

      const neurons = document.createElement('div');
      neurons.className = 'neurons';
      for (let i = 0; i < Math.min(neuronCount, gameModel.data.neuralNetwork.maxNeuronsToShow); i++) {
        const neuron = document.createElement('div');
        neuron.className = 'neuron';
        neurons.appendChild(neuron);
      }
      if (neuronCount > gameModel.data.neuralNetwork.maxNeuronsToShow) {
        const ellipsis = document.createElement('div');
        ellipsis.className = 'ellipsis';
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement('div');
          dot.className = 'dot';
          ellipsis.appendChild(dot);
        }
        neurons.appendChild(ellipsis);
        
        const lastNeuron = document.createElement('div');
        lastNeuron.className = 'neuron';
        lastNeuron.textContent = neuronCount;
        neurons.appendChild(lastNeuron);
      }
      layer.appendChild(neurons);

      network.appendChild(layer);
    }); 
    this.drawConnections();
  },
  drawConnections() {
    const network = document.getElementById('neural-network');
    const connections = document.querySelectorAll('.connection');
    connections.forEach(conn => conn.remove());

    const layerElements = document.querySelectorAll('.layer');
    const networkRect = network.getBoundingClientRect();

    for (let i = 0; i < layerElements.length - 1; i++) {
        const currentLayer = layerElements[i];
        const nextLayer = layerElements[i + 1];
        const currentNeurons = currentLayer.querySelectorAll('.neuron');
        const nextNeurons = nextLayer.querySelectorAll('.neuron');

        currentNeurons.forEach(currentNeuron => {
            nextNeurons.forEach(nextNeuron => {
                const connection = document.createElement('div');
                connection.className = 'connection';
                const start = currentNeuron.getBoundingClientRect();
                const end = nextNeuron.getBoundingClientRect();

                // Calculate the center points of the neurons
                const startCenterX = start.left + start.width / 2;
                const startCenterY = start.top + start.height / 2;
                const endCenterX = end.left + end.width / 2;
                const endCenterY = end.top + end.height / 2;

                // Calculate the angle between the neurons
                const angle = Math.atan2(endCenterY - startCenterY, endCenterX - startCenterX);

                // Calculate the start and end points on the edges of the neurons
                const startRadius = start.width / 2;
                const endRadius = end.width / 2;
                const startX = startCenterX - networkRect.left + Math.cos(angle) * startRadius;
                const startY = startCenterY - networkRect.top + Math.sin(angle) * startRadius;
                const endX = endCenterX - networkRect.left - Math.cos(angle) * endRadius;
                const endY = endCenterY - networkRect.top - Math.sin(angle) * endRadius;

                // Calculate the length and angle of the connection
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

                connection.style.width = `${length}px`;
                connection.style.left = `${startX}px`;
                connection.style.top = `${startY}px`;
                connection.style.transform = `rotate(${angle}rad)`;

                network.appendChild(connection);
            });
        });
    }
}
};





// Controller
const gameController = {
  init() {
    this.setupEventListeners();
    this.startGameLoop();
    gameView.renderNetwork();
  },
  setupEventListeners() { 
    document.getElementById("clickMe").addEventListener("click", () => {
      gameModel.addMoney();
      gameView.updateMoneyDisplay();
    });
    document.getElementById('addNeuronInput').addEventListener('click', () => this.updateNetwork(0, 'add'));
    document.getElementById('removeNeuronInput').addEventListener('click', () => this.updateNetwork(0, 'remove'));
    document.getElementById('addNeuronHidden').addEventListener('click', () => this.updateNetwork(1, 'add'));
    document.getElementById('removeNeuronHidden').addEventListener('click', () => this.updateNetwork(1, 'remove'));
    document.getElementById('addNeuronOutput').addEventListener('click', () => this.updateNetwork(2, 'add'));
    document.getElementById('removeNeuronOutput').addEventListener('click', () => this.updateNetwork(2, 'remove'));
    window.addEventListener('resize', () => gameView.drawConnections());
  },
  startGameLoop() {
    setInterval(() => {
      gameView.updateMoneyDisplay();
    }, 1000 / 20);
    setInterval(() => {
      gameModel.addMoney();
    }, 1000);
  },
  updateNetwork(layerIndex, action) {
    if (action === 'add') {
      gameModel.addNeuron(layerIndex);
    } else if (action === 'remove') {
      gameModel.removeNeuron(layerIndex);
    }
    gameView.renderNetwork();
  }
};

gameController.init();