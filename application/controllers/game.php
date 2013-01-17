<?php

/*
 * The only controller for Othello.
 * 
 * The other two methods are called from the client-side by Ajax and receive and
 * return Json data.
 */

class Game extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('othello');
    }

    // The home method creates a page with the game.
    public function home($gameId = 0)
    {
        if ($gameId == 0)
        {
            $gameIdFromCookie = $this->input->cookie('gameId', true);
            
            if ($gameIdFromCookie != false)
            {
                $gameId = $gameIdFromCookie;
            }
        }
        
        $data['title'] = 'Othello';
        $data['notice'] = '';
        $data['game'] = $this->othello->get_game($gameId);
        
        if ($data['game'] == null)
        {
            $data['notice'] = 'The game with id ' . $gameId . ' could not be found. We\'ve created a new game for you instead.';
            $data['game'] = $this->othello->new_game();
        }
        
        // Set a cookie with the game id to expire in one week.
        $this->input->set_cookie('gameId', $data['game']['id'], 604800, '.stunning-stuff.com', '/othello', '', false);

        $data['head_content'] = 'templates/home.head.php';
        $data['main_content'] = 'templates/home.php';
        
        $this->load->view('main.php', $data);
    }
    
    // Called from the client-side through Ajax. A state string shoudld be passed along,
    // which we store in the database.
    public function save()
    {
        $id = $this->input->post('id');
        $state = $this->input->post('state');
        $turn = $this->input->post('turn');
        
        $success = $this->othello->update_game($id, $state, $turn);
        
        $data = array('success' => $success);
        echo json_encode($data);
    }

    // Called from the client-side through Ajax when a new game is requested.
    // We use the othello model to create a new game and return it as Json.
    public function create()
    {
        $data = array('success' => true);
        $data['game'] = $this->othello->new_game();
        
        // Set a cookie with the game id to expire in one week.
        $this->input->set_cookie('gameId', $data['game']['id'], 604800, '.stunning-stuff.com', '/othello', '', false);

        echo json_encode($data);
    }
}