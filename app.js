function calculate() {
  const salary = parseFloat(
    document.getElementById("salary").value.replace(/,/g, "")
  );
  const raise = parseFloat(
    document.getElementById("raise").value
  );
  const inflation = parseFloat(
    document.getElementById("inflation").value
  );

  const result = document.getElementById("result");
  const badge = document.getElementById("badge");
  const summary = document.getElementById("summary");
  const detail = document.getElementById("detail");
  const breakdown = document.getElementById("breakdown");

  if (isNaN(salary) || isNaN(raise) || isNaN(inflation) || salary <= 0) {
    badge.className = "badge no";
    badge.textContent = "Missing input";
    summary.textContent = "Please enter your salary, raise %, and inflation rate.";
    detail.textContent = "All three fields are required.";
    breakdown.innerHTML = "";
    result.style.display = "block";
    return;
  }

  const newSalary = salary * (1 + raise / 100);
  const nominalIncrease = newSalary - salary;
  const realValue = newSalary / (1 + inflation / 100);
  const realChange = realValue - salary;
  const realChangePct = (realChange / salary) * 100;

  if (realChange > 0) {
    badge.className = "badge ok";
    badge.textContent = "✓ Your raise beats inflation";
    summary.textContent = "Success! Your purchasing power increased by $" + realChange.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " in real terms.";
    detail.textContent = "A " + raise + "% raise outpaces " + inflation + "% inflation — your real purchasing power grew by " + realChangePct.toFixed(2) + "%.";
  } else if (realChange < 0) {
    badge.className = "badge no";
    badge.textContent = "✕ Your raise lost to inflation";
    summary.textContent = "Warning: Even with a $" + nominalIncrease.toLocaleString(undefined, { maximumFractionDigits: 0 }) + " raise, you can buy fewer goods than last year.";
    detail.textContent = "A " + raise + "% raise does not keep up with " + inflation + "% inflation — your real purchasing power fell by " + Math.abs(realChangePct).toFixed(2) + "%.";
  } else {
    badge.className = "badge neutral";
    badge.textContent = "→ Your raise exactly matches inflation";
    summary.textContent = "Your purchasing power is unchanged in real terms.";
    detail.textContent = "Your raise of " + raise + "% exactly matches the inflation rate of " + inflation + "%.";
  }

  breakdown.innerHTML = '<div class="sep"></div><div class="mini">Current salary: <span class="k">$' + salary.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span> &nbsp;•&nbsp;New salary: <span class="k">$' + newSalary.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span> &nbsp;•&nbsp;Nominal increase: <span class="k">$' + nominalIncrease.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span><br/>Real value (inflation-adjusted): <span class="k">$' + realValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span> &nbsp;•&nbsp;Real change: <span class="k">' + (realChange >= 0 ? "+" : "") + '$' + realChange.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span></div>';

  result.style.display = "block";
}

document.getElementById("year").textContent = new Date().getFullYear();
