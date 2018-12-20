(function(exports){

    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
        type: "GAME ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
    *Client to server: game is complete, the winner is ...
    */
    

   /*
    * Client to server: game is complete, the winner is ...
    */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
};

}(typeof exports === "undefined" ? this.Messages = {} : exports));
//if exports is undefined, we are on the client; else the server
