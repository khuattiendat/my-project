const numbers = [1, 2, 3, 2, 4, 2, 5, 3, 3, 3];

let frequency = {};
let maxCount = 0;
let mostFrequentElement = null;

for (let i = 0; i < numbers.length; i++) {
    let num = numbers[i];
    frequency[num] = (frequency[num] || 0) + 1;

    if (frequency[num] > maxCount) {
        maxCount = frequency[num];
        mostFrequentElement = num;
    }
}

// console.log(mostFrequentElement, maxCount); // Output: 3