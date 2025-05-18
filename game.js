(function () {
  let isPause = false;
  let animationId = null;

  const speed = 3;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');

  const tree1 = trees[0];
  const coordsTree1 = getCoords(tree1);

  animationId = requestAnimationFrame(startGame);

  // запуск игры
  function startGame() {
    treesAnimation();

    animationId = requestAnimationFrame(startGame);
  };

  //функция панимации деревьев
  function treesAnimation() {
    const newCoordY = coordsTree1.y + speed;
    coordsTree1.y = newCoordY;
    tree1.style.transform = `translate(${coordsTree1.x}px, ${newCoordY}px)`;

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