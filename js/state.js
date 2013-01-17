// The state is internally represented as a string of W's, B's and -'s.
// The stateString is what actually gets sent to the server for storage in the database.
// This class provides abstractions to the game class and basically wraps the string representation of the state.
function State(stateString)
{
    var _defaultStateString = '---------------------------WB------BW---------------------------';
    
    var _stateString = stateString;
    if (_stateString == undefined || _stateString == null || _stateString.length == 0)
    {
        _stateString = _defaultStateString;
    }

    _element = $('#stateString');
    
    this.isWhite = function(i, j)
    {
        return (getCharacter(getStringIndex(i, j)) == 'W');
    }

    this.isBlack = function(i, j)
    {
        return (getCharacter(getStringIndex(i, j)) == 'B');
    }

    this.isEmpty = function(i, j)
    {
        return (getCharacter(getStringIndex(i, j)) == '-');
    }
    
    this.isClear = function()
    {
        return (_stateString == _defaultStateString);
    }

    this.setWhite = function(i, j)
    {
        setCharacter(getStringIndex(i, j), 'W');
    }

    this.setBlack = function(i, j)
    {
        setCharacter(getStringIndex(i, j), 'B');
    }

    this.setEmpty = function()
    {
        setCharacter(getStringIndex(i, j), '-');
    }

    this.set = function(i, j, color)
    {
        if (color == 'black')
        {
            this.setBlack(i, j);
        }
        else if (color == 'white')
        {
            this.setWhite(i, j);
        }
        else
        {
            this.setEmpty(i, j);
        }
    }

    this.getAsString = function()
    {
        return _stateString;
    }

    var getCharacter = function(index)
    {
        return _stateString.charAt(index);
    }

    var setCharacter = function(index, character)
    {
        _stateString = _stateString.substr(0, index) + character + _stateString.substr(index + 1);
    }

    var getStringIndex = function(i, j)
    {
        return i * 8 + j;
    }
}