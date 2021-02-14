extends Node2D

onready var allTiles = $TileHolder
onready var door = $Door
onready var player = $Player
onready var speedLabel = $CanvasLayer/SpeedLevel
onready var charSpeedLevel : float = 1.0

onready var keysToWin : int = 6

var startingXY = Vector2 (504,  462)

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
	

#Win State
func _on_Door_body_entered(body):
	print("Test 3")
	if body.name == "Player":
		print("Test 1")
		if door.isDoorOpen() == true:
			get_tree().change_scene("res://Levels/TutorialLevel.tscn")
			print("Test 2")

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

func updateStartXY(newX, newY):
	startingXY = Vector2 (newX,  newY)