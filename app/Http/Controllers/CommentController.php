<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CommentController extends Controller
{
    use AuthorizesRequests;
    /**
      * Store a newly created comment.
      */
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|min:3|max:1000'
        ]);

        $comment = $post->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id()
        ]);

        // Load the user relationship for the new comment
        $comment->load('user.profile');

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }
    /**
     * Show the form for editing the comment.
     */
    public function edit(Comment $comment)
    {
        $this->authorize('update', $comment);
        return view('comments.edit', compact('comment'));
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|min:3|max:1000'
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'comment' => $comment->fresh()->load('user')
        ]);
    }
    /**
      * Remove the specified comment.
      */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();
        return response()->json(['message' => 'Comment deleted successfully']);
    }
    /**     * Reply to an existing comment.
     */
    public function reply(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'content' => 'required|min:3|max:1000'
        ]);

        $reply = new Comment([
            'content' => $validated['content'],
            'user_id' => auth()->id(),
            'parent_id' => $comment->id
        ]);

        $comment->post->comments()->save($reply);

        return response()->json([
            'success' => true,
            'comment' => $reply->load('user')
        ]);
    }
}
