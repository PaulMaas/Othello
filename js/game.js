// The Game class has knowledge of the rules and provides methods that
// alter the Board while staying within the boundaries 
// of those rules. It also maintains state through the State object.
function Game(id, state, turn)
{
    var _me = this;
    
    var _id;
    var _state;
    var _board;
    var _players;
    var _activePlayer;
    var _observers;

    var init = function(id, state, turn)
    {
        // When re-initiating, we have to make sure no lingering machine moves
        // can affect the new game.
        _me.cancelDelayedMachineMove();
        
        _id = id;
        _state = new State(state);
        _board = new Board(_me);

        // Players are only created once, if we're re-initiating we keep the old players and reset
        // their piece counts.
        if (_players == null || _players == undefined)
        {
            _players = {black: new Player('black'), white: new Player('white')};
        }
        _players.black.setPieceCount(0);
        _players.white.setPieceCount(0);

        // Make sure the active player is initialized correctly.
        _activePlayer = (turn != null && turn != undefined && turn == 'W') ? _players.white : _players.black;
        
        // Create the observers array only when first loading the game.
        if (_observers == null || _observers == undefined)
        {
            _observers = new Array();
        }

        // Make sure the board is initialized to match the given state.
        for (var i = 0; i < 8; i++)
        {
            for (var j = 0; j < 8; j++)
            {
                if (_state.isBlack(i, j))
                {
                    _board.addPieceToSquare(i, j, new Piece(_players.black));
                }
                else if (_state.isWhite(i, j))
                {
                    _board.addPieceToSquare(i, j, new Piece(_players.white));
                }
            }
        }
        
        // Show initial possible moves for whatever player is active.
        var possibleMoves = _me.getAllPossibleMoves(_activePlayer);
        highlightPossibleMoves(possibleMoves);
        
        // Notify obervers that a new game has been initiated.
        notifyObservers('newGame', {id: _id});
    }
    
    this.addObserver = function(observer)
    {
        _observers.push(observer);
    }
    
    var notifyObservers = function(event, data)
    {
        for (var i = 0; i < _observers.length; i++)
        {
            _observers[i].notify(event, data);
        }
    }
    
    this.getActivePlayer = function()
    {
        return _activePlayer;
    }
    
    this.getPlayerByColor = function(color)
    {
        if (color == 'black') return _players.black;
        else if (color == 'white') return _players.white;
        else return null;
    }

    // Process a human click on a square.
    this.clickSquare = function(i, j)
    {
        // If the player clicks an empty square, he/she is trying to make a move.
        if (_board.isEmptySquare(i, j))
        {
            // If the human player click while it's the machine's turn we ignore the click.
            if (!_activePlayer.isMachine())
            {
                this.makeMove(i, j);
            }
        }
    }

    // This method does the grunt work. It finds if the move is valid,
    // then executes it, switches players, highlights possible moves for
    // the 'other' player and checks if the game is over. It also notifies
    // the observers and makes sure the game state is saved to the server.
    this.makeMove = function(i, j)
    {
        var affectedPieceCoords = _me.getMoveAffectedPieceCoords(i, j);
        
        // The move is only valid if it affects one or more pieces from the other player.
        if (affectedPieceCoords.length > 0)
        {
            for (var index = 0; index < affectedPieceCoords.length; index++)
            {
                _board.updatePiece(affectedPieceCoords[index].i, affectedPieceCoords[index].j, _activePlayer);
                _state.set(affectedPieceCoords[index].i, affectedPieceCoords[index].j, _activePlayer.getColor());
            }
            _board.addPieceToSquare(i, j, new Piece(_activePlayer));
            _state.set(i, j, _activePlayer.getColor());
            
            // Switch to the other player. It's his turn.
            if (_activePlayer == _players.black) _activePlayer = _players.white;
            else _activePlayer = _players.black;

            // Get all possible moves for this player in order to highlight them.
            var possibleMoves = _me.getAllPossibleMoves(_activePlayer);

            _board.unhighlightAllSquares();

            // The game is finished if there are no more possible moves.
            if (possibleMoves.length > 0)
            {
                highlightPossibleMoves(possibleMoves);

                // If the other player is a machine, trigger his move.
                if (_activePlayer.isMachine())
                {
                    this.makeDelayedMachineMove();
                }
            }
            else
            {
                finish();
            }

            // Make observers aware that the board has changed.
            notifyObservers('boardChanged');

            // Save the new state to the server.
            save();
        }
    }
    
    // Is called when there are no more possible moves, and thus the game has ended.
    var finish = function()
    {
        var winner = null;
        if (_players.black.getPieceCount() > _players.white.getPieceCount())
        {
            winner = _players.black;
        }
        else if (_players.white.getPieceCount() > _players.black.getPieceCount())
        {
            winner = _players.white;
        }
        notifyObservers('gameFinished', {winner: winner});
    }

    var highlightPossibleMoves = function(possibleMoves)
    {
        // Highlight all the squares that correspond to the possible moves.
        for (var i = 0; i < possibleMoves.length; i++)
        {
            _board.highlightSquare(possibleMoves[i].i, possibleMoves[i].j);
        }
    }

    var _timeoutHandle;
    this.makeDelayedMachineMove = function()
    {
        _timeoutHandle = setTimeout(
            function()
            {
                _activePlayer.makeMachineMove(_me)
            }
        , 2500);
    }
    
    this.cancelDelayedMachineMove = function()
    {
        if (_timeoutHandle != undefined && _timeoutHandle != null)
        {
            clearTimeout(_timeoutHandle);
        }
    }

    // Returns an array of coordinates for the pieces that will be affected
    // if the active player puts a piece in square i, j.
    // This makes sure we look in every direction, then calls a recursive function to look in that direction.
    this.getMoveAffectedPieceCoords = function(i, j)
    {
        var pieceCoords = new Array();
        for (var direction = 0; direction < 8; direction++)
        {
            var coords = getAdjacentSquareCoords(i, j, direction);

            $.merge(pieceCoords, getMoveAffectedPieceCoordsInner(coords.i, coords.j, direction, new Array()));
        }

        return pieceCoords;
    }
    
    // Recursive helper function for the above function.
    var getMoveAffectedPieceCoordsInner = function(i, j, direction, pieceCoords)
    {
        if (i >= 0 && i < 8 && j >= 0 && j < 8)
        {
            if (_board.isEmptySquare(i, j))
            {
                // We can't jump squares.
                return [];
            }
            else if (_board.getPiece(i, j).getOwner() == _activePlayer)
            {
                // This is a valid move, so return all the coords found up to this point.
                return pieceCoords;
            }
            else if (_board.getPiece(i, j).getOwner() != _activePlayer)
            {
                // Keep digging...
                pieceCoords.push({i: i, j: j});
                
                var coords = getAdjacentSquareCoords(i, j, direction);
                
                return getMoveAffectedPieceCoordsInner(coords.i, coords.j, direction, pieceCoords);
            }
        }

        // We're out of bounds.
        return [];
    }

    // Gets all the possible moves for the given player.
    this.getAllPossibleMoves = function(player)
    {
        var possibleMoves = new Array();
        for (var i = 0; i < 8; i++)
        {
            for (var j = 0; j < 8; j++)
            {
                // Use any of our pieces as the starting point.
                // // Then look if a valid 'connetion' can be made.
                if (!_board.isEmptySquare(i, j) && _board.getPiece(i, j).getOwner() == player)
                {
                    $.merge(possibleMoves, getPossibleMoves(i, j, player));
                }
            }
        }
        
        return possibleMoves;
    }
    
    // Helper function for the above function.
    // This makes sure we look in every direction around piece i, j
    // to see if a 'valid' connection can be made.
    var getPossibleMoves = function(i, j, player)
    {
        var possibleMoves = new Array();
        for (var direction = 0; direction < 8; direction++)
        {
            var possibleMove = getPossibleMove(i, j, player, direction);
            
            if (possibleMove != null) possibleMoves.push(possibleMove);
        }
        
        return possibleMoves;
    }
    
    // Helper function for the above function. This looks in only one direction
    // for a valid connection, which is found as long as we move over pieces
    // of the opponent until we find an empty square.
    var getPossibleMove = function(i, j, player, direction)
    {
        var coords = getAdjacentSquareCoords(i, j, direction);

        // First make sure the first adjacent square contains a piece from the
        // other player.
        if (coords.i >= 0 && coords.i < 8 && coords.j >= 0 && coords.j < 8)
        {
            if (!_board.isEmptySquare(coords.i, coords.j) && _board.getPiece(coords.i, coords.j).getOwner() != player)
            {
                coords = getAdjacentSquareCoords(coords.i, coords.j, direction);
                
                // We can now keep moving in the given direction until we find either an empty square,
                // one of our own pieces, a boundary, or one of the other player's pieces.
                return getPossibleMoveInner(coords.i, coords.j, player, direction);
            }
        }

        // We're out of bounds or the first adjacent square didn't contain a
        // piece from the other player.
        return null;
    }
    
    // Recursive helper function for the above function.
    // This looks in only one direction
    // for a valid connection, which is found as long as we move over pieces
    // of the opponent until we find an empty square.
    var getPossibleMoveInner = function(i, j, player, direction)
    {
        if (i >= 0 && i < 8 && j >= 0 && j < 8)
        {
            if (_board.isEmptySquare(i, j))
            {
                // Success, this player can place a piece here.
                return {i: i, j: j};
            }
            else if (_board.getPiece(i, j).getOwner() == player)
            {
                // No move here. One of this player's own pieces is in the way.
                return null;
            }
            else
            {
                var coords = getAdjacentSquareCoords(i, j, direction);
                
                // Keep digging...
                return getPossibleMoveInner(coords.i, coords.j, player, direction);
            }
        }
        
        // We're out of bounds.
        return null;
    }
    
    // Helper function to get coordinates of the next piece/square,
    // given original coordinates and a direction.
    var getAdjacentSquareCoords = function(i, j, direction)
    {
        var ii, jj;

        if (direction == 0) {ii = -1;jj = 0;} // up
        if (direction == 1) {ii = -1;jj = 1} // right, up
        if (direction == 2) {ii = 0;jj = 1} // right
        if (direction == 3) {ii = 1;jj = 1} // right, down
        if (direction == 4) {ii = 1;jj = 0;} // down
        if (direction == 5) {ii = 1;jj = -1} // left, down
        if (direction == 6) {ii = 0;jj = -1} // left
        if (direction == 7) {ii = -1;jj = -1} // left, up
        
        return {i: i + ii, j: j + jj};
    }

    // Upload current state to server through a Json/Ajax call.
    var save = function()
    {
        $.post('game/save', {id: _id, state: _state.getAsString(), turn: _activePlayer.getColor()[0].toUpperCase()},
            function(data)
            {
                if (!data.success)
                {
                    // Ignore.
                }
            }
        , "json");
    }
    
    // Retrieve a new game from the server through a Json/Ajax call.
    this.create = function()
    {
        $.post('game/create', {},
            function(data)
            {
                if (data.success)
                {
                    // Re-initialize the game with the new information.
                    init(data.game.id, data.game.state, data.game.turn);
                }
            }
        , "json");
    }
    
    // Initialize this object.
    init(id, state, turn);
}