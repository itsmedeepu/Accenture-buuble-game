export interface Equation {
  id: string;
  text: string;
  value: number;
}



const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const roundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const generateEquations = (level: number): Equation[] => {
  const equations: Equation[] = [];
  const usedValues = new Set<number>();
  
  // Difficulty scaling
  // Level 1-5: Simple operations, small numbers
  // Level 6-10: Decimals, larger numbers
  // Level 11+: Mixed operations, negative results possible
  
  const maxNumber = 10 + (level * 2);
  
  while (equations.length < 3) {
    let val1 = getRandomInt(1, maxNumber);
    let val2 = getRandomInt(1, maxNumber);
    // Weighted operators: Increase chance of / and decimals
    const ops = ['+', '-', '*', '/', '/', '+']; 
    let operator = ops[getRandomInt(0, Math.min(level + 2, 5))]; // Unlock operators faster
    
    // Force more decimals
    if (Math.random() > 0.6) {
        // Generate decimal numbers to start with
        val1 = roundToTwo(getRandomInt(1, maxNumber) + Math.random());
        val2 = roundToTwo(getRandomInt(1, maxNumber) + Math.random());
        operator = ['+', '-'][getRandomInt(0, 1)]; // Keep it simple with decimals for now
    }

    if (operator === '/') {
        // Force division to often result in decimals like .5
        if (Math.random() > 0.4) {
             // Create clean division
             val1 = val2 * getRandomInt(1, 10);
        } else {
             // Create .5 type decimals
             val2 = 2;
             val1 = (getRandomInt(1, 10) * 2) + 1; // Odd number / 2 = .5
        }
    }

    // Adjust for subtraction to avoid negatives in early levels
    if (operator === '-' && level < 5) {
        if (val1 < val2) [val1, val2] = [val2, val1];
    }
    
    let value = 0;
    switch(operator) {
        case '+': value = val1 + val2; break;
        case '-': value = val1 - val2; break;
        case '*': value = val1 * val2; break;
        case '/': value = val1 / val2; break;
    }
    
    value = roundToTwo(value);
    
    if (!usedValues.has(value) && !isNaN(value) && isFinite(value)) {
        usedValues.add(value);
        equations.push({
            id: Math.random().toString(36).substr(2, 9),
            text: `${val1} ${operator} ${val2}`,
            value: value
        });
    }
  }
  
  return equations;
};
