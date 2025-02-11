<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{

    public function edit($group)
    {
        $settings = Setting::query()
            ->where('group', '=', $group)
            ->pluck('value', 'name');

        return response()->json([
            'group' => $group,
            'settings' => $settings,
        ], 200);
    }

    public function update(Request $request, $group)
    {
        foreach ($request->post('settings') as $name => $value) {

            Setting::set($name, $value, $group);
        }
        foreach ($request->file('settings') as $name => $file) {

            Setting::set($name, $file->store('assets','public'), $group);
        }
        return response()->json([
            'message' => 'Settings updated',
        ], 200);
    }
}
