const express = require('express'); // Import express
const app = express();              // Initialize express
const cors = require('cors');


app.use(cors());




// Middleware to parse JSON bodies in requests
app.use(express.json());

app.post('/calculate-risk', (req, res) => {
    const { age, weight, height, systolic, diastolic, familyHistory } = req.body;

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

    // Call the function and pass the age
    const agePoints = ageCalc(age);

    // Send the response back as JSON
    res.json({ agePoints });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
