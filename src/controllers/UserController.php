<?php
/**
 * Created by PhpStorm.
 * User: adolph
 * Date: 17-6-15
 * Time: 下午2:19
 */

namespace App\Controllers;


use App\Models\User;
use Slim\Http\Request;
use Slim\Http\Response;

class UserController
{
    public function index($a, $b)
    {
        return $a * $b;
    }

    public function add($a, $b)
    {
        return $a + $b;
    }
}