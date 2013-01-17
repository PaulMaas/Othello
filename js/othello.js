// This class wires the game up to the external components that are affected by the game.
// It uses the observer pattern to get notification from the game.
function Othello(game)
{
    var _me = this;
    
    var _game;
    
    var init = function(game)
    {
        _game = game;

        // Wire things up that are external to the game itself.
        
        $('#notice').hide()
        $('#notice').change(
            function()
            {
                $('#notice').fadeIn(1000).delay(2000).fadeOut(2000);
            }
        );

        // Show the notice at page load in case the server sent one along.
        if ($('#notice').find('p').text().length > 0)
        {
            $('#notice').change();
        }

        // Wire the new game button up.
        $('#newGameButton').click(
            function()
            {
                // Before starting a new game, reset players to human.
                _game.getPlayerByColor('black').setIsMachine(false);
                $('#blackPlayer').removeClass('machine');

                _game.getPlayerByColor('white').setIsMachine(false);
                $('#whitePlayer').removeClass('machine');

                // Create/start a new game.
                _game.create();
            }
        );

        // Clicking on the player piece counters at the bottom switches the player to and from a machine player.
        $('#blackPlayer').click(
            function()
            {
                var player = _game.getPlayerByColor('black');
                
                // Toggle between machine player and human player.
                if (player.isMachine())
                {
                    if (_game.getActivePlayer() == player)
                    {
                        _game.cancelDelayedMachineMove();
                    }

                    player.setIsMachine(false);
                    $('#blackPlayer').removeClass('machine');
                }
                else
                {
                    player.setIsMachine(true);
                    $('#blackPlayer').addClass('machine');

                    if (_game.getActivePlayer() == player)
                    {
                        _game.makeDelayedMachineMove();
                    }
                }
            }
        );

        // Clicking on the player piece counters at the bottom switches the player to and from a machine player.
        $('#whitePlayer').click(
            function()
            {
                var player = _game.getPlayerByColor('white');
                
                // Toggle between machine player and human player.
                if (player.isMachine())
                {
                    if (_game.getActivePlayer() == player)
                    {
                        _game.cancelDelayedMachineMove();
                    }

                    player.setIsMachine(false);
                    $('#whitePlayer').removeClass('machine');
                }
                else
                {
                    player.setIsMachine(true);
                    $('#whitePlayer').addClass('machine');

                    if (_game.getActivePlayer() == player)
                    {
                        // Make a move, it's your turn.
                        _game.makeDelayedMachineMove();
                    }
                }
            }
        );
        
        // Start listening for events from the game.
        _game.addObserver(_me);
        
        // We have to make sure the game info matches the game after
        // the page is initially loaded.
        updateInfo(_game.getPlayerByColor('black').getPieceCount(), _game.getPlayerByColor('white').getPieceCount(), _game.getActivePlayer());
    }
    
    // Handle notifications of changes. At this points notifications are only coming from the game object.
    this.notify = function(event, data)
    {
        if (event == 'newGame')
        {
            updateGameId(data.id);
            updateInfo(_game.getPlayerByColor('black').getPieceCount(), _game.getPlayerByColor('white').getPieceCount(), _game.getActivePlayer());
        }
        else if (event == 'gameFinished')
        {
            $('#whitePlayer').addClass('active');
            $('#blackPlayer').addClass('active');
            
            $('#whitePlayer').fadeIn('fast');
            $('#blackPlayer').fadeIn('fast');
            
            // Show a notice about who the winner is.
            if (data.winner != null)
            {
                if (data.winner.getColor() == 'black')
                {
                    showNotice('Black wins the game!');
                }
                else
                {
                    showNotice('White wins the game!');
                }
            }
            else
            {
                showNotice('It\'s a tie!');
            }
        }
        else if (event == 'boardChanged')
        {
            updateInfo(_game.getPlayerByColor('black').getPieceCount(), _game.getPlayerByColor('white').getPieceCount(), _game.getActivePlayer());
        }
    }
    
    var updateGameId = function(id)
    {
        $('#gameId').text(id);
    }
    
    var showNotice = function(text)
    {
        $('#notice').find('p').text(text);
        $('#notice').change();
    }
    
    var updateInfo = function(blackCount, whiteCount, activePlayer)
    {
        $('#blackPlayer').text(blackCount);
        $('#whitePlayer').text(whiteCount);
        
        if (activePlayer.getColor() == 'white')
        {
            $('#whitePlayer').fadeTo(450, 1.0);
            $('#blackPlayer').fadeTo(150, 0.2);
        }
        else
        {
            $('#blackPlayer').fadeTo(450, 1.0);
            $('#whitePlayer').fadeTo(150, 0.2);
        }
    }
    
    // Initialize this object.
    init(game);
}