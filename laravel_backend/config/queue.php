<?php

return [
    'default' => env('QUEUE_CONNECTION', 'database'),

    'connections' => [
        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            'queue' => 'default',
            'retry_after' => 90,
        ],
    ],

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'job_batches',
    ],

    'failed' => [
        'driver' => 'database-uuids',
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],
];
