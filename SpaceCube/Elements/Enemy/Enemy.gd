extends Area2D

#func _process(delta):
#	pass

func _on_Enemy_body_entered(body):
	if body.name == "Player":
		body.die()
