// Please refrain from tampering with the setup code provided here,
// as the index.html and test files rely on this setup to work properly.
// Only add code (e.g., helper methods, variables, etc.) within the scope
// of the anonymous function on line 6

const polybiusModule = (function () {
  // you can add any code you want within this function scope
  /****** Constant Keys ******/
  const keys = {
    alphaKey: _createKey("alpha"),
    coordKey: _createKey("coord"),
  };

  /*****************************
   * * * * * *  MAIN * * * * * *
   ****************************/
  function polybius(input, encode = true) {
     try {
      if (!input.length) throw new Error(`Input cannot be empty!`);
      return input
        .split(" ")
        .map((word) => _iterateWord(word, encode, keys))
        .join(" ");
    } catch (error) {
     return false; //return false if error
    }
  }

  /*********************************
   * * * *  HELPER FUNCTIONS * * * *
   ********************************/
  
  function _iterateWord(word, encode, { alphaKey, coordKey }) {
    /***********
     * ENCODING
     ***********/
    if (encode)
      return word
        .toLowerCase()
        .split("")
        .map((letter) => _mapMatrixTo(letter, alphaKey, coordKey))
        .join("");

    /***********
     * DECODING
     ***********/
    if (word.length % 2 !== 0)
      throw new Error(
        `Polybius coordinates come in pairs.\nIgnoring spaces, you cannot decrypt with an odd numbered total!`
      ); 
    let output = "";
    for (let char = 0; char < word.length; char += 2) {
      const col = word[char];
      const row = word[char + 1];
      const code = `${col}${row}`;
      output += _mapMatrixTo(code, coordKey, alphaKey);
    }
    return output;
  }

  //Finds the coordinate on fromKey that matches the inputted character, and returns the value of toKey at the same coordinate
  function _mapMatrixTo(input, fromKey, toKey) {
    const coordinate = _findCoordinate(input, fromKey); //finds the matching coordinate in the fromKey
    if (!coordinate) throw new Error(`"${input}" is not a valid input!`); //If no match is found return false
    const row = coordinate[0]; 
    const col = coordinate[1]; 
    return toKey[row][col]; 
  }
  
  function _findCoordinate(input, key) {
    if (input === "i" || input === "j") input = "(i/j)"; //i or j will be treated as i/j
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 5; col++) {
        if (key[row][col] === input) return [row, col]; //
      }
    return false; //if no match is found return false
  }

  /*************************************************
   * * * * * * *  DEVELOPER FUNCTIONS  * * * * * * *
   * * * * TO CREATE ENCRYPTION KEY MATRICES * * * *
   ************************************************/
  function _createKey(type = "alpha", size = 5) {
    //Creates a matrix of the specified type and size to use as an encryption key
    const grid = [];
    for (let row = 0; row < size; row++) {
      const thisRow = [];
      for (let col = 0; col < size; col++) {
        type === "alpha"
          ? thisRow.push(_alphaIndex(row, col, size))
          : thisRow.push(_coordIndex(row, col));
      }
      grid.push(thisRow);
    }
    return grid;
  }
  
  function _alphaIndex(row, col, size) {
    const number = row * size + col; 
    let charCode = number + 97; //Add 97 to start from charCode "a"
    if (charCode === 105) return "(i/j)"; 
    const shift = charCode > 105 ? 1 : 0; //since i and j are merged one space is needed to account for it
    return String.fromCharCode(charCode + shift);
  }
  function _coordIndex(row, col) {
    return `${col + 1}${row + 1}`;
  }

  return {
    polybius,
  };
})();

module.exports = { polybius: polybiusModule.polybius };