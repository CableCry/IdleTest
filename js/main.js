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
      layers: [1, 1, 1], 
      maxNeuronsToShow: 5,
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
  addHiddenLayer() {
    // Insert a new hidden layer with 1 neuron before the output layer
    this.data.neuralNetwork.layers.splice(this.data.neuralNetwork.layers.length - 1, 0, 1);
  },
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
    const layers = gameModel.data.neuralNetwork.layers;

    if (layers.length >= 5) {
        // Render first two layers
        this.renderLayer(network, layers[0], 'Input', 0);
        this.renderLayer(network, layers[1], 'Hidden 1', 1);

        // Render condensed middle layers
        this.renderCondensedLayers(network, layers.slice(2, -2), 2);

        // Render last two layers
        this.renderLayer(network, layers[layers.length - 2], `Hidden ${layers.length - 2}`, layers.length - 2);
        this.renderLayer(network, layers[layers.length - 1], 'Output', layers.length - 1);
    } else {
        // Render all layers normally
        layers.forEach((neuronCount, index) => {
            const label = index === 0 ? 'Input' : 
                          index === layers.length - 1 ? 'Output' : 
                          `Hidden ${index}`;
            this.renderLayer(network, neuronCount, label, index);
        });
    }
    
    this.drawConnections();
    this.renderLayerControls();
  },

  renderLayer(container, neuronCount, label, layerIndex) {
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

    const labelElement = document.createElement('div');
    labelElement.className = 'layer-label';
    labelElement.textContent = label;
    layer.appendChild(labelElement);

    // Add a data attribute to the layer for identification
    layer.dataset.layerIndex = layerIndex;

    container.appendChild(layer);
  },

  renderCondensedLayers(container, middleLayers, startIndex) {
    const condensed = document.createElement('div');
    condensed.className = 'condensed-layers';

    const layerCount = middleLayers.length;
    const totalNeurons = middleLayers.reduce((sum, count) => sum + count, 0);

    const infoElement = document.createElement('div');
    infoElement.className = 'condensed-info';
    infoElement.textContent = `${layerCount} hidden layers`;
    condensed.appendChild(infoElement);

    const neuronInfo = document.createElement('div');
    neuronInfo.className = 'condensed-neuron-info';
    neuronInfo.textContent = `${totalNeurons} neurons`;
    condensed.appendChild(neuronInfo);

    // Mini network representation
    const miniNetwork = document.createElement('div');
    miniNetwork.className = 'mini-network';
    for (let i = 0; i < 3; i++) {
        const miniLayer = document.createElement('div');
        miniLayer.className = 'mini-layer';
        for (let j = 0; j < 3; j++) {
            const miniNeuron = document.createElement('div');
            miniNeuron.className = 'mini-neuron';
            miniLayer.appendChild(miniNeuron);
        }
        miniNetwork.appendChild(miniLayer);
    }
    condensed.appendChild(miniNetwork);

    // Add data attributes to the condensed layers for identification
    condensed.dataset.startIndex = startIndex;
    condensed.dataset.endIndex = startIndex + middleLayers.length - 1;

    container.appendChild(condensed);
  },
  drawConnections() {
    const network = document.getElementById('neural-network');
    const connections = document.querySelectorAll('.connection');
    connections.forEach(conn => conn.remove());

    const layerElements = document.querySelectorAll('.layer, .condensed-layers');
    const networkRect = network.getBoundingClientRect();

    for (let i = 0; i < layerElements.length - 1; i++) {
        const currentLayer = layerElements[i];
        const nextLayer = layerElements[i + 1];
        
        let currentNeurons, nextNeurons;
        
        if (currentLayer.classList.contains('condensed-layers')) {
            currentNeurons = currentLayer.querySelectorAll('.mini-neuron');
        } else {
            currentNeurons = currentLayer.querySelectorAll('.neuron');
        }
        
        if (nextLayer.classList.contains('condensed-layers')) {
            nextNeurons = nextLayer.querySelectorAll('.mini-neuron');
        } else {
            nextNeurons = nextLayer.querySelectorAll('.neuron');
        }

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
  },

  renderLayerControls() {
    const controlsContainer = document.getElementById('network-controls');
    controlsContainer.innerHTML = '';

    const layers = gameModel.data.neuralNetwork.layers;
    layers.forEach((neuronCount, index) => {
      const button = document.createElement('button');
      button.textContent = `+ ${index === 0 ? 'Input' : index === layers.length - 1 ? 'Output' : 'Hidden ' + index}`;
      button.dataset.layerIndex = index;
      controlsContainer.appendChild(button);
    });

    const addLayerButton = document.createElement('button');
    addLayerButton.textContent = '+ Hidden Layer';
    addLayerButton.id = 'addHiddenLayer';
    controlsContainer.appendChild(addLayerButton);
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
    // Use event delegation for network control buttons
    document.getElementById('network-controls').addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        if (event.target.id === 'addHiddenLayer') {
          this.addNewHiddenLayer();
        } else {
          const layerIndex = parseInt(event.target.dataset.layerIndex);          
          this.updateNetwork(layerIndex, 'add');
        }
      }
    });

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
    }
    gameView.renderNetwork();
  },
  addNewHiddenLayer() {
    gameModel.addHiddenLayer();
    gameView.renderNetwork();
  }
};

gameController.init();