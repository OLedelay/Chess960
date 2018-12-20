(function (exports) {

    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.T_GAME_ABORTED = "GAME-ABORTED";
    exports.O_GAME_ABORTED = {
        type: exports.T_GAME_ABORTED
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Client to server: What is the current state of the board: ...
     */
    exports.T_BOARD_STATE_REQUEST = "BOARD-STATE-REQUEST";
    exports.O_BOARD_STATE_REQUEST = {
        type: "BOARD-STATE-REQUEST",
    };

    /*
     * Server to client: This is the current state of the board: ...
     */
    exports.T_BOARD_STATE_IS = "BOARD-STATE-IS";
    exports.O_BOARD_STATE_IS = {
        type: exports.T_BOARD_STATE_IS,
        data: null
    };

    /*
     * Server to client: set as white 
     */
    exports.T_PLAYER_TYPE = "PLAYER-SIDE";
    exports.O_PLAYER_WHITE = {
        type: exports.T_PLAYER_TYPE,
        data: "WHITE"
    };
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    /* 
     * Server to client: set as black
     */
    exports.O_PLAYER_BLACK = {
        type: exports.T_PLAYER_TYPE,
        data: "BLACK"
    };
    exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null
    };

}(typeof exports === "undefined" ? this.Messages = {} : exports));
// if exports is undefined, we are on the client; else the server
