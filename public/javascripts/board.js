var pieces = {
    EMPTY: 0, wP: 1, wR: 2, wN: 3, wB: 4, wQ: 5, wK: 6,
    bP: 7, bR: 8, bN: 9, bB: 10, bQ: 11, bK: 12
};

var piecesGap = 6;

// var position = {
//     A8: 0, B8: 1, C8: 2, D8: 3, E8: 4, F8: 5, G8: 6, H8: 7,
//     A7: 8, B7: 9, C7: 10, D7: 11, E7: 12, F7: 13, G7: 14, H7: 15,
//     A6: 16, B6: 42, C6: 43, D6: 44, E6: 45, F6: 46, G6: 47, H6: 23,
//     A5: 24, B5: 52, C5: 53, D5: 54, E5: 55, F5: 56, G5: 57, H5: 31,
//     A4: 32, B4: 62, C4: 63, D4: 64, E4: 65, F4: 66, G4: 67, H4: 39,
//     A3: 40, B3: 72, C3: 73, D3: 74, E3: 75, F3: 76, G3: 77, H3: 47,
//     A2: 48, B2: 82, C2: 83, D2: 84, E2: 85, F2: 86, G2: 87, H2: 55,
//     A1: 56, B1: 92, C1: 93, D1: 94, E1: 95, F1: 96, G1: 97, H1: 63,
// }

var rankDisplay = function (rankIndex) {
    return 8 - rankIndex;
}

function Board() {
    this.board = (function () {
        let board = [];
        for (let i = 0; i < 64; i++) {
            board[i] = 0;
        }
        for (let i = 48; i <= 55; i++) {
            board[i] = pieces.wP;
        }
        for (let i = 8; i <= 15; i++) {
            board[i] = pieces.bP;
        }

        let rng = function (size) { return Math.floor(Math.random() * size); };

        let placement = function (num) {
            let counter = 0;
            for (let i = 56; i < 64; i++) {
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

        for (i = 0; i <= 7; i++) {
            board[i] = board[i + 56] + piecesGap;
        }

        return board;
    })();

    this.movesMade = 0;

    this.isWhite = function (position) {
        return (this.board[position] > pieces.EMPTY && this.board[position] < pieces.bP);
    }
    this.isEmpty = function (position) {
        return (this.board[position] == pieces.EMPTY);
    }

    // returns whether a given position on the board is safe, given the position and whether the target is white
    this.isSafe = function (pos, isWhite) {
        // returns a new position given an old position and offsets, returns 0 if offsets are out of bounds
        let offset = function (position, fileOffset, rankOffset) {
            let resultFile = fileOf(position) + fileOffset;
            let resultRank = rankOf(position) + rankOffset;
            if (resultFile >= 0 && resultFile < 8 && resultRank >= 0 && resultRank < 8) {
                return position + 8 * rankOffset + fileOffset;
            }
            return -1;
        }

        let scaryPieces;
        if (isWhite) {
            scaryPieces = { Pawn: 7, Rook: 8, Knight: 9, Bishop: 10, Queen: 11, King: 12 }

            if (this.board[offset(pos, 1, -1)] == scaryPieces.Pawn || this.board[offset(pos, -1, -1)] == scaryPieces.Pawn) {
                return false;
            }
        }
        else {
            scaryPieces = { Pawn: 1, Rook: 2, Knight: 3, Bishop: 4, Queen: 5, King: 6 }

            if (this.board[offset(pos, 1, 1)] == scaryPieces.Pawn || this.board[offset(pos, -1, 1)] == scaryPieces.Pawn) {
                return false;
            }
        }
        // static positions knight/king
        if (this.board[offset(pos, 2, 1)] == scaryPieces.Knight || this.board[offset(pos, 2, -1)] == scaryPieces.Knight ||
            this.board[offset(pos, -2, 1)] == scaryPieces.Knight || this.board[offset(pos, -2, -1)] == scaryPieces.Knight ||
            this.board[offset(pos, 1, 2)] == scaryPieces.Knight || this.board[offset(pos, -1, 2)] == scaryPieces.Knight ||
            this.board[offset(pos, 1, -2)] == scaryPieces.Knight || this.board[offset(pos, -1, -2)] == scaryPieces.Knight ||

            this.board[offset(pos, 0, 1)] == scaryPieces.King || this.board[offset(pos, 1, 1)] == scaryPieces.King ||
            this.board[offset(pos, 1, 0)] == scaryPieces.King || this.board[offset(pos, 1, -1)] == scaryPieces.King ||
            this.board[offset(pos, 0, -1)] == scaryPieces.King || this.board[offset(pos, -1, -1)] == scaryPieces.King ||
            this.board[offset(pos, -1, 0)] == scaryPieces.King || this.board[offset(pos, -1, 1)] == scaryPieces.King
        ) {
            return false;
        }
        // sameRank to the right
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, i, 0)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Rook || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // sameRank to the left
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, -i, 0)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Rook || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // sameFile below
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, 0, i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Rook || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // sameFile above
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, 0, -i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Rook || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // bottom right diagonal
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, i, i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Bishop || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // bottom left diagonal
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, -i, i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Bishop || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // top left diagonal
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, -i, -i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Bishop || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        // top right diagonal
        for (let i = 1; i < 8; i++) {
            let piece = this.board[offset(pos, i, -i)];
            if (piece > pieces.EMPTY) {
                if (piece == scaryPieces.Bishop || piece == scaryPieces.Queen) {
                    return false;
                }
                break;
            }
        }
        return true;
    }

    this.validMove = function (oldpos, newpos) {
        this.board[newpos] = this.board[oldpos];
        this.board[oldpos] = pieces.EMPTY;
        this.movesMade++;
    }

    // function to move the piece at a certain position to a new position, returns -1 if the move is invalid
    this.move = function (oldpos, newpos) {
        if (fileOf(newpos) >= 0) {
            let relativeFile = fileOf(newpos) - fileOf(oldpos);
            let relativeRank = rankOf(newpos) - rankOf(oldpos);
            let sameFile = relativeFile == 0;
            let sameRank = relativeRank == 0;

            let wKPosition = 0;
            let bKPosition = 0;
            for (let i = 0; i <= 63; i++) {
                let p = this.board[i];
                if (p == pieces.wK) {
                    wKPosition = i;
                }
                if (p == pieces.bK) {
                    bKPosition = i;
                }
            }
            let wKSafe = this.isSafe(wKPosition, true);
            let bKSafe = this.isSafe(bKPosition, false);


            switch (this.board[oldpos]) {
                case pieces.wP: // "en passant" not yet implemented
                    if (!this.isWhite(newpos) && wKSafe && this.movesMade % 2 == 0) {
                        if (relativeRank == -1 && relativeFile >= -1 && relativeFile <= 1) { //newpos is somewhere close in front of oldpos
                            if (!sameFile && this.isEmpty(newpos)) { // can't diagonally jump to empty
                                return -1;
                            }
                            else if (sameFile && !this.isEmpty(newpos)) {
                                return -1;
                            }
                            this.validMove(oldpos, newpos);
                            if (rankOf(newpos) == 0) {
                                this.board[newpos] == pieces.wQ; //free choice not yet implemented
                            }
                            return undefined;
                        } else if (relativeRank == -2 && sameFile && rankOf(oldpos) == 6 && this.isEmpty(newpos)) {
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.bP:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && bKSafe && this.movesMade % 2 == 1) {
                        if (relativeRank == 1 && relativeFile >= -1 && relativeFile <= 1) { //newpos is somewhere close in front of oldpos
                            if (!sameFile && this.isEmpty(newpos)) { // can't diagonally jump to empty
                                return -1;
                            }
                            else if (sameFile && !this.isEmpty(newpos)) {
                                return -1;
                            }
                            this.validMove(oldpos, newpos);
                            if (rankOf(newpos) == 7) {
                                this.board[newpos] == pieces.bQ; //free choice not yet implemented
                            }
                            return undefined;
                        } else if (relativeRank == 2 && sameFile && rankOf(oldpos) == 1 && this.isEmpty(newpos)) {
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.wR:
                    if (!this.isWhite(newpos) && wKSafe && this.movesMade % 2 == 0) {
                        if (!sameFile && sameRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 1; i < newpos; i++) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 1; i > newpos; i--) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                        else if (sameFile && !sameRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 8; i < newpos; i += 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 8; i < newpos; i -= 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.bR:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && bKSafe && this.movesMade % 2 == 1) {
                        if (!sameFile && sameRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 1; i < newpos; i++) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 1; i > newpos; i--) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                        else if (sameFile && !sameRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 8; i < newpos; i += 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 8; i < newpos; i -= 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.wN:
                    if (!this.isWhite(newpos) && wKSafe && this.movesMade % 2 == 0) {
                        if (relativeFile == 2 || relativeFile == -2) {
                            if (relativeRank == 1 || relativeRank == -1) {
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        }
                        if (relativeRank == 2 || relativeRank == -2) {
                            if (relativeFile == 1 || relativeFile == -1) {
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        }
                    }
                    break;
                case pieces.bN:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && bKSafe && this.movesMade % 2 == 1) {
                        if (relativeFile == 2 || relativeFile == -2) {
                            if (relativeRank == 1 || relativeRank == -1) {
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        }
                        if (relativeRank == 2 || relativeRank == -2) {
                            if (relativeFile == 1 || relativeFile == -1) {
                                this.validMove(oldpos, newpos);
                                return undefined;
                            }
                        }
                    }
                    break;
                case pieces.wB:
                    if (!this.isWhite(newpos) && wKSafe && this.movesMade % 2 == 0) {
                        if (relativeFile == relativeRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 9; i < newpos; i += 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 9; i > newpos; i -= 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (relativeFile == -relativeRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 7; i < newpos; i += 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 7; i > newpos; i -= 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.bB:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && bKSafe && this.movesMade % 2 == 1) {
                        if (relativeFile == relativeRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 9; i < newpos; i += 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 9; i > newpos; i -= 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (relativeFile == -relativeRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 7; i < newpos; i += 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 7; i > newpos; i -= 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.wQ:
                    if (!this.isWhite(newpos) && wKSafe && this.movesMade % 2 == 0) {
                        if (relativeFile == relativeRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 9; i < newpos; i += 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 9; i > newpos; i -= 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (relativeFile == -relativeRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 7; i < newpos; i += 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 7; i > newpos; i -= 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (!sameFile && sameRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 1; i < newpos; i++) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 1; i > newpos; i--) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                        else if (sameFile && !sameRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 8; i < newpos; i += 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 8; i < newpos; i -= 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.bQ:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && bKSafe && this.movesMade % 2 == 1) {
                        if (relativeFile == relativeRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 9; i < newpos; i += 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 9; i > newpos; i -= 9) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (relativeFile == -relativeRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 7; i < newpos; i += 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 7; i > newpos; i -= 7) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        } else if (!sameFile && sameRank) {
                            if (relativeFile > 0) {
                                for (let i = oldpos + 1; i < newpos; i++) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 1; i > newpos; i--) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same rank
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                        else if (sameFile && !sameRank) {
                            if (relativeRank > 0) {
                                for (let i = oldpos + 8; i < newpos; i += 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            else {
                                for (let i = oldpos - 8; i < newpos; i -= 8) {
                                    if (!this.isEmpty(i)) { // tiles between oldpos and newpos empty on same file
                                        return -1;
                                    }
                                }
                            }
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.wK:
                    if (!this.isWhite(newpos) && this.movesMade % 2 == 0) { // castling not yet implemented
                        if (relativeFile >= -1 && relativeFile <= 1 && relativeRank >= -1 && relativeRank <= 1 && this.isSafe(newpos, true)) {
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
                    break;
                case pieces.bK:
                    if ((this.isWhite(newpos) || this.isEmpty(newpos)) && this.movesMade % 2 == 0) {
                        if (relativeFile >= -1 && relativeFile <= 1 && relativeRank >= -1 && relativeRank <= 1 && this.isSafe(newpos, false)) {
                            this.validMove(oldpos, newpos);
                            return undefined;
                        }
                    }
            }
        }
        return -1;
    }
}

// let baa = new Board();
// console.log(baa.board.toString())


function fileOf(index) {
    if (index < 0 || index > 63) {
        return -1;
    }
    return (index % 8);
}

function rankOf(index) {
    if (index < 0 || index > 63) {
        return -1;
    }
    return Math.floor(index / 8);
}

function indexOf(file, rank) {
    if (rank < 0 || rank > 7 || file < 0 || file > 7) {
        return 0;
    }
    return (rank * 8 + file);
}

