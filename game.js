(function () {
  let isPause = false;
  let animationId = null;

  // console.log(window);
  // window.innerHeight: 577;
  // window.innerWidth: 794;
  
  // задаем скорость
  const speed = 3;
  // находим машину
  const car = document.querySelector('.car');
  // находим ширину(половину) и высоту машины
  const carWidth = car.clientWidth / 2;
  const carHeight = car.clientHeight;

  // находим монетку
  const coin = document.querySelector('.coin');
  const coinCoord = getCoords(coin);


  // находим дорогу и ее высоту и ширину(половину)
  const road = document.querySelector('.road');
  const roadHeight = road.clientHeight;
  const roadwidth = road.clientWidth / 2;

  // находим все деревья 
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
    // если игра на паузе, код дальше не выполняется. управление машиной становится невозможным
    if (isPause) {
      return
    };

    const code = event.code;

    // проверяется условие на нажатие кнопок "стрелки:верх, вниз, влево, вправо" и кнопок "WSAD"
    if ((code === 'ArrowUp' || code === 'KeyW') && carMoveInfo.top === null) {
      // условие: если мы двигаемся вверх, вниз не работает
      if (carMoveInfo.bottom) {
        return;
      }
      // запуск аниамацие по кнопке вверх
      carMoveInfo.top = requestAnimationFrame(carMoveToTop);
    }
    else if ((code === 'ArrowDown' || code === 'KeyS') && carMoveInfo.bottom === null) {
      if (carMoveInfo.top) {
        return;
      }
      carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
    }
    else if ((code === 'ArrowLeft' || code === 'KeyA') && carMoveInfo.left === null) {
      if (carMoveInfo.right) {
        return;
      }
      carMoveInfo.left = requestAnimationFrame(carMoveToLeft);

    }
    else if ((code === 'ArrowRight' || code === 'KeyD') && carMoveInfo.right === null) {
      if (carMoveInfo.left) {
        return;
      }
      carMoveInfo.right = requestAnimationFrame(carMoveToRight);

    }
  });

  // отмена анимации
  document.addEventListener('keyup', (event) => {
    const code = event.code;
    // проверяется условие на ОТЖАТИЕ кнопок "стрелки:верх, вниз, влево, вправо" и кнопок "WSAD"
    if (code === 'ArrowUp' || code === 'KeyW') {
      // как только отпускается клавиша, завершается анимация с высчитыванием координат
      cancelAnimationFrame(carMoveInfo.top);
      // обнуляем хранилище
      carMoveInfo.top = null;
    }
    else if (code === 'ArrowDown' || code === 'KeyS') {
      cancelAnimationFrame(carMoveInfo.bottom);
      carMoveInfo.bottom = null;
    }
    else if (code === 'ArrowLeft' || code === 'KeyA') {
      cancelAnimationFrame(carMoveInfo.left);
      carMoveInfo.left = null;
    }
    else if (code === 'ArrowRight' || code === 'KeyD') {
      cancelAnimationFrame(carMoveInfo.right);
      carMoveInfo.right = null;
    }
  });

  // функции для расчета координат машины
  function carMoveToTop() {
    // высчитываем новую коодинату по оси Y
    const newY = carCoords.y - 5;
    // условием ограничиваем движение машины за пределы экрана
    if (newY < 0) {
      return;
    }
    // сохранили координату в хранилище
    carCoords.y = newY;
    // имея нужные координаты передвинули машину
    carMove(carCoords.x, newY);
    // зациклили функцию
    carMoveInfo.top = requestAnimationFrame(carMoveToTop);
  }
  function carMoveToBottom() {
    const newY = carCoords.y + 5;
    if ((newY + carHeight) > roadHeight) {
      return;
    }
    carCoords.y = newY;
    carMove(carCoords.x, newY);
    carMoveInfo.bottom = requestAnimationFrame(carMoveToBottom);
  }
  function carMoveToLeft() {
    const newX = carCoords.x - 5;
    if (newX < -roadwidth + carWidth) {
      return;
    }

    carCoords.x = newX;
    carMove(newX, carCoords.y);
    carMoveInfo.left = requestAnimationFrame(carMoveToLeft);
  }
  function carMoveToRight() {
    const newX = carCoords.x + 5;
    if (newX > roadwidth - carWidth) {
      return;
    }
    carCoords.x = newX;
    carMove(newX, carCoords.y);
    carMoveInfo.right = requestAnimationFrame(carMoveToRight);
  }

  // задаем координаты машине
  function carMove(x, y) {
    car.style.transform = `translate(${x}px, ${y}px)`
  }

  animationId = requestAnimationFrame(startGame);

  // запуск игры
  function startGame() {
    treesAnimation();
    coinAnimation();
    animationId = requestAnimationFrame(startGame);
  };

  //функция  анимации деревьев
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

  // функция расчета координат монетки
  function coinAnimation() {
    let newYCoord = coinCoord.y + speed;
    let newXCoord = coinCoord.x;

    if (newYCoord > window.innerHeight) {
      newYCoord = -150;
    }

    const direction = parseInt(Math.random() * 2);
    const randomXCoord = parseInt(Math.random() * (roadwidth + 1));

    // if (direction === 0) { // двигаем влево
    //   newXCoord = -randomXCoord;
    // } else if (direction === 1) { // двигаем вправо
    //   newXCoord = randomXCoord;
    // }

    // то же самое и if/else
    newXCoord = direction === 0 ? -randomXCoord : randomXCoord;

    // хранилище координат
    coinCoord.y = newYCoord;
    coinCoord.x = newXCoord;

    coin.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
  }

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
      cancelAnimationFrame(carMoveInfo.top);
      cancelAnimationFrame(carMoveInfo.bottom);
      cancelAnimationFrame(carMoveInfo.left);
      cancelAnimationFrame(carMoveInfo.right);
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