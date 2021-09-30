# A Human Matrix solver
This project aims to solve matrixes in a humanistic way by only using fractions in the last step.
It also uses logic to combine steps together when it can.

# Plans
- [X] Make a matrix class that can perform opperations on a matrix
- [X] Add matrix row opperations into the class
- [X] Make a solve determinant function that can get the determinant of the matrix
- [X] Make a function that solves the matrix and can print the steps
- [X] Make a web page that uses my matrix class and shows its work
- [ ] Add the ability to read a string of steps produced by the solve function and apply it to another given matrix.
- [ ] make a web page that can use the generated steps and apply them to another matrix to get things like the inverse or solve for (X,Y,Z)
- [ ] make a function to determine the LU decomposition


# Matrix opperation Syntax for step solve
- opperations are seporated with a ;
- paramaters of an opperation are seporated with ,'s
- There are 4 opperations available
    - S,Ra,Rb; switches row a with row b
    - M,X,Ra; multiplys row a by X
    - MA,X,Ra,Rb; multiplys row a by X and adds to row b
    - MMA,X,Y,Ra,Rb; multiplys row a by X, multiplys row b by Y, adds row a and b together and stores the result in row b

example synax would be
```JavaScript
var X = [[1,-2,3],[0,2,1],[1,-1,1]];
var newMatrix = new Matrix(3, true);
newMatrix.matrix = X;
newMatrix.applySteps('MA,-1,0,2;S,1,2;MA,2,1,0;MA,-2,1,2;MMA,1,5,2,0;MMA,2,5,2,1;M,0.2,0;M,0.2,1;M,0.2,2;');
```