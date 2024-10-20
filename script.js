
// 10-17-24
// I removed the modal/popup window as the implementation was confusing me a little. I made the old ageForm into the actual risk test now.
// I made it look nicer so it matches the website
// I also added calculations on the server side for the family history.
// Also added input validation
// Any questions let me know - Bryan

// 10-18-24
// I now added calculations for the family history, total points, and insurance risk.
// Also allowed user to clear inputs to do another test.


const checkboxes = document.querySelectorAll('input[name="familyHistory"]');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        if (checkbox.value === 'None' && checkbox.checked) {
            checkboxes.forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false; // Deselect other checkboxes
                }
            });
        } else if (checkbox.value !== 'None' && checkbox.checked) {
            // Deselect "None" if any other checkbox is selected
            const noneCheckbox = document.getElementById('none');
            noneCheckbox.checked = false;
        }
    })
});


/*This function gathers health data and sends it to the server to be calculated 
 and returns finished results */
document.getElementById('ageForm').addEventListener('submit', function(event) {
  event.preventDefault();  

  const errorMessages = document.getElementById('errorMessages');
  errorMessages.textContent = ''; // Clear previous error messages



  // Gets the values from the input boxes 
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const heightft = document.getElementById('heightft').value;
    const heightin = document.getElementById('heightin').value;
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;

    // Get selected family history values
    const familyHistory = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);


    // Validate input
    let isValid = true;

    if (age < 0 || age > 120) {
        errorMessages.textContent += 'Please enter a valid age (0-120).\n';
        isValid = false;
    }
    if (weight <= 0) {
        errorMessages.textContent += 'Please enter a valid weight (greater than 0).\n';
        isValid = false;
    }
    if (heightft < 2) {
        errorMessages.textContent += 'Height must be at least 2 feet.\n';
        isValid = false;
    }
    if (systolic < 0 || systolic > 300) {
        errorMessages.textContent += 'Please enter a valid systolic blood pressure.\n';
        isValid = false;
    }
    if (diastolic < 0 || diastolic > 200) {
        errorMessages.textContent += 'Please enter a valid diastolic blood pressure.\n';
        isValid = false;
    }

    if (!isValid) {
        return; // Prevent form submission if invalid
    }

  
  // Sends client data to the server and returns calculations
  fetch('http://localhost:3000/calculate-risk', {
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
  .then(response => response.json())
  .then(data => {
      // Display the info from the server in HTML
      document.getElementById('agePoints').textContent = data.agePoints;
      document.getElementById('BMI').textContent = data.BMI;
      document.getElementById('BMIPoints').textContent = data.BMIPoints;
      document.getElementById('displaySystolic').textContent = data.systolicPointsReturn;
      document.getElementById('displayDiastolic').textContent = data.diastolicPointsReturn;
      document.getElementById('familyHistoryPoints').textContent = data.familyHistoryPoints;
      document.getElementById('displayPoints').textContent = data.totalPoints;
      document.getElementById('displayRisk').textContent = data.riskCategory;


  })
  .catch(error => console.error('Error:', error));

    // Clear button
    document.getElementById('clearButton').addEventListener('click', function() {
        document.getElementById('ageForm').reset(); // Clear form inputs

        // Clear result values
        document.getElementById('agePoints').textContent = '';
        document.getElementById('BMI').textContent = '';
        document.getElementById('BMIPoints').textContent = '';
        document.getElementById('displaySystolic').textContent = '';
        document.getElementById('displayDiastolic').textContent = '';
        document.getElementById('familyHistoryPoints').textContent = '';
        document.getElementById('displayPoints').textContent = '';
        document.getElementById('displayRisk').textContent = '';
    });

});
