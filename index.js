let isAnimation = false;
let level = 0;
let isExe = false;

const LIST = [
  [5, 300, 10, 0],
  [3, 250, 15, 0.2],
  [4, 200, 20, 0.4],
  [3, 180, 25, 0.6],
  [3, 160, 30, 0.8],
  [4, 140, 35, 1],
  [3, 120, 40, 1.5],
  [4, 115, 45, 2],
  [5, 110, 50, 2.5],
  [5, 110, 55, 3],
];

const yaba = function (cupCount, duration, animateCount) {
  isAnimation = true;
  cupSelect(cupCount).then(() => {
    animation(cupCount, duration, animateCount);
    // animationPromise(cupCount, duration, animateCount);
  });
};

const createComponent = function () {
  isAnimation = false;
  isExe = false;
  const [CC, S, AC, P] = LIST[level];
  const header = document.querySelector("header");
  const div = document.createElement("div");
  const bae = document.getElementById("bae");
  div.className = "button";
  div.innerText = "Start Game";
  bae.innerText = `DIE 시 배율 = ${P}배`;
  div.onclick = () => {
    div.remove();
    yaba(CC, S, AC);
  };
  header.appendChild(div);
  createCup(CC);
};

const dief = function () {
  level = 0;
  const container = document.getElementById("container");
  Array.from(container.children).forEach((i) => i.remove());
  createComponent();
};

const success = function () {
  level += 1;
  const header = document.querySelector("header");
  const div = document.createElement("div");
  const godie = document.createElement("div");
  const go = document.createElement("div");
  const die = document.createElement("div");
  div.innerText = "Success!";
  div.className = "result";
  godie.className = "godie";
  go.innerText = "GO";
  go.className = "resb";
  go.onclick = () => {
    div.remove();
    godie.remove();
    const container = document.getElementById("container");
    Array.from(container.children).forEach((i) => i.remove());
    createComponent();
  };
  die.innerText = "DIE";
  die.className = "resb";
  die.onclick = () => {
    div.remove();
    godie.remove();
    const container = document.getElementById("container");
    Array.from(container.children).forEach((i) => i.remove());
    dief();
  };
  godie.appendChild(go);
  godie.appendChild(die);
  header.appendChild(div);
  if (level < 10) header.appendChild(godie);
};

const fail = function () {
  const header = document.querySelector("header");
  const div = document.createElement("div");
  const ret = document.createElement("ret");
  ret.innerText = "RETRY";
  ret.className = "resb";
  ret.onclick = () => {
    div.remove();
    ret.remove();
    dief();
  };
  div.innerText = "FAIL~";
  div.className = "result";
  header.appendChild(div);
  header.appendChild(ret);
};

const createCup = function (cupCount) {
  //  입력받은 숫자만큼 태그 생성 - 클래스부여 - 배경색 부여
  const container = document.getElementById("container");
  for (let i = 0; i < cupCount; i++) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    img.src = "cup.png";
    div.appendChild(img);
    div.className = `cup cup_${i + 1}`;
    // div.style.background = `#${ Math.round(Math.random() * 0xffffff).toString(16) }`;
    gap = parseInt(
      ((window.innerWidth * 4) / 5 - 240 * cupCount) / (cupCount - 1)
    );
    div.style.left = `${i * (gap + 240)}px`;
    div.onclick = () => {
      if (isAnimation) return;
      div.children[0].classList.add("blowaway");
      if (!isExe) {
        fail();
        isExe = true;
      }
    };
    container.appendChild(div);
  }
};

const cupSelect = function (cupCount) {
  const number = Math.floor(Math.random() * cupCount) + 1;
  const target = document.querySelector(`.cup_${number}`);
  target.onclick = () => {
    if (isAnimation) return;
    img = target.children[0];
    img.classList.add("blowaway");
    if (!isExe) success();
    isExe = true;
  };
  const ball = document.createElement("div");
  ball.className = "ball";
  img = target.children[0];
  img.classList.add("upanddown");
  target.appendChild(ball);
  return new Promise((resolve) => {
    setTimeout(() => {
      img.classList.remove("upanddown");
      resolve();
    }, 3000);
  });
};

const animation = function (cupCount, duration, animateCount) {
  let timeLine1 = anime.timeline({
    easing: "linear",
    delay: 100,
    autoplay: false,
    complete: () => {
      isAnimation = false;
      anime({
        duration,
        targets: document.querySelectorAll(".cup"),
        translateY: 0,
      });
    },
  });

  for (let i = 0; i < animateCount; i++) {
    const random = Math.random();
    let target1 = Math.floor(random * cupCount) + 1;
    let target2 = Math.floor(random * cupCount) + 1;
    if (target1 === target2) target2--;
    if (target2 === 0) target2 = cupCount;
    target1 = `.cup_${target1}`;
    target2 = `.cup_${target2}`;
    const target1El = document.querySelector(target1);
    const target2El = document.querySelector(target2);

    timeLine1.add({
      duration,
      targets: [target1El, target2El],

      left: (el) => {
        if (el === target1El) return [el.style.left, target2El.style.left];
        else return [el.style.left, target1El.style.left];
      },

      loopBegin: () => {
        anime({
          duration,
          targets: target1El,
          easing: "linear",
          keyframes: [{ translateY: 150 }, { translateY: 0 }],
        });
        anime({
          duration,
          targets: target2El,
          easing: "linear",
          keyframes: [{ translateY: -150 }, { translateY: 0 }],
        });
      },
    });
  }

  timeLine1.restart();
};

createComponent();
