extends "res://Elements/Enemy/Enemy.gd"

export var speed : int = 100 #* charSpeedLevel
export var moveDist : int = 250
 
onready var startX : float = position.x
onready var targetX : float = position.x + moveDist

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
    # move to the "targetX" position
    position.x = move_to(position.x, targetX, speed * delta) #line 26
 
    # if we're at our target, move in the other direction
    if position.x == targetX:
        if targetX == startX:
            targetX = position.x + moveDist
        else:
            targetX = startX

# moves "current" towards "to" in an increment of "step"
func move_to (current, to, step):
 
    var new = current
 
    # are we moving positive?
    if new < to:
        new += step
 
        if new > to:
            new = to
    # are we moving negative?
    else:
        new -= step
 
        if new < to:
            new = to
 
    return new