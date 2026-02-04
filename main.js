const SUITS = [
  { symbol: "\u2660", name: "s", color: "black" },
  { symbol: "\u2665", name: "h", color: "red" },
  { symbol: "\u2666", name: "d", color: "red" },
  { symbol: "\u2663", name: "c", color: "black" },
];

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const POSITIONS = ["UTG", "UTG+1", "MP", "HJ", "CO", "BTN", "SB", "BB"];

const SCENARIOS = [
  // --- Premium hands ---
  {
    hand: "AA", position: "any", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Call", "Fold"],
    explanation: "Pocket aces are the best starting hand in hold'em. You should always raise to build the pot and isolate opponents. Limping risks letting multiple players see a cheap flop and reduces your edge."
  },
  {
    hand: "KK", position: "any", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Pocket kings are the second-best hand preflop. Raising builds the pot and narrows the field. You want to play this hand aggressively in almost every preflop spot."
  },
  {
    hand: "AA", position: "any", action: "Opponent raises to 2.5x",
    correct: "Re-raise (3-bet)", choices: ["Re-raise (3-bet)", "Call", "Fold"],
    explanation: "With pocket aces facing a raise, you should 3-bet for value. You have the best possible hand and want to build the pot. Slow-playing aces preflop is a common amateur mistake."
  },
  {
    hand: "KK", position: "any", action: "Opponent raises to 2.5x",
    correct: "Re-raise (3-bet)", choices: ["Call", "Fold", "Re-raise (3-bet)"],
    explanation: "Kings should almost always be 3-bet facing a raise. You have a monster hand that dominates most opening ranges. Building the pot now maximizes your expected value."
  },
  {
    hand: "QQ", position: "any", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Call", "Fold"],
    explanation: "Queens are a premium pair that should always be opened with a raise. You want to thin the field and play against fewer opponents. This hand plays best heads-up or three-way."
  },
  {
    hand: "AKs", position: "any", action: "Opponent raises to 2.5x",
    correct: "Re-raise (3-bet)", choices: ["Re-raise (3-bet)", "Call", "Fold"],
    explanation: "Suited ace-king is a premium hand that plays great as a 3-bet. It has strong equity against opening ranges and excellent playability postflop. 3-betting also lets you take the initiative."
  },
  // --- Strong hands in position ---
  {
    hand: "AQs", position: "CO", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Suited ace-queen in the cutoff is a clear raise. You have a strong hand with position on most remaining players. Raising lets you take down the blinds or play a pot in position."
  },
  {
    hand: "JJ", position: "MP", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Pocket jacks are a strong hand that should be opened from any position. While they can be tricky postflop, raising preflop is standard. You want to narrow the field before the flop."
  },
  {
    hand: "TT", position: "HJ", action: "Opponent raises to 2.5x from UTG",
    correct: "Call", choices: ["Call", "Re-raise (3-bet)", "Fold"],
    explanation: "Tens facing an UTG open are a good calling hand. The UTG range is strong, so 3-betting risks facing only better hands. Calling lets you set-mine and play postflop with a solid pair."
  },
  // --- Marginal / speculative hands ---
  {
    hand: "78s", position: "BTN", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Suited connectors on the button are a standard open-raise. You have position and a hand with great playability that can make straights and flushes. Folding the button with a suited connector is too tight."
  },
  {
    hand: "A5s", position: "CO", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Suited ace-five is a solid open from the cutoff. It has nut-flush potential and can make the wheel straight. The suited ace gives you enough equity and playability to open from late position."
  },
  {
    hand: "KJo", position: "UTG", action: "Folded to you",
    correct: "Fold", choices: ["Raise", "Fold", "Call"],
    explanation: "King-jack offsuit from UTG is too weak to open in a tournament. It's easily dominated by AK, AJ, KQ, and you're out of position against most callers. Discipline in early position is key to tournament survival."
  },
  {
    hand: "56s", position: "SB", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "When folded to you in the small blind, suited connectors are a raise to attack the big blind. You should be opening a wide range heads-up against the BB. Completing is usually worse than raising or folding."
  },
  {
    hand: "Q9o", position: "UTG", action: "Folded to you",
    correct: "Fold", choices: ["Raise", "Call", "Fold"],
    explanation: "Queen-nine offsuit from UTG is a clear fold. This hand is too weak and easily dominated from early position. Playing marginal hands out of position leads to difficult spots and tournament bust-outs."
  },
  {
    hand: "ATo", position: "MP", action: "Opponent raises to 2.5x from UTG",
    correct: "Fold", choices: ["Call", "Fold", "Re-raise (3-bet)"],
    explanation: "Ace-ten offsuit is dominated by much of an UTG opening range (AK, AQ, AJ). Calling leaves you out of position with a hand that's often second-best. Folding avoids a costly dominated situation."
  },
  {
    hand: "22", position: "BTN", action: "Opponent raises to 2.5x from MP",
    correct: "Call", choices: ["Call", "Fold", "Re-raise (3-bet)"],
    explanation: "Small pocket pairs on the button are a good call to set-mine. You have position and implied odds if you hit your set. 3-betting would turn your hand into a bluff with little fold equity."
  },
  {
    hand: "K9s", position: "BTN", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Suited king-nine on the button is a standard open-raise. You have position, a decent high card, and flush potential. The button is the most profitable position and you should open a wide range."
  },
  {
    hand: "J8o", position: "CO", action: "Opponent raises to 2.5x from HJ",
    correct: "Fold", choices: ["Call", "Re-raise (3-bet)", "Fold"],
    explanation: "Jack-eight offsuit has poor playability against a raise. It lacks the connectivity and suit to justify calling, and it's not strong enough to 3-bet. Saving chips with clean folds is critical in tournaments."
  },
  // --- Short stack spots ---
  {
    hand: "A2s", position: "BTN", action: "Folded to you (15 BB stack)",
    correct: "All-in", choices: ["All-in", "Fold", "Raise to 2x"],
    explanation: "With 15 big blinds, suited aces are a shove from the button. Push/fold strategy takes over at short stacks. A suited ace has enough equity against calling ranges to make this a profitable shove."
  },
  {
    hand: "K7o", position: "SB", action: "Folded to you (12 BB stack)",
    correct: "All-in", choices: ["All-in", "Fold", "Raise to 2x"],
    explanation: "At 12 BBs in the small blind, king-seven is a standard shove against the big blind. You don't have the stack depth to raise/fold, so shoving applies maximum pressure. ICM aside, this is a clear push."
  },
  {
    hand: "T3o", position: "UTG", action: "Folded to you (10 BB stack)",
    correct: "Fold", choices: ["All-in", "Fold", "Raise to 2x"],
    explanation: "Ten-three offsuit from UTG is too weak to shove even at 10 BBs. There are too many players left to act who can wake up with better hands. Wait for a better spot or a better hand."
  },
  {
    hand: "QJs", position: "CO", action: "Opponent raises, another re-raises all-in",
    correct: "Fold", choices: ["Call", "Fold", "Re-raise all-in"],
    explanation: "Facing a raise and an all-in re-raise, QJs is in bad shape. The all-in range here is heavily weighted toward big pairs and AK. Your hand has too little equity against that range to call."
  },
  {
    hand: "99", position: "SB", action: "Folded to you (20 BB stack)",
    correct: "All-in", choices: ["All-in", "Raise to 2x", "Fold"],
    explanation: "Pocket nines with 20 BBs from the small blind is a strong shove. A standard raise commits too much of your stack, making a shove the cleaner play. Nines have excellent equity against the BB's calling range."
  },
  {
    hand: "AJo", position: "HJ", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "Ace-jack offsuit from the hijack is a standard open-raise. You have a strong top-card hand in a middle-late position. This is well within a solid opening range from this seat."
  },
  {
    hand: "87o", position: "UTG+1", action: "Folded to you",
    correct: "Fold", choices: ["Raise", "Call", "Fold"],
    explanation: "Eight-seven offsuit from early position is a fold. Without a suit, you lack the implied odds to play speculative hands. Early position requires hands with strong high-card value or premium pairs."
  },
];

let correct = 0;
let total = 0;
let usedIndices = [];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSuit() {
  return SUITS[Math.floor(Math.random() * SUITS.length)];
}

function parseHand(handStr) {
  const suited = handStr.endsWith("s");
  const offsuit = handStr.endsWith("o");
  const isPair = !suited && !offsuit && handStr.length === 2;

  let r1, r2;
  if (isPair) {
    r1 = handStr[0];
    r2 = handStr[1];
  } else {
    r1 = handStr[0];
    r2 = handStr[1];
  }

  let s1 = randomSuit();
  let s2;
  if (suited) {
    s2 = s1;
  } else {
    do { s2 = randomSuit(); } while (s2.name === s1.name);
  }
  if (isPair) {
    do { s2 = randomSuit(); } while (s2.name === s1.name);
  }

  return [
    { rank: r1, suit: s1 },
    { rank: r2, suit: s2 },
  ];
}

function renderCard(card) {
  const div = document.createElement("div");
  div.className = "card " + card.suit.color;
  div.innerHTML = `<span class="rank">${card.rank}</span><span class="suit">${card.suit.symbol}</span>`;
  return div;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQuestion() {
  if (usedIndices.length >= SCENARIOS.length) {
    usedIndices = [];
  }

  let idx;
  do {
    idx = Math.floor(Math.random() * SCENARIOS.length);
  } while (usedIndices.includes(idx));
  usedIndices.push(idx);

  const scenario = SCENARIOS[idx];
  const cards = parseHand(scenario.hand);

  const cardsEl = document.getElementById("cards");
  cardsEl.innerHTML = "";
  cards.forEach((c) => cardsEl.appendChild(renderCard(c)));

  const pos = scenario.position === "any" ? pickRandom(POSITIONS) : scenario.position;
  document.getElementById("position").textContent = pos;

  const stackText = scenario.action.includes("BB stack")
    ? scenario.action.match(/\d+ BB/)[0]
    : Math.floor(Math.random() * 30 + 20) + " BB";
  document.getElementById("stack").textContent = stackText;
  document.getElementById("action").textContent = scenario.action.replace(/\s*\(\d+ BB stack\)/, "");

  const choicesEl = document.getElementById("choices");
  choicesEl.innerHTML = "";
  const shuffled = shuffle([...scenario.choices]);

  shuffled.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(choice, scenario.correct, scenario.explanation);
    choicesEl.appendChild(btn);
  });

  document.getElementById("explanation").classList.remove("show");
  document.getElementById("nextBtn").classList.remove("show");
}

function handleAnswer(selected, correctAnswer, explanation) {
  total++;
  const buttons = document.querySelectorAll(".choice-btn");

  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add("correct");
    } else if (btn.textContent === selected && selected !== correctAnswer) {
      btn.classList.add("wrong");
    }
  });

  if (selected === correctAnswer) {
    correct++;
  }

  document.getElementById("score").textContent = `Score: ${correct} / ${total}`;

  const expEl = document.getElementById("explanation");
  expEl.textContent = explanation;
  expEl.classList.add("show");

  document.getElementById("nextBtn").classList.add("show");
}

loadQuestion();
