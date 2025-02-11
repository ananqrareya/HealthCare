<?php

namespace App\Services\Scanner;
use IDAnalyzer2\Client;
use IDAnalyzer2\Api\Scanner\QuickScan;
use Illuminate\Http\Request;

class QuickScanServices
{
public function __invoke(Request $request)
{
    try {
        $request->validate([
            'id_card'=>'required',
        ]);
        $imgBytes = file_get_contents($request->file("id_card"));

        $client = new Client(env('ANALYZER_API_KEY'));

        $qscan = new QuickScan();
        $qscan->document = base64_encode($imgBytes);
        $qscan->saveFile = true;

        list($result, $err) = $client->Do($qscan);
        if($err != null) {
            echo 'ApiError：'.$err->message;
            return;
        }


        return \response()->json($result);

    } catch (\IDAnalyzer2\SDKException $e) {
        echo 'SDKException：'.$e->getMessage();
    }  catch (Exception $e) {
        echo 'Exceptipn：' . $e->getMessage();
    }

}

}
