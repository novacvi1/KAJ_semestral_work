# Mindmap App

## Project Description
Project was done as a part of a semester work for the subject of Client applications in JavaScript at the Faculty of Electrical Engineering CTU in Prague.

This project is a Mindmap application that allows users to visually organize information.
The application is built using JavaScript and is managed with npm. The mindmap is represented on a Canvas
in the HTML file, with different branches and nodes represented by lines and circles respectively.


## Procedure

The application is primarily split into two parts: the mindmap representation and the functionality.
The mindmap is created on Canvas in the `index.html` file. The functionality is implemented in JavaScript,
with the main application logic in `app.js` and the mindmap-specific logic in `mindmap.js`. The work on canvas is done
in `Canvas.js`. Other files include `BaseNode.js` and `Branch.js` which are used to represent nodes and branches in the mindmap.
Form `BaseNode.js` is inherited `OvalNode.js` and `RectangleNode.js` which are used to represent specific nodes in the mindmap.

Application has the option to save and load the mindmap from the local storage. The mindmap is saved as a JSON object,
which is then stringified and stored in the local storage. When the application is loaded, the JSON object is parsed
and the mindmap is reconstructed.

The JSON files can also be downloaded and uploaded to the application. Upload can be done by clicking on the "Load"
button or dragging the file into the application.

To history in a browser are saved only the creation and deletion of nodes to be able to undo and redo these actions.

App can be used on mobile devices with all the functionality as on desktop.

Loading animations of the app are done using SVG.


## Functions


The application includes the following functions:

1. **Node Creation**: Users can create new nodes in the mindmap, represented by ovals and rectangles in the Canvas.
Created nodes can be of two types: ovals and rectangles. Ovals can have the maximum of 17 characters and rectangles can have the maximum of 100 characters.
2. **Connector Creation**: Users can create connectors between nodes, represented by lines in the Canvas.
3. **Node Editing**: Users can edit the information contained in a node.
4. **Node Deletion**: Users can delete nodes, along with any associated branches.
5. **Node Movement**: Users can move nodes around the Canvas.
6. **Saving and Loading**: Users can save the mindmap to the device and load it back.


## Controls
Controls of the application can also be found in the application clicking on the info button.

### Desktop Controls
- **Create Node**: Double-click on the canvas or right-click and select the type of node.
- **Edit Node**: Double-click on the node or right-click and select the "Edit Node" option.
- **Delete Node**: Right-click on the node and select the "Delete Node" option or press the "Delete" or "Backspace" key.
- **Connect Nodes**: Right-click on the first node and select the "Connect Nodes" option, then click on the second node.
- **Move Node**: Click and drag the node.
- **Save Mindmap**: Click on the "Save" button.
- **Load Mindmap**: Click on the "Load" button and choose the file or drag the file into the application and drop it on the canvas.
- **Clear Canvas**: Click on the "New" button.

### Mobile Controls
- **Create Node**: Click "New Node" button and select the type of node.
- **Edit Node**: Click on the node and select the "Edit Node" button.
- **Delete Node**: Click on the node and select the "Delete Node" button.
- **Connect Nodes**: Click on the first node and select the "Connect Nodes" button, then click on the second node.
- **Move Node**: Click and drag the node.
- **Save Mindmap**: Click on the "Save" button in the drawer hidden in hamburger menu.
- **Load Mindmap**: Click on the "Load" button in the drawer hidden in hamburger menu and choose the file.
- **Clear Canvas**: Click on the "New" button in the drawer hidden in hamburger menu.

## Evaluation Scorecard
Done each point of the evaluation scorecard.

| Category                    | Description                                                                                             |
|-----------------------------|---------------------------------------------------------------------------------------------------------|
| Documentation               | Here in `README.md`                                                                                     |
| Validity                    | Tested with validator and all browser                                                                   |
| Semantic tags               | In index.html                                                                                           |
| Graphic-SVG/Canvas          | Canvas used in index.html, svg also there used on loading page                                          |
| Media-Audio/Video           | Audio sound playing on deletion of a node                                                               |
| Form elements               | Node text input, focus, validation, custom validation in showInputField in Canvas.js, file input        |
| Offline app                 | Works without internet after load                                                                       |
| Advance selectors           | In `css/style.css`                                                                                      |
| Vendor prefixes             | In `css/style.css` for box-shadows and transitions and animations                                       |
| CSS3 transformation 2D/3D   | 2D transformations pop-up info and error, loading svg                                                   |
| CSS3 transitions/animations | Loading SVG logo animation, pop-up transitions                                                          |
| Media queries               | In `css/style.css`                                                                                      |
| OOP approach                | classes, named space in App, inheritance between `BaseNode.js` and `OvalNode.js` and `RectangleNode.js` |
| Use of advance JS APIs      | LocalStorage in `Storage.js`, File API in `mindmap.js` and Drag and Drop in `DropZone.js`               |
| Functional history          | History API used in `mindmap.js`                                                                        |
| Media control               | Audio used in `mindmap.js`                                                                              |
| Offline application         | States about connection done in `app.js`                                                                |
| JS work with SVG            | In `app.js` creation, changes and event with SVG loading screen                                         |
