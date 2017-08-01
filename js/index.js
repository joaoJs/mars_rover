$(document).ready(function() {

  var planet_size = 0;

  ///////////////////////////////////////////////
  // Rover constructor
  function Rover(name, position, direction, commands) {
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.commands = commands;
    this.final = "";
  }

  // rovers will be stored in rovers object
  var rovers = {};

  // final messages will be stored in array
  var finalMessages = [];

  // variable to control creation of rovers
  var control = 0;

  /*********************************************************
    function that will move rover according to its direction
   *********************************************************/

  function goForward(rover) {

    // change rovers position according to its direction
    switch(rover.direction) {
      case 'N':
        rover.position[1]++;
        break;
      case 'E':
        rover.position[0]++;
        break;
      case 'S':
        rover.position[1]--;
        break;
      case 'W':
        rover.position[0]--;
        break;
      }

  //the rover needs to wrap from one edge of the grid to another
  if(rover.position[0] === planet_size) rover.position[0] = 0;
  if(rover.position[0] < 0) rover.position[0] = planet_size - 1;
  if(rover.position[1] === planet_size) rover.position[1] = 0;
  if(rover.position[1] < 0) rover.position[1] = planet_size - 1;

  var x =  rover.position[0];
  var y =  rover.position[1];
  var text = $(".c"+y+x).text();

    //rovers leave a mark (o) on previous position
      switch(rover.direction) {
        case 'N':
          $(".c"+(y-1)+x).text("o");
          $(".c"+y+x).text("o");
          break;
        case 'E':
          $(".c"+y+(x-1)).text("o");
          $(".c"+y+x).text("o");
          break;
        case 'S':
          $(".c"+(y+1)+x).text("o");
          $(".c"+y+x).text("o");
          break;
        case 'W':
          $(".c"+y+(x+1)).text("o");
          $(".c"+y+x).text("o");
          break;
        }

  // '.c-y+x' --> html class for grid's new position
  // if rover finds an obstacle
  if(text === '*') {
    // change appearance of current position on grid and return result to move function
    $(".c"+y+x).css('border','1px solid black');
    $(".c"+y+x).text("X");
    return "found";
    // if rover crashes with previous rover
  } else if (text === "O") {
    $(".c"+y+x).css('border','1px solid black');
    $(".c"+y+x).text("X");
    return "crashed";
    } else {

      //console.log("New Rover Position: [" + x + ", " + y + "]");

    }

}

/***********************************
  function to move rovers
 ***********************************/

  Rover.prototype.move = function() {

    var final = " survived";
    var begin = String(this.position[1]+this.position[0]);
    var curr = $(".c"+this.position[1]+this.position[0]).text();
    var rover = this;
    var commands = this.commands;
    //var name = this.name;
    //var final = this.final;

    // check if current position is not an obstacle
    if (curr !== "*") {

      // obj to helps rover switch direction
      var changeDirection = {
        f : function() {rover.direction = 'N';},
        b : function() {rover.direction = 'S';},
        r : function() {rover.direction = 'E';},
        l : function() {rover.direction = 'W';}
      };

      // for each command
      for (var i = 0; i < commands.length; i++) {

        var dir = commands[i];
        // change the direction
        changeDirection[dir]();

        // keep result of next move
        var next = goForward(rover)

        // if rover finds obstacle
        if (next === "found") {
          final = " found obstacle at position ["+ this.position[0] + "," + this.position[1] + "]";
          $(".col-").css('background','red');
          break;
        } else if (next === "crashed") {
          final = " crashed at position ["+ this.position[0] + "," + this.position[1] + "]";
          $(".col-").css('background','red');
          break;
        }


      }
    } else {

      //  change appearance of position in grid
      $(".c"+this.position[1]+this.position[0]).css("border","solid 1px black");
      $(".c"+this.position[1]+this.position[0]).text("X");
      $(".col-").css('background','red');
      final = " landed in obstacle";
    }

    if (final === " survived") {
      console.log(this);
      $(".c"+this.position[1]+this.position[0]).text("O");
      final += " and its current position is ["+ this.position[0] + "," + this.position[1] + "]";
    }

    rover.final = rover.name + final;
    finalMessages.push(rover.final);

}


/********************************
    render final messages
 ********************************/

  function renderFinalMessages(messages) {

    // initialize an unorderd list for final messages
    var ul = "<ul>"

    // for each final message
    finalMessages.forEach(message => {
      // if rover survived
      if (/survived/.test(message)) {
        // ad message in green
        ul += "<li id='green'>"+message+"</li>";

      } else {
        // add message in red
        ul += "<li id='red'>"+message+"</li>";

      }

    });

    ul += "</ul>";
    // append unordered list to html
    $(".final").append(ul);

  }

/************************************
    build planet space
 ************************************/

  $(".build").on("click", function() {

    clear();

    var size = $(".spaceSize").val();
    size = Number(size);
    planet_size = size;
    var space_size = [size, size];
    var max_diff = Math.ceil(size / 4);

    // ensure proper usage
    if (!size || (size < 5) || (size > 15)) {
      $(".error").html("must provide size from 5 to 15")
    } else {

      $(".error").html("");

      var toDiff_input = "<input placeholder='difficulty 1 - "+max_diff+"' type='number' class='setObst'>";
      var toDiff = "<input type='submit' value='set obstacles' class='set_obst'><br>";

      $(".diff_input").append(toDiff_input);
      $(".diff").append(toDiff);

      var height = space_size[0];
      var width = space_size[1];

      // set space with input size
      setSpace(height, width);

    }

  });

  /////////////////////////////////////////////
  // function to build and append space to html
  var setSpace = function(height, width) {

    // building the grid
    // for each row add a new div to html
    for (var i = height - 1; i >= 0; i--) {
      var new_row = "<div class='row r"+i+"'>";

      // for each column add a new div to html
      for (var j = 0; j < width; j++) {
        new_row += "<div class='col- c"+i+j+"'><p id='-"+i+","+j+"'></p></div>";
      }

      new_row += "</div>";
      // append new row to html
      $(".planet").append(new_row);

    }
  };

/***********************************
	 set obstacles
 ***********************************/

  $(".diff").on("click", function() {

    var textCol = $(".col-").text();

    // check if planet already has obstacles
    if (textCol.includes("*")) {
      $(".error").html("planet already has obstacles. They're invisible for now.");
    } else {

      var difficulty = $(".setObst").val();
      difficulty = Number(difficulty);
      var max_diff = Math.ceil(planet_size / 4);

      // ensure proper usage
      if (!difficulty) {

        $(".error").html("must provide difficulty");

      } else if (difficulty > max_diff) {

        $(".error").html("difficulty too high for planet size");

      } else if (difficulty < 1) {

        $(".error").html("difficulty can't be less than 1");

      } else {

        $(".error").html("");

        // let user know how many rovers can be created
        var new_rover = '<button class="btn btn-primary">new rover</button><p>\
          You can make up to 3 rovers</p>';
        //var new_rover = '<input type="submit" value="new rover" class="makeRover"><p>You can make up to 3 rovers</p>'
        $(".newR").html(new_rover);

        // set obstacles according to difficulty
        set_obstacles(difficulty);

        // function to set obst
        function set_obstacles(difficulty) {
        
          // repeate difficulty times
          for(var i = 0; i < difficulty; i++) {

            // j is row
            for(var j = 0; j < planet_size; j++) {
              // k is random col
              var k = Math.floor(Math.random() * planet_size);
              var v3 = $(".c"+j+k).text();
              // make obstacles white so they are hidden
              $(".c"+j+k).css("color","white");
              // "*" will be the obstacles
              $(".c"+j+k).text("*");
            }
          }
        }
      }
    }
});


/***********************************
	 Making new rovers
 ***********************************/

  $(".newR").on("click", function() {

    // ensure proper usage
    if (Object.keys(rovers).length >= 3) {
      $(".error").html("can't make more than 3 rovers");
    } else if (control !== 0) {
      $(".error").html("must finish creating this rover first");
    } else {
      $(".error").html("");

      control = 1;

      var maxPos = planet_size - 1;

      $(".roverInfo").html("");
      // add input filds for roverInfo
      var addName = "<input placeholder='name' type='text' class='roverName'><br>";
      var addPosX = "<input placeholder='x 0-"+maxPos+"' type='number' class='roverX'><br>";
      var addPosY = "<input placeholder='y 0-"+maxPos+"' type='number' class='roverY'><br>";
      var addDir = "<input placeholder='direction N S E W' type='text' class='dir'><br>";
      var addCom = "<input placeholder='commands f b r l' type='text' class='commands'><br>";
      var create = "<input type='submit' value='create' class='create'><br>";

      $(".roverInfo").append(addName, addPosX, addPosY, addDir, addCom, create);

      // make rover with given info
      $(".create").on("click", function() {

        var name = $(".roverName").val();
        var x = Number($(".roverX").val());
        var y = Number($(".roverY").val());
        var position = [x,y];
        var dir = $(".dir").val().toUpperCase();
        var commands = $(".commands").val();

        // ensure user provides necessary info
        if (!name || x === "" || y === "" || !position || !dir || !commands) {
          $(".error").html("must provide all info");
        } else {

          // ensure proper usage
          if ((x < 0)||(x > maxPos)) {

            $(".error").html("x has to be between 0 and "+maxPos);

          } else if ((y < 0)||(y > maxPos)) {

            $(".error").html("y has to be between 0 and "+maxPos);

          } else if (/[^NSEWnsew]/.test(dir)) {

            $(".error").html("'N'-North / 'S'-South / 'E'-East / 'W'-West");

          } else if (/[^fbrlFBRL]/.test(commands)) {

            $(".error").html("'f'-forward / 'b'-backwards / 'r'-right / 'l'-left \nex.: fffrrbbl");

          } else {

            $(".error").html("");
            control = 0;
            // store new rover in rovers object
            rovers[name] = new Rover(name,position,dir,commands);

            // add button to move rovers
            var start = "<button class='btn btn-primary start'>Start!</button>";
            $(".action").html(start);

            // move rovers!
            $(".start").on("click", function() {

              for (let name in rovers) {
                rovers[name].move();
              }

              // after each rover has moved, render final results for each rover
              renderFinalMessages(finalMessages);

            });
          }
        }
      });
    }
  });



/************************************
	 clear past events and reset
 ************************************/

  $(".clear").on("click", function() {
    $(".spaceSize").val("");
    $(".roverInfo").html("");
    control = 0;
    clear();
  });

  //////////////////
  // clear rows
  function clear() {

    planet_size = 0;
    finalMessages = [];
    rovers = {};
    planet_size = 0;
    $(".newR").html("");
    $(".diff_input").html("");
    $(".diff").html("");
    $(".error").html("");
    $(".final").html("");
    $(".planet").html("");
    $(".action").html("");
  }

});
