class Matrix {
    //var matrix[row][column]

    /**
     * Makes a square matrix and sets all values to 0
     * @param {*} size The number of rows AND columns in a matrix
     * @param {*} showWork Outputs the math processe to the terminal or not. 
     */
    constructor(size, showWork) {
        this.matrix = new Array(size).fill(0).map(() => new Array(size).fill(0));
        this.showWork = showWork;
    }

    /**
     * Switches position of Row 1 with Row 2
     * @param {*} r1 Row 1
     * @param {*} r2 Row 2
     */
    switchRows(r1, r2) {
        let tempRow = this.matrix[r1];
        this.matrix[r1] = this.matrix[r2];
        this.matrix[r2] = tempRow;
        if (this.showWork) {
            console.log(`Switching row ${r1} with row ${r2}`);
            this.print();
        }
    }

    /**
     * Multiplys a row by value x
     * @param {*} x The Multiplyer
     * @param {*} r The Row
     */
    multiplyRow(x, r) {
        this.matrix[r].forEach((column, index) => {
            this.matrix[r][index] = column * x;
        });
        if (this.showWork) {
            console.log(`Multiplying row ${r} by ${x}`);
            this.print();
        }
    }

    /**
     * Multiplys Row 1 by x and adds the result to Row 2
     * @param {*} x The Multiplyer
     * @param {*} r1 Row 1
     * @param {*} r2 Row 2
     */
    multiplyAndAddRow(x, r1, r2) {
        this.matrix[r1].forEach((column, index) => {
            this.matrix[r2][index] = (x * column) + this.matrix[r2][index];
        });
        if (this.showWork) {
            console.log(`Multiplying row ${r1} by ${x} and adding the product to ${r2}`);
            this.print();
        }
    }

    /**
     * Multiplys Row 1, Multiplys Row 2, adds the result together and stores in Row 2
     * @param {*} x Row 1 Multiplyer
     * @param {*} y Row 2 Multiplyer
     * @param {*} r1 Row 1
     * @param {*} r2 Row 2
     */
    MAMA(x, y, r1, r2) {
        this.matrix[r1].forEach((column, index) => {
            this.matrix[r2][index] = (x * column) + (y * this.matrix[r2][index]);
        });
        if (this.showWork) {
            console.log(`Multiplying row ${r1} by ${x}, Multiplying row ${r2} by ${y}, adding them together and saving to row ${r2}`);
            this.print();
        }
    }

    print() {
        let matrixString = '';
        this.matrix.forEach(row => {
            matrixString += '[ '
            row.forEach((column, index) => {
                if (index === 0) matrixString += '' + column + '';
                else matrixString += ', ' + column + '';
            });
            matrixString += ' ] \n';
        });
        console.log(matrixString);
    }

    determinant(matrix) {
        if (matrix[0].length == 2) {
            //base case
            return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
        }
        else {
            let sum = 0;
            for (let i = 0; i < matrix[0].length; i++) {
                //create and populate the sub matrix
                let subMatrix = new Array(matrix[0].length - 1).fill(0).map(() => new Array(matrix[0].length - 1).fill(0));
                for (let a = 1; a < matrix[0].length; a++) {
                    for (let b = 0; b < matrix[0].length - 1; b++) {
                        // console.log(`A: ${a}, B: ${b}`);
                        if (b >= i) subMatrix[a - 1][b] = matrix[a][b + 1];
                        else subMatrix[a - 1][b] = matrix[a][b];
                    }
                }
                if (i % 2 == 0) sum += matrix[0][i] * this.determinant(subMatrix); //if even
                else sum -= matrix[0][i] * this.determinant(subMatrix); //if odd
            }
            return sum;
        }
    }
    /**
     * For this to work, the returned statements must be prepended and appended with $$
     * @returns 
     */
    mathJax(){
        let mathMatrix = '';
        mathMatrix += '\\begin{bmatrix} ';
        for(let i = 0; i < this.matrix[0].length; i++){
            for(let j = 0; j < this.matrix[0].length; j++){
                if(j < this.matrix[0].length-1) mathMatrix += '' + this.matrix[i][j] + ' & ';
                else mathMatrix += '' + this.matrix[i][j] + '\\\\ ';
            }
        }
        mathMatrix += '\\end{bmatrix} ';
        return mathMatrix;
    }

    human_solve() {
        let determinant = this.determinant(this.matrix);
        if (determinant === 0) {
            this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            return 'Error matrix has no determinant';
        }
        else {
            //step 2, give it structure
            let solution = '';
            let steps = '$$\n Start:';
            steps += this.mathJax();
            steps += "\n$$\n"

            for (let i = 0; i < this.matrix[0].length; i++) {
                //if that position is not already 1, make it 1
                if (this.matrix[i][i] !== 1) {
                    //check if any in that column are == to 1 that can be swapped
                    var next = false;
                    for (let j = i + 1; j < this.matrix[0].length; j++) {
                        if (this.matrix[j][i] === 1) {
                            solution += `S,${i},${j};`;
                            steps += `$$\nR${i+1} <=> R${j+1}:` + this.mathJax() + '=>';
                            this.switchRows(i, j);
                            steps += this.mathJax() + '\n$$\n';
                            next = true;
                            break;
                        }
                    }

                    // if no rows could be swapped, check if any could be multiplied evenly to make the target = 1
                    if (!next) {
                        for (let j = i + 1; j < this.matrix[0].length; j++) {
                            let target = this.matrix[i][i] - 1;

                            if (target % this.matrix[j][i] === 0) {
                                solution += `MA,${-(target / this.matrix[j][i])},${j},${i};`;
                                steps += `$$\n${-(target / this.matrix[j][i])}R${j+1} + R${i+1} = R${i+1}: ` + this.mathJax() + '=>';
                                this.multiplyAndAddRow(-(target / this.matrix[j][i]), j, i);
                                steps += this.mathJax() + '\n$$\n';
                                break;
                            }
                        }
                    }
                }
                // loop through the column and check if each other element is 0, if not, make it so.
                for (let j = 0; j < this.matrix[0].length; j++) {
                    if (j != i && this.matrix[j][i] != 0) {
                        let target = -this.matrix[j][i];
                        if (target % this.matrix[i][i] === 0) {
                        // if (true) {
                            steps += `$$\n${target / this.matrix[i][i]}R${i+1} + R${j+1} = R${j+1}: ` + this.mathJax() + '=>';
                            solution += `MA,${target / this.matrix[i][i]},${i},${j};`;
                            this.multiplyAndAddRow((target / this.matrix[i][i]), i, j);
                        }
                        else {
                            steps += `$$\n${-this.matrix[j][i]}R${i+1} + ${this.matrix[i][i]}R${j+1} = R${j+1}: ` + this.mathJax() + '=>';
                            solution += `MMA,${-this.matrix[j][i]},${this.matrix[i][i]},${i},${j};`;
                            this.MAMA(-this.matrix[j][i], this.matrix[i][i], i, j);
                        }
                        steps += this.mathJax() + '\n$$\n';
                    }
                }


            }
            // Step 3, loop through and check if the final form is 1, else multiply to get there.
            for (let i = 0; i < this.matrix[0].length; i++) {
                if (this.matrix[i][i] != 1) {
                    solution += `M,${1 / this.matrix[i][i]},${i};`;
                    steps += `$$\n${(1 / this.matrix[i][i])}R${i+1} = R${i+1}: ` + this.mathJax() + '=>';
                    this.multiplyRow((1 / this.matrix[i][i]), i);
                    steps += this.mathJax() + '\n$$\n';
                }
            }
            return {
                solution: solution,
                steps: steps,
                determinant: determinant
            }
        }
    }

    robo_solve() {
        let determinant = this.determinant(this.matrix);
        if (determinant === 0) {
            this.matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
            return 'Error matrix has no determinant';
        }
        else {
            //step 2, give it structure
            let solution = '';
            let steps = '$$\n Start:';
            steps += this.mathJax();
            steps += "\n$$\n"

            for (let i = 0; i < this.matrix[0].length; i++) {
                //if that position is not already 1, make it 1
                if (this.matrix[i][i] !== 1) {
                    //check if any in that column are == to 1 that can be swapped
                    var next = false;
                    for (let j = i + 1; j < this.matrix[0].length; j++) {
                        if (this.matrix[j][i] === 1) {
                            solution += `S${i},${j};`;
                            steps += `$$\nR${i+1} <=> R${j+1}:` + this.mathJax() + '=>';
                            this.switchRows(i, j);
                            steps += this.mathJax() + '\n$$\n';
                            next = true;
                            break;
                        }
                    }

                    // if no rows could be swapped, check if any could be multiplied evenly to make the target = 1
                    if (!next) {
                        for (let j = i + 1; j < this.matrix[0].length; j++) {
                            let target = this.matrix[i][i] - 1;

                            if (target % this.matrix[j][i] === 0) {
                                solution += `MA${-(target / this.matrix[j][i])},${j},${i};`;
                                steps += `$$\n${-(target / this.matrix[j][i])}R${j+1} + R${i+1} = R${i+1}: ` + this.mathJax() + '=>';
                                this.multiplyAndAddRow(-(target / this.matrix[j][i]), j, i);
                                steps += this.mathJax() + '\n$$\n';
                                break;
                            }
                        }
                    }
                }
                // loop through the column and check if each other element is 0, if not, make it so.
                for (let j = 0; j < this.matrix[0].length; j++) {
                    if (j != i && this.matrix[j][i] != 0) {
                        let target = -this.matrix[j][i];
                        steps += `$$\n${target / this.matrix[i][i]}R${i+1} + R${j+1} = R${j+1}: ` + this.mathJax() + '=>';
                        solution += `MA${target / this.matrix[i][i]},${i},${j};`;
                        this.multiplyAndAddRow((target / this.matrix[i][i]), i, j);
                        steps += this.mathJax() + '\n$$\n';
                    }
                }


            }
            // Step 3, loop through and check if the final form is 1, else multiply to get there.
            for (let i = 0; i < this.matrix[0].length; i++) {
                if (this.matrix[i][i] != 1) {
                    solution += `M${1 / this.matrix[i][i]},${i};`;
                    steps += `$$\n${(1 / this.matrix[i][i])}R${i+1} = R${i+1}: ` + this.mathJax() + '=>';
                    this.multiplyRow((1 / this.matrix[i][i]), i);
                    steps += this.mathJax() + '\n$$\n';
                }
            }
            return {
                solution: solution,
                steps: steps,
                determinant: determinant
            }
        }
    }

    //apply generated steps to the matrix
    applySteps(solution){
        //MA,-1,0,2;S,1,2;MA,2,1,0;MA,-2,1,2;MMA,1,5,2,0;MMA,2,5,2,1;M,0.2,0;M,0.2,1;M,0.2,2;
        
        //stp 1: break the string into parts delimited by the ';'
        solution = solution.split(';');

        //stp 2: break the strings into a multi dimentional array delimited by ','
        solution.forEach((step, stp_num) => {
            solution[stp_num] = step.split(',');
        });

        //process each row as input steps applied to a matrix showing steps along the way
        solution.forEach(step => {
            switch(step[0]){
                case 'S':
                    this.switchRows(step[1], step[2]);
                    break;
                case 'M':
                    this.multiplyRow(step[1], step[2]);
                    break;
                case 'MA':
                    this.multiplyAndAddRow(step[1], step[2], step[3]);
                    break;
                case 'MMA':
                    this.MAMA(step[1], step[2], step[3], step[4]);
                    break;
            }
        });

    }

}
/*
var X = [[1,-2,3],[0,2,1],[1,-1,1]];
var X = [[1,0,0],[0,1,0],[0,0,1]];
var newMatrix = new Matrix(3, true);
newMatrix.matrix = X;
newMatrix.applySteps('MA,-1,0,2;S,1,2;MA,2,1,0;MA,-2,1,2;MMA,1,5,2,0;MMA,2,5,2,1;M,0.2,0;M,0.2,1;M,0.2,2;');
*/