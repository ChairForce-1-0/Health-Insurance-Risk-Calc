const { app } = require('@azure/functions');

app.http('calculate-risk', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        age: age,
        weight: weight,   
        heightft: heightft, 
        heightin: heightin,
        systolic: systolic,
        diastolic: diastolic,
        familyHistory: familyHistory
    })
})
.then(response => {
    if (!response.ok) {
        // Check for non-200 responses
        return response.text().then(text => { throw new Error(text) });
    }
    return response.json();
})
.then(data => {
    // Handle successful JSON response
    document.getElementById('agePoints').textContent = data.agePoints;
    document.getElementById('BMI').textContent = data.BMI;
    document.getElementById('BMIPoints').textContent = data.BMIPoints;
    document.getElementById('displaySystolic').textContent = data.systolicPointsReturn;
    document.getElementById('displayDiastolic').textContent = data.diastolicPointsReturn;
    document.getElementById('familyHistoryPoints').textContent = data.familyHistoryPoints;
    document.getElementById('displayPoints').textContent = data.totalPoints;
    document.getElementById('displayRisk').textContent = data.riskCategory;
})
.catch(error => {
    console.error('Error:', error);
    errorMessages.textContent = `Error: ${error.message}`;
});