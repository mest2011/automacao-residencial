<?php
include_once "database/crud.php";

class LampadaBus extends Crud
{
    function get_status($nome)
    {
        $sql = "SELECT * FROM tb_lampadas where nome = '{$nome}'";
        
        $result = parent::read($sql)[0];

        $result["cores"] = split_colors($result['cor']);

        return $result;
    }

    function set_function($nome, $status, $function = null, $cor = null, $tempo = 0)
    {
        $sql = "UPDATE tb_lampadas SET status = {$status}, funcao = '{$function}', cor = '{$cor}', tempo = {$tempo} WHERE nome = '{$nome}'";
        //print_r($sql);

        return parent::update($sql);
    }
}


function split_colors($colorHEX)
{
    $result = array(
        "r" => hexdec(substr($colorHEX, 1, 2)),
        "g" => hexdec(substr($colorHEX, 3, 2)),
        "b" => hexdec(substr($colorHEX, 5, 2))
    );


    return $result;
}
