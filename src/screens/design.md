# Global state
## ControlsContext
✔ Most recently pressed direction button currently down
--- others

## LocationContext
✔ Current room
✔ Position in room

## CharacterContext
- Characters in party
- All character stats (including status effects)

## InventoryContext
✔ Inventory
✔ Money

## GameStateContext
- Event history (e.g., global switches, areas completed)
- Time of day

# What can we do?
- Step in a direction
  - lock controls
  - animate character sprite
  - transition room
  - open controls
- Turn towards a direction
- Transition to a new room
  - after finish walking
  - lock controls
  - transition out (fade?)
  - transition in (fade?)
  - open controls
- Open menu
  - lock controls
  - transition open
  - open menu controls
- Move cursor in menu
- Select item in menu
- Cancel (go back) in menu
- Other menu things
- Close menu
  - lock controls
  - transition closed
  - open overworld controls
- Begin battle mode
  - after finish walking (or on event trigger)
  - lock controls
  - transition out (FF style)
  - transition in (fade?)
  - move characters and enemies into place
  - start battle timer
  - open general battle controls (run away)
- On battle command start
  - open command-select controls
  - same basic functions as the menu
- On battle win
  - party celebration animation
  - display exp, money, item drops
  - lock controls
  - transition out (fade?)
  - transition in to overworld
  - open overworld controls
- On battle lose
  - lock controls
  - transition to game over screen
  - open controls
  - transition (fade?) on confirm
- Press action button on tile in facing direction
- Advance/close dialogue
