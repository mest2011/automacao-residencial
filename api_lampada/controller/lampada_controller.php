<?php
include_once "business/lampada_bus.php";

class Lampada
{

    public $_nome;
    private $_lampBus;
    function __construct($nome)
    {
        $this->_nome =  $nome;
        $this->_lampBus = new LampadaBus();
    }

    function status()
    {
        return $this->_lampBus->get_status($this->_nome);
    }

    function on_off($status){
        return $this->_lampBus->set_function($this->_nome, $status);
    }
}


?>