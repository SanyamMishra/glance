<?php

if(! function_exists('responseStatus')) {
    function responseStatus($status, $errorType) {
        return jsonData([
            'status' => $status,
            'errorType' => $errorType
        ]);
    }
}

if (! function_exists('jsonData')) {
    function jsonData($dataArray) {
        $dataArray = (object)$dataArray;
        return json_encode($dataArray);
    }
}