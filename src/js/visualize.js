import { source, audioContext, analyser } from "./playerLogic.js";

// Функция для визуализации спектра звуковых волн на холсте
function visualizeWave() {
    const  canvas = document.getElementById("visualizer"); // Получаем холст

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let ctx = canvas.getContext("2d");

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Создаем массив для хранения данных спектра
    let dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(dataArray);

    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем спектр звуковых волн на холсте
    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i];

        ctx.fillStyle = `rgb(256, 256, 256)`;
        ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
    }

    requestAnimationFrame(visualizeWave);
}

export { visualizeWave }