# THis is just here for the judges I think
# I ran this script and it make the linkAntenna.csv file
# this took forever btw
# I hope you like it, if you need any changed just lmk

import math
import csv

def linkB(dr,slantr):
    #Split it up into sections to make it more readable and easier to create, not necesary
    #Constants
    pt = 10
    gt = 9
    losses = 19.43
    nr = 0.55
    lam = .136363636363636
    kb = -228.6
    ts = 22
    # Basically a constant of -.43
    first = pt+gt-losses
    # This makes the number smaller based off the diameter of the ground station antenna (either 12 or 34)
    dishCirc = dr*math.pi
    second = 10*math.log10(nr*((dishCirc/lam)**2))
    # Deals with the distance from the antena, in the spreadsheet
    slant = 4000*slantr*math.pi
    third = -20*math.log10(slant/lam)
    #Lowk no clue what this part is for
    #I cant do negative of a negative in python, but its the negaive of the boltzman constant
    fourth = -kb-10*math.log10(22)
    # Exponent
    expo = (first + second + third + fourth)/10
    #Bits and kilobits
    bits = 10**expo
    kilobits = bits/1000

    # This is here becuase the limit is 10 Mbps
    if kilobits > 10000:
        return 10000
    return round(kilobits, 5)

#Returns the best antennas and its link budget
def best(index):
    with open('linkB.csv', mode ='r')as file:
        data = list(csv.reader(file))
        row = data[index+1]
        # Reads from the spreadsheet (the code looks stupid cause some of them are blank so I had to error trap that)
        wpsa_range = 0
        ds54_range = 0
        ds24_range = 0
        ds34_range = 0
        #Because some of them are just blank, I make sure that they exist, otherwise the value is set to 0
        if int(row[8])==1:
            wpsa_range = float(row[9])
        if int(row[10]) == 1:
            ds54_range = float(row[11])
        if int(row[12]) == 1:
            ds24_range = float(row[13])
        if int(row[14]) == 1:
            ds34_range = float(row[15])
        #If they are all blank, it will return none and 0
        if wpsa_range == 0 and ds54_range == 0 and ds24_range == 0 and ds34_range == 0:
            return ["none", 0]
        #Puts them all into a dict
        ranges = {"wpsa": wpsa_range, 
                  "ds54": ds54_range, 
                  "ds24": ds24_range, 
                  "ds34": ds34_range}
        #Gets the max range and the corresponding antenna
        max_range = max(ranges.values())
        max_antenna = max(ranges, key=ranges.get)
        # all of them are 34 in diameter except for wpsa, so for wpsa, it will pass 12 for the diameter
        if max_antenna == "wpsa":
            max_link = linkB(12, max_range)
        else:
            max_link = linkB(34, max_range)
        #Returns a list (not a tuple cuz im special) of the best antenna and the link budget of it
        return [max_antenna, max_link]


def main():
    # List for all the dicts
    total = []
    # Opens the data file
    with open('linkB.csv', mode ='r')as file:
        data = list(csv.reader(file))
        for i in range(len(data)-1):
            #Creates a blank dictionary
            dict = {}
            # Adds all the correct data to it
            dict["MISSION ELAPSED TIME (mins)"] = data[i+1][0]
            dict["Antenna"] = best(i)[0]
            dict["Budget"] = best(i)[1]
            # To measure progress (long ahh runtime)
            print(i)
            # Adds the list to a dict
            total.append(dict)
        # Opens a CSV file and writes to it
        with open('linkAntenna.csv', 'w', newline='') as csvfile:
            #Title names
            fieldnames = ['MISSION ELAPSED TIME (mins)', 'Antenna', 'Budget']
            #Stuff from csv library (yes i am a library merchant idc)
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            #Writes the list full of dicts from before
            writer.writerows(total)


main()