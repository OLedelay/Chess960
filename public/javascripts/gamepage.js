var visualizeBoard = function () {
	var count = 0;
	for (var count = 0; count < 64; count++) {
		$("#chess-board").append('<div class="tile highlight" style="grid-column:'
			+ (fileOf(count) + 1) + ';grid-row:' + (rankOf(count) + 1) + '"></div>');

		$("#chess-board").append('<div class="piece" style="grid-column:'
			+ (fileOf(count) + 1) + ';grid-row:' + (rankOf(count) + 1) +
			'"><img class="pieceimg" src="piece' + myBoard.board[count] +
			'.png" width="64" height="64"></div>');

		$(".piece").eq(count).attr("data-gridpos", count);

		if ((count % 16 < 8 && count % 2 == 1) || (count % 16 >= 8 && count % 2 == 0)) {
			$(".tile").eq(count).addClass("black");
		}
		else {
			$(".tile").eq(count).addClass("white");
		}
	}
}

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

var pieces = {
	EMPTY: 0, wP: 1, wR: 2, wN: 3, wB: 4, wQ: 5, wK: 6,
	bP: 7, bR: 8, bN: 9, bB: 10, bQ: 11, bK: 12
};

/*
	This function takes in the piece name from the ID of the list item that got clicked on
	Goes through if statement to match piece to formula, if piece is found then it will
	add the "legal" class to all matching tiles. This is for user happy fun times.


	TBA : Get assignment of piece depending on what the player has chosen. 

*/




var displayAllowedMoves = function (pos) {
	// var gridpos = currentTile.attr('data-gridpos');
	// var l_rank = ($.inArray(gridpos.charAt(0), rank));
	// var l_file = ($.inArray(parseInt(gridpos.charAt(1)), file));
	// var c_rank = rankOf(gridpos);
	// var c_file = fileOf(gridpos);





	// if (piece == "pawn") {
	// 	var ID = rank[l_rank + 1] + file[l_file];
	// 	$('*[data-gridpos="' + ID + '"]').addClass('legal');
	// 	currentTile.removeClass('legal');
	// }

}

var error;
var piece;
var myBoard;
var amWhite = true;

jQuery(document).ready(function ($) {
	myBoard = new Board();
	console.log(myBoard.board.toString());
	visualizeBoard();
	console.log("board created");
	$(".piece").on('click', function () {
		if (piece) {
			$(".tile").eq(piece.attr('data-gridpos')).removeClass('selected');
			let oldpos = piece.attr('data-gridpos');
			let newpos = $(this).attr('data-gridpos')
			let relativeFile = fileOf(newpos) - fileOf(oldpos);
			let relativeRank = rankOf(newpos) - rankOf(oldpos);
			error = myBoard.move(oldpos, newpos);
			console.log("from: " + oldpos + " to: " + newpos);
			if (!error) {
				console.log("move successful");
				piece.addClass("smoothmove");
				$(".piece.smoothmove").css({ "transform": "translate3d(" + (relativeFile * 64) + "px, " + (relativeRank * 64) + "px, 0px)" })
				setTimeout(() => {
					$(".pieceimg").eq(newpos).remove();
					$(this).append('<img class="pieceimg" src="piece' + myBoard.board[newpos] + '.png" width="64" height="64">')
					$(".pieceimg").eq(oldpos).remove();
					$(".piece").eq(oldpos).append('<img class="pieceimg" src="piece' + myBoard.board[oldpos] + '.png" width="64" height="64">')

					$(".piece.smoothmove").css({ "transform": "translate3d(0px, 0px, 0px)" })
					$(".piece").eq(oldpos).removeClass("smoothmove");
				}, 500);


			} else {
				console.log("invalid move")
				error = undefined;
			}
			piece = undefined;
		} else {
			// if (myBoard.isWhite($(this).attr('data-gridpos')) == amWhite && !myBoard.isEmpty($(this).attr('data-gridpos'))) {
				piece = $(this);
				$(".tile").eq(piece.attr('data-gridpos')).addClass('selected');
				displayAllowedMoves(piece.attr('data-gridpos'));
			// }
		}

	})

	$(".piece").on('mouseenter', function () {
		if (piece || myBoard.isWhite($(this).attr('data-gridpos')) == amWhite && !myBoard.isEmpty($(this).attr('data-gridpos'))) {
			$(".tile").eq($(this).attr('data-gridpos')).addClass('hover');
		}
	})

	$(".piece").on('mouseleave', function () {
		$(".tile").eq($(this).attr('data-gridpos')).removeClass('hover');
	});

});