<?php

include_once "database/connection.php";

class Crud
{
    public $data = array();
    public $lines;

    function create($sql)
    {
        $db = new Db();

        $conn = $db->connect();

        $result = $conn->query($sql);

        if ($result === true) {
            $response = true;
        } else {
            $response = false;
        }

        $db->close($conn);

        return $response;
    }

    function read($sql)
    {
        $db = new Db();

        $conn = $db->connect();

        $result = $conn->query($sql);

        $this->lines = $result->num_rows;

        if ($this->lines > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($this->data, $row);
            }
        } else {
            $data = "null";
        }

        $db->close($conn);

        return $this->data;
    }

    function update($sql)
    {
        $db = new Db();

        $conn = $db->connect();

        $result = $conn->query($sql);

        if ($result === true) {
            $resposta = true;
        } else {
            $resposta = false;
        }

        $db->close($conn);

        return $resposta;
    }

    function delete($sql)
    {
        $db = new Db();

        $conn = $db->connect();

        $result = $conn->query($sql);

        if ($result === true) {
            $resposta = true;
        } else {
            $resposta = false;
        }

        $db->close($conn);

        return $resposta;
    }
}
