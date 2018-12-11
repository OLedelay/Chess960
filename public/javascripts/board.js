/*
function ChessPiece(isWhite, position){
    this.isWhite = isWhite;
    this.position = position;
}

ChessPiece.prototype.getIsWhite = function(){return this.isWhite;};
ChessPiece.prototype.getPosition = function(){return this.position;};
ChessPiece.prototype.setIsWhite = function(isWhite){this.isWhite = isWhite;};
ChessPiece.prototype.move = function(dx,dy){
    let newpos = this.position + dx + 10*dy;
    if(fileOf(newpos)>=0 && rankOf(newpos)>=0){
        this.position = position;
        return undefined;
    }
    return -1;
};

function Pawn(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

Pawn.prototype = Object.create(ChessPiece.prototype);
Pawn.prototype.constructor = Pawn;

function Rook(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

Rook.prototype = Object.create(ChessPiece.prototype);
Rook.prototype.constructor = Rook;

function Knight(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

Knight.prototype = Object.create(ChessPiece.prototype);
Knight.prototype.constructor = Knight;


function Bishop(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

Bishop.prototype = Object.create(ChessPiece.prototype);
Bishop.prototype.constructor = Bishop;


function Queen(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

Queen.prototype = Object.create(ChessPiece.prototype);
Queen.prototype.constructor = Queen;


function King(isWhite, position){
    ChessPiece.call(this, isWhite, position);
}

King.prototype = Object.create(ChessPiece.prototype);
King.prototype.constructor = King;
*/
var pieces = {
    EMPTY: 0, wP: 1, wR: 2, wN: 3, wB: 4,  wQ: 5,  wK: 6,
              bP: 7, bR: 8, bN: 9, bB: 10, bQ: 11, bK: 12
};

var piecesGap = 6;

var position = {
    A8: 21, B8: 22, C8: 23, D8: 24, E8: 25, F8: 26, G8: 27, H8: 28,
    A7: 31, B7: 32, C7: 33, D7: 34, E7: 35, F7: 36, G7: 37, H7: 38,
    A6: 41, B6: 42, C6: 43, D6: 44, E6: 45, F6: 46, G6: 47, H6: 48,
    A5: 51, B5: 52, C5: 53, D5: 54, E5: 55, F5: 56, G5: 57, H5: 58,
    A4: 61, B4: 62, C4: 63, D4: 64, E4: 65, F4: 66, G4: 67, H4: 68,
    A3: 71, B3: 72, C3: 73, D3: 74, E3: 75, F3: 76, G3: 77, H3: 78,
    A2: 81, B2: 82, C2: 83, D2: 84, E2: 85, F2: 86, G2: 87, H2: 88,
    A1: 91, B1: 92, C1: 93, D1: 94, E1: 95, F1: 96, G1: 97, H1: 98,
}

var rankDisplay = function(rankIndex){
    return 8 - rankIndex;
}

function Board() {
    this.board = (function () {
        let board = [];
        for (let i = 0; i < 120; i++) {
            board[i] = 0;
        }
        for (let i = 81; i <= 88; i++) {
            board[i] = pieces.wP;
        }
        for (let i = 31; i <= 38; i++) {
            board[i] = pieces.bP;
        }

        let rng = function (size) { return Math.floor(Math.random() * size); };

        let placement = function (num) {
            let counter = 0;
            for (let i = 91; i < 99; i++) {
                if (board[i] == 0) {
                    if (num == counter) {
                        return i;
                    }
                    counter++;
                }
            }
            return -1;
        }

        let kn1 = placement(rng(8));
        board[kn1] = pieces.wN;
        let kn2 = placement(rng(7));
        board[kn2] = pieces.wN;
        let bish1 = placement(rng(6));
        board[bish1] = pieces.wB;
        let bish2 = placement(rng(5));
        board[bish2] = pieces.wB;
        let quee = placement(rng(4));
        board[quee] = pieces.wQ;
        board[placement(0)] = pieces.wR;
        board[placement(0)] = pieces.wK;
        board[placement(0)] = pieces.wR;

        for (i = 21; i <= 28; i++) {
            board[i] = board[i + 70] + piecesGap;
        }

        return board;
    })();

    this.movesMade = 0;

    this.isWhite = function(position){
        return (this.board[position] > pieces.EMPTY && this.board[position] < pieces.bP);
    }
    this.isEmpty = function(position){
        return (this.board[position] == pieces.EMPTY);
    }

    this.validMove = function(oldpos, newpos){
        this.board[newpos] = this.board[oldpos];
        this.board[oldpos] = pieces.EMPTY;
        this.movesMade++;
    }

    this.move = function (oldpos, newpos) { // old&new positions
        if (fileOf(newpos) >= 0) {
            let relativeFile = fileOf(newpos) - fileOf(oldpos);
            let relativeRank = rankOf(newpos) - rankOf(oldpos);
            let sameFile = relativeFile == 0;
            let sameRank = relativeRank == 0;
            
            switch (this.board[oldpos]) { // !isWhite(newpos) for white, isWhite||isEmpty(newpos) for black
                case pieces.wP:
                    if (newpos <= oldpos - 9 && newpos >= oldpos - 11 && !this.isWhite(newpos)) { //newpos is somewhere close in front of oldpos
                        if(!sameFile && this.isEmpty(newpos)){ // can't diagonally jump to empty, still needs "en passant" rule implementation
                            return -1;
                        }
                        else if(sameFile && !this.isEmpty(newpos)){
                            return -1;
                        }
                        this.validMove(oldpos, newpos);
                        if(rankOf(newpos) == 0){
                            this.board[newpos] == pieces.wQ; //choose your own piece to be implemented
                        }
                        return undefined;
                    }
                    break;
                case pieces.wR:
                    if(!this.isWhite(newpos)){ 
                        if(!sameFile && sameRank){
                            if(relativeFile > 0){ 
                                for(let i = oldpos + 1; i < newpos; i++){
                                    if(!this.isEmpty(i)){ // makes sure all tiles between oldpos and newpos are empty on the same rank
                                        return -1;
                                    }
                                }
                            }
                            else{
                                for(let i = oldpos - 1; i > newpos; i--){
                                    if(!this.isEmpty(i)){ // makes sure all tiles between oldpos and newpos are empty on the same rank
                                        return -1;
                                    }
                                }
                            }
                        } 
                        else if(sameFile && !sameRank){
                            if(relativeRank > 0){
                                for(let i = oldpos + 10; i < newpos; i += 10){
                                    if(!this.isEmpty(i)){ // makes sure all tiles between oldpos and newpos are empty on the same file
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for(let i = oldpos - 10; i < newpos; i -= 10){
                                    if(!this.isEmpty(i)){ // makes sure all tiles between oldpos and newpos are empty on the same file
                                        return -1;
                                    }
                                }
                            }
                        }
                        this.validMove(oldpos, newpos);
                        return undefined;
                    }
                    break;
                case pieces.wN:
                    if(!this.isWhite(newpos)){
                        if(relativeFile == 2 || relativeFile == -2){
                            if(relativeRank == 1 || relativeRank == -1){
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }   
                        }
                        if(relativeRank == 2 || relativeRank == -2){
                            if(relativeFile == 1 || relativeFile == -1){
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }   
                        }
                    }
                    break;
                case pieces.wB:
                    if(!this.isWhite(newpos)){
                        if(relativeFile == relativeRank){
                            if(relativeFile > 0){
                                for(let i = oldpos + 11; i < newpos; i += 11){
                                    if(!this.isEmpty(i)){ // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                            else {
                                for(let i = oldpos - 11; i > newpos; i -= 11){
                                    if(!this.isEmpty(i)){ // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        } else if(relativeFile == -relativeRank){
                            if(relativeRank > 0){
                                for(let i = oldpos + 9; i < newpos; i += 9){
                                    if(!this.isEmpty(i)){ // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                            else {
                                for(let i = oldpos - 9; i > newpos; i -= 9){
                                    if(!this.isEmpty(i)){ // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        }
                    }
                    break;
                case pieces.wQ:
                case pieces.wK:
                case pieces.bP:
                case pieces.bR:
                case pieces.bN:
                case pieces.bB:
                case pieces.bQ:
                case pieces.bK:
            }
        }
        return -1;
    }
}

let baa = new Board();
console.log(baa.board.toString())


function fileOf(index) {
    if(index < 21 || index > 98){
        return -1;
    }
    let file = index % 10 - 1
    if (file == 8) {
        return -1;
    }
    return file;
}

function rankOf(index) {
    if(fileOf(index) == -1){
        return -1;
    }
    return Math.floor(index / 10) - 2;
}

function indexOf(rank, file) {
    if (rank < 0 || rank > 7 || file < 0 || file > 7) {
        return 0;
    }
    return (rank * 10 + file + 21);
}

