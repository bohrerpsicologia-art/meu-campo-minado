/**
 * CONFIGURAÇÕES DO JOGO
 * Para expandir o jogo (ex: novos tamanhos de tabuleiro), altere estas constantes.
 */
const BOARD_SIZE = 16;
const MINES_COUNT = 51;
let minesLocation = [];
let board = [];
let scores = [0, 0];
let currentPlayer = 0; // 0 para Azul, 1 para Vermelho
let gameOver = false;
let gameMode = 'pvp';
let difficulty = 3;
let powerups = [1, 1]; // Uma bomba grande para cada jogador
let powerupActive = false;
let turnTimer = null;
let timeLeft = 60;
let lastMoveTile = null;

// Referências do DOM
const boardElement = document.getElementById('board');
const score1Element = document.getElementById('score1');
const score2Element = document.getElementById('score2');
const turnIndicator = document.getElementById('turn-indicator');
const minesLeftElement = document.getElementById('mines-left');
const timerElement = document.getElementById('timer');
const gameModeSelect = document.getElementById('game-mode');
const difficultySelect = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game');
const player1Panel = document.getElementById('player1-info');
const player2Panel = document.getElementById('player2-info');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupGame();

    newGameBtn.addEventListener('click', setupGame);

    gameModeSelect.addEventListener('change', (e) => {
        gameMode = e.target.value;
        difficultySelect.style.display = gameMode === 'pve' ? 'block' : 'none';
        setupGame();
    });

    difficultySelect.addEventListener('change', (e) => {
        difficulty = parseInt(e.target.value);
        setupGame();
    });

    document.getElementById('btn-bomb-1').addEventListener('click', () => usePowerup(0));
    document.getElementById('btn-bomb-2').addEventListener('click', () => usePowerup(1));
});

function setupGame() {
    // Resetar variáveis
    board = [];
    minesLocation = [];
    scores = [0, 0];
    currentPlayer = 0;
    gameOver = false;
    powerups = [1, 1];
    powerupActive = false;
    lastMoveTile = null;

    // Atualizar UI
    score1Element.textContent = '0';
    score2Element.textContent = '0';
    turnIndicator.textContent = 'Vez do Azul';
    minesLeftElement.textContent = `Minas: ${MINES_COUNT}`;
    updatePlayerPanels();
    updatePowerupButtons();
    startTimer();

    // Criar tabuleiro lógico e visual
    boardElement.innerHTML = '';
    createMines();

    for (let r = 0; r < BOARD_SIZE; r++) {
        let row = [];
        for (let c = 0; c < BOARD_SIZE; c++) {
            let tile = document.createElement('div');
            tile.id = `${r}-${c}`;
            tile.className = 'tile';
            tile.addEventListener('click', () => handleTileClick(r, c));
            tile.addEventListener('mouseenter', () => handleTileHover(r, c));
            tile.addEventListener('mouseleave', () => clearTileHovers());
            boardElement.appendChild(tile);
            row.push({
                r, c,
                isMine: minesLocation.includes(`${r}-${c}`),
                revealed: false,
                owner: null // 0 ou 1 quem achou a mina
            });
        }
        board.push(row);
    }
}

function createMines() {
    let minesLeft = MINES_COUNT;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * BOARD_SIZE);
        let c = Math.floor(Math.random() * BOARD_SIZE);
        let id = `${r}-${c}`;
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

function handleTileHover(r, c) {
    if (!powerupActive || gameOver) return;
    clearTileHovers();

    // Destacar área 3x3
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                document.getElementById(`${nr}-${nc}`).classList.add('highlight-bomb');
            }
        }
    }
}

function clearTileHovers() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(t => t.classList.remove('highlight-bomb'));
}

function handleTileClick(r, c) {
    if (gameOver) return;

    const tileData = board[r][c];
    if (tileData.revealed) return;

    if (powerupActive) {
        applyBigBomb(r, c);
        return;
    }

    processMove(r, c);
}

function markLastMove(r, c) {
    if (lastMoveTile && lastMoveTile.classList) {
        lastMoveTile.classList.remove('last-move');
    }
    lastMoveTile = document.getElementById(`${r}-${c}`);
    if (lastMoveTile) lastMoveTile.classList.add('last-move');
}

function processMove(r, c) {
    const tileData = board[r][c];
    tileData.revealed = true;
    const tileElement = document.getElementById(`${r}-${c}`);
    tileElement.classList.add('revealed');

    markLastMove(r, c);
    resetTimer();

    if (tileData.isMine) {
        // Encontrou uma mina!
        tileData.owner = currentPlayer;
        tileElement.classList.add(currentPlayer === 0 ? 'mine-p1' : 'mine-p2');
        tileElement.innerHTML = '💣';
        scores[currentPlayer]++;
        updateScores();

        const remainingMines = MINES_COUNT - (scores[0] + scores[1]);
        minesLeftElement.textContent = `Minas: ${remainingMines}`;

        if (checkEarlyWin() || scores[0] + scores[1] === MINES_COUNT) {
            endGame();
        } else {
            // No MSN Flags, quem acerta joga de novo.
            // Se for humano vs máquina, chamamos a máquina de novo se ela acertou.
            if (gameMode === 'pve' && currentPlayer === 1) {
                setTimeout(machineMove, 600);
            }
        }
    } else {
        // Errou
        const count = countNeighborMines(r, c);
        if (count > 0) {
            tileElement.textContent = count;
            tileElement.style.color = getNumberColor(count);
        } else {
            // No MSN Flags, clicar num vazio (0) abre em cascata para acelerar o jogo
            revealEmptyCascade(r, c);
        }

        switchTurn();
    }
}

function checkEarlyWin() {
    const remainingMines = MINES_COUNT - (scores[0] + scores[1]);
    const scoreDiff = Math.abs(scores[0] - scores[1]);

    // Se a diferença for maior que as minas restantes, quem está na frente já venceu
    if (scoreDiff > remainingMines) {
        return true;
    }
    return false;
}

function revealEmptyCascade(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                const target = board[nr][nc];
                if (!target.revealed && !target.isMine) {
                    target.revealed = true;
                    const tileEl = document.getElementById(`${nr}-${nc}`);
                    tileEl.classList.add('revealed');
                    const count = countNeighborMines(nr, nc);
                    if (count > 0) {
                        tileEl.textContent = count;
                        tileEl.style.color = getNumberColor(count);
                    } else {
                        revealEmptyCascade(nr, nc);
                    }
                }
            }
        }
    }
}

function switchTurn() {
    if (gameOver) return;
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    updatePlayerPanels();
    turnIndicator.textContent = `Vez do ${currentPlayer === 0 ? 'Azul' : 'Vermelho'}`;
    resetTimer();

    if (gameMode === 'pve' && currentPlayer === 1 && !gameOver) {
        setTimeout(machineMove, 800);
    }
}

function countNeighborMines(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                if (board[nr][nc].isMine) count++;
            }
        }
    }
    return count;
}

/**
 * ATUALIZAÇÃO DE PONTUAÇÃO
 * GANCHO: Aqui você pode inserir uma chamada para salvar a pontuação em um banco de dados
 * ou atualizar um ranking online no futuro.
 */
function updateScores() {
    score1Element.textContent = scores[0];
    score2Element.textContent = scores[1];

    // Exemplo: if(window.database) window.database.saveScore(scores);
}

function updatePlayerPanels() {
    player1Panel.classList.toggle('active', currentPlayer === 0);
    player2Panel.classList.toggle('active', currentPlayer === 1);
}

function getNumberColor(n) {
    const colors = ['#000', '#0000FF', '#008000', '#FF0000', '#000080', '#800000', '#008080', '#000', '#808080'];
    return colors[n] || 'white';
}

function usePowerup(playerIndex) {
    if (currentPlayer !== playerIndex || powerups[playerIndex] <= 0 || gameOver || powerupActive) return;

    powerupActive = true;
    const btn = document.getElementById(`btn-bomb-${playerIndex + 1}`);
    btn.style.boxShadow = "0 0 15px var(--neon-yellow)";
    turnIndicator.textContent = "Selecione onde soltar a Bomba Grande!";
}

function applyBigBomb(r, c) {
    powerupActive = false;
    clearTileHovers();
    powerups[currentPlayer]--;
    updatePowerupButtons();
    markLastMove(r, c);
    resetTimer();

    const btn1 = document.getElementById('btn-bomb-1');
    const btn2 = document.getElementById('btn-bomb-2');
    btn1.style.boxShadow = "";
    btn2.style.boxShadow = "";

    // No MSN Flags, a bomba revela área e quem usou ganha os pontos.
    // É um item estratégico. Geralmente encerra o turno após o uso.
    let minesFound = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                const target = board[nr][nc];
                if (!target.revealed) {
                    if (target.isMine) minesFound++;
                    processTargetInBomb(nr, nc);
                }
            }
        }
    }

    const remainingMines = MINES_COUNT - (scores[0] + scores[1]);
    minesLeftElement.textContent = `Minas: ${remainingMines}`;

    if (checkEarlyWin() || scores[0] + scores[1] === MINES_COUNT) {
        endGame();
    } else {
        switchTurn();
    }
}

function processTargetInBomb(r, c) {
    const tileData = board[r][c];
    tileData.revealed = true;
    const tileElement = document.getElementById(`${r}-${c}`);
    tileElement.classList.add('revealed');

    if (tileData.isMine) {
        tileData.owner = currentPlayer;
        tileElement.classList.add(currentPlayer === 0 ? 'mine-p1' : 'mine-p2');
        tileElement.innerHTML = '💣';
        scores[currentPlayer]++;
        updateScores();
    } else {
        const count = countNeighborMines(r, c);
        if (count > 0) {
            tileElement.textContent = count;
            tileElement.style.color = getNumberColor(count);
        }
    }
}

function updatePowerupButtons() {
    document.getElementById('btn-bomb-1').disabled = powerups[0] <= 0;
    document.getElementById('btn-bomb-2').disabled = powerups[1] <= 0;
    document.querySelector('#powerup1 .count').textContent = powerups[0];
    document.querySelector('#powerup2 .count').textContent = powerups[1];
}

function machineMove() {
    if (gameOver || currentPlayer !== 1) return;

    // IA decide usar bomba?
    if (powerups[1] > 0 && Math.random() < 0.15 && difficulty >= 3) {
        // Encontrar uma área densa
        let bestR = 8, bestC = 8;
        applyBigBomb(bestR, bestC);
        return;
    }

    let move = null;

    if (difficulty >= 3) {
        move = getLogicalMove();
    }

    if (!move) {
        move = getGuessMove();
    }

    if (move) {
        processMove(move.r, move.c);
    }
}

function getLogicalMove() {
    // Procura por minas garantidas ou espaços seguros
    // No Flags, queremos clicar em MINAS.
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c].revealed && !board[r][c].isMine) {
                const count = countNeighborMines(r, c);
                const neighbors = getNeighbors(r, c);
                const hiddenNeighbors = neighbors.filter(n => !board[n.r][n.c].revealed);
                const revealedMines = neighbors.filter(n => board[n.r][n.c].revealed && board[n.r][n.c].isMine).length;

                // Se o número de vizinhos ocultos + minas já reveladas é igual ao número da célula,
                // então todos os ocultos são minas!
                if (hiddenNeighbors.length > 0 && (hiddenNeighbors.length + revealedMines === count)) {
                    // IA nível alto clica na mina com certeza
                    if (difficulty >= 4 || Math.random() < 0.7) {
                        return hiddenNeighbors[0];
                    }
                }
            }
        }
    }
    return null;
}

function getGuessMove() {
    let availableTiles = [];
    let mineTiles = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (!board[r][c].revealed) {
                availableTiles.push({r, c});
                if (board[r][c].isMine) mineTiles.push({r, c});
            }
        }
    }

    if (availableTiles.length === 0) return null;

    // Nível 5 (Gênio): 60% de chance de acertar uma mina no "chute" se não houver lógica clara
    if (difficulty === 5 && mineTiles.length > 0) {
        if (Math.random() < 0.6) {
            return mineTiles[Math.floor(Math.random() * mineTiles.length)];
        }
    }

    // Ajuste de probabilidade por dificuldade
    // Nível 1: Erra muito (escolhe deliberadamente não-minas se possível)
    if (difficulty === 1) {
        let safeTiles = availableTiles.filter(t => !board[t.r][t.c].isMine);
        if (safeTiles.length > 0 && Math.random() < 0.8) {
            return safeTiles[Math.floor(Math.random() * safeTiles.length)];
        }
    }

    // Padrão: aleatório
    return availableTiles[Math.floor(Math.random() * availableTiles.length)];
}

function getNeighbors(r, c) {
    let neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                neighbors.push({r: nr, c: nc});
            }
        }
    }
    return neighbors;
}

function startTimer() {
    clearInterval(turnTimer);
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    turnTimer = setInterval(() => {
        if (gameOver) {
            clearInterval(turnTimer);
            return;
        }
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(turnTimer);
            handleTimeOut();
        }
    }, 1000);
}

function resetTimer() {
    startTimer();
}

function handleTimeOut() {
    if (gameOver) return;
    switchTurn();
}

/**
 * FIM DE JOGO
 * GANCHO: Local ideal para exibir anúncios premiados ou botões de compartilhamento social.
 */
function endGame() {
    gameOver = true;
    clearInterval(turnTimer);
    let winner = "";
    let winnerId = -1;

    if (scores[0] > scores[1]) {
        winner = "AZUL VENCEU!";
        winnerId = 0;
    } else if (scores[1] > scores[0]) {
        winner = "VERMELHO VENCEU!";
        winnerId = 1;
    } else {
        winner = "EMPATE!";
    }

    turnIndicator.textContent = `FIM DE JOGO: ${winner}`;

    // Pequeno delay para permitir que o último clique seja processado visualmente
    setTimeout(() => {
        alert(`Fim de jogo! ${winner}\nPlacar: Azul ${scores[0]} x ${scores[1]} Vermelho`);

        // GANCHO: Chamar função de exibição de anúncio aqui
        // showInterstitialAd();
    }, 100);
}
