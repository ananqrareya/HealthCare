<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Twilio\Rest\Client;

class TwilioServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $this->app->singleton(Client::class, function ($app) {
            return new Client(
                config('services.twilio.sid'),
                config('services.twilio.token')
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        //
    }
}
