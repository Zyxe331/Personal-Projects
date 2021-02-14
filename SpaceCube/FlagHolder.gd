extends Node2D

func updateFlags(caller):
	for N in self.get_children():
		N.flagOff()
	caller.flagOn()
	
func checkPoint(newX, newY):
	get_parent().updateStartXY(newX, newY)
