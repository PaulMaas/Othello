// Board controls the physical rendering of the board
// and provides abstractions for utilization by the Game class.
// It also 'wires up' pieces, squares, the game, and the board.
function Board(game)
{
    var _game;
    var _squares;
    var _pieces;
    var _element;

    var init = function(game)
    {
        _game = game;
        _element = $('#board');
        _squares = new Array(8);
        _pieces = new Array(8);
        
        // (Re)set the board element.
        _element.empty();
        
        // Add the 64 squares.
        for (var i = 0; i < 8; i++)
        {
            _squares[i] = new Array(8);
            _pieces[i] = new Array(8);

            for (var j = 0; j < 8; j++)
            {
                _squares[i][j] = new Square(i, j);
                _element.append(_squares[i][j].getElement());

                // Wire it up. Make sure the square reports back to the game.
                _squares[i][j].getElement().click({i: i, j: j},
                    function(event)
                    {
                        _game.clickSquare(event.data.i, event.data.j);
                        return false;
                    }
                );
            }
        }
    }

    this.getSquare = function(i, j)
    {
        return _squares[i][j];
    }

    this.highlightSquare = function(i, j)
    {
        _squares[i][j].getElement().addClass('highlighted ' + _game.getActivePlayer().getColor());
    }

    this.unhighlightAllSquares = function()
    {
        for (var i = 0; i < _squares.length; i++)
        {
            for (var j = 0; j < _squares[i].length; j++)
            {
                _squares[i][j].getElement().removeClass('highlighted white black');
            }
        }
    }

    this.isEmptySquare = function(i, j)
    {
        return _squares[i][j].isEmpty();
    }

    this.getPiece = function(i, j)
    {
        return _pieces[i][j];
    }

    this.updatePiece = function(i, j, owner)
    {
        _pieces[i][j].setOwner(owner);
    }

    this.addPieceToSquare = function(i, j, piece)
    {
        _pieces[i][j] = piece;
        _squares[i][j].setPiece(piece);
    }
    
    init(game);
}