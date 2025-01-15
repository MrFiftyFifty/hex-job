<?php

namespace App\Http\Controllers;

use App\Models\UserReport;
use App\Models\User;
use Illuminate\Http\Request;
use App\Notifications\NewUserReport;
use Illuminate\Support\Facades\Notification;

class ReportController extends Controller
{
    public function index()
    {
        $reports = UserReport::with(['reporter', 'reportedUser'])
            ->latest()
            ->paginate(20);

        return view('admin.reports.index', compact('reports'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reported_user_id' => 'required|exists:users,id',
            'reason' => 'required|string|max:255',
            'description' => 'required|string|max:1000'
        ]);

        $report = UserReport::create([
            'reporter_id' => auth()->id(),
            'reported_user_id' => $validated['reported_user_id'],
            'reason' => $validated['reason'],
            'description' => $validated['description']
        ]);

        $admins = User::where('is_admin', true)->get();
        Notification::send($admins, new NewUserReport($report));

        return response()->json(['message' => 'Report submitted successfully']);
    }

    public function update(UserReport $report, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,resolved,dismissed'
        ]);

        $report->update($validated);

        return response()->json(['message' => 'Report status updated successfully']);
    }
}
