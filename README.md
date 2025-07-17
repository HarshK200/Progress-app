# Progress-app (kanban board application)

### DEMO:

![progress-app-demo-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/0ff33df3-0f4a-47fd-af4b-726583540896)



## TODO:

- [x] Basic UI setup
- [x] Figure out the Data Structure for Serialization
- [x] FIX: the hover:bg-opacity-30 in List.tsx! it doesn't work
- [x] BIG BUG FIX: Use the official wails template, cause the community template doesn't work 😭.
- [x] FIX: Break down state
- [x] FIX: Optimize re-renders (using atomFamily)
- [x] Load board data from disk in golang and use a function that pass that to frontend.
- [x] Add state logic to Sidebar (Setup boards routing using the sidebar using state)
- [x] Implement "Add new ListCard button" (partially done handle prev and next as well)
- [x] Implement "Add new List button"
- [x] Implement "Add new Board button" (in the Boards Sidebar group itself)
- [x] Edit menu to delete ListCard.
- [x] BUG: onChange of the title of listCard and List update the state.
- [x] BUG: after doubly-linked list implementation adjust deletion logic for that i.e. do prevCardId and nextCardId update
- [x] Use Doubly-Linked list for ordering list-cards
- [x] BUG FIX: app breaks when two cards from one list are dropped next to each other in some other list
      (this was a closure issue, because of where and how the function is written it froms a closure which
      captures the draggingCardList value and hence causes issues)
- [x] BUG FIX: the infinite loop bug on two card swap in the same list. (just had to do an early return)
- [x] Implement drag and drop functionality like trello for listcards (use pragmatic dnd)
      (DONE: made listcard dragable,
      DONE: make dropable tragets)
- [x] Implement the drop on top functionality for dnd list cards
- [x] Implement the drop on bottom functionality for dnd list cards (i just asked chatgpt for drop on top inverse)
- [x] POLISH: Adjust for the gap-1.5 i.e. 6px when dropping (i did as much as i could)
- [x] Make an empty list also dropTarget for listcard
- [x] Add Sidebar skeleton loading UI
- [x] Implement scalling for Listcards(when dragging and dropping)
- [x] Implement drag and drop functionality like trello for Lists (use pragmatic dnd)
- [x] BUG FIX: The EditMenu for listcard being cropped by overflow-y-auto fixed
- [x] Edit menu to delete list.
- [x] Implement (Ctrl + s) to save (also show a read icon on bottom right when not saved)

- [ ] Make it so every state change is an action (with ctrl + z)
    State changes:
    - update list, listCard, board
- [ ] Right click menu to delete board.
- [ ] Implement the Ctrl+p quick search/command menu (i'm excited for this one)
- [ ] Implement Ctrl+f for fuzzy find boards
- [ ] Add Skeleton loading ui for board lists and listcards
- [ ] Add priority colors
- [ ] Polish up the edit-menu for list and list-cards both
        - make it so that prev open one closes when goes out of focus
        - also upon clicking somewhere randomly also closes the edit-menu
