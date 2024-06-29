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
      // Render first layer
      this.renderLayer(network, layers[0], 'Input', 0);

      // Render first hidden layer
      this.renderLayer(network, layers[1], 'Hidden', 1);

      // Render condensed middle layers
      this.renderCondensedLayers(network, layers.slice(2, -2), 2);

      // Render last hidden layer
      this.renderLayer(network, layers[layers.length - 2], 'Hidden', layers.length - 2);

      // Render output layer
      this.renderLayer(network, layers[layers.length - 1], 'Output', layers.length - 1);
    } else {
      // Render all layers normally
      layers.forEach((neuronCount, index) => {
        const label = index === 0 ? 'Input' : 
                      index === layers.length - 1 ? 'Output' : 
                      'Hidden';
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
    infoElement.textContent = 'Black Box';
    condensed.appendChild(infoElement);

    const neuronInfo = document.createElement('div');
    neuronInfo.className = 'condensed-neuron-info';
    neuronInfo.textContent = `${layerCount} layers, ${totalNeurons} neurons`;
    condensed.appendChild(neuronInfo);

    // Add connection dots on the sides
    const leftDot = document.createElement('div');
    leftDot.className = 'connection-dot left-dot';
    condensed.appendChild(leftDot);

    const rightDot = document.createElement('div');
    rightDot.className = 'connection-dot right-dot';
    condensed.appendChild(rightDot);

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
      let currentEndPoint, nextStartPoint;
      
      if (currentLayer.classList.contains('condensed-layers')) {
        currentNeurons = [currentLayer.querySelector('.right-dot')];
        currentEndPoint = 'right';
      } else {
        currentNeurons = currentLayer.querySelectorAll('.neuron');
        currentEndPoint = 'center';
      }
      
      if (nextLayer.classList.contains('condensed-layers')) {
        nextNeurons = [nextLayer.querySelector('.left-dot')];
        nextStartPoint = 'left';
      } else {
        nextNeurons = nextLayer.querySelectorAll('.neuron');
        nextStartPoint = 'center';
      }

      currentNeurons.forEach(currentNeuron => {
        nextNeurons.forEach(nextNeuron => {
          this.createConnection(network, currentNeuron, nextNeuron, networkRect, currentEndPoint, nextStartPoint);
        });
      });
    }

    // Draw connections inside the black box
    const blackBox = document.querySelector('.condensed-layers');
    if (blackBox) {
      const miniLayers = blackBox.querySelectorAll('.mini-layer');
      for (let i = 0; i < miniLayers.length - 1; i++) {
        const currentLayer = miniLayers[i];
        const nextLayer = miniLayers[i + 1];
        const currentNeurons = currentLayer.querySelectorAll('.mini-neuron');
        const nextNeurons = nextLayer.querySelectorAll('.mini-neuron');

        currentNeurons.forEach(currentNeuron => {
          nextNeurons.forEach(nextNeuron => {
            this.createConnection(blackBox, currentNeuron, nextNeuron, blackBox.getBoundingClientRect(), 'center', 'center', 'mini-connection');
          });
        });
      }
    }
  },

  createConnection(container, start, end, containerRect, startPoint = 'center', endPoint = 'center', className = 'connection') {
    const connection = document.createElement('div');
    connection.className = 'connection';
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    let startX, startY, endX, endY;

    if (startPoint === 'center') {
      startX = startRect.left + startRect.width / 2;
      startY = startRect.top + startRect.height / 2;
    } else if (startPoint === 'right') {
      startX = startRect.right;
      startY = startRect.top + startRect.height / 2;
    } else if (startPoint === 'left') {
      startX = startRect.left;
      startY = startRect.top + startRect.height / 2;
    }

    if (endPoint === 'center') {
      endX = endRect.left + endRect.width / 2;
      endY = endRect.top + endRect.height / 2;
    } else if (endPoint === 'right') {
      endX = endRect.right;
      endY = endRect.top + endRect.height / 2;
    } else if (endPoint === 'left') {
      endX = endRect.left;
      endY = endRect.top + endRect.height / 2;
    }

    const angle = Math.atan2(endY - startY, endX - startX);
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    connection.style.width = `${length}px`;
    connection.style.left = `${startX - containerRect.left}px`;
    connection.style.top = `${startY - containerRect.top}px`;
    connection.style.transform = `rotate(${angle}rad)`;

    container.appendChild(connection);
  },

  renderLayerControls() {
    const controlsContainer = document.getElementById('network-controls');
    controlsContainer.innerHTML = '';
  
    const layers = gameModel.data.neuralNetwork.layers;
    layers.forEach((neuronCount, index) => {
      const button = document.createElement('button');
      if (index === 0) {
        button.textContent = '+ Input';
      } else if (index === layers.length - 1) {
        button.textContent = '+ Output';
      } else if (index === 1) {
        button.textContent = '+ Hidden In';
      } else if (index === layers.length - 2) {
        button.textContent = '+ Hidden Out';
      } 
      else {
        // Skip buttons inside the Black Box
        return;
      }
      button.dataset.layerIndex = index;
      controlsContainer.appendChild(button);
    });
  
    // Add Black Box controls if there are condensed layers
    if (layers.length >= 5) {
      const blackBoxNeuronButton = document.createElement('button');
      blackBoxNeuronButton.textContent = '+ Black Box Neuron';
      blackBoxNeuronButton.dataset.action = 'addBlackBoxNeuron';
      controlsContainer.appendChild(blackBoxNeuronButton);
  
      const blackBoxLayerButton = document.createElement('button');
      blackBoxLayerButton.textContent = '+ Black Box Layer';
      blackBoxLayerButton.dataset.action = 'addBlackBoxLayer';
      controlsContainer.appendChild(blackBoxLayerButton);
    } else {
      // Only add the "Hidden Layer" button if the black box is not active
      const addLayerButton = document.createElement('button');
      addLayerButton.textContent = '+ Hidden Layer';
      addLayerButton.id = 'addHiddenLayer';
      controlsContainer.appendChild(addLayerButton);
    }
  },

  activateRandomNeuron() {
    const neurons = document.querySelectorAll('.neuron:not(.active)');
    if (neurons.length > 0) {
        const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        randomNeuron.classList.add('active');
        setTimeout(() => {
            randomNeuron.classList.remove('active');
        }, 2000); // Remove active class after 2 seconds
    }
  },

activateRandomMiniNeuron() {
    const miniNeurons = document.querySelectorAll('.mini-neuron:not(.active)');
    if (miniNeurons.length > 0) {
        const randomMiniNeuron = miniNeurons[Math.floor(Math.random() * miniNeurons.length)];
        randomMiniNeuron.classList.add('active');
        setTimeout(() => {
            randomMiniNeuron.classList.remove('active');
        }, 2000); // Remove active class after 2 seconds
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

    // Use event delegation for network control buttons
    document.getElementById('network-controls').addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        if (event.target.id === 'addHiddenLayer') {
          this.addNewHiddenLayer();
        } else if (event.target.dataset.action === 'addBlackBoxNeuron') {
          this.addBlackBoxNeuron();
        } else if (event.target.dataset.action === 'addBlackBoxLayer') {
          this.addBlackBoxLayer();
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
      gameView.activateRandomNeuron();
      gameView.activateRandomMiniNeuron();
    }, 1000 / 2);
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
  },
  addBlackBoxNeuron() {
    const layers = gameModel.data.neuralNetwork.layers;
    if (layers.length >= 5) {
      // Add a neuron to a random layer within the Black Box
      const randomIndex = Math.floor(Math.random() * (layers.length - 4)) + 2;
      gameModel.addNeuron(randomIndex);
      gameView.renderNetwork();
    }
  },
  addBlackBoxLayer() {
    const layers = gameModel.data.neuralNetwork.layers;
    if (layers.length >= 5) {
      // Insert a new layer with 1 neuron at a random position within the Black Box
      const randomIndex = Math.floor(Math.random() * (layers.length - 4)) + 2;
      gameModel.data.neuralNetwork.layers.splice(randomIndex, 0, 1);
      gameView.renderNetwork();
    }
  }
};

gameController.init();
