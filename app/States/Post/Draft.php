<?php

namespace App\States\Post;

class Draft extends PostState
{
    public function color(): string
    {
        return 'yellow';
    }

    public function label(): string
    {
        return 'Draft';
    }
}
