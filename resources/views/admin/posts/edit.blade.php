<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold">Edit Post: {{ $post->title }}</h2>
    </x-slot>

    <script src="https://cdn.ckeditor.com/ckeditor5/40.0.0/classic/ckeditor.js"></script>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6">
                    <form action="{{ route('admin.posts.update', $post) }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        @method('PATCH')

                        <!-- Title -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                Title
                            </label>
                            <input type="text" 
                                   name="title" 
                                   value="{{ old('title', $post->title) }}"
                                   class="w-full border-gray-300 rounded-md shadow-sm">
                            @error('title')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Rich Content Editor -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                Content
                            </label>
                            <textarea name="content" 
                                      id="editor"
                                      class="w-full border-gray-300 rounded-md shadow-sm">{{ old('content', $post->content) }}</textarea>
                            @error('content')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Post Status -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                Status
                            </label>
                            <select name="status" class="w-full border-gray-300 rounded-md shadow-sm">
                                <option value="draft" {{ $post->status === 'draft' ? 'selected' : '' }}>Draft</option>
                                <option value="published" {{ $post->status === 'published' ? 'selected' : '' }}>Published</option>
                            </select>
                            @error('status')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Tags Input -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                Tags (separate with commas)
                            </label>
                            <input type="text" 
                                    name="tag_list" 
                                    value="{{ old('tag_list', $post->tags->pluck('name')->implode(', ')) }}"
                                    placeholder="technology, programming, laravel"
                                    class="w-full border-gray-300 rounded-md shadow-sm">
                            @error('tag_list')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Image Upload -->
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                Image
                            </label>
                            @if($post->image)
                                <div class="mb-2">
                                    <img src="{{ Storage::url($post->image) }}" 
                                         alt="Current image" 
                                         class="w-48 h-48 object-cover rounded">
                                </div>
                            @endif
                            <input type="file" 
                                   name="image" 
                                   accept="image/*"
                                   class="w-full border-gray-300 rounded-md shadow-sm">
                            @error('image')
                                <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                            @enderror
                        </div>

                        <!-- Submit Button -->
                        <div class="flex justify-end">
                            <button type="submit" 
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                Update Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        ClassicEditor
            .create(document.querySelector('#editor'), {
                toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    'undo',
                    'redo'
                ],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                    ]
                }
            })
            .catch(error => {
                console.error(error);
            });
    </script>
</x-app-layout>
