function Piece(owner)
{
    var _owner;
    var _element;

    var init = function(owner)
    {
        _owner = owner;
        _owner.incrementPieceCount();

        _element = $('<div class="' + _owner.getColor() + ' piece" />');
        
    }

    this.setOwner = function(owner)
    {
        _element.removeClass(_owner.getColor())
        _element.addClass(owner.getColor());

        // Produces a flickering effect.
        _element.fadeTo(50, 0.4).fadeTo(50, 1.0).fadeTo(50, 0.4).fadeTo(50, 1.0).fadeTo(50, 0.4).fadeTo(50, 1.0).fadeTo(50, 0.4).fadeTo(50, 1.0).fadeTo(50, 0.4).fadeTo(50, 1.0);

        _owner.decrementPieceCount();
        owner.incrementPieceCount();

        _owner = owner;
    }

    this.getOwner = function()
    {
        return _owner;
    }

    this.getElement = function()
    {
        return _element;
    }

    this.getColor = function()
    {
        return _owner.getColor();
    }
    
    init(owner);
}