const express = require('express'); // Import express
const app = express();              // Initialize express
const cors = require('cors');

app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

app.post('/calculate-risk', (req, res) => {
    console.log('Request body:', req.body);
    const { age, weight, heightft, heightin, systolic, diastolic, familyHistory } = req.body;

    // Function to calculate points based on age
    function ageCalc(age) {
        let agePoints = 0;
        if (age < 30) {
            agePoints = 0;
        } else if (age < 45) {
            agePoints = 10;
        } else if (age < 60) {
            agePoints = 20;
        } else {
            agePoints = 30;
        }
        return agePoints;  // Return the age points
    }

    // Function to calculate BMI
    function calcBMI(weight, heightft, heightin) {
        let feetMeters = heightft * 0.3048;
        let inchMeters = heightin * 0.0254;
        let weightKg = weight * 0.453592;
        let heightInMeters = feetMeters + inchMeters;
        let BMIScore = (weightKg / Math.pow(heightInMeters, 2));
        return BMIScore;
    }

    // Function to calculate BMI points
    function CalcBMIPoints(BMI) {
        let BMIPoints = 0;  // Declare BMIPoints at the beginning
        if (BMI < 25 && BMI >= 18.5) {
            BMIPoints = 0;
        } else if (BMI >= 25 && BMI < 30) {
            BMIPoints = 30;
        } else if (BMI >= 30 && BMI < 35) {
            BMIPoints = 75;
        } else {
            BMIPoints = "error (BMIScore is out of range)";
        }
        return BMIPoints;
    }

    // Call the functions
    const agePoints = ageCalc(age);
    const BMI = calcBMI(weight, heightft, heightin);
    const BMIPoints = CalcBMIPoints(BMI);

    res.json({ agePoints, BMI, BMIPoints });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
