document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("factorizeButton");
    button.addEventListener("click", startFactorization);
});

function startFactorization() {
    const input = document.getElementById("inputNumber").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "";

    if (!/^\d+$/.test(input)) {
        resultDiv.textContent = "Please enter a valid positive integer.";
        return;
    }

    const O = BigInt(input);
    if (O % 2n === 0n || O < 3n) {
        resultDiv.textContent = "Please enter an odd number greater than 1.";
        return;
    }

    // Count number of distinct prime factors (biprime = 2 exactly)
    let count = 0n;
    let copy = O;
    for (let i = 2n; i * i <= copy; i++) {
        if (copy % i === 0n) {
            count++;
            while (copy % i === 0n) {
                copy /= i;
            }
        }
    }
    if (copy > 1n) count++;

    if (count !== 2n) {
        resultDiv.textContent = "The number is not a biprime (must have exactly 2 distinct prime factors).";
        return;
    }

    // FRACTIONAL FACTORIZATION STARTS HERE
    const fractions = [
        { offset: 0.25, divisor: 4n },
        { offset: 0.75, divisor: 4n },
        { offset: 0.125, divisor: 8n },
        { offset: 0.875, divisor: 8n },
        { offset: 0.0625, divisor: 16n },
        { offset: 0.9375, divisor: 16n },
        { offset: 0.03125, divisor: 32n },
        { offset: 0.96875, divisor: 32n }
    ];

    let found = false;

    outer: for (let x = 1; x < 10000; x++) {
        for (const f of fractions) {
            const denom = (x + f.offset).toFixed(5);
            const q = O / parseFloat(denom);
            if (q % 1 !== 0) continue;
            const qInt = BigInt(Math.round(q));
            if (qInt % f.divisor !== 0n) continue;
            const factor = qInt / f.divisor;
            if (O % factor === 0n && factor > 1n && factor < O) {
                resultDiv.textContent = `Factor found: ${factor.toString()}`;
                found = true;
                break outer;
            }
        }
    }

    if (!found) {
        resultDiv.textContent = "No factor found within tested range.";
    }
}
