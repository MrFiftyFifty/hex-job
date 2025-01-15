<?php

namespace App\States\Post;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

abstract class PostState extends State
{
    abstract public function color(): string;
    abstract public function label(): string;

    public static function config(): StateConfig
    {
        return parent::config()
            ->default(Draft::class)
            ->allowTransition(Draft::class, Published::class)
            ->allowTransition(Published::class, Draft::class);
    }
}
