extends KinematicBody2D

onready var sprite = $Sprite

onready var keyNum : int = 0

export var maxSpeed : int = 200
export var speedIncrease : int = 50
export var slowSpeed : int = 40
export var jumpForce : int = 125

export var speedLevel : float = 1
export var speedLevelDegrade : float = .03
export var speedLevelBoost : float = .4

onready var degradeCounterMaster : int = 1
onready var degradeCounter : int = degradeCounterMaster

#For Movement
var vel : Vector2 = Vector2()
var grounded : bool = false

func _ready():
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	
	# Degrade
	if speedLevel > 1:
		if degradeCounter == 0:
			speedLevel -= speedLevelDegrade
			
			degradeCounter = degradeCounterMaster
			#No Degrade below 1
			if speedLevel < 1:
				speedLevel = 1
		else:
			degradeCounter -= 1
	
	# Boost
	if Input.is_action_just_pressed("speed_up"):
		speedLevel += speedLevelBoost
		
		#Boost Cap
		if speedLevel > 6:
			speedLevel = 6
			
			#Lock if Cap is reached
			degradeCounter = 10
			
	#slowSpeed = 200 * (speedLevel*2)
	
	# Movement Inputs
	if Input.is_action_pressed("move_left"):
		vel.x -= speedIncrease * speedLevel
		
		# Cap Negative Speed
		if  vel.x < -(maxSpeed * speedLevel):
			vel.x = -(maxSpeed * speedLevel)
			
	elif Input.is_action_pressed("move_right"):
		vel.x += speedIncrease * speedLevel
		
		# Cap Speed
		if  vel.x > maxSpeed * speedLevel:
			vel.x = maxSpeed * speedLevel
	else :
		if (vel.x < 0 && is_on_floor()):
			vel.x += slowSpeed
			if vel.x > 0:
				vel.x = 0
		elif (vel.x > 0 && is_on_floor()):
			vel.x -= slowSpeed
			if vel.x < 0:
				vel.x = 0
	
	# applying the velocity
	vel = move_and_slide(vel, Vector2.UP)
	
	#gravity
	if Input.is_action_pressed("fast_fall"):
		vel.y += 60
	else:
		vel.y += 20
	
	# jump input
	if Input.is_action_pressed("jump") and is_on_floor():
    	vel.y -= jumpForce + (jumpForce*speedLevel)
		
func checkWin():
	get_parent().hasPlayerWon(keyNum)

func giveSpeedLevel():
	return speedLevel
	
func die():
	get_parent().softReset()
	# get_tree().reload_current_scene()  #hardmode
