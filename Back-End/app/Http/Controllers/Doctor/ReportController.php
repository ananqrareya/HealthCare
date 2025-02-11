<?php
namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Models\Report;
use Illuminate\Support\Facades\Gate;

class ReportController extends Controller
{
    public function store(StoreReportRequest $request)
    {
        Gate::authorize('create',Report::class);

        if (!$request->file('report_file')) {
            return response()->json([
                'message' => 'Report not found',
            ], 201);
        }

        $validated = $request->validated();
        // Save the uploaded file
        $file = $this->uploadToCloudinary($request->file('report_file'), 'reports');
        $validated['file_path'] = $file['url'];
        $validated['public_id'] = $file['public_id'];
        $validated['date'] = now()->format('Y-m-d');

        // Save the report data in the database
        $report = Report::create($validated);

        return response()->json([
            'message' => 'Report saved successfully',
            'report' => $report
        ], 201);
    }
    private function uploadToCloudinary($file, string $folder)
    {
        $cloudinaryFile = $file->storeOnCloudinary($folder);
        return [
            'url' => $cloudinaryFile->getSecurePath(),
            'public_id' => $cloudinaryFile->getPublicId(),
        ];
    }
}
