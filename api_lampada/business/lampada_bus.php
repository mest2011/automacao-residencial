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

    function set_on_off($nome, $state)
    {
        if ($state <> '0' and $state <> '1') return "'Erro':'Valor invalido!'";

        $sql = "UPDATE tb_lampadas SET status = {$state} WHERE nome = '{$nome}'";

        if (parent::update($sql)) {
            return "'Status alterado!'";
        } else {
            return "'Erro' : 'Ao alterar o estado da lamapada!'";
        }
    }

    function set_color($nome, $color)
    {
        $temp_cor = split_colors($color);

        if ($temp_cor['r'] > 255 || $temp_cor['g'] > 255 || $temp_cor['b'] > 255 || $temp_cor['r'] < 0 || $temp_cor['g'] < 0 || $temp_cor['b'] < 0 ) {
            return "'Cor inválida!'";
        } else {
            $sql = "UPDATE tb_lampadas SET cor = '{$color}', funcao = '' WHERE nome = '{$nome}'";
            if (parent::update($sql)) {
                
                return "Cor alterada!";
            } else {
                return "Erro : Ao alterar a cor!";
            }
        }
    }

    function set_function($nome, $status, $function = "carrossel", $cor = "#ffffff", $tempo = 20)
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
