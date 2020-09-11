import re
import random

list_beer = ["Night out", "Anybody a pint?", "Chill out", "Beer Festival", "Craft Beers"]
list_darts = ["Darts evening", "Darts & fun", "Just darts", "Darts & more"]
list_bowling = ["Strike!", "Bowling evening", "Bowling master", "Super bowling", "3 strike"]
list_escape = ["Scary night", "Would you dare?", "The great escape", "Any clue?", "Never again"]
list_quiz = ["Quiz master", "Riddle king", "Quiz evening", "Harry Potter Quiz"]
list_snooker = ["Snooker evening", "Pool night", "Black & Blue", "Snooker master"]
list_tennis = ["Smash it", "Table tennis fever", "Ping Pong evening", "Pongfinity!"]
list_party = ["Hit that!", "All that jazz", "Fancy a drink?", "Summer party", "Till the dawn"]
list_other = ["Corporate event", "General training", "Don't miss it!"]

n = open("outputSQL.txt", "w")

with open('inputSQL.txt', 'r+') as f:
   for line in f:
     x = re.findall("'(.*?)'", line)
     old_title = x[0]
     category = x[4]
     if(category == "Beer night"):
       line = line.replace(old_title, random.choice(list_beer))
     if(category == "Darts"):
       line = line.replace(old_title, random.choice(list_darts))
     if(category == "Bowling"):
       line = line.replace(old_title, random.choice(list_bowling))
     if(category == "Escape room"):
       line = line.replace(old_title, random.choice(list_escape))
     if(category == "Quiz night"):
       line = line.replace(old_title, random.choice(list_quiz))
     if(category == "Snooker"):
       line = line.replace(old_title, random.choice(list_snooker))
     if(category == "Table tennis"):
       line = line.replace(old_title, random.choice(list_tennis))
     if(category == "Party"):
       line = line.replace(old_title, random.choice(list_party))
     if(category == "Other"):
       line = line.replace(old_title, random.choice(list_other))
     n.write(line)
     

