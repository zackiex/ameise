# Ants Simulation Project

## Overview
The objective of this project is to simulate the behaviour of ants in a field, where they are programmed to run randomly in different directions in search of sugar, which they then transport back to the anthill. The simulation is constructed using TypeScript and incorporates a graphical user interface (GUI).

The simulation features the following characteristics:
1. Each ant is initiated with a random direction of travel.
2. The direction of travel is reflected at the edge of the field.
3. The field size and number of ants can be adjusted.
4. Sugar pieces of varying sizes (between 3 and 10 units) are randomly generated.
5. Upon discovering sugar, ants inform each other.
6. Sugar is transported collaboratively to the anthill.
7. The simulation is continuous, with new sugar pieces generated after each successful transport. The initialization phase comprises the following steps: At the outset of the simulation, each ant is assigned a random direction.
2. The simulation allows for the movement of the ants in accordance with the following steps: The ants proceed to traverse the assigned direction, subsequently reflecting off the edges of the field.
3. Generation of Sugar: A piece of sugar is randomly generated on the field, taking care to avoid positions that have already been occupied by ants.
4. Discovery: When an ant discovers a piece of sugar within a defined perimeter, it notifies other ants of this discovery.
5. Transport: The informed ants gather at the sugar and transport it to the anthill, either collectively or individually.
