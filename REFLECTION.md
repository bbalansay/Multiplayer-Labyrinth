# Reflection

### Bradley Balansay

Looking back on how I first architected the Labyrinth, I was extremely proud (and thankful) of myself for making it extensible. Instead of using a concrete, 2D array like most, I used pointers to tell Locations what it was connected to. I had a toNorth, toSouth, toEast, and toWest, and if I wanted to I could have implemented a toUp, toDown, toNorthEast, etc. This made it extremely easy to make the Labyrinth larger. There wasn't much refactoring to do in that sense, but I did run into issues with Players and Items.

When updating the functionality of Players and Items, it required a lot of "shotgun surgery". Changing code in one place meant I had to change it in a lot of other places, especially when I had to turn instances of a single Player or Item into Player[] or Item[]. I had to change lots and lots of source code to extend the Labyrinth, which honestly ended up being a lot more than I previously thought. I tried to eliminate code that was in multiple places as much as possible, and in doing so helped me make the code a little bit cleaner.

I think that the most important take-away I have from this process is that you should always try to implement code with the open/closed principle in mind. If I had thought about the possibility of multiple Players and Items beforehand, it would have saved a lot of time changing what code I previously had and would have left me a lot more time to focus on what needed to be added. In the future, I will definitely try to think about the future instead of the deadline.
