
// Temperary values, these will later be gathered from user input



const systolic = 120 
const diastolic = 80 
const familyHistory = 'cancer'

const opentBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("riskTestModal");
/* Opens the popup window (modal) */
opentBtn.addEventListener("click", () => {
    modal.classList.add("open");
});
/* Closes the popup window (modal) */
closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});


/*This function gathers health data and sends it to the server to be calculated 
 and returns finished results */
document.getElementById('ageForm').addEventListener('submit', function(event) {
  event.preventDefault();  



  // Gets the values from the input boxes 
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const heightft = document.getElementById('heightft').value;
    const heightin = document.getElementById('heightin').value;
    const systolic = document.getElementById('systolic').value;
    const diastolic = document.getElementById('diastolic').value;

  
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


  })
  .catch(error => console.error('Error:', error));
});
