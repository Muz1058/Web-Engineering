const body = document.querySelector("body");
const dynamicRows = document.querySelector(".dynamicRows");
const numberOfRows = document.getElementById("NumberOfRows");
const tableHeader = document.querySelector(".tableHeader");
const calculateButtonContainer = document.querySelector(".calculatebtn");
const resultField = document.querySelector(".resultField");

let submitbtn = document.createElement("input");
submitbtn.type = 'submit';
submitbtn.value = 'Calculate';
submitbtn.id = 'calculate';

function addArray(array) {
  return array.reduce((sum, val) => sum + val, 0);
}

function average(array) {
  return addArray(array) / array.length;
}


function cleanUpPredictionElements() {
 
  const predictionInputs = document.querySelectorAll("#predictionInput");
  const predictionResults = document.querySelectorAll(".prediction-result");
  
  predictionInputs.forEach(input => input.remove());
  predictionResults.forEach(result => result.remove());
}

numberOfRows.addEventListener('keydown', function (e) {
  if (e.key === "Enter") {
    const rows = parseInt(numberOfRows.value);
    if (isNaN(rows) || rows < 1) return;
    tableHeader.innerHTML = `
      <tr>
        <th>SR</th>
        <th>X</th>
        <th>Y</th>
      </tr>
    `;
    const dataBody = document.getElementById("dataBody");
    dataBody.innerHTML = "";

    for (let i = 1; i <= rows; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <th>${i}</th>
        <td><input class="x" type="text" required placeholder="X${i}"></td>
        <td><input class="y" type="text" required placeholder="Y${i}"></td>
      `;
      dataBody.appendChild(row);
    }

    if (!document.getElementById("calculate")) {
      calculateButtonContainer.appendChild(submitbtn);
    }

    if (dynamicRows && body.contains(dynamicRows)) {
      body.removeChild(dynamicRows);
    }
 
    submitbtn.addEventListener("click", function (e) {
      e.preventDefault();

      const xInputs = document.querySelectorAll(".x");
      const yInputs = document.querySelectorAll(".y");

      const xArray = [];
      const yArray = [];

      xInputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) xArray.push(val);
      });

      yInputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val)) yArray.push(val);
      });

      if (xArray.length !== rows || yArray.length !== rows) {
        resultField.innerHTML = `<div class="error-message">Please enter valid and complete X and Y values.</div>`;
        return;
      }

      const xMean = average(xArray);
      const yMean = average(yArray);

      let numerator = 0;
      let denominator = 0;

      tableHeader.innerHTML = `
        <tr>
          <th>SR</th>
          <th>x</th>
          <th>y</th>
          <th>x−x̄</th>
          <th>y−ȳ</th>
          <th>(x−x̄)(y−ȳ)</th>
          <th>(x−x̄)²</th>
        </tr>
      `;
      const dataBody = document.getElementById("dataBody");
      dataBody.innerHTML = "";

      for (let i = 0; i < rows; i++) {
        const x = xArray[i];
        const y = yArray[i];
        const xDiff = x - xMean;
        const yDiff = y - yMean;
        const xyProduct = xDiff * yDiff;
        const xSquare = xDiff * xDiff;

        numerator += xyProduct;
        denominator += xSquare;

        const row = document.createElement("tr");
        row.innerHTML = `
          <th>${i + 1}</th>
          <td>${x.toFixed(4)}</td>
          <td>${y.toFixed(4)}</td>
          <td>${xDiff.toFixed(4)}</td>
          <td>${yDiff.toFixed(4)}</td>
          <td>${xyProduct.toFixed(4)}</td>
          <td>${xSquare.toFixed(4)}</td>
        `;
        dataBody.appendChild(row);
      }

      const m = numerator / denominator;
      const c = yMean - m * xMean;

      resultField.innerHTML = `
        <div class="results-container">
          <h3 class="results-heading">Calculation Results</h3>
          <p><b>&#8721;(x−x̄)(y−ȳ) =</b> ${numerator.toFixed(4)}</p>
          <p><b>&#8721;(x−x̄)² =</b> ${denominator.toFixed(4)}</p>
         
          <span>
            <b>m = </b>
            <span class="fraction">
              <div class="fraction-top">${numerator.toFixed(4)}</div>
              <div>${denominator.toFixed(4)}</div>
            </span>
            <span style="margin-left: 10px;"><b>= ${m.toFixed(4)}</b></span>
          </span><br>
          <p class="regression-line"><b>Regression Line:</b> y = ${m.toFixed(4)}x + ${c.toFixed(4)}</p>
          
          <div class="predictionDiv">
            <button id="predictionBtn">Make Prediction</button>
            <div id="predictionContainer"></div>
          </div>
          <br>
          <button id="newCalcBtn">New Calculation</button>
        </div>`;

      let predictionButton = document.getElementById("predictionBtn");
      
      
      let predictionInputActive = false;
      
      predictionButton.addEventListener('click', () => {
        
        if (predictionInputActive) return;
        
      
        cleanUpPredictionElements();
        
     
        let predictionContainer = document.getElementById("predictionContainer");
        let predictionInput = document.createElement("input");
        predictionInput.type = "text";
        predictionInput.placeholder = "Enter value of x and press Enter";
        predictionInput.id = "predictionInput";
        predictionButton.style.marginTop="20px"
        predictionButton.style.marginBottom="20px"
        predictionInput.required = true;
        predictionContainer.appendChild(predictionInput);
        predictionInput.focus(); 
        
        predictionInputActive = true;
   
        predictionInput.addEventListener("keydown", function(event) {
          if (event.key === "Enter") {
            const xValue = parseFloat(predictionInput.value);
            
            if (isNaN(xValue)) {
              
              alert("Please enter a valid numeric value for X");
              return;
            }
              
            const predictedY = m * xValue + c;
              
            
            const resultDiv = document.createElement("div");
            resultDiv.style.margin="10px"
            resultDiv.innerHTML = `<strong>If X = ${xValue}, then Y = <mark>${predictedY.toFixed(4)}</mark></strong>`;
            resultDiv.className = "prediction-result";
            
            
            predictionContainer.appendChild(resultDiv);        
            predictionInput.value = "";
          }
        });
      });


      document.getElementById("newCalcBtn").addEventListener("click", () => {
        numberOfRows.value = "";
        document.getElementById("dataBody").innerHTML = "";
        tableHeader.innerHTML = "";
        resultField.innerHTML = "";
        calculateButtonContainer.innerHTML = "";        

        cleanUpPredictionElements();      
        body.appendChild(dynamicRows);
      });
    });
  }
});