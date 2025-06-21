Progress-app (kanban board application)

TODO:

[x] - Basic UI setup
[x] - Figure out the Data Structure for Serialization
[x] - FIX: the hover:bg-opacity-30 in List.tsx! it doesn't work

[ ] - BIG BUG FIX: Use the official wails template, cause the community template doesn't work 😭.

[ ] - FIX: all the stupid re-renders that are happening becuase of you using a single
DataState object instead use jotai AtomFamily to break that big-fat-chonky state down
into atoms its own atoms.

[ ] - Load board data from disk in golang and use a function that pass that to frontend.
[ ] - Add new ListCard button
[ ] - Add new List button
[ ] - Setup routing using the sidebar with React-router
[ ] - Implement drag and drop functionality like trello
[ ] - Implement the Ctrl+p quick search/command menu
