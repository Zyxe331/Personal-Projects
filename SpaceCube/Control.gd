extends Control

onready var tens = $Tens
onready var ones = $Ones
onready var bar = $Bar

#currentScale = the decimal that is multiplied into the scale to determine length
#currentBar = what size the bar currently is on screen
#neededBar = the size the bar should be according to the speedScale
onready var currentScale : float = 0	#Goes from 0 to 1.0
onready var currentBar : int = 1
onready var neededBar : int = 1


func _process(delta):
	
	#increase / decrease bar size at a constant speed to look natural
	if currentBar < neededBar:
		currentScale += .1
		currentBar = currentScale * 10
		bar.set_scale(Vector2( (currentScale*2) + .1, 1))
			#max size wanted is (2.0,1) currentScale only goes up to 1, so multiplied by *2
			# adding + .1 means the bar will always be visible even at 0
	elif currentBar > neededBar:
		currentScale -= .1
		currentBar = currentScale * 10
		bar.set_scale(Vector2( (currentScale*2) + .1, 1))

func updateSpeedLevel(value1, value2):
	tens.set_frame(value1)
	ones.set_frame(value2)
	neededBar = value2