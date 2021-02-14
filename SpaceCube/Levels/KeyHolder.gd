extends Node2D

#passes each key's request to the level
func hasPlayerWon(keys):
	get_parent().hasPlayerWon(keys)