(function () {
  let isPause = false;
  let animationId = null;

  // console.log(window);
  // window.innerHeight: 577;
  // window.innerWidth: 794;


  const speed = 3;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');

  // массив деревьев
  const treesCoords = [];

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    const coordsTree = getCoords(tree);

    treesCoords.push(coordsTree);
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
        newYCoord = -tree.height;
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