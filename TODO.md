# TODO

- Each animal has properties such as:
  - Type (herbivore, carnivore, producer)
  - Health
  - Heal Rate (+X health per cycle)
  - Min/max Speed X/Y (random distance moved each cycle)
  - Chance to rush (X% each cycle to do double move distance)
  - Chance to idle (sit still on a cycle)
  - Chance to frolick (1/4 speed on a cycle)
  - Food needed every X cycles (if not met start taking Health damage)
- Ecosystem balance is calculated by number of carnivores vs herbivores vs plant food source plus a factor of overall percent
  happiness of each animal
  - Need a minimum population of each - can't just cruise by on 1 of each or something
  - Happiness would be how recently it was fed or saw a buddy or was hurt
- Can setup win conditions (eventually) - to start need to have 90%+ ecosystem balance for say 30 seconds
- Need plants as placeable food sources
- Animals like birds that just fly from one side of the map to the other (so no negative direction movement)
- Have "tree of life" or something spawn in a random spot at random intervals - if clicked get a bonus
  - These are on a general "global event" cycle with a chance for each big thing to happen
- Similarly have negative things spawn like poison mushrooms?
- Have forest fires start that enables a water mode where you quickly hose it down as it spreads
  - Other natural disasters like floods, hail, etc.
- Day/night cycle
  - Then different speeds for certain nocturnal animals vs daytime?
- Eventually need humans and idle garbage creation when placed - can almost do a pseudo-city builder
- Change cursor when selecting an animal to place
- Allow queueing multiple animals - so you can press "Elk" 5 times then your next 5 map clicks are Elk, for example
- Limit population not by a forced cap, but instead by a lack of places to sleep and live - aka randomly start killing
  animals at X number onscreen (based on density of animals - screen size / animal size = some num?)

## Next Steps

- Place static food sources (MapElement with no movement)
- Different speeds/rush/idle/frolick per initial set of animals
- Basic seeking behaviour? Search radius for everyone to find their desired food source, and X percent chance to move towards
  it instead of randomly?
