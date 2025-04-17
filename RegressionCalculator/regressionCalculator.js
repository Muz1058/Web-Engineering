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
        <button id="newCalcBtn">New Calculation</button>  
      `;

      document.getElementById("newCalcBtn").addEventListener("click", () => {
        numberOfRows.value = "";
        document.getElementById("dataBody").innerHTML = "";
        tableHeader.innerHTML = "";
        resultField.innerHTML = "";
        calculateButtonContainer.innerHTML = "";
        body.appendChild(dynamicRows); 
      });
    });
  }
});
