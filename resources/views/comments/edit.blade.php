@extends('layouts.app')

@section('content')
<div class="max-w-2xl mx-auto p-6">
    <h2 class="text-xl font-semibold mb-4">Edit Comment</h2>

    <form action="{{ route('comments.update', $comment) }}" method="POST">
        @csrf
        @method('PUT')

        <div class="mb-4">
            <label for="content" class="block text-gray-700 text-sm font-bold mb-2">
                Content
            </label>
            <textarea name="content" id="content" rows="5" required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">{{ old('content', $comment->content) }}</textarea>
            @error('content')
                <p class="text-red-500 text-xs italic mt-2">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex items-center justify-between">
            <a href="{{ url()->previous() }}" class="text-blue-500 hover:underline">Cancel</a>
            <button type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Update Comment
            </button>
        </div>
    </form>
</div>
@endsection
