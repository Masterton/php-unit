<?php

return [
    '[/]' => [
        'get' => [
            'handler' => 'App\Views\AdminView:index',
            'name' => 'admin_index',
            'auth' => true,
            'op_name' => '访问"管理后台-统计概况"'
        ],
    ]
];