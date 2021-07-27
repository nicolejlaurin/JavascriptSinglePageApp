2406 Assignment 2
(c) Louis D. Nel 2018

Authors:
Nicole Laurin: 101043422

Contact:
nicolejlaurin@cmail.carleton.ca

Program:
single paged web application based on the native capabilities of Node.js and javascript.
This web app will have the server offer contents of files to the client editor which can modify the contents and
send them back to the server to be stored as modified or new files.

Purpose:
To build an app that allows a user to open a chord pro formatted (chords and lyrics)
text files hosted on a node.js server and then within their browser drag the words and chord
symbols around. The user will be able to transpose the chords up or down to a different musical key.
The user can also use a "refresh" button which will allow the HTML text below the canvas to reflect
the current contents of the canvas. This app should also be able to save and send a JSON object to the server
with the current chord pro formatted song.


Node.js version: v10.15.0
OS version: 10.14.2


Launching instructions:
node server.js


Testing instructions:
  - access directory of project files
  - enter "node server.js" in the terminal
  - enter the given website "http://localhost:3000/assignment2.html" into an internet browser
  - type in a song name and press "enter" or click on the "submit request" button
  - press on "transpose up" or "transpose down" buttons to transpose a songs chords
  - press on "refresh" button to reflect the current contents on the canvas
  - type a name and press on "save as" button to save the current canvas contents
  - to retrieve a saved file, type the name of the file you just named it.

Issues:
1. Refresh does not properly function as its supposed to. It will change the below text according
to the location on canvas but output is very strange and unpredictable.
2. Transpose will no longer work during refresh.
