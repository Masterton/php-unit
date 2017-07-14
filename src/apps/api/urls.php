<?php

return [
    '/ping[/]' => [
        'map' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("pong");
                return $response;
            },
            'name' => 'api_ping',
            'methods' => ['GET', 'POST']
        ],
    ],
    '/user[/]'=>[
        'get'=>[
            'handler'=>'App\Controllers\UserController:info',
            'name'=>'get_user',
            'auth'=>true,
        ],
        'post'=>[
            'handler'=>'App\Controllers\UserController:edit',
            'name'=>'modify_user',
            'auth'=>true
        ]
    ]
];