<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;
use Spatie\QueryBuilder\AllowedFilter;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $posts = QueryBuilder::for(Post::class)
            ->where('status', 'published')
            ->withCount('comments')
            ->allowedFilters([
                'title',
                AllowedFilter::exact('state'),
                AllowedFilter::scope('hasTag'),
            ])
            ->allowedSorts(['title', 'created_at'])
            ->allowedIncludes(['user', 'tags'])
            ->paginate(10);

        $tags = Tag::all();
        
        return view('posts.index', compact('posts', 'tags'));
    }
    public function show(Request $request, Post $post)
    {
        $post->recordView($request->ip(), $request->userAgent());
        
        $post->load(['user', 'tags', 'comments.user', 'likes']);
        $likesCount = $post->likes()->count();
        $isLiked = auth()->check() ? $post->isLikedBy(auth()->user()) : false;

        return view('posts.show', compact('post', 'likesCount', 'isLiked'));
    }

    public function userPosts()
    {
        $posts = QueryBuilder::for(Post::class)
            ->where('user_id', auth()->id())
            ->allowedFilters([
                'title',
                AllowedFilter::exact('state'),
            ])
            ->allowedSorts(['title', 'created_at'])
            ->defaultSort('-created_at')
            ->with(['user', 'tags'])
            ->withCount(['comments', 'likes', 'views'])
            ->paginate(10);

        return view('dashboard.posts.index', compact('posts'));
    }

    public function create()
    {
        $tags = Tag::all();
        return view('dashboard.posts.create', compact('tags'));
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|min:3|max:255',
            'content' => 'required',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|max:2048',
            'tag_list' => 'nullable|string'
        ]);

        DB::beginTransaction();
        
        try {
            $post = auth()->user()->posts()->create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'status' => $validated['status']
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('posts', 'public');
                $post->update(['image' => $path]);
            }

            if ($request->filled('tag_list')) {
                $post->syncTags($request->tag_list);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Post created successfully']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function getUserPosts()
    {
        return auth()->user()->posts()
            ->with(['tags'])
            ->latest()
            ->get();
    }
    public function edit(Post $post)
    {
        $this->authorize('update', $post);
        $tags = Tag::all();
        return view('dashboard.posts.edit', compact('post', 'tags'));
    }
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'title' => 'required|min:3|max:255',
            'content' => 'required',
            'status' => 'required|in:draft,published',
            'image' => 'nullable|image|max:2048',
            'tag_list' => 'nullable|string'
        ]);

        $post->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => $validated['status']
        ]);

        if ($request->hasFile('image')) {
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            $path = $request->file('image')->store('posts', 'public');
            $post->update(['image' => $path]);
        }

        if ($request->filled('tag_list')) {
            $post->syncTags($request->tag_list);
        }

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post->fresh()
        ]);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        $post->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Post deleted successfully']);
        }

        return redirect()->route('profile.posts')->with('success', 'Post deleted successfully');
    }

    public function like(Post $post)
    {
        $user = auth()->user();
        $likesCount = $post->likes()->count();

        if (!$post->isLikedBy($user)) {
            $post->likes()->attach($user->id);
            $likesCount++;
        } else {
            $post->likes()->detach($user->id);
            $likesCount--;
        }

        return response()->json([
            'success' => true,
            'likesCount' => $likesCount,
            'isLiked' => $post->fresh()->isLikedBy($user)
        ]);
    }
}
