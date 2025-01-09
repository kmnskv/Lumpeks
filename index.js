const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Folder na tymczasowe przechowywanie plików

app.use(express.static(path.join(__dirname, 'public')));

// Endpoint do analizy obrazu
app.post('/analyze-image', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    const subscriptionKey = '<E3fbN4g6d2oyVo1eGnw7q17p8eNUi81ZZLwv4nUdLiiHpHfW6ZbCJQQJ99BAACYeBjFXJ3w3AAAFACOGKhM1>'; // Wklej swój klucz API
    const endpoint = '<https://lumpekscomputervision.cognitiveservices.azure.com/>'; // Wklej swój Endpoint

    try {
        const imageBuffer = require('fs').readFileSync(imagePath);
        const response = await axios.post(
            `${endpoint}/vision/v3.2/analyze?visualFeatures=Description`,
            imageBuffer,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                    'Content-Type': 'application/octet-stream',
                },
            }
        );

        // Usuwanie tymczasowego pliku
        require('fs').unlinkSync(imagePath);

        // Zwrócenie opisu obrazu
        res.json(response.data.description.captions[0]?.text || 'Nie rozpoznano obrazu.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Błąd podczas analizy obrazu.');
    }
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
