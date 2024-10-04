document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDisplay = document.getElementById('status');
    const timerDisplay = document.getElementById('timerDisplay');

    let timer;
    let timeLeft = 25 * 60; // 25 minutes in seconds

    const startTimer = () => {
        // Start timer logic here
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                // Show a notification or update status here
            }
        }, 1000);
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
    };

    const stopTimer = () => {
        clearInterval(timer);
        stopBtn.style.display = 'none';
        startBtn.style.display = 'block';
    };

    const resetTimer = () => {
        clearInterval(timer);
        timeLeft = 25 * 60;
        timerDisplay.textContent = '25:00';
        stopBtn.style.display = 'none';
        startBtn.style.display = 'block';
    };

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);
});
