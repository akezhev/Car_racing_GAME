(function () {
  let isPause = false;
  let animationId = null;

  // console.log(window);
  // window.innerHeight: 577;
  // window.innerWidth: 794;
  
  // задаем скорость
  let speed = 3;
  let score = 0;

  // находим машину
  const car = document.querySelector('.car');
  const carInfo = {
    ...createElementInfo(car),
    move: {
      top: null,
      bottom: null,
      left: null,
      right: null,
    },
  };

  // находим монетку
  const coin = document.querySelector('.coin');
  const coinInfo = createElementInfo(coin);

  // получем табличку
  const danger = document.querySelector('.danger');
  const dangerInfo = createElementInfo(danger);

  // получаем стрелку
  const arrow = document.querySelector('.arrow');
  const arrowInfo = createElementInfo(arrow);

  // находим дорогу и ее высоту и ширину(половину)
  const road = document.querySelector('.road');
  const roadHeight = road.clientHeight;
  const roadwidth = road.clientWidth / 2;

  const gameButton = document.querySelector('.game-button');
  const gameScore = document.querySelector('.game-score');
  const backdrop = document.querySelector('.backdrop');
  const restartButton = document.querySelector('.restart-button');


  // находим все деревья 
  const trees = document.querySelectorAll('.tree');


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
    if ((code === 'ArrowUp' || code === 'KeyW') && carInfo.move.top === null) {
      // условие: если мы двигаемся вверх, вниз не работает
      if (carInfo.move.bottom) {
        return;
      }
      // запуск аниамацие по кнопке вверх
      carInfo.move.top = requestAnimationFrame(carMoveToTop);
    }
    else if ((code === 'ArrowDown' || code === 'KeyS') && carInfo.move.bottom === null) {
      if (carInfo.move.top) {
        return;
      }
      carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
    }
    else if ((code === 'ArrowLeft' || code === 'KeyA') && carInfo.move.left === null) {
      if (carInfo.move.right) {
        return;
      }
      carInfo.move.left = requestAnimationFrame(carMoveToLeft);
    }
    else if ((code === 'ArrowRight' || code === 'KeyD') && carInfo.move.right === null) {
      if (carInfo.move.left) {
        return;
      }
      carInfo.move.right = requestAnimationFrame(carMoveToRight);
    }
  });

  // отмена анимации
  document.addEventListener('keyup', (event) => {
    const code = event.code;
    // проверяется условие на ОТЖАТИЕ кнопок "стрелки:верх, вниз, влево, вправо" и кнопок "WSAD"
    if (code === 'ArrowUp' || code === 'KeyW') {
      // как только отпускается клавиша, завершается анимация с высчитыванием координат
      cancelAnimationFrame(carInfo.move.top);
      // обнуляем хранилище
      carInfo.move.top = null;
    }
    else if (code === 'ArrowDown' || code === 'KeyS') {
      cancelAnimationFrame(carInfo.move.bottom);
      carInfo.move.bottom = null;
    }
    else if (code === 'ArrowLeft' || code === 'KeyA') {
      cancelAnimationFrame(carInfo.move.left);
      carInfo.move.left = null;
    }
    else if (code === 'ArrowRight' || code === 'KeyD') {
      cancelAnimationFrame(carInfo.move.right);
      carInfo.move.right = null;
    }
  });

  function createElementInfo(element) {
    return {
      coords: getCoords(element),
      height: element.clientHeight,
      width: element.clientWidth / 2,
      visible: true,
    }
  };

  // функции для расчета координат машины
  function carMoveToTop() {
    // высчитываем новую коодинату по оси Y
    const newY = carInfo.coords.y - 5;
    // условием ограничиваем движение машины за пределы экрана
    if (newY < 0) {
      return;
    }
    // сохранили координату в хранилище
    carInfo.coords.y = newY;
    // имея нужные координаты передвинули машину
    carMove(carInfo.coords.x, newY);
    // зациклили функцию
    carInfo.move.top = requestAnimationFrame(carMoveToTop);
  }

  function carMoveToBottom() {
    const newY = carInfo.coords.y + 5;
    if ((newY + carInfo.height) > roadHeight) {
      return;
    }
    carInfo.coords.y = newY;
    carMove(carInfo.coords.x, newY);
    carInfo.move.bottom = requestAnimationFrame(carMoveToBottom);
  }

  function carMoveToLeft() {
    const newX = carInfo.coords.x - 5;
    if (newX < -roadwidth + carInfo.width) {
      return;
    }
    carInfo.coords.x = newX;
    carMove(newX, carInfo.coords.y);
    carInfo.move.left = requestAnimationFrame(carMoveToLeft);
  }
  
  function carMoveToRight() {
    const newX = carInfo.coords.x + 5;
    if (newX > roadwidth - carInfo.width) {
      return;
    }
    carInfo.coords.x = newX;
    carMove(newX, carInfo.coords.y);
    carInfo.move.right = requestAnimationFrame(carMoveToRight);
  }

  // задаем координаты машине
  function carMove(x, y) {
    car.style.transform = `translate(${x}px, ${y}px)`
  }

  animationId = requestAnimationFrame(startGame);

  // запуск игры
  // анимация всех деталей
  function startGame() {
    elementAnimation(danger, dangerInfo, -300);

    if (hasCollision(carInfo, dangerInfo)) {
      return finishGame();
    }

    treesAnimation();
    elementAnimation(coin, coinInfo, -100);

    if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
      score++;
      gameScore.innerText = score;
      coin.style.display = 'none';
      coinInfo.visible = false;

      if (score % 3 === 0) {
        speed += 2;
      }
    };


    
    // elementAnimation(arrow, arrowInfo, -600);

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

  // функция расчета координат монетки, таблички и стрелки
  function elementAnimation(elem, elemInfo, elemInitialYCoord) {
    let newYCoord = elemInfo.coords.y + speed;
    let newXCoord = elemInfo.coords.x;

    if (newYCoord > window.innerHeight) {
      // появление монетки за пределами экрана на 150 пикс
      newYCoord = elemInitialYCoord;
        const direction = parseInt(Math.random() * 2);
        const maxXCoord = (roadwidth + 1 - elemInfo.width);
        const randomXCoord = parseInt(Math.random() * maxXCoord);

        elem.style.display = "initial";
        elemInfo.visible = true;

        // if (direction === 0) { // двигаем влево
        //   newXCoord = -randomXCoord;
        // } else if (direction === 1) { // двигаем вправо
        //   newXCoord = randomXCoord;
        // }

        // то же самое и if/else
        newXCoord = direction === 0 ? -randomXCoord : randomXCoord;
    }
    // хранилище координат
    elemInfo.coords.x = newXCoord;
    elemInfo.coords.y = newYCoord;
    elem.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
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

  // функция коллизии
  function hasCollision(elem1Info, elem2Info) {
    const carYTop = elem1Info.coords.y;
    const carYBottom = elem1Info.coords.y + elem1Info.height;

    const carXLeft = elem1Info.coords.x - elem1Info.width;
    const carXRight = elem1Info.coords.x + elem1Info.width;

    const coinYTop = elem2Info.coords.y;
    const coinYBottom = elem2Info.coords.y + elem2Info.height;

    const coinXLeft = elem2Info.coords.x - elem2Info.width;
    const coinXRight = elem2Info.coords.x + elem2Info.width;

    // ось y
    if (carYTop > coinYBottom || carYBottom < coinYTop) {
      return false;
    }
    // ось X
    if (carXLeft > coinXRight || carXRight < coinXLeft) {
      return false;
    }
    return true;
  }

  // 
  function cancelAnimations() {
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(carInfo.move.top);
    cancelAnimationFrame(carInfo.move.bottom);
    cancelAnimationFrame(carInfo.move.left);
    cancelAnimationFrame(carInfo.move.right);  
  }

  // 
  function finishGame() {
    cancelAnimations();

    gameScore.style.display = 'none';
    gameButton.style.display = 'none';
    backdrop.style.display = 'flex';
    const scoreText = backdrop.querySelector('.finish-text-score');
    scoreText.innerText = score;
  }

// функция запуска и остановки игры 
  gameButton.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      cancelAnimations();
      gameButton.children[0].style.display = 'none';
      gameButton.children[1].style.display = 'initial';
    } 
    else {
      animationId = requestAnimationFrame(startGame);
      gameButton.children[0].style.display = 'initial';
      gameButton.children[1].style.display = 'none';
    }
  });

  restartButton.addEventListener('click', () => {
    window.location.reload();
  })
  
})();