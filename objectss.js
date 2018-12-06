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
var pieces = {  EMPTY:0,wP:1,wR:2,wN:3,wB:4,wQ:5,wK:6,
                    bP:7,bR:8,bN:9,bB:10,bQ:11,bK:12    };

var position = {
    A1:91, B1:92, C1:93, D1:94, E1:95, F1:96, G1:97, H1:98,
    A2:81, B2:82, C2:83, D2:84, E2:85, F2:86, G2:87, H2:88,
    A3:71, B3:72, C3:73, D3:74, E3:75, F3:76, G3:77, H3:78,
    A4:61, B4:62, C4:63, D4:64, E4:65, F4:66, G4:67, H4:68,
    A5:51, B5:52, C5:53, D5:54, E5:55, F5:56, G5:57, H5:58,
    A6:41, B6:42, C6:43, D6:44, E6:45, F6:46, G6:47, H6:48,
    A7:31, B7:32, C7:33, D7:34, E7:35, F7:36, G7:37, H7:38,
    A8:21, B8:22, C8:23, D8:24, E8:25, F8:26, G8:27, H8:28,
}

function Board(){
    this.board = (function(){
        let board = [];
        for(let i = 0; i < 120; i++){
            board[i] = 0;
        }
        for(let i = 81; i <= 88; i++){
            board[i] = pieces.wP;
        }
        for(let i = 31; i <= 38; i++){
            board[i] = pieces.bP;
        }
        
        let rng = function(size){return Math.floor(Math.random()*size);};
    
        let placement = function(num){
            let counter = 0;
            for(let i = 91; i < 99; i++){
                if(board[i]==0){
                    if(num == counter){
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

        for(i = 21; i <= 28; i++){
            board[i] = board[i+70] + 6;
        }

        return board;
    })();

    
    this.move = function(oldpos, newpos){
        switch(this.board[oldpos]){
            case 1: 
            case 2: 
            case 3: 
            case 4: 
            case 5: 
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12: 
        }
    }
}

let baa = new Board();
console.log(baa.board.toString())





function fileOf(index){
    let file = index % 10 -1
    if(file == 8){
        file = -1;
    }
    return file;
}

function rankOf(index){
    let rank = Math.floor(index / 10)-2;
    if (rank<0 || rank>7){
        rank = -1;
    }
    return rank;
}

function indexOf(rank, file){
    if(rank<0 || rank>7 || file<0 || file>7){
        return 0;
    }
    return (rank*10 + file + 21);
}

