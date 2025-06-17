const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://terminal.jup.ag';
const VERSION = '1.0.0'; // версия из package.json
const BUNDLE_NAME = `main-${VERSION}`;

// Создаем директории если их нет
const dirs = [
    'src/static/css',
    'src/static/fonts/Inter',
    'src/static/fonts/Poppins',
    'src/static/js'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Функция для скачивания файла
function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${url} -> ${destination}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(destination, () => {}); // Удаляем файл в случае ошибки
            reject(err);
        });
    });
}

// Список файлов для скачивания
const filesToDownload = [
    {
        url: `${BASE_URL}/${BUNDLE_NAME}-app.js`,
        destination: 'src/static/js/app.js'
    },
    {
        url: `${BASE_URL}/${BUNDLE_NAME}-Tailwind.css`,
        destination: 'src/static/css/tailwind.css'
    },
    {
        url: `${BASE_URL}/scoped-preflight.css`,
        destination: 'src/static/css/preflight.css'
    },
    {
        url: `${BASE_URL}/${BUNDLE_NAME}-Jupiter.css`,
        destination: 'src/static/css/jupiter.css'
    }
];

// Скачиваем шрифты
const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
fontWeights.forEach(weight => {
    filesToDownload.push({
        url: `https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2`,
        destination: `src/static/fonts/Inter/Inter-${weight}.woff2`
    });
});

filesToDownload.push({
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
    destination: 'src/static/fonts/Poppins/Poppins-Regular.woff2'
});

// Скачиваем все файлы
async function downloadAll() {
    try {
        for (const file of filesToDownload) {
            await downloadFile(file.url, file.destination);
        }
        console.log('All files downloaded successfully!');
    } catch (error) {
        console.error('Error downloading files:', error);
    }
}

downloadAll();