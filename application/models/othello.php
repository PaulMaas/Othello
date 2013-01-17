<?php

/*
 * This class loads, stores, and creates games in the database.
 */
class Othello extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    
    public function get_game($id = 0)
    {
        if ($id == 0)
        {
            return $this->new_game();
        }
        else
        {
            $query = $this->db->get_where('game', array('id' => $id));
            
            if ($query->num_rows() == 0)
            {
                return null;
            }
            else
            {
                return $query->row_array();
            }
        }
    }
    
    public function new_game()
    {
        $this->db->insert('game', array('state' => null, 'turn' => null));
        $id = $this->db->insert_id();

        return array('id' => $id, 'state' => null, 'turn' => null);
    }
    
    public function update_game($id, $state, $turn)
    {
        if ($id != 0 && $state != null && $turn != null)
        {
            $data = array('state' => $state, 'turn' => $turn);

            $this->db->where('id', $id);
            $this->db->update('game', $data);
            
            return true;
        }
        else
        {
            return false;
        }
    }
}