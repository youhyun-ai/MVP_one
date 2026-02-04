const SUITS = [
  { symbol: "\u2660", name: "s", color: "black" },
  { symbol: "\u2665", name: "h", color: "red" },
  { symbol: "\u2666", name: "d", color: "red" },
  { symbol: "\u2663", name: "c", color: "black" },
];

const RANKS = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const POSITIONS = ["UTG","UTG+1","MP","HJ","CO","BTN","SB","BB"];

// =========================================================
// PREFLOP SCENARIOS (intermediate-level)
// =========================================================
const PREFLOP_SCENARIOS = [
  // --- 3-bet and 4-bet decisions ---
  {
    hand: "AKo", position: "CO", action: "UTG opens 2.5x, HJ 3-bets to 7x",
    correct: "4-bet", choices: ["4-bet", "Call", "Fold"],
    explanation: "AKo has too much equity to fold facing a 3-bet when you close the action. 4-betting lets you define your hand's strength and take initiative. Flatting risks playing a bloated pot out of position multiway."
  },
  {
    hand: "JJ", position: "BTN", action: "CO opens 2.5x, you 3-bet to 7.5x, CO 4-bets to 18x",
    correct: "Call", choices: ["Call", "5-bet all-in", "Fold"],
    explanation: "Jacks are too strong to fold but not strong enough to 5-bet shove at deep stacks. The CO 4-bet range includes bluffs and hands you dominate like TT and AQ. Calling keeps their bluffs in and lets you play postflop with position."
  },
  {
    hand: "A5s", position: "BTN", action: "CO opens 2.5x",
    correct: "3-bet", choices: ["3-bet", "Call", "Fold"],
    explanation: "Suited ace-five is the ideal 3-bet bluff from the button. It blocks AA and A5 nut combos, has nut-flush and wheel-straight potential, and plays poorly as a flat. 3-betting balances your value range with a hand that has good equity when called."
  },
  {
    hand: "QQ", position: "BB", action: "BTN opens 2.5x, SB 3-bets to 9x",
    correct: "4-bet", choices: ["4-bet", "Call", "5-bet all-in"],
    explanation: "Queens in the BB facing a squeeze should 4-bet at intermediate stack depths. Just calling lets the original raiser come along cheaply. 4-betting isolates the 3-bettor and gets value from worse hands in their range like AQ, JJ, TT."
  },
  {
    hand: "KQs", position: "HJ", action: "UTG opens 2.5x",
    correct: "Call", choices: ["Call", "3-bet", "Fold"],
    explanation: "KQs is a strong hand but 3-betting into an UTG range is risky—you'll mostly get action from better. Calling preserves equity against their wider continuing range. You have good playability postflop with two broadway cards and a flush draw possibility."
  },
  // --- Squeeze spots ---
  {
    hand: "TT", position: "SB", action: "HJ opens 2.5x, CO and BTN both call",
    correct: "Squeeze (raise to ~12x)", choices: ["Squeeze (raise to ~12x)", "Call", "Fold"],
    explanation: "Tens in the SB with two cold-callers is a textbook squeeze spot. The callers have capped ranges and will fold most of their hands. Squeezing takes down a large pot preflop or isolates against a range you're ahead of."
  },
  {
    hand: "AJo", position: "BB", action: "CO opens 2.5x, BTN calls",
    correct: "Squeeze (raise to ~9x)", choices: ["Squeeze (raise to ~9x)", "Call", "Fold"],
    explanation: "AJo in the BB with a caller behind is a solid squeeze. The BTN's cold-call range is capped and folds to aggression often. Squeezing also avoids playing a marginal hand out of position in a multiway pot."
  },
  // --- Tricky 3-bet pots ---
  {
    hand: "88", position: "MP", action: "UTG opens 2.5x (25 BB effective)",
    correct: "All-in", choices: ["All-in", "Call", "Fold"],
    explanation: "At 25 BBs effective, eights are a reshove against a UTG open. You don't have the stack depth to call and set-mine profitably. Shoving applies fold equity against hands like AQ and AJ while flipping with overcards if called."
  },
  {
    hand: "AQo", position: "CO", action: "UTG opens 2.5x (20 BB effective)",
    correct: "All-in", choices: ["All-in", "Call", "Fold"],
    explanation: "At 20 BBs, AQo is a standard reshove over a UTG open. The stack-to-pot ratio doesn't support flatting, and folding is far too tight. You have good equity against their calling range and strong fold equity against their opening range."
  },
  // --- Blind vs blind ---
  {
    hand: "K4o", position: "SB", action: "Folded to you (30 BB)",
    correct: "Raise", choices: ["Raise", "Fold", "All-in"],
    explanation: "Blind vs blind at 30 BBs, K4o is a standard open from the SB. You only need to get through one player and have a king-high hand. Folding any king here is too tight; shoving is unnecessary with this much stack depth."
  },
  {
    hand: "J7s", position: "BB", action: "SB raises to 3x (30 BB effective)",
    correct: "Call", choices: ["Call", "3-bet", "Fold"],
    explanation: "J7 suited defends profitably against a wide SB opening range. You close the action and get a good price with a hand that has flush and straight potential. 3-betting turns a profitable defend into a marginal bluff."
  },
  {
    hand: "T8s", position: "BB", action: "SB raises to 2.5x (40 BB effective)",
    correct: "3-bet", choices: ["3-bet", "Call", "Fold"],
    explanation: "T8 suited is a good 3-bet from the BB against a SB open. It has great playability with straight and flush draws, and 3-betting takes the initiative. At 40 BBs you have enough depth to play postflop after a 3-bet."
  },
  // --- ICM / bubble pressure ---
  {
    hand: "AKs", position: "CO", action: "Folded to you, bubble of a tournament (30 BB)",
    correct: "Raise", choices: ["Raise", "All-in", "Fold"],
    explanation: "AKs is far too strong to fold on any bubble. Open-raising keeps your range disguised and gives you postflop options. Shoving 30 BBs is unnecessarily aggressive when a standard raise accomplishes the same pressure with less risk."
  },
  {
    hand: "55", position: "BTN", action: "Folded to you, 3 from the money (18 BB)",
    correct: "All-in", choices: ["All-in", "Fold", "Raise to 2x"],
    explanation: "Pocket fives on the button near the bubble at 18 BBs is a clear shove. You apply maximum ICM pressure on the blinds who must call tighter. A min-raise commits too much of your stack and gives opponents a better price to play back."
  },
  {
    hand: "K9o", position: "UTG", action: "Folded to you, on the money bubble (22 BB)",
    correct: "Fold", choices: ["Raise", "Fold", "All-in"],
    explanation: "K9o from UTG on the bubble is a disciplined fold. Early position opens face many players who can wake up with better holdings. ICM pressure means getting caught here costs more than the pot you'd win by stealing."
  },
  // --- Mixed / close spots ---
  {
    hand: "ATs", position: "MP", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "ATs from MP is a standard open in any tournament format. It has strong high-card value, nut-flush potential, and plays well postflop. Folding suited aces from middle position is overly nitty for intermediate play."
  },
  {
    hand: "76s", position: "HJ", action: "UTG opens 2.5x",
    correct: "Fold", choices: ["Call", "3-bet", "Fold"],
    explanation: "76 suited lacks the implied odds to call an early position raise from the HJ. You're out of position with a speculative hand against a strong range. Calling here bleeds chips in spots where you rarely flop well enough to continue."
  },
  {
    hand: "KJo", position: "CO", action: "HJ opens 2.5x",
    correct: "Fold", choices: ["Call", "3-bet", "Fold"],
    explanation: "KJo is dominated by much of the HJ opening range—AK, AJ, KQ all crush you. Calling leads to reverse implied odds when you hit top pair with a bad kicker. This is a clear fold that intermediate players often misplay as a call."
  },
  {
    hand: "QTs", position: "BTN", action: "CO opens 2.5x",
    correct: "Call", choices: ["Call", "3-bet", "Fold"],
    explanation: "QTs on the button is a profitable flat against a CO open. You have position, good playability, and straight/flush potential. 3-betting works sometimes but flatting is the higher EV line with this hand's postflop equity."
  },
  {
    hand: "AJo", position: "UTG", action: "Folded to you (6-max table)",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "AJo from UTG at a 6-max table is a standard open. UTG in 6-max is equivalent to HJ in a full ring, so your range should be wider. AJo has enough strength and playability to open from this position."
  },
  {
    hand: "44", position: "CO", action: "UTG raises 2.5x, MP 3-bets to 7x",
    correct: "Fold", choices: ["Call", "Fold", "4-bet"],
    explanation: "Small pairs facing a raise and a 3-bet are in terrible shape. You don't have the implied odds to set-mine in a 3-bet pot, and you're crushed by both ranges. Folding saves chips for better spots."
  },
  {
    hand: "T9s", position: "BTN", action: "Folded to you",
    correct: "Raise", choices: ["Raise", "Fold", "Call"],
    explanation: "T9 suited on the button is one of the best speculative opens in poker. You have position, two live cards, and excellent straight and flush potential. This is a mandatory open that should never be folded."
  },
  {
    hand: "KK", position: "SB", action: "BTN opens 2.5x (you have 35 BB)",
    correct: "3-bet", choices: ["3-bet", "All-in", "Call"],
    explanation: "Kings in the SB facing a BTN open should 3-bet for value, not shove. At 35 BBs, shoving over-commits and folds out everything except hands that beat or flip with you. A 3-bet to ~8x builds the pot while keeping worse hands in."
  },
  {
    hand: "A8o", position: "HJ", action: "UTG opens 2.5x, MP calls",
    correct: "Fold", choices: ["Call", "Fold", "Squeeze"],
    explanation: "A8o facing a UTG open and a cold-call is a clear fold. Your hand is dominated by much of UTG's range and you'll be out of position. Squeezing with this hand is too thin—you'll get called by better and fold out worse."
  },
];

// =========================================================
// FLOP SCENARIOS (intermediate-level)
// =========================================================
const FLOP_SCENARIOS = [
  {
    hand: "AKs", board: ["Q","7","2"], boardSuits: ["rainbow"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Continuation bet (~3.5 BB)", choices: ["Continuation bet (~3.5 BB)", "Check back", "Bet pot (7 BB)"],
    explanation: "AK on a dry Q-7-2 board has two overcards and strong equity. A half-pot c-bet takes advantage of your range advantage on this board. Checking gives up the initiative and lets villain realize equity for free with hands like T9 or 65."
  },
  {
    hand: "JJ", board: ["A","8","3"], boardSuits: ["rainbow"],
    position: "MP", villain: "BB", pot: "6.5 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Check back", choices: ["Continuation bet", "Check back", "Bet pot"],
    explanation: "Jacks on an ace-high board should often check in position. Your hand has decent showdown value but gets called mostly by better (any ace). Checking controls the pot size and lets you get to showdown cheaply against villain's check-call range."
  },
  {
    hand: "87s", board: ["6","5","K"], boardSuits: ["two-tone"],
    position: "BTN", villain: "CO", pot: "7 BB",
    action: "CO raised preflop, you called on BTN. CO c-bets 3.5 BB",
    correct: "Raise to ~10 BB", choices: ["Raise to ~10 BB", "Call", "Fold"],
    explanation: "You have an open-ended straight draw on a board where raising puts CO in a tough spot. Raising semi-bluffs with strong equity and can win immediately. Calling is fine but raising builds a bigger pot when you hit and applies maximum pressure."
  },
  {
    hand: "AQo", board: ["Q","T","6"], boardSuits: ["two-tone"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB donk-bets 5 BB",
    correct: "Raise to ~14 BB", choices: ["Raise to ~14 BB", "Call", "Fold"],
    explanation: "Top pair top kicker facing a donk-bet should raise for value and protection. The board is draw-heavy with straight and flush possibilities, so you need to charge draws. Donk-bet ranges are often weak and fold to aggression frequently."
  },
  {
    hand: "TT", board: ["J","T","4"], boardSuits: ["rainbow"],
    position: "BB", villain: "BTN", pot: "7 BB",
    action: "BTN raised preflop, you called in BB. You check, BTN bets 3 BB",
    correct: "Check-raise to ~10 BB", choices: ["Check-raise to ~10 BB", "Call", "Fold"],
    explanation: "Middle set on a relatively dry board is a strong check-raise candidate. You want to build the pot with a disguised monster. Calling risks letting villain check back the turn and miss value with the second-best hand possible here."
  },
  {
    hand: "AKo", board: ["9","8","7"], boardSuits: ["two-tone"],
    position: "UTG", villain: "BB", pot: "6.5 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Check back", choices: ["Continuation bet", "Check back", "Bet pot"],
    explanation: "AK completely whiffs this coordinated board that heavily favors the BB's range. The BB calls with suited connectors, pocket pairs, and suited one-gappers that all connect here. Checking preserves your equity and avoids a check-raise on a board where you have no pair."
  },
  {
    hand: "KQs", board: ["K","9","4"], boardSuits: ["rainbow"],
    position: "BTN", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Bet ~3 BB", choices: ["Bet ~3 BB", "Check back", "Bet pot (7 BB)"],
    explanation: "Top pair with a queen kicker on a dry board wants a small value bet. A third-pot sizing extracts value from worse pairs and ace-highs. Betting big folds out everything you beat and only gets called by hands that beat you."
  },
  {
    hand: "66", board: ["A","K","6"], boardSuits: ["two-tone"],
    position: "BB", villain: "CO", pot: "7 BB",
    action: "CO raised preflop, you called in BB. You check, CO bets 3.5 BB",
    correct: "Call", choices: ["Call", "Check-raise", "Fold"],
    explanation: "Bottom set on AK6 is a monster, but check-raising scares away everything you beat. Calling traps villain into barreling turns with worse hands and bluffs. The board favors their range, so they'll keep betting with many second-best hands."
  },
  {
    hand: "98s", board: ["T","7","2"], boardSuits: ["rainbow"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB check-raises your 3 BB c-bet to 10 BB",
    correct: "Call", choices: ["Call", "Fold", "Re-raise"],
    explanation: "Open-ended straight draw with a gutshot (any 6 or J) facing a check-raise has excellent equity. You have the odds to call and strong implied odds when you hit. Folding gives up too much equity and re-raising bloats the pot with a drawing hand."
  },
  {
    hand: "AA", board: ["J","T","9"], boardSuits: ["two-tone"],
    position: "CO", villain: "BTN", pot: "16 BB (3-bet pot)",
    action: "You 3-bet preflop, BTN called. You bet 8 BB, BTN raises to 22 BB",
    correct: "Call", choices: ["Call", "Re-raise all-in", "Fold"],
    explanation: "Aces on a coordinated JT9 board facing a raise should call rather than re-raise. The board connects heavily with BTN's flatting range (QJ, JT, 87, sets). Calling keeps bluffs in and lets you re-evaluate on the turn rather than committing your stack on a dangerous board."
  },
  {
    hand: "AJs", board: ["A","8","5"], boardSuits: ["two-tone, you have backdoor flush draw"],
    position: "BTN", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB donk-bets 2 BB",
    correct: "Raise to ~7 BB", choices: ["Raise to ~7 BB", "Call", "Fold"],
    explanation: "Top pair strong kicker facing a small donk-bet should raise for value and protection. The donk sizing is weak and often indicates a draw or marginal pair testing the water. Raising charges draws and defines your hand as strong."
  },
  {
    hand: "KTs", board: ["K","7","3"], boardSuits: ["monotone, you have the flush draw"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Bet ~5 BB", choices: ["Bet ~5 BB", "Check back", "Bet pot (7 BB)"],
    explanation: "Top pair with the nut flush draw is a premium combo that should bet for value and protection. On a monotone board, opponents with a single high card of that suit will call. Larger sizing charges the one-card flush draws that have roughly 35% equity against you."
  },
  {
    hand: "QJo", board: ["T","9","3"], boardSuits: ["rainbow"],
    position: "BB", villain: "CO", pot: "6.5 BB",
    action: "CO raised preflop, you called in BB. You check, CO bets 3 BB",
    correct: "Call", choices: ["Call", "Check-raise", "Fold"],
    explanation: "Open-ended straight draw on a dry board is a clear call against a c-bet. You have eight outs to the nuts and position doesn't matter since you close the action. Check-raising is aggressive but turns a strong drawing hand into a bluff unnecessarily."
  },
  {
    hand: "55", board: ["A","Q","J"], boardSuits: ["two-tone"],
    position: "BTN", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB check-raises your 3 BB bet to 10 BB",
    correct: "Fold", choices: ["Call", "Fold", "Re-raise"],
    explanation: "Pocket fives on AQJ facing a check-raise have almost zero equity. The board connects with nearly everything in the BB's check-raise range—two pair, sets, straights, and strong draws. Your hand has no realistic path to winning this pot."
  },
  {
    hand: "ATo", board: ["A","9","5"], boardSuits: ["rainbow"],
    position: "MP", villain: "BB", pot: "6.5 BB",
    action: "You raised preflop, BB called. BB leads for 5 BB",
    correct: "Call", choices: ["Call", "Raise to ~14 BB", "Fold"],
    explanation: "Top pair decent kicker facing a lead should call to keep villain's range wide. Raising folds out bluffs and worse aces that might fire again. The dry board means you're rarely behind to draws, so there's no urgency to protect."
  },
  {
    hand: "KK", board: ["A","7","2"], boardSuits: ["rainbow"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Bet ~2.5 BB", choices: ["Bet ~2.5 BB", "Check back", "Bet pot (7 BB)"],
    explanation: "Kings on an ace-high dry board should still c-bet small. Many hands in BB's range missed this board entirely, and a small bet extracts value from medium pairs and gets folds from overcards. Checking back lets villain realize free equity with hands you currently beat."
  },
  {
    hand: "97s", board: ["8","6","2"], boardSuits: ["two-tone, you have flush draw"],
    position: "BTN", villain: "CO", pot: "7 BB",
    action: "CO raised preflop, you called. CO bets 3.5 BB",
    correct: "Raise to ~10 BB", choices: ["Raise to ~10 BB", "Call", "Fold"],
    explanation: "You have an open-ended straight draw plus a flush draw—a monster combo draw with 15 outs. Semi-bluff raising applies pressure and can take the pot immediately. You have roughly 55% equity even if called, making this a value raise in disguise."
  },
  {
    hand: "QQ", board: ["K","8","4"], boardSuits: ["rainbow"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB check-raises your 3 BB c-bet to 10 BB",
    correct: "Call", choices: ["Call", "Re-raise", "Fold"],
    explanation: "Queens facing a check-raise on a king-high board are in a tough but playable spot. You beat bluffs, draws, and slowplayed middle pairs in villain's range. Folding is too tight and re-raising only gets called by better—calling and re-evaluating the turn is best."
  },
  {
    hand: "A4s", board: ["K","J","5"], boardSuits: ["two-tone, you have backdoor flush draw"],
    position: "BTN", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB checks to you",
    correct: "Bet ~2.5 BB", choices: ["Bet ~2.5 BB", "Check back", "Bet pot"],
    explanation: "A4 suited with a backdoor flush draw on KJ5 is a good small c-bet candidate. You have overcards, a backdoor nut flush draw, and a gutshot to the wheel. Small sizing puts pressure on BB's weak pairs and unpaired hands while keeping the pot manageable."
  },
  {
    hand: "JTs", board: ["9","8","2"], boardSuits: ["rainbow"],
    position: "CO", villain: "BB", pot: "7 BB",
    action: "You raised preflop, BB called. BB check-raises your 3 BB c-bet to 10 BB",
    correct: "Call", choices: ["Call", "Re-raise all-in", "Fold"],
    explanation: "Open-ended straight draw facing a check-raise has excellent pot odds and implied odds. Any 7 or Q gives you the nuts, and you have two overcards as potential outs. Re-raising commits too many chips with a draw, but folding throws away strong equity."
  },
];

// =========================================================
// Engine
// =========================================================
let currentMode = null;
let scenarios = [];
let correctCount = 0;
let totalCount = 0;
let usedIndices = [];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomSuit() { return SUITS[Math.floor(Math.random() * SUITS.length)]; }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function parseHand(handStr) {
  const suited = handStr.endsWith("s");
  const offsuit = handStr.endsWith("o");
  const r1 = handStr[0];
  const r2 = handStr[1];

  let s1 = randomSuit();
  let s2;
  if (suited) {
    s2 = s1;
  } else {
    do { s2 = randomSuit(); } while (s2.name === s1.name);
  }
  return [
    { rank: r1, suit: s1 },
    { rank: r2, suit: s2 },
  ];
}

function generateBoardCards(boardRanks, boardSuitsHint) {
  let suits;
  if (boardSuitsHint[0] === "rainbow") {
    suits = shuffle([...SUITS]).slice(0, 3);
  } else if (boardSuitsHint[0].startsWith("monotone")) {
    const s = randomSuit();
    suits = [s, s, s];
  } else {
    const s1 = randomSuit();
    let s2;
    do { s2 = randomSuit(); } while (s2.name === s1.name);
    suits = shuffle([s1, s1, s2]);
  }
  return boardRanks.map((r, i) => ({ rank: r, suit: suits[i] }));
}

function renderCard(card) {
  const div = document.createElement("div");
  div.className = "card " + card.suit.color;
  div.innerHTML = `<span class="rank">${card.rank}</span><span class="suit">${card.suit.symbol}</span>`;
  return div;
}

// --- Navigation ---
function startQuiz(mode) {
  currentMode = mode;
  scenarios = mode === "preflop" ? PREFLOP_SCENARIOS : FLOP_SCENARIOS;
  correctCount = 0;
  totalCount = 0;
  usedIndices = [];

  document.getElementById("modeSelect").classList.add("hidden");
  document.getElementById("quizScreen").classList.remove("hidden");
  document.getElementById("quizTitle").textContent = mode === "preflop" ? "Preflop Quiz" : "Flop Quiz";
  document.getElementById("score").textContent = "Score: 0 / 0";
  loadQuestion();
}

function goBack() {
  document.getElementById("quizScreen").classList.add("hidden");
  document.getElementById("modeSelect").classList.remove("hidden");
}

// --- Load question ---
function loadQuestion() {
  if (usedIndices.length >= scenarios.length) usedIndices = [];

  let idx;
  do { idx = Math.floor(Math.random() * scenarios.length); } while (usedIndices.includes(idx));
  usedIndices.push(idx);

  const s = scenarios[idx];
  const cards = parseHand(s.hand);

  // Render hole cards
  const cardsEl = document.getElementById("cards");
  cardsEl.innerHTML = "";
  cards.forEach(c => cardsEl.appendChild(renderCard(c)));

  // Board (flop mode only)
  const boardSection = document.getElementById("boardSection");
  const boardEl = document.getElementById("board");
  const potBox = document.getElementById("potBox");

  if (currentMode === "flop") {
    boardSection.classList.remove("hidden");
    boardEl.innerHTML = "";
    const boardCards = generateBoardCards(s.board, s.boardSuits);
    boardCards.forEach(c => boardEl.appendChild(renderCard(c)));
    potBox.classList.remove("hidden");
    document.getElementById("pot").textContent = s.pot;
  } else {
    boardSection.classList.add("hidden");
    potBox.classList.add("hidden");
  }

  // Position & stack
  const pos = s.position === "any" ? pickRandom(POSITIONS) : s.position;
  document.getElementById("position").textContent = pos;

  const stackMatch = s.action.match(/(\d+ BB)/);
  const stackText = stackMatch ? stackMatch[1] : (Math.floor(Math.random() * 30 + 20) + " BB");
  document.getElementById("stack").textContent = stackText;

  // Action
  document.getElementById("actionLabel").textContent = currentMode === "flop" ? "Situation" : "Action To You";
  document.getElementById("action").textContent = s.action.replace(/\s*\(\d+ BB[^)]*\)/, "");

  // Question
  document.getElementById("question").textContent = "What should you do?";

  // Choices
  const choicesEl = document.getElementById("choices");
  choicesEl.innerHTML = "";
  shuffle([...s.choices]).forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.onclick = () => handleAnswer(choice, s.correct, s.explanation);
    choicesEl.appendChild(btn);
  });

  document.getElementById("explanation").classList.remove("show");
  document.getElementById("nextBtn").classList.remove("show");
}

function handleAnswer(selected, correctAnswer, explanation) {
  totalCount++;
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) btn.classList.add("correct");
    else if (btn.textContent === selected && selected !== correctAnswer) btn.classList.add("wrong");
  });
  if (selected === correctAnswer) correctCount++;
  document.getElementById("score").textContent = `Score: ${correctCount} / ${totalCount}`;
  const expEl = document.getElementById("explanation");
  expEl.textContent = explanation;
  expEl.classList.add("show");
  document.getElementById("nextBtn").classList.add("show");
}
