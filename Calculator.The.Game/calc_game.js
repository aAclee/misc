// Goal, Moves, Instructions, Start
// Given a goal, number of moves, and a set of instructions,
// find the instructions used within the number of moves
// that will change the start until it becomes the goal
// goal - number (integer)
// start = number (integer)
// moves = number (ineger)
// instruction = array(strings)

class Instruction {
  constructor(string) {
    this.instruction = string;
  }

  applyInstruction(num) {
    const lead = this.instruction[0];
    let instNum = Number(this.instruction.slice(1));
    switch(lead) {
      case "+":
      case "-":
      case "/":
      case "x":
        return this.applyOperation(lead, num, instNum);

      default:
        return this.specialInstruction(num);
    }
  }

  applyOperation(op, numOne, numTwo) {
    switch(op) {
      case "+":
        return numOne + numTwo;
      case "-":
        return numOne - numTwo;
      case "x":
        return numOne * numTwo;
      case "/":
        return numOne / numTwo;
      default:
        return numOne;
    }
  }

  specialInstruction(num) {
    switch(this.instruction) {
      case "negate":
        return num * -1;
      case "sum":
        return this.sumNumber(num);
      case "reverse":
        return this.reverse(num);
      case "mirror":
        return this.mirror(num);
      case "<<":
        return this.removeRight(num);
      case ">>":
        return this.removeLeft(num);
      default:
        return this.hybridOperation(num);
    }
  }

  sumNumber(num) {
    let sum = 0;
    const stringNum = String(num);
    for (let i = 0; i < stringNum.length; i++) {
      sum += Number(stringNum[i]);
    }
    return sum;
  }

  shiftLeft(num) {
    const strNum = String(num);
    const first = strNum[0];
    const rest = strNum.slice(1);
    return Number(rest + first);
  }

  shiftRight(num) {
    const strNum = String(num);
    const last = strNum[strNum.length - 1];
    const rest = strNum.slice(0, strNum.length - 1);
    return Number(last + rest);
  }

  reverse(num) {
    return Number(String(num).split("").reverse().join(""));
  }

  mirror(num) {
    const str = String(num) + String(num).split("").reverse().join("");
    return Number(str);
  }

  removeRight(num) {
    const strNum = String(num);
    return Number(strNum.slice(0, strNum.length - 1));
  }

  removeLeft(num) {
    const strNum = String(num);
    return Number(strNum.slice(1));
  }

  hybridOperation(num) {
    if (this.instruction.includes("power")) {
      const power = Number(this.instruction.split("power")[1]);
      return Math.pow(num, power);

    } else if (this.instruction.includes("replace")) {
      const replace = this.instruction.split("replace")[1].split("=>");
      const stringNum = String(num).replaceAll(replace[0], replace[1]);
      return Number(stringNum);

    } else if (this.instruction.includes("insert")) {
      const insert = this.instruction.split("insert")[1];
      const stringNum = String(num);
      return Number(stringNum + insert);

    } else if (this.instruction.includes("shift")) {
      const shift = this.instruction.split("shift")[1];
      return (shift === "<") ? this.shiftLeft(num) : this.shiftRight(num);

    } else {
      return num;
    }
  }
}

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.split(search).join(replacement);
};

class CalculatorGame {
  constructor(start, goal, moves, instructions) {
    this.start = start;
    this.goal = goal;
    this.moves = moves;
    this.instructions = instructions;
  }

  checkSolution(instructions) {
    let total = this.start;
    // console.log(total);
    for (let i = 0; i < instructions.length; i++) {
      let instruction = new Instruction(instructions[i]);
      total = instruction.applyInstruction(total);
      // console.log(total);
      if (String(total).length > 6) return false;
    }
    return total === this.goal;
  }

  buildAllSolutions(moves = this.moves, instructions = this.instructions) {
    if (moves < 1) return [];
    if (moves === 1) {
      return instructions.map( inst => [inst]);
    }

    const prevSolutions = this.buildAllSolutions(moves - 1, instructions);
    const allSolutions = [];
    instructions.forEach( currentInst => {
      prevSolutions.forEach( prevInst => {
        allSolutions.push([currentInst, ...prevInst]);
      });
    });

    return allSolutions;
  }

  findSolution() {
    const allSolutions = this.buildAllSolutions();
    for (let i = 0; i < allSolutions.length; i++) {
      if (this.checkSolution(allSolutions[i])) {
        return allSolutions[i];
      }
    }
    return [];
  }
}

// constructor(start, goal, moves, instructions)
const shiftLeft = "shift<";
const shiftRight = "shift>";
const removeLeft = ">>";
const removeRight = "<<";
const negate = "negate";
const sum = "sum";
const reverse = "reverse";
const mirror = "mirror";
const replace = (n1, n2) => {
  return `replace${n1}=>${n2}`;
};
const insert = n => {
  return `insert${n}`;
};


const start = 125;
const goal = 20;
const moves = 8;
const instruction = [mirror, sum];

const game = new CalculatorGame(start, goal, moves, instruction);
console.log(game.findSolution());