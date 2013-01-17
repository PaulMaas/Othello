<script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
<script type="text/javascript" src="js/othello.js"></script>
<script type="text/javascript" src="js/game.js"></script>
<script type="text/javascript" src="js/player.js"></script>
<script type="text/javascript" src="js/board.js"></script>
<script type="text/javascript" src="js/state.js"></script>
<script type="text/javascript" src="js/square.js"></script>
<script type="text/javascript" src="js/piece.js"></script>
<script>
    $(document).ready
    (
        function()
        {
            // Create a new game with parameters coming from the server-side game controller.
            // The parameters may be null, except for the id.
            var game = new Game(<?=$game['id']?>, '<?=$game['state']?>', '<?=$game['turn']?>');
            
            // This class wires the game up to the external components that are affected by the game.
            // It uses the observer pattern to get notification from the game.
            // This class has to be instantiated after the page is fully loaded.
            new Othello(game);
        }
    );
</script>