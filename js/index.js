
$(document).ready(function() {
  
  // sub for planet.space.length
  var planet_size = 0;

  function Rover(position, direction, commands) {
  this.position = position;
  this.direction = direction;
  this.commands = commands;
}
  
  var rovers = {};
  
  // variable to control creation of rovers
  var control = 0;
  
 function goForward(rover) {
    
    //console.log(x,y, "goForward!")
    console.log(rover, "F");

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

  //if rover finds an obstacle it shoud stop executing the commands, stop at the las
  //possible position and report that it found an obsacle.
  // lets check html value
  // '.col-pos[0]+pos[1]'
  var x =  rover.position[0];
  var y =  rover.position[1];
  var text = $(".c"+y+x).text(); 
    
  if(text === '*') {
    $(".c"+y+x).css('border','1px solid black');
    $(".c"+y+x).text("X"); 
    return "found";
  } else if (text === "|" || text === "--") {
    return "crashed"; 
    } else {
      
    //rovers leave a mark
      //$(".c"+previous[1]+previous[0]).text("o");
      switch(rover.direction) {
    case 'N':
      $(".c"+(y-1)+x).text("o");
      $(".c"+y+x).text("|");
      break;
    case 'E':
      $(".c"+y+(x-1)).text("o");
      $(".c"+y+x).text("--");
      break;
    case 'S':
      $(".c"+(y+1)+x).text("o");
      $(".c"+y+x).text("|");
      break;
    case 'W': 
      $(".c"+y+(x+1)).text("o");
      $(".c"+y+x).text("--");
      break;
  }
     

  
  console.log("New Rover Position: [" + x + ", " + y + "]");
  }

}
  
  // function to move rovers
  Rover.prototype.move = function() {
    
    var final = "alive";
    var begin = String(this.position[1]+this.position[0]);
    var curr = $(".c"+this.position[1]+this.position[0]).text();
    if (curr !== "*") {
 
    var rover = this;
    var commands = this.commands;
  
   var changeDirection = {
    f : function() {rover.direction = 'N';},
    b : function() {rover.direction = 'S';},
    r : function() {rover.direction = 'E';},
    l : function() {rover.direction = 'W';}
};
  
  //function move will take a list of commands as input
  for (var i = 0; i < commands.length; i++) {
    //each element in the list will be a new direction command for the rover
    var dir = commands[i];
    //therefore we call the changeDirection object and change rover's direction according to the command (f b r l)
    changeDirection[dir]();
    //we finally ask for the rover to move forward with the updated direction
    //goForward(rover);
    
    var next = goForward(rover)
    //console.log(next, "next");
    if (next === "found") {
      final = "found";
      $(".col-").css('background','red');
      console.log('here');
      break;
    } else if (next === "crashed") {
      final = "crashed";
      $(".col-").css('background','red');
      console.log("crashed");
      break;
    }

    //it will move once for each command on the list and will eventually display its new position
    }
    } else {
     $(".c"+this.position[1]+this.position[0]).css("border","solid 1px black"); $(".c"+this.position[1]+this.position[0]).text("X");
      $(".col-").css('background','red');
      final = "landed in obstacle";
    }
  
    console.log(final);
    //$(".c"+begin).html("Y")
    $(".final").html(final);
  //return obst;
}
  
  // build planet space;
  $(".build").on("click", function() {
    
    var not_empty = $(".row").text();
    
    if (not_empty) {
      clear();
    }
    
    var size = $(".spaceSize").val();
    size = Number(size);
    planet_size = size;
    var space_size = [size, size];
    
    var height = space_size[0];
    var width = space_size[1];
    
    setSpace(height, width);
    
    
  });
  
  // function to build and append space to html 
  var setSpace = function(height, width) {
  
    // maybe invert, start on height
  for (var i = height - 1; i >= 0; i--) {
    var new_row = "<div class='row r"+i+"'>"
    
    for (var j = 0; j < width; j++) {
      
      new_row += "<div class='col- c"+i+j+"'><p id='-"+i+","+j+"'></p></div>"
    }
    new_row += "</div>";
    $(".planet").append(new_row);  
    //console.log(new_row);
  }
  
};
  
  //set obstacles
  $(".set_obst").on("click", function() {
    
    var difficulty = $(".setObst").val();
    difficulty = Number(difficulty);
    
    set_obstacles(difficulty);
    
    // function to set obst
    function set_obstacles(difficulty) {
    
    for(var i = 0; i < difficulty; i++) {
      
      // j is row
      for(var j = 0; j < planet_size; j++) {
      // k is random col
      var k = Math.floor(Math.random() * planet_size);
      //console.log(j, k);
      var v3 = $(".c"+j+k).text();
      // make obstacles white so they are hidden
      $(".c"+j+k).css("color","white");
      $(".c"+j+k).text("*");
      
    }
  }
  }
    
  });
  
  // open rover's info
  $(".makeRover").on("click", function() {
    
    if (Object.keys(rovers).length >= 3) {
      $(".error").html("can't make more than 3 rovers")
    } else if (control !== 0) {
       $(".error").html("must finish creating this rover first")        
    } else {
     
    control = 1;
    
    $(".roverInfo").html("");
    var addName = "<input placeholder='name' type='text' class='roverName'><br>";
    var addPosX = "<input placeholder='x-position' type='number' class='roverX'><br>";
    var addPosY = "<input placeholder='y-position' type='number' class='roverY'><br>";
    var addDir = "<input placeholder='direction' type='text' class='dir'><br>";
    var addCom = "<input placeholder='commands' type='text' class='commands'><br>";
    var create = "<input type='submit' value='create' class='create'><br>";
    
    $(".roverInfo").append(addName, addPosX, addPosY, addDir, addCom, create);
    
    // make rover with given info
  $(".create").on("click", function() {
    
    
    var name = $(".roverName").val();
    var x = Number($(".roverX").val());
    var y = Number($(".roverY").val());
    var position = [x,y];
    var dir = $(".dir").val();
    var commands = $(".commands").val();
    
    if (!name || x === "" || y === "" || !position || !dir || !commands) {
      $(".error").html("must provide all info")
    } else {
    
    control = 0;
    rovers[name] = new Rover(position,dir,commands);
    
    // add button to move rovers
    var start = "<button class='btn btn-primary start'>Start!</button>"
    $(".action").html(start);  
      
    // move rovers!
  $(".start").on("click", function() {
    
    for (let name in rovers) {
      rovers[name].move();
    }
      
  })
      
    }  
  })
      
 }    
});
  
  
  
  
  $(".clear").on("click", function() {
    $(".roverInfo").html("");
    control = 0;
    clear();
  })
  
  // clear rows
  function clear() {
    
    planet_size = 0;
    
    rovers = {};
    planet_size = 0;
    $(".error").html("");
    $(".final").html("");
    $(".row").html("");
    $(".action").html("")  
  }  

  
  
});