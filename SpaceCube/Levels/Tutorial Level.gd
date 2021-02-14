extends Node2D

onready var allTiles = $TileHolder
onready var key = $Key
onready var door = $Door
onready var player = $Player
onready var speedLabel = $SpeedLevel
onready var charSpeedLevel : float = 1

var startingXY = Vector2 (67,  463)
onready var keysToWin : int = 1

func _ready():
	door.setNumber(keysToWin)

func _process(delta):
	
	#constantly update player's current speed level
	charSpeedLevel = player.giveSpeedLevel()
	
	speedLabel.updateSpeedLevel(int(charSpeedLevel),int((charSpeedLevel*10)) % 10)
	
	#Colorize - faster the speed level, more red everything should look
	if charSpeedLevel == 1 :
		self.modulate = Color (1,1,1)
	else :
		self.modulate = Color(1,1 - (charSpeedLevel/6),1 - (charSpeedLevel/6))
		
	if player.position.y > 630:
		player.die()

#Win State
func _on_Door_body_entered(body):
	if body.name == "Player":
		if (door.isDoorOpen()):
			get_tree().change_scene("res://Levels/TestingGround.tscn")

#Checks whether to open the door
func hasPlayerWon(keys):
	door.setNumber(keysToWin - keys)
	if keys == keysToWin:
		door.open()
		
func softReset():
	player.position.x = startingXY.x
	player.position.y = startingXY.y
	player.vel.x = 0
	player.vel.y = 0
	player.speedLevel = 1.0