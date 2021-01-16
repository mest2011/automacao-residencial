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
    //v1
    function on_off($status){
        return $this->_lampBus->set_function_old($this->_nome, $status);
    }
    //v2
    function turn_on_off($status){
        return $this->_lampBus->set_on_off($this->_nome, $status);
    }

    function color($color){
        return $this->_lampBus->set_color($this->_nome, $color);
    }

    function intensity($intensity){
        return $this->_lampBus->set_intensity($this->_nome, $intensity);
    }

    function function($function){
        return $this->_lampBus->set_function($this->_nome, $function);
    }

    function duration($duration){
        return $this->_lampBus->set_duration($this->_nome, $duration);
    }
}


?>