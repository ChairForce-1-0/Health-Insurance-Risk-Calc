const express = require('express'); // Import express
const path = require('path');       // Import path

const app = express();              // Initialize express
const PORT = process.env.PORT || 3000;  // Use the PORT from the environment or default to 3000

// Serve static files from the project root (HTML, CSS, images, etc.)
app.use(express.static(path.join(__dirname, '../')));

// Middleware to parse the request body as JSON
app.use(express.json());

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));  // Adjust path to serve the HTML correctly
});

// To check if the server is running
app.get('/ping', (req, res) => {
    res.status(200).send('Server is running');
});

// Serve the CSS file (optional, as static middleware should handle it)
app.get('/index.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.css'));  // Adjust path for CSS if needed
});

// Handle POST request for insurance risk calculation
app.post('/calculate-risk', (req, res) => {
    const { age, weight, heightft, heightin, systolic, diastolic, familyHistory } = req.body;

    function ageCalc(age) {
        return age < 30 ? 0 : age < 45 ? 10 : age < 60 ? 20 : 30;
    }

    function calcBMI(weight, heightft, heightin) {
        const feetMeters = heightft * 0.3048;
        const inchMeters = heightin * 0.0254;
        const weightKg = weight * 0.453592;
        const heightInMeters = feetMeters + inchMeters;
        return (weightKg / Math.pow(heightInMeters, 2)).toFixed(2);
    }

    function CalcBMIPoints(BMI) {
        if (BMI < 25 && BMI >= 18.5) return 0;
        if (BMI >= 25 && BMI < 30) return 30;
        if (BMI >= 30 && BMI < 35) return 75;
        return { error: "BMI score out of range" };
    }

    const BMI = calcBMI(weight, heightft, heightin);
    const BMIPointsResult = CalcBMIPoints(BMI);
    if (BMIPointsResult.error) return res.status(400).json(BMIPointsResult);

    function CalcSystolicBpPoints(systolic) {
        return systolic < 120 ? 0 :
               systolic < 130 ? 15 :
               systolic < 140 ? 30 :
               systolic <= 180 ? 75 : 100;
    }

    function CalcDiastolicBpPoints(diastolic) {
        return diastolic < 120 ? 0 :
               diastolic < 130 ? 15 :
               diastolic < 140 ? 30 :
               diastolic <= 180 ? 75 : 100;
    }

    function CalcHistoryPoints(familyHistory) {
        return familyHistory.includes('None') ? 0 : familyHistory.length * 10;
    }

    function CalcTotalPoints(agePoints, BMIPoints, systolicPoints, diastolicPoints, familyHistoryPoints) {
        const totalPoints = agePoints + BMIPoints + systolicPoints + diastolicPoints + familyHistoryPoints;
        const riskCategory = totalPoints <= 20 ? "Low Risk" :
                             totalPoints <= 50 ? "Moderate Risk" :
                             totalPoints <= 75 ? "High Risk" : "Uninsurable";
        return { totalPoints, riskCategory };
    }

    const agePoints = ageCalc(age);
    const systolicPoints = CalcSystolicBpPoints(systolic);
    const diastolicPoints = CalcDiastolicBpPoints(diastolic);
    const familyHistoryPoints = CalcHistoryPoints(familyHistory);

    const { totalPoints, riskCategory } = CalcTotalPoints(
        agePoints, BMIPointsResult, systolicPoints, diastolicPoints, familyHistoryPoints
    );

    res.json({
        agePoints, BMI, BMIPoints: BMIPointsResult, systolicPoints,
        diastolicPoints, familyHistoryPoints, totalPoints, riskCategory
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
