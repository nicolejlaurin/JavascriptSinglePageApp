/*
Client-side javascript for 2406 assignment 1
COMP 2406 (c) Louis D. Nel 2018

*/
let words = [] //array of drag-able lyrics or chord words
let yValue = 50
let xValue = 40
//leave this moving word for fun and for using it to
//provide status info to client.
//NOT part of assignment requirements
let movingString = {
  word: "Moving",
  x: 100,
  y: 100,
  xDirection: 1, //+1 for rightwards, -1 for leftwards
  yDirection: 1, //+1 for downwards, -1 for upwards
  stringWidth: 50, //will be updated when drawn
  stringHeight: 24
} //assumed height based on drawing point size


let timer //timer for animation of moving string etc.
let wordBeingMoved //word being dragged by the mouse
let deltaX, deltaY //location where mouse is pressed relative to word origin
let canvas = document.getElementById('canvas1') //our drawing canvas
let fontPointSize = 18 //point size for chord and lyric text
let wordHeight = 20 //estimated height of a string in the editor
let editorFont = 'Courier New' //font for your editor -must be monospace font
let lineHeight = 40 //nominal height of text line
let lyricLineOffset = lineHeight * 5 / 8 //nominal offset for lyric line below chords
let topMargin = 40 //hard coded top margin white space of page
let leftMargin = 40 //hard code left margin white space of page
let words_file_txt = ' '

let transposedByNSemitones = 0 //transposition in semitones

let wordTargetRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
} //used for debugging
//rectangle around word boundary

function getWordAtLocation(aCanvasX, aCanvasY) {

  //locate the word near aCanvasX,aCanvasY co-ordinates
  //aCanvasX and aCanvasY are assumed to be X,Y loc
  //relative to upper left origin of canvas

  //used to get the word mouse is clicked on

  let context = canvas.getContext('2d')

  for (let i = 0; i < words.length; i++) {
    let wordWidth = context.measureText(words[i].word).width
    if ((aCanvasX > words[i].x && aCanvasX < (words[i].x + wordWidth)) &&
      (aCanvasY > words[i].y - wordHeight && aCanvasY < words[i].y)) {
      //set word targeting rectangle for debugging
      wordTargetRect = {
        x: words[i].x,
        y: words[i].y - wordHeight,
        width: wordWidth,
        height: wordHeight
      }
      return words[i]
    } //return the word found
  }
  return null //no word found at location
}

function drawCanvas() {

  let context = canvas.getContext('2d')
  let lyricFillColor = 'cornflowerblue'
  let lyricStrokeColor = 'blue'
  let chordFillColor = 'green'
  let transposedChordFillColor = 'orange'
  let chordStrokeColor = 'green'

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '' + fontPointSize + 'pt ' + editorFont
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  //draw drag-able lyric and chord words
  for (let i = 0; i < words.length; i++) {
    let data = words[i]
    if (data.lyric) {
      context.fillStyle = lyricFillColor
      context.strokeStyle = lyricStrokeColor
    }
    if (data.chord) {
      if (transposedByNSemitones === 0) {
        context.fillStyle = chordFillColor
        context.strokeStyle = chordStrokeColor

      } else {
        context.fillStyle = transposedChordFillColor
        context.strokeStyle = transposedChordFillColor
      }

    }

    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)
  }

  //draw box around word last targeted with mouse -for debugging
  //context.strokeRect(wordTargetRect.x, wordTargetRect.y, wordTargetRect.width, wordTargetRect.height);

  /*
    context.fillStyle = 'red';
    movingString.stringWidth = context.measureText(	movingString.word).width;
    context.fillText(movingString.word, movingString.x, movingString.y);
	*/


}

function getCanvasMouseLocation(e) {
  //provide the mouse location relative to the upper left corner
  //of the canvas

  /*
  This code took some trial and error. If someone wants to write a
  nice tutorial on how mouse-locations work that would be great.
  */
  let rect = canvas.getBoundingClientRect()

  //account for amount the document scroll bars might be scrolled
  let scrollOffsetX = $(document).scrollLeft()
  let scrollOffsetY = $(document).scrollTop()

  let canX = e.pageX - rect.left - scrollOffsetX
  let canY = e.pageY - rect.top - scrollOffsetY

  return {
    canvasX: canX,
    canvasY: canY
  }

}

function handleMouseDown(e) {

  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY
  console.log("mouse down:" + canvasX + ", " + canvasY)

  wordBeingMoved = getWordAtLocation(canvasX, canvasY)
  //console.log(wordBeingMoved.word);
  if (wordBeingMoved != null) {
    deltaX = wordBeingMoved.x - canvasX
    deltaY = wordBeingMoved.y - canvasY
    $("#canvas1").mousemove(handleMouseMove)
    $("#canvas1").mouseup(handleMouseUp)

  }

  // Stop propagation of the event and stop any default
  //  browser action

  e.stopPropagation()
  e.preventDefault()

  drawCanvas()
}

function handleMouseMove(e) {

  //console.log("mouse move");

  let canvasMouseLoc = getCanvasMouseLocation(e)
  let canvasX = canvasMouseLoc.canvasX
  let canvasY = canvasMouseLoc.canvasY

  console.log("move: " + canvasX + "," + canvasY)

  wordBeingMoved.x = canvasX + deltaX
  wordBeingMoved.y = canvasY + deltaY

  e.stopPropagation()

  drawCanvas()
}

function handleMouseUp(e) {
  //console.log("mouse up")
  e.stopPropagation()

  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove) //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp) //remove mouse up handler

  drawCanvas() //redraw the canvas
}


function handleTimer() {
  movingString.x = (movingString.x + 5 * movingString.xDirection)
  movingString.y = (movingString.y + 5 * movingString.yDirection)

  //keep moving string within canvas bounds
  if (movingString.x + movingString.stringWidth > canvas.width) movingString.xDirection = -1
  if (movingString.x < 0) movingString.xDirection = 1
  if (movingString.y > canvas.height) movingString.yDirection = -1
  if (movingString.y - movingString.stringHeight < 0) movingString.yDirection = 1

  drawCanvas()
}

//KEY CODES
//should clean up these hard coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40


function handleKeyDown(e) {

  //console.log("keydown code = " + e.which );
  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
  //console.log("key UP: " + e.which);
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    //do nothing for now
  }

  if (e.which == ENTER) {
    handleSubmitButton() //treat ENTER key like you would a submit
    $('#userTextField').val('') //clear the user text field
  }

  e.stopPropagation()
  e.preventDefault()

}

function parseChordProFormat(chordProLinesArray) {
  transposedByNSemitones = 0 //reset transposition into semitones
  let context = canvas.getContext('2d');
  //clear any newline or return characters as a precaution --might not be needed
  for (let i = 0; i < chordProLinesArray.length; i++) {
    chordProLinesArray[i] = chordProLinesArray[i].replace(/(\r\n|\n|\r)/gm, "");
  }

  let textDiv = document.getElementById("text_area")
  textDiv.innerHTML = ''
  let yValue = 30;
  for (let i = 0; i < chordProLinesArray.length; i++) {
    let xValue = 40;
    let line = chordProLinesArray[i]
    textDiv.innerHTML = textDiv.innerHTML + `<p> ${line}</p>`

    let lyricLine = line.split(/\s/)
    /*for (let i = 0; i < lyricLine.length; i++) {
          console.log("Word in this list: " + lyricLine[i])
    }*/
    //let lyricLine = line;
    for (aWord of lyricLine){
      //if (1==1){
        //continue;
      //}
      //else {
        let chordsInThisWord = 0;
        let widthChordsNeed =0

        if (aWord.startsWith("[") && aWord.endsWith("]")){
          words.push({word:aWord, x:xValue+50, y:yValue-25, chord: 'chord'});
        }
        else{

        while (aWord.indexOf('[') > -1 && (aWord.length - 1 > (aWord.indexOf(']') - aWord.indexOf('[')))  ){
          chordsInThisWord += 1

          let chord = ' ';
          let indexOfChord = aWord.indexOf('[');

                          // Strip out the chord from the word
          chord = aWord.substring(indexOfChord,aWord.indexOf(']')+1);
          aWord = aWord.replace(/\b\[.+?\]|\[.+?\]\b|\[.+?\]/, '');

          let xOffset = (indexOfChord * context.measureText(aWord.substring(0,indexOfChord)).width /
                                         (indexOfChord + 1)) - context.measureText(chord).width /2;

           let chordWidth = context.measureText(chord).width;
           widthChordsNeed += chordWidth;

           // Offset the chord spacing if there are multiple chords so that they dont bunch up
           if(chordsInThisWord > 1) xOffset += chordWidth * (chordsInThisWord - 1);


           words.push({word:chord, x:xValue+xOffset, y:yValue-25, chord: 'chord'});
         }
         words.push({word: aWord, x:xValue, y:yValue, lyric: 'lyric'})
       }
         //words.push({word: aWord, x:xValue, y:yValue, lyric: 'lyric'})

      // Calculate spacing after word
      xValue += 10 + context.measureText(aWord).width;
      if(chordsInThisWord > 1) xValue += widthChordsNeed/2 + 10;
      }
      yValue += 50
  }

}



function transpose(theWords, semitones) {
  //Transpose any of the chords in the array of word objects theWords by
  //semitones number of musical steps or semi-tones.
  //semitones is expected to be an integer between -12 and +12

  if (semitones === 0) return //nothing to do

  transposedByNSemitones += semitones
  if (transposedByNSemitones >= 12) transposedByNSemitones -= 12
  if (transposedByNSemitones <= -12) transposedByNSemitones += 12

  for (let i = 0; i < words.length; i++) {
    if (words[i].chord) {
      words[i].word = transposeChord(words[i].word, semitones)
    }
  }
}

function transposeChord(aChordString, semitones) {
  console.log(`transposeChord: ${aChordString} by ${semitones}`)
  /*transpose aChordString by semitones
  aChordString is expected to be like: '[Gm7]' or '[F#maj7]'
  Strategy: look for the position of the chord letter name in hard-coded array of
  letter names and if found replace the characters with the ones offset by the argument
  semitones.
  For example to transpose A#m up by three semitones find for A# in RootNamesWithSharps
  array (which would be 1) then replace A# with the name found at RootsNamesWithSharps[1+3]
  which would be C#. Hence A#m transposed up three semitones would be C#m.
  */
  const RootNamesWithSharps = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
  const RootNamesWithFlats = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab']
  let rootNames = RootNamesWithSharps
  let rootNameIndex = -1
  let transposedChordString = ''
  for (let i = 0; i < aChordString.length; i++) {
    if (rootNames.findIndex(function(element) {
        return element === aChordString[i]
      }) === -1) {
      //character is not start of a chord root name (i.e. is not A,B,C,D,E,F, or G)
      if ((aChordString[i] !== '#') && (aChordString[i] !== 'b')) //skip # and b suffix
        transposedChordString += aChordString[i]
    } else {
      //character is start of a chord name root (i.e. A,B,C,D,E,F, or G)
      let indexOfSharp = -1
      let indexOfFlat = -1
      //check to see if we are dealing with names like A# or Bb
      if (i < aChordString.length - 1) {
        indexOfSharp = RootNamesWithSharps.findIndex(function(element) {
          return element === (aChordString[i] + aChordString[i + 1])
        })
        if (indexOfSharp !== -1) transposedChordString += RootNamesWithSharps[(indexOfSharp + 12 + semitones) % 12]
        indexOfFlat = RootNamesWithFlats.findIndex(function(element) {
          return element === (aChordString[i] + aChordString[i + 1])
        })
        if (indexOfFlat !== -1) transposedChordString += RootNamesWithFlats[(indexOfFlat + 12 + semitones) % 12]
      }
      if ((indexOfSharp === -1) && (indexOfFlat === -1)) {
        //chord name is letter without a # or b
        let index = rootNames.findIndex(function(element) {
          return element === aChordString[i]
        })
        if (index !== -1) transposedChordString += rootNames[(index + 12 + semitones) % 12]
      }
    }
  }
  return transposedChordString
}

function handleTransposeUpButton() {
  transpose(words, 1)
  drawCanvas()
}

function handleTransposeDownButton() {
  transpose(words, -1)
  drawCanvas()
}


function handleSubmitButton() {

  let userText = $('#userTextField').val() //get text from user text input field
  //clear lines of text in textDiv
  let textDiv = document.getElementById("text_area")
  textDiv.innerHTML = ''

  if (userText && userText !== '') {
    let userRequestObj = {
      text: userText
    }
    let userRequestJSON = JSON.stringify(userRequestObj)
    $('#userTextField').val('') //clear the user text field

    //alert ("You typed: " + userText);
    $.post("fetchSong", userRequestJSON, function(data, status) {
      console.log("data: " + data)
      console.log("typeof: " + typeof data)
      let responseObj = data
      movingString.word = responseObj.text
      words = [] //clear drag-able words array;
      if (responseObj.songLines) {
        let lines_sb = responseObj.songLines
        parseChordProFormat(lines_sb);
        drawCanvas()
      }
    })
  }

}

function handleRefreshButton(){ //NEED TO RETOUCH
  let textArea = document.getElementById('text_area')

  let wordList = words

  for ( word of wordList ){
    word.y = ((word.y-wordList[0].y)/(yValue+fontPointSize)).toFixed(0)*(yValue+fontPointSize) + wordList[0].y
  }

  wordList.sort(function(a,b){
    return a.y - b.y
  })

  wordList.push({
    word : '',
    x : 50,
    y : wordList[wordList.length -1].y + (yValue + fontPointSize),
  })

  let l = wordList[0].y
  let txt = ' '
  let text_line = ' '
  let line = []
  let lines_r = []

  for (i = 0; i < wordList.length; i++){
    let y_sorted_words = wordList[i]

    if (y_sorted_words.y != l){
      l = y_sorted_words.y

      if (line.length > 1){
        line.sort(function(a,b){
        return a.x - b.x
      })
    }

    for (let x_sorted_word of line){
      txt += x_sorted_word.word + ' '
      text_line += x_sorted_word.word + ' '
    }

    text_line.trim()
    lines_r.push(text_line)
    text_line = ' '

    txt += '\n'

    line = []
    line.push(y_sorted_words)
  }
  else {
    line.push(y_sorted_words)
  }
}
words_file_txt = txt
for (line of lines_r){
  textArea.innerHTML += `${line}</p>`
}
words =[]
parseChordProFormat(lines_r)
drawCanvas()

}

function handleSaveAsButton(){ //NEED TO RETOUCH
  let userText = $('#userTextField').val()
  if (userText&&userText!='') {
    let sendObj = {
      usage : 'saveFile', //seperate usage of post methods
      title : userText,
      content : words_file_txt
    }

    sendObjJSON = JSON.stringify(sendObj)

    $.post('createSong',sendObjJSON,(data)=>{ //sendback .text
      console.log(`File has been saved : ${data.text}`);

    })
  }

}


$(document).ready(function() {
  //This is called after the broswer has loaded the web page

  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown)

  //add key handler for the document as a whole, not separate elements.
  $(document).keydown(handleKeyDown)
  $(document).keyup(handleKeyUp)

  timer = setInterval(handleTimer, 100) //animation timer
  //clearTimeout(timer); //to stop timer

  drawCanvas()
})
