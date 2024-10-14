
// Temperary values, these will later be gathered from user input
const weight = 160
const height = 1.8288
const systolic = 120 
const diastolic = 80 
const familyHistory = 'cancer'





document.getElementById('ageForm').addEventListener('submit', function(event) {
  event.preventDefault();  



  // Get the age value from the form
  const age = document.getElementById('age').value;


  
  // Make a POST request to the API
  fetch('http://localhost:3000/calculate-risk', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          age: age,
          weight: weight,   
          height: height,  
          systolic: systolic,
          diastolic: diastolic,
          familyHistory: familyHistory
      })
  })
  .then(response => response.json())
  .then(data => {
      // Display the age points in the HTML
      document.getElementById('agePoints').textContent = data.agePoints;
  })
  .catch(error => console.error('Error:', error));
});
