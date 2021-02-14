extends Area2D

onready var flagPic = $AnimatedSprite
	#flagPic.set_frame(0) = Black Flag (Not Active)
	#flagPic.set_frame(1) = White Flag (Active)

func flagOn():
	flagPic.set_frame(1)
	get_parent().checkPoint(self.position.x, self.position.y)
	
	
func flagOff():
	flagPic.set_frame(0)


func _on_Checkpoint_body_entered(body):
	if body.name == "Player":
		get_parent().updateFlags(self)

