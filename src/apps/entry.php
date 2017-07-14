<?php

return [
    'api' => [
        'prefix' => '/api',
        'urls' => require __DIR__ . '/api/urls.php'
    ],
    'admin' => [
        'prefix' => '/admin',
        'urls' => require __DIR__ . '/admin/urls.php'
    ],
    'home' => [
        'prefix' => '',
        'urls' => require __DIR__ . '/home/urls.php'
    ]
];
