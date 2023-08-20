const gameOfLife = {
  width: 50,
  height: 50,
  stepInterval: null, 

  createAndShowBoard: function () {

    const goltable = document.createElement("tbody");

    let tablehtml = "";
    for (let h = 0; h < this.height; h++) {
      tablehtml += "<tr id='row+" + h + "'>";
      for (let w = 0; w < this.width; w++) {
        tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
      }
      tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;

    const board = document.getElementById("board");
    board.appendChild(goltable);

    this.setupBoardEvents();
  },

  forEachCell: function (iteratorFunc) {
    for(let y = 0; y < this.height; y++){
      for(let x = 0; x < this.width; x++){
        const cell = document.getElementById(`${x}-${y}`)
        iteratorFunc(cell, x, y)
      }
    }
  },

  setupBoardEvents: function () {

    let botonClear = document.getElementById("clear_btn")
    botonClear.addEventListener("click", function(){
      gameOfLife.clear()
    })

    let botonRandom = document.getElementById("random_btn")
    botonRandom.addEventListener("click", function(){
      gameOfLife.random()
    })

    let botonStep = document.getElementById("step_btn")
    botonStep.addEventListener("click", function(){
      gameOfLife.step()
    })

    let botonAuto = document.getElementById("auto_btn")
    botonAuto.addEventListener("click", function(){
      gameOfLife.enableAutoPlay(numPanel)
    })
    
    let leftButton = document.getElementById("boton_speed_left")
    let rightButton = document.getElementById("boton_speed_right")
    let textPanel = document.getElementById("text_panel").textContent
    let numPanel = parseInt(textPanel.split("ms")[0])

    leftButton.addEventListener("click", () => {
      if(numPanel >= 200){
        numPanel -= 100
        document.getElementById("text_panel").textContent = `${numPanel}ms`
        if(this.stepInterval !== null) this.enableAutoPlay(numPanel)
        this.enableAutoPlay(numPanel)
      }
    })

    rightButton.addEventListener("click", () => {
      if(numPanel <= 900){
        numPanel += 100
        document.getElementById("text_panel").textContent = `${numPanel}ms`
        if(this.stepInterval !== null) this.enableAutoPlay(numPanel)
        this.enableAutoPlay(numPanel)
      }
    })

    let botonResize = document.getElementById("resize_btn");
    botonResize.addEventListener("click", function () {
      const newSize = parseInt(document.getElementById("num_cells_input").value);
      gameOfLife.resize(newSize);
    });

    const onCellClick = function (e) {

      if (this.dataset.status == "dead") {
        this.className = "alive";
        this.dataset.status = "alive";
      } else {
        this.className = "dead";
        this.dataset.status = "dead";
      }
    };

    this.forEachCell(function(cell){
      cell.addEventListener("click", onCellClick);
    })


  },

  step: function () {
    let arrVivos = []
    let arrMuertos = []


    this.forEachCell(function (cell){
      let contador = 0

      let [ejeX, ejeY] = cell.id.split("-")

      ejeX = parseInt(ejeX)
      ejeY = parseInt(ejeY)


      let arrVecinos = []

      //Vecinos puros
      arrVecinos.push(document.getElementById(`${ejeX+1}-${ejeY}`))
      arrVecinos.push(document.getElementById(`${ejeX-1}-${ejeY}`))
      arrVecinos.push(document.getElementById(`${ejeX}-${ejeY+1}`))
      arrVecinos.push(document.getElementById(`${ejeX}-${ejeY-1}`))

      //Vecinnos Diagonales
      arrVecinos.push(document.getElementById(`${ejeX+1}-${ejeY-1}`)) 
      arrVecinos.push(document.getElementById(`${ejeX+1}-${ejeY+1}`)) 
      arrVecinos.push(document.getElementById(`${ejeX-1}-${ejeY-1}`)) 
      arrVecinos.push(document.getElementById(`${ejeX-1}-${ejeY+1}`)) 
      
      let filtroVecinos = arrVecinos.filter(function(vecino){
        return vecino !== null && vecino.getAttribute("data-status") === "alive"
      }) 

      contador = filtroVecinos.length

      //Reglas
      if (cell.dataset.status === "alive") {
        if (contador < 2 || contador > 3) {
          arrMuertos.push(cell);
        }
      } else {
        if (contador === 3) {
          arrVivos.push(cell);
        }
      }

    })

    arrVivos.forEach(function(cell){
      cell.className = "alive";
      cell.dataset.status = "alive"
    }) 

    arrMuertos.forEach(function(cell){
      cell.className = "dead";
      cell.dataset.status = "dead"
    }) 
  },

  enableAutoPlay: function(num) {	

      if(this.stepInterval === null){
        this.stepInterval = setInterval(() => this.step(), num)
        document.getElementById("auto_btn").textContent = "STOP"
      } else {
        this.stepInterval === clearInterval(this.stepInterval)
        this.stepInterval = null
        document.getElementById("auto_btn").textContent = "AUTO"
      }
      
  },

  clear: function() {

    this.forEachCell(function (cell){
      cell.className = "dead";
      cell.dataset.status = "dead"
    })

  },

  random: function() {

    this.forEachCell(function (cell){
      let numeroRandom = Math.round(Math.random())

      if(numeroRandom === 0){
        cell.className = "alive";
        cell.dataset.status = "alive";
      } else {
        cell.className = "dead";
        cell.dataset.status = "dead";
      }

    })
  },

  resize: function (num) {
    let alertShown = false;
    if (num >= 10 && num <= 90) {
      this.width = num;
      this.height = num;
  
      const board = document.getElementById("board");
      board.innerHTML = "";
  
      this.createAndShowBoard();
      this.setupBoardEvents();
      this.clear();

    } else {
      if (!alertShown) {
        alert("El tamaño debe estar entre 10 y 90 celdas.");
        alertShown = true;
      }
    }
  },
};

gameOfLife.createAndShowBoard();
