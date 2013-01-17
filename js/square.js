function Square()
{
    var _piece = null;
    var _element = $('<div class="square" />');

    this.setPiece = function(piece)
    {
        _piece = piece;

        _element.empty();
        _element.append(_piece.getElement());
    }

    this.getPiece = function()
    {
        return _piece;
    }

    this.getElement = function()
    {
        return _element;
    }

    this.isEmpty = function()
    {
        return (_piece == null);
    }

    this.clear = function()
    {
        _piece = null;
        _element.empty();
    }
}