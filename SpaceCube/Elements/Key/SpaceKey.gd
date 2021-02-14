extends Area2D

onready var sprite = $Sprite
onready var timer = $Timer

onready var goingUp : bool = false #keeps track of whether the key is idling up or down
onready var movementsLeft : int = 2 #keeps track of how much longer the key is idling either up or down
	#starts going down twie, then up 3, then down 3 ...

#Key Idle Animation
func _on_Timer_timeout():

	#Moves it either up 5 or down 5
	if goingUp:
		position.y -= 5
	else:
		position.y += 5
	movementsLeft -= 1
	
	#Resets movementsLeft to 3 if it reaches 0
	if movementsLeft == 0:
		if goingUp:
			goingUp = false
		else:
			goingUp = true
		movementsLeft = 3	

#If touched by player
func _on_Key_body_entered(body):
	if body.name == "Player":
		body.keyNum += 1
		get_parent().hasPlayerWon(body.keyNum)
		timer.stop()
		queue_free()
		
