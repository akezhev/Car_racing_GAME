(function () {
  let isPause = false;
  let animationId = null;

  // console.log(window);
  // window.innerHeight: 577;
  // window.innerWidth: 794;

  const speed = 3;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');

  // получение коодинат машины
  const carCoords = getCoords(car);
  const carMoveInfo = {
    top: null,
    bottom: null,
    left: null,
    right: null,
  }

  // массив деревьев
  const treesCoords = [];

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const coordsTree = getCoords(tree);

    treesCoords.push(coordsTree);
  }

  // логика для анимации машины
  // запуск анимации
  document.addEventListener('keydown', (event) => {
    const code = event.code;

    if (code === 'ArrowUp' && carMoveInfo.top === null) {
      // запуск аниамацие по кнопке вверх
      carMoveInfo.top = requestAnimationFrame(carMoveToTop);
    }
    else if (code === 'ArrowDown'&& carMoveInfo.bottom === null) {
      carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);

    }
    else if (code === 'ArrowLeft' && carMoveInfo.left === null) {
      carMoveInfo.left = requestAnimationFrame(carMoveToLeft);

    }
    else if (code === 'ArrowRight' && carMoveInfo.right === null) {
      carMoveInfo.right = requestAnimationFrame(carMoveToRight);

    }
  });
  // отмена анимации
  document.addEventListener('keyup', (event) => {
    const code = event.code;

    if (code === 'ArrowUp') {
      // как только отпускается клавиша, завершается анимация с высчитыванием координат
      cancelAnimationFrame(carMoveInfo.top);
      // обнуляем хранилище
      carMoveInfo.top = null;
    }
    else if (code === 'ArrowDown') {
      cancelAnimationFrame(carMoveInfo.bottom);
      carMoveInfo.bottom = null;
    }
    else if (code === 'ArrowLeft') {
      cancelAnimationFrame(carMoveInfo.left);
      carMoveInfo.left = null;
    }
    else if (code === 'ArrowRight') {
      cancelAnimationFrame(carMoveInfo.right);
      carMoveInfo.right = null;
    }
  });

  // функции для расчета координат машины
  function carMoveToTop() {
    // высчитываем новую коодинату по оси Y
    const newY = carCoords.y - 5;
    // сохранили координату в хранилище
    carCoords.y = newY;
    // имея нужные координаты передвинули машину
    carMove(carCoords.x, newY);
    // зациклили функцию
    carMoveInfo.top = requestAnimationFrame(carMoveToTop);
  }
  function carMoveToBottom() {
    const newY = carCoords.y + 5;
    carCoords.y = newY;
    carMove(carCoords.x, newY);
    carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
  }
  function carMoveToLeft() {
    const newX = carCoords.x - 5;
    carCoords.x = newX;
    carMove(newX, carCoords.y);
    carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
  }
  function carMoveToRight() {
    const newX = carCoords.x + 5;
    carCoords.x = newX;
    carMove(newX, carCoords.y);
    carMoveInfo.right = requestAnimationFrame(carMoveToRight);
  }

  function carMove(x, y) {
    car.style.transform = `translate(${x}px, ${y}px)`
  }

  animationId = requestAnimationFrame(startGame);

  // запуск игры
  function startGame() {
    treesAnimation();

    animationId = requestAnimationFrame(startGame);
  };

  //функция панимации деревьев
  function treesAnimation() {
    for (let i = 0; i < trees.length; i++) {
      const tree = trees[i];
      const coords = treesCoords[i];

      let newYCoord = coords.y + speed;

      // проверка координат дерева на зацикливание анимации
      if (newYCoord > window.innerHeight) {
        newYCoord = -370 ;
      }
      
      // перезаписываем новые координаты
      treesCoords[i].y = newYCoord;
      tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
    }
  };

  // функция получения координат деревьев
  function getCoords(element) {
    const matrix = window.getComputedStyle(element).transform;
    const array = matrix.split(',');
    const y = array[array.length - 1];
    const x = array[array.length - 2];

    const numericY = parseFloat(y);
    const numericX = parseFloat(x);

    return { x: numericX, y: numericY };
  }


// функция запуска и остановки игры 
  const gameButton = document.querySelector('.game-button');
  gameButton.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimationFrame(animationId);
      gameButton.children[0].style.display = 'none';
      gameButton.children[1].style.display = 'initial';
    } 
    else {
      animationId = requestAnimationFrame(startGame);
      gameButton.children[0].style.display = 'initial';
      gameButton.children[1].style.display = 'none';
    }
  });



})();