<?php

use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'doctors/*/appointments',
        ]);

        $middleware->statefulApi();
        $middleware->append(ForceJsonResponse::class);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->stopIgnoring(HttpException::class);

        // Stop ignoring HttpException for the global handler
        $exceptions->stopIgnoring(HttpException::class);

        // Customize the exception handling behavior for different exceptions
        $exceptions->render(function (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        });

        $exceptions->render(function (NotFoundHttpException $e) {
            if ($e->getPrevious() instanceof ModelNotFoundException) {
                return response()->json(['error' => 'Resource not found.'], 404);

            }
        });
//        $exceptions->render(function (\Exception $e) {
//            return response()->json(
//                ['error' =>
//                    ['message' => $e->getMessage(),
//                        'file' => $e->getFile(),
//                        'line' => $e->getLine()
//                    ]
//                ], 500);
//        });



    })->create();
