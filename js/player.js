function Player(color)
{
    var _pieceCount = 0;
    var _color = color;
    var _isMachine = false;

    this.getColor = function()
    {
        return _color;
    }
    
    this.getPieceCount = function()
    {
        return _pieceCount;
    }
    
    this.setPieceCount = function(pieceCount)
    {
        _pieceCount = pieceCount;
    }
    
    this.incrementPieceCount = function()
    {
        _pieceCount++;
    }
    
    this.decrementPieceCount = function()
    {
        _pieceCount--;
    }
    
    this.setIsMachine = function(isMachine)
    {
        _isMachine = isMachine;
    }
    
    this.isMachine = function()
    {
        return _isMachine;
    }
    
    this.makeMachineMove = function(game)
    {
        // Set to false to pick moves randomly.
        var isSmart = true;
        
        var possibleMoves = game.getAllPossibleMoves(this);
        
        if (possibleMoves.length > 0)
        {
            if (isSmart)
            {
                // The best move is considered to be the move that flips the most pieces.
                // This basically only thinks one step ahead. A smarter machine player would be able to
                // look further ahead and possibly use a minimax strategy.
                // This simple scheme actually provides a good challenge already though.
                
                var bestMove = possibleMoves[0];
                var bestMoveScore = game.getMoveAffectedPieceCoords(bestMove.i, bestMove.j).length;

                for (var i = 1; i < possibleMoves.length; i++)
                {
                    var moveScore = game.getMoveAffectedPieceCoords(possibleMoves[i].i, possibleMoves[i].j).length;
                    if (moveScore > bestMoveScore)
                    {
                        bestMove = possibleMoves[i];
                        bestMoveScore = moveScore;
                    }
                }
                
                game.makeMove(bestMove.i, bestMove.j);
            }
            else
            {
                // Randomly pick a move from the possible moves.
                
                var min = 0;
                var max = possibleMoves.length - 1;
                var randIndex = Math.floor(Math.random() * (max - min + 1)) + min;

                game.makeMove(possibleMoves[randIndex].i, possibleMoves[randIndex].j);
            }
        }
    }
}