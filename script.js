
// Temperary values, these will later be gathered from user input
const weight = 160
const height = 1.8288
const systolic = 120 
const diastolic = 80 
const familyHistory = 'cancer'

// This is all the code to get the popup window for the risk test questions.
// Implementations still needed for my end at least that I know of(Bryan) include:
// Fix input for height (feet, inches), submit the collected data to the server (unsure how to do), new modal (popup window)
// for the end result (what the risk assessment is), calculations on the server end, make it pretty
// If any questions please let me know, but honestly I will probably be as lost as you are
// - Bryan 

let userAnswers = {
    age: null,
    height: null,
    weight: null,
    systolic: null,
    diastolic: null,
    familyHistory: []
};


let questionIndex = 0;
const opentBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modal = document.getElementById("riskTestModal");
const modalContent = document.getElementById("modalContent");
const startTestBtn = document.getElementById("startTestBtn");

/* Questions for the risk test */
const riskQuestions = [
    {
        question: "what is your age?",
        inputType: "number",
        inputId: "ageInput",
        placeholder: "Enter your age"
    },
    {   /* Needs implementation of correct height */
        question: "What is your height? (in feet/inches)",
        inputType: "number",
        inputId: "heightInput",
        placeholder: "Enter your height"
    },
    {
        question: "What is your weight (in pounds)?",
        inputType: "number",
        inputId: "weightInput",
        placeholder: "Enter your weight"
    },
    {
        question: "What is your systolic blood pressure?",
        inputType: "number",
        inputId: "systolicInput",
        placeholder: "Enter your systolic blood pressure"
    },
    {
        question: "What is your diastolic blood pressure?",
        inputType: "number",
        inputId: "diastolicInput",
        placeholder: "Enter your diastolic blood pressure"
    },
    {
        question: "Does any member in your family have diabetes, cancer, or Alzheimer's?",
        inputType: "checkbox",
        inputId: "famDisease",
        options: ["Diabetes", "Cancer", "Alzherimer's"]
    }
];


/* Opens the popup window (modal) */
opentBtn.addEventListener("click", () => {
    modal.classList.add("open");
});
/* Closes the popup window (modal) */
closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
    questionIndex = 0;
});
startTestBtn.addEventListener("click", function() {
    loadQuestion();
});

/* Loads the current question */
function loadQuestion() {
    const currentQuestion = riskQuestions[questionIndex];
    if (currentQuestion) {
        modalContent.innerHTML = `
            <h2>Question ${questionIndex + 1}</h2>
            <p>${currentQuestion.question}</p>
            ${generateInputField(currentQuestion)}
            <button id="nextQuestionBtn">Next</button>        
        `;

        const nextButton = document.getElementById("nextQuestionBtn");
        nextButton.addEventListener("click", function() {
            saveInput(currentQuestion); // Save user input

            questionIndex++;
            if (questionIndex < riskQuestions.length) {
                loadQuestion();
            } else {
                displaySummary();
            }
        });
    }
}

/* Input fields change based on what type of question is asked */
function generateInputField(question) {
    if (question.inputType === "number") {
        return `<input type="number" id="${question.inputId}" placeholder="${question.placeholder}">`;
    } else if (question.inputType === "radio") {
        return question.options.map(option => `
            <label>
                <input type="radio" name="${question.inputId}" value="${option}"> ${option}
            </label>
        `).join("<br>");
    } else if (question.inputType === "checkbox") {
        return question.options.map(option => `
            <label>
                <input type="checkbox" name="${question.inputId}" value="${option}"> ${option}
            </label>
        `).join("<br>");       
    }
}

// Save user input 
function saveInput(question) {
    if(question.inputType === "number") {
        const value = document.getElementById(question.inputId).value;
        userAnswers[question.inputId.replace("Input", "")] = parseFloat(value);
    } else if (question.inputType === "checkbox") {
        const checkboxes = document.querySelectorAll(`input[name="${question.inputId}"]:checked`);
        userAnswers.familyHistory = Array.from(checkboxes).map(checkbox => checkbox.value);
    }
}

// Show everything the user entered to ensure correct inputs 
function displaySummary() {
    document.getElementById('summaryAge').textContent = userAnswers.age;
    document.getElementById('summaryHeight').textContent = userAnswers.height;
    document.getElementById('summaryWeight').textContent = userAnswers.weight;
    document.getElementById('summarySystolic').textContent = userAnswers.systolic;
    document.getElementById('summaryDiastolic').textContent = userAnswers.diastolic;
    document.getElementById('summaryFamilyHistory').textContent = userAnswers.familyHistory.length > 0 ? userAnswers.familyHistory.join(", ") : "None";

    const summaryModal = document.getElementById("summaryModal");
    summaryModal.classList.add("open");
}
// User can submit answers
document.getElementById('closeSummaryModalBtn').addEventListener('click', function() {
    const summaryModal = document.getElementById("summaryModal");
    summaryModal.classList.remove("open");
});


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
