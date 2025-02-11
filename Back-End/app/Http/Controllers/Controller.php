<?php

namespace App\Http\Controllers;
use OpenApi\Attributes as OA;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     description="Fusion Center Documentation",
 *     title="Fusion Center Documentation"
 * )
 *
 * @OA\Server(
 *     url="http://127.0.0.1:8000/api",
 *     description="Local server"
 * )
 *
 * @OA\Server(
 *     url="http://staging.example.com",
 *     description="Staging server"
 * )
 *
 * @OA\Server(
 *     url="http://example.com",
 *     description="Production server"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     name="Authorization",
 *     in="header"
 * )
 */


abstract class Controller
{
    //
}
