// ตัวแปร Global
let currentRegion = null;
let currentQuestion = 0;
let score = 0;
let totalQuestions = 0;
let selectedDifficulty = 'normal';
let questionsToPlay = [];
let highScores = [];

// Load high scores from localStorage
function loadHighScores() {
    const stored = localStorage.getItem('highScores');
    if (stored) {
        highScores = JSON.parse(stored);
    }
}

// Save high scores to localStorage
function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores.sort((a, b) => b.score - a.score).slice(0, 10)));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHighScores();
    generateStars();
});

// สร้าง Stars ในพื้นหลัง
function generateStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// เริ่มเกม
function startGame() {
    showScreen('region-select');
}

// วิธีเล่น
function howToPlay() {
    showScreen('how-to-play');
}

// แสดงคะแนนสูงสุด
function showScore() {
    showScreen('score-board');
}

// ตั้งค่า
function setting() {
    showScreen('settings');
}

// สร้าง Screen ต่างๆ
function createGameScreens() {
    const overlay = document.querySelector('.overlay');
    
    // Region Select Screen
    const regionSelect = document.createElement('div');
    regionSelect.className = 'game-screen';
    regionSelect.id = 'region-select';
    regionSelect.innerHTML = `
        <div class="game-header">
            <h2>🗺️ เลือกภาค</h2>
            <p>เลือกภาคที่ต้องการเรียนรู้ภาษาถิ่น</p>
        </div>
        <div class="region-grid">
            <button class="region-btn region-north" onclick="selectRegion('north')">
                🏔️<br>ภาคเหนือ
            </button>
            <button class="region-btn region-northeast" onclick="selectRegion('northeast')">
                🌾<br>ภาคตะวันออกเฉียงเหนือ
            </button>
            <button class="region-btn region-central" onclick="selectRegion('central')">
                🏙️<br>ภาคกลาง
            </button>
            <button class="region-btn region-south" onclick="selectRegion('south')">
                🏝️<br>ภาคใต้
            </button>
        </div>
        <button class="back-btn" onclick="backToMenu()">← ย้อนกลับ</button>
    `;
    
    // Game Screen
    const gameScreen = document.createElement('div');
    gameScreen.className = 'game-screen';
    gameScreen.id = 'game-screen';
    gameScreen.innerHTML = `
        <div class="game-header">
            <h2 id="region-name"></h2>
            <div class="score-display">
                <div class="score-item">
                    ❓ คำถาม: <span id="current-q">0</span>/<span id="total-q">0</span>
                </div>
                <div class="score-item">
                    ✅ คะแนน: <span id="current-score">0</span>
                </div>
            </div>
        </div>
        <div class="question-container">
            <div class="question-text" id="question-text"></div>
            <div class="options" id="options-container"></div>
        </div>
    `;
    
    // Game Over Screen
    const gameOver = document.createElement('div');
    gameOver.className = 'game-screen';
    gameOver.id = 'game-over';
    gameOver.innerHTML = `
        <div class="game-header">
            <h2>🎉 เสร็จสิ้น!</h2>
        </div>
        <div class="question-container" style="text-align: center;">
            <div style="font-size: 3rem; margin: 20px 0;">🏆</div>
            <p style="font-size: 1.3rem; color: #2C3E50; margin: 10px 0;">
                คะแนนของคุณ: <strong id="final-score">0</strong> / <span id="final-total">0</span>
            </p>
            <p id="result-message" style="font-size: 1.1rem; color: #666; margin: 15px 0;"></p>
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                <button class="btn btn-secondary" onclick="startGame()" style="padding: 12px 25px;">
                    🎮 เล่นอีกครั้ง
                </button>
                <button class="btn btn-primary" onclick="backToMenu()" style="padding: 12px 25px;">
                    🏠 หน้าแรก
                </button>
            </div>
        </div>
    `;
    
    // How to Play Screen
    const howToPlayScreen = document.createElement('div');
    howToPlayScreen.className = 'game-screen';
    howToPlayScreen.id = 'how-to-play';
    howToPlayScreen.innerHTML = `
        <div class="game-header">
            <h2>📖 วิธีเล่น</h2>
        </div>
        <div class="question-container">
            <div style="color: #2C3E50; line-height: 1.8;">
                <h3 style="margin-bottom: 15px;">🎮 ขั้นตอนการเล่น:</h3>
                <ol style="margin-left: 20px; margin-bottom: 15px;">
                    <li><strong>เลือกภาค:</strong> เลือกภาคที่ต้องการเรียนรู้ภาษาถิ่น (เหนือ อีสาน กลาง ใต้)</li>
                    <li><strong>ตอบคำถาม:</strong> อ่านคำถามและเลือกคำตอบที่ถูกต้อง</li>
                    <li><strong>รับคะแนน:</strong> ตอบถูกแล้วได้ 1 คะแนน</li>
                    <li><strong>หมดคำถาม:</strong> เมื่อตอบครบทุกคำถาม จะไปหน้าเสร็จสิ้น</li>
                    <li><strong>บันทึกคะแนน:</strong> คะแนนจะถูกบันทึกลงบอร์ด High Score</li>
                </ol>
                <hr style="margin: 20px 0; border: none; border-top: 2px solid #ccc;">
                <p><strong>💡 เคล็ดลับ:</strong> เรียนรู้ภาษาถิ่นผ่านการตอบคำถาม สนุกไปกับการเรียน!</p>
                <p><strong>⚙️ ระดับความยาก:</strong> สามารถปรับในเมนูตั้งค่าได้</p>
            </div>
        </div>
        <button class="back-btn" onclick="backToMenu()">← ย้อนกลับ</button>
    `;
    
    // Score Board Screen
    const scoreBoard = document.createElement('div');
    scoreBoard.className = 'game-screen';
    scoreBoard.id = 'score-board';
    scoreBoard.innerHTML = `
        <div class="game-header">
            <h2>🏆 คะแนนสูงสุด</h2>
        </div>
        <div class="scoreboard">
            <h3>Top 10 🎖️</h3>
            <div class="score-list" id="score-list"></div>
        </div>
        <button class="back-btn" onclick="backToMenu()">← ย้อนกลับ</button>
    `;
    
    // Settings Screen
    const settingsScreen = document.createElement('div');
    settingsScreen.className = 'game-screen';
    settingsScreen.id = 'settings';
    settingsScreen.innerHTML = `
        <div class="game-header">
            <h2>⚙️ ตั้งค่า</h2>
        </div>
        <div class="settings-panel">
            <div class="setting-item">
                <label class="setting-label">ระดับความยาก:</label>
                <div class="setting-value">
                    <button class="difficulty-btn ${selectedDifficulty === 'easy' ? 'active' : ''}" onclick="setDifficulty('easy')">ง่าย</button>
                    <button class="difficulty-btn ${selectedDifficulty === 'normal' ? 'active' : ''}" onclick="setDifficulty('normal')">ปกติ</button>
                    <button class="difficulty-btn ${selectedDifficulty === 'hard' ? 'active' : ''}" onclick="setDifficulty('hard')">ยาก</button>
                </div>
            </div>
            <div class="setting-item">
                <label class="setting-label">📊 ข้อมูลเกม:</label>
                <p style="color: #666;">จำนวนคำถาม: <strong id="diff-info">0</strong></p>
            </div>
            <div class="setting-item">
                <button class="btn btn-secondary" onclick="clearScores()" style="width: 100%; padding: 12px;">
                    🗑️ ล้างคะแนนสูงสุด
                </button>
            </div>
        </div>
        <button class="back-btn" onclick="backToMenu()">← ย้อนกลับ</button>
    `;
    
    overlay.appendChild(regionSelect);
    overlay.appendChild(gameScreen);
    overlay.appendChild(gameOver);
    overlay.appendChild(howToPlayScreen);
    overlay.appendChild(scoreBoard);
    overlay.appendChild(settingsScreen);
    
    updateDifficultyInfo();
}

// เลือกภาค
function selectRegion(region) {
    currentRegion = region;
    currentQuestion = 0;
    score = 0;
    
    // สร้างรายการคำถาม
    const questions = gameData[region].questions;
    const numQuestions = difficulties[selectedDifficulty].questions;
    questionsToPlay = questions.slice(0, Math.min(numQuestions, questions.length));
    totalQuestions = questionsToPlay.length;
    
    // แสดงคำถามแรก
    showScreen('game-screen');
    displayQuestion();
}

// แสดงคำถาม
function displayQuestion() {
    if (currentQuestion >= questionsToPlay.length) {
        endGame();
        return;
    }
    
    const question = questionsToPlay[currentQuestion];
    const regionName = gameData[currentRegion].name;
    
    document.getElementById('region-name').textContent = regionName;
    document.getElementById('current-q').textContent = currentQuestion + 1;
    document.getElementById('total-q').textContent = totalQuestions;
    document.getElementById('current-score').textContent = score;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index, question.correct, question.explanation);
        optionsContainer.appendChild(btn);
    });
}

// เลือกคำตอบ
function selectAnswer(selected, correct, explanation) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correct) {
            btn.classList.add('correct');
        } else if (index === selected && selected !== correct) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === correct) {
        score++;
    }
    
    // แสดง explanation
    const questionContainer = document.querySelector('.question-container');
    const explanation_div = document.createElement('div');
    explanation_div.style.cssText = 'background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 15px; color: #2C3E50;';
    explanation_div.innerHTML = `<strong>💡 คำอธิบาย:</strong> ${explanation}`;
    questionContainer.appendChild(explanation_div);
    
    // ต่อไปในคำถามถัดไป
    setTimeout(() => {
        currentQuestion++;
        displayQuestion();
    }, 2500);
}

// จบเกม
function endGame() {
    const resultPercentage = Math.round((score / totalQuestions) * 100);
    let resultMessage = '';
    
    if (resultPercentage === 100) {
        resultMessage = '🌟 ยอดเยี่ยม! คุณเก่งมาก!';
    } else if (resultPercentage >= 80) {
        resultMessage = '😄 ดีเลยคะ! เกือบสมบูรณ์!';
    } else if (resultPercentage >= 60) {
        resultMessage = '👍 ดีนะคะ!';
    } else if (resultPercentage >= 40) {
        resultMessage = '💪 ยังพอใช้ เรียนรู้เพิ่มเติมนะ!';
    } else {
        resultMessage = '📚 มาเรียนรู้เพิ่มเติมกัน!';
    }
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-total').textContent = totalQuestions;
    document.getElementById('result-message').textContent = resultMessage;
    
    // บันทึกคะแนน
    const timestamp = new Date().toLocaleString('th-TH');
    highScores.push({
        score: score,
        total: totalQuestions,
        region: gameData[currentRegion].name,
        percentage: resultPercentage,
        date: timestamp
    });
    saveHighScores();
    
    showScreen('game-over');
}

// แสดง/ซ่อน Screen
function showScreen(screenId) {
    const screens = document.querySelectorAll('.game-screen');
    const mainOverlay = document.querySelector('.overlay:not(.game-screen)');
    
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    } else if (screenId === 'menu') {
        screens.forEach(s => s.classList.remove('active'));
        mainOverlay.style.display = 'flex';
    }
}

// ย้อนกลับไปเมนู
function backToMenu() {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // แสดง main overlay
    document.querySelectorAll('.overlay').forEach(overlay => {
        if (!overlay.querySelector('.game-screen')) {
            overlay.style.display = 'flex';
        }
    });
}

// ปรับระดับความยาก
function setDifficulty(level) {
    selectedDifficulty = level;
    
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
    updateDifficultyInfo();
}

// อัปเดตข้อมูลระดับความยาก
function updateDifficultyInfo() {
    const num = difficulties[selectedDifficulty].questions;
    document.getElementById('diff-info').textContent = num;
}

// ล้างคะแนน
function clearScores() {
    if (confirm('⚠️ ต้องการล้างคะแนนสูงสุดทั้งหมด?')) {
        highScores = [];
        saveHighScores();
        displayScoreBoard();
        alert('✅ ล้างคะแนนเสร็จสิ้น');
    }
}

// แสดงบอร์ดคะแนน
function displayScoreBoard() {
    const scoreList = document.getElementById('score-list');
    scoreList.innerHTML = '';
    
    if (highScores.length === 0) {
        scoreList.innerHTML = '<div class="score-entry empty">ยังไม่มีคะแนนสูงสุด</div>';
        return;
    }
    
    highScores.forEach((entry, index) => {
        const scoreEntry = document.createElement('div');
        scoreEntry.className = 'score-entry';
        scoreEntry.innerHTML = `
            <span>
                ${index + 1}. ${entry.region} 
                <strong>${entry.score}/${entry.total}</strong> 
                (${entry.percentage}%)
            </span>
            <span style="font-size: 0.9rem; opacity: 0.7;">${entry.date}</span>
        `;
        scoreList.appendChild(scoreEntry);
    });
}

// Initialize screens
createGameScreens();
displayScoreBoard();