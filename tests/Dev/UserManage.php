<?php
namespace App\Tests\Dev;

/**
 * UserManage
 */
class UserManage extends \App\Controllers\ControllerBase
{
    // 添加用户
    public function add(\Slim\Http\Request $request, \Slim\Http\Response $response, $args = [])
    {
        $response->getBody()->write('test add');

        return $response;
    }

    // 删除用户
    public function delete(\Slim\Http\Request $request, \Slim\Http\Response $response, $args = [])
    {
        $response->getBody()->write('test delete');

        return $response;
    }
}