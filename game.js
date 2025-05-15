(function () {
  let isPause = false;
  let animationId = null;

  const speed = 3;

  const car = document.querySelector('.car');
  const trees = document.querySelectorAll('.tree');

  const tree1 = trees[0];

  animationId = requestAnimationFrame(startGame);


// запуск игры
  function startGame() {
    treesAnimation();

    animationId = requestAnimationFrame(startGame);

  }

// анимация дерева
  function treesAnimation() {
    const newCoord = getYCoord(tree1) + speed;
    tree1.style.transform = `translateY(${newCoord}px)`;

  }


// функция расчета координат дерева
  function getYCoord(element) {
    const matrix = window.getComputedStyle(tree1).transform;
    const array = matrix.split(',');
    const lastElement = array[array.length - 1];
    const coordY = parseFloat(lastElement);

    return coordY;
  }


// функция запуска и остановки игры 
  const gameButton = document.querySelector('.game-button');
  gameButton.addEventListener('click', () => {
    isPause = !isPause;
    if (isPause) {
      canselAnimationFrame(animationId);
      gameButton.children[0].style.display = 'none';
      gameButton.children[1].style.display = 'initial';
    } 
    else {
      gameButton.children[0].style.display = 'initial';
      gameButton.children[1].style.display = 'none';
    }
  });



})();