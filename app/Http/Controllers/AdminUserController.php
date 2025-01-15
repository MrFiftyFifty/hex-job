<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::withCount(['posts', 'comments'])
            ->latest()
            ->paginate(10);
            
        return view('admin.users.index', compact('users'));
    }

    public function toggleBan(User $user)
    {
        $user->update(['is_banned' => !$user->is_banned]);
        
        return back()->with('success', 
            $user->is_banned ? 'User has been banned.' : 'User has been unbanned.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();
        
        return back()->with('success', 'User deleted successfully.');
    }
}
