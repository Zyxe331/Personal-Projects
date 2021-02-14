extends Area2D

onready var isOpen : bool = false

onready var doorPic = $AnimatedSprite
	#doorPic.set_frame(0) = Closed Door
	#doorPic.set_frame(1) = Open Door

onready var number = $Number
	#Number above the door
	#number.set_frame(0) = 0	|	number.set_frame(5) = 5

# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass

func isDoorOpen():
	return isOpen

#Opens door, setting for winstate
func open():
	doorPic.set_frame(1)
	isOpen = true
	
func setNumber(num):
	number.set_frame(num)