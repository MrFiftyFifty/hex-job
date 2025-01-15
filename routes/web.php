<?php

use App\Models\User;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AdminPostController;
use App\Http\Controllers\AdminCommentController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', function () {
    return redirect('/blog');
});

Route::get('/blog', [PostController::class, 'index'])->name('posts.index');
Route::get('/blog/{post}', [PostController::class, 'show'])->name('posts.show');
Route::get('/tags/search', [TagController::class, 'search'])->name('tags.search');

// Authentication Required Routes
Route::middleware(['auth'])->group(function () {
    // User Posts Management
    Route::get('/profile/posts', [PostController::class, 'userPosts'])->name('profile.posts');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])
        ->name('posts.destroy')
        ->middleware('can:delete,post');
    Route::resource('posts', PostController::class)->except(['destroy', 'index', 'show']);
    
    // Post Interactions
    Route::post('/api/posts/{post}/like', [PostController::class, 'like'])->name('posts.like');
    Route::delete('/api/posts/{post}/like', [PostController::class, 'unlike'])->name('posts.unlike');

    // Comments
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Profile Management
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // User Profiles
    Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');

    // User Interactions
    Route::post('/api/users/{user}/follow', [UserProfileController::class, 'follow'])->name('users.follow');
    Route::delete('/api/users/{user}/follow', [UserProfileController::class, 'unfollow'])->name('users.unfollow');

    // Reports
    Route::post('/api/reports', [ReportController::class, 'store']);

    // API Routes
    Route::get('/api/posts', [PostController::class, 'getUserPosts'])->name('api.posts.index');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Posts Management
    Route::get('/posts', [AdminPostController::class, 'index'])->name('admin.posts.index');
    Route::delete('/posts/{post}', [AdminPostController::class, 'destroy'])->name('admin.posts.destroy');
    Route::get('/posts/{post}/edit', [AdminPostController::class, 'edit'])->name('admin.posts.edit');
    Route::patch('/posts/{post}', [AdminPostController::class, 'update'])->name('admin.posts.update');
    
    // Comments Management
    Route::get('/comments', [AdminCommentController::class, 'index'])->name('admin.comments.index');
    Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy'])->name('admin.comments.destroy');
    Route::patch('/comments/{comment}', [AdminCommentController::class, 'update'])->name('admin.comments.update');
    
    // Users Management
    Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
    Route::patch('/users/{user}/ban', [AdminUserController::class, 'toggleBan'])->name('admin.users.toggle-ban');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('admin.users.destroy');

    // Reports Management
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');
    Route::patch('/reports/{report}', [ReportController::class, 'update'])->name('admin.reports.update');
});

// Public Profile Routes
Route::get('/users/{user}', function(User $user) {
    $user->load(['posts' => function($query) {
        $query->with('statistics')->latest();
    }]);
    return view('profile.show', compact('user'));
})->name('users.show');

require __DIR__.'/auth.php';
