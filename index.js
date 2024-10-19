const express = require('express'); // Import express
const app = express();              // Initialize express
const cors = require('cors');

app.use(cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

app.use(express.static(__dirname));

app.post('/calculate-risk', (req, res) => {
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
        return BMIScore.toFixed(2);
    }

    // Function to calculate BMI points
    function CalcBMIPoints(BMI) {
        let BMIPoints = 0;  
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


    function CalcSystolicBpPoints(systolic){
        let systolicPoints = 0
        if (systolic < 120){
            systolicPoints = 0;

        } else if (systolic >= 120 && systolic < 130){
            systolicPoints = 15;

        }else if (systolic >= 130 && systolic < 140){
            systolicPoints = 30;

        }else if (systolic >= 140 && systolic <= 180){
            systolicPoints = 75;

        }else if (systolic > 180 ){
            systolicPoints = 100;
        } else {
            systolicPoints = "error";
        }
        return systolicPoints
    }


    function CalcDiastolicBpPoints(diastolic){
        let diastolicPoints = 0
        if (diastolic < 120){
            diastolicPoints = 0;

        } else if (diastolic >= 120 && diastolic < 130){
            diastolicPoints = 15;

        }else if (diastolic >= 130 && diastolic < 140){
            diastolicPoints = 30;

        }else if (diastolic >= 140 && diastolic <= 180){
            diastolicPoints = 75;

        }else if (diastolic > 180 ){
            diastolicPoints = 100;
        } else {
            diastolicPoints = "error";
        }
        return diastolicPoints
    }

    function CalcHistoryPoints(familyHistory){
        if(familyHistory.includes('None')){
            return 0;
        }
        return familyHistory.length*10;
    }

    function CalcTotalPoints(agePoints, BMIPoints, systolicPoints, diastolicPoints, familyHistoryPoints) {
        const totalPoints = agePoints + BMIPoints + systolicPoints + diastolicPoints + familyHistoryPoints;

        let riskCategory;
        if (totalPoints <= 20) {
            riskCategory = "Low Risk";
        } else if (totalPoints <= 50) {
            riskCategory = "Moderate Risk";
        } else if (totalPoints <= 75) {
            riskCategory = "High Risk";
        } else {
            riskCategory = "Uninsurable";
        }

        return { totalPoints, riskCategory };
    }


    // Call the functions
    const agePoints = ageCalc(age);
    const BMI = calcBMI(weight, heightft, heightin);
    const BMIPoints = CalcBMIPoints(BMI);
    const systolicPointsReturn = CalcSystolicBpPoints(systolic);
    const diastolicPointsReturn = CalcDiastolicBpPoints(diastolic);
    const familyHistoryPoints = CalcHistoryPoints(familyHistory);

    const { totalPoints, riskCategory } = CalcTotalPoints(agePoints, BMIPoints, systolicPointsReturn, diastolicPointsReturn, familyHistoryPoints);

    res.json({ agePoints, BMI, BMIPoints , systolicPointsReturn, diastolicPointsReturn, familyHistoryPoints, totalPoints, riskCategory});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
