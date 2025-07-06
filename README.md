# Progress-app (kanban board application)

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

- [ ] Implement drag and drop functionality like trello (use pragmatic dnd)
      (DONE: made listcard dragable,
      TODO: make dropable tragets)

- [ ] Use Doubly-Linked list for ordering list-cards
- [ ] Add (Ctrl + s) to save (also show a read icon on bottom right when not saved)
- [ ] Edit menu to delete list.
- [ ] Edit menu to delete board.
- [ ] Implement the Ctrl+p quick search/command menu (i'm excited for this one)
- [ ] Add Skeleton loading ui (there a react package)
