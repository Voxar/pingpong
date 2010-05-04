var game = undefined;
$(function() {
  var boxxer = function(box) {
    box = {box:box,name:box.find(".name"),number:box.find(".number"),info:box.find(".info")}
    
    var switchServe = function(doneFunc) {
      box.info.animate({left: -200}, doneFunc)
    };
    
    jQuery.extend(box.number, {
      set : function(n, doneFunc) {
        var number = box.number;
        var new_number = number.clone();
        number.html(n).before(new_number)
        box.box.find(".number").animate({top:-100}, 100, function() {
          number.css("top", 0)
          new_number.remove();
          if(doneFunc) doneFunc();
        })
      },
      increment : function(doneFunc) {
        box.number.set(parseInt(box.number.html()) + 1, doneFunc) 
      }
    })
    
    jQuery.extend(box.info, {
      slideIn : function() {
        this.animate({left: 0})
      },
      slideRight : function() {
        this.animate({left: 200})
      },
      slideLeft : function() {
        this.animate({left:-200})
      }
    });
    
    return box;
  };
  
  var left = boxxer($(".left"));
  var right = boxxer($(".right"));
  
  game = (function() {
    //Private
    
    var current_serving = 0;
    var serves_left = 3;
    
    //Public
    return {
      left: left,
      right: right,
      setServe : function(player) {
        if(player == 1){
          left.info.slideRight();
          right.info.slideIn();
        } else {
          left.info.slideIn();
          right.info.slideLeft();
        }
        current_serving = player;
      },
      switchServe : function() {
        if(current_serving == 0){
          current_serving = 1;
        } else {
          current_serving = 0;
        }
        this.setServe(current_serving)
      },
      update_serves : function() {
        if(--serves_left == 0){
          this.switchServe()
          serves_left = 3;
        }
      },
      victoryDance : function(box) {
        var up = function() {
          box.info.animate({'font-size': '2em', 'top': -15}, down)
        }
        var down = function() {
          box.info.animate({'font-size': '1em', 'top': 0}, up)
        }
        box.info.css("left", 0).addClass("winner").html("WINNER")
        up()
      },
      checkWin : function() {
        var left_score = parseInt(left.number.html())
        var right_score = parseInt(right.number.html())
        if((left_score > 10 || right_score > 10) && Math.abs(left_score-right_score) >= 2){
          left.number.unbind('click')
          right.number.unbind('click')
          this.victoryDance(left_score > right_score ? left : right);
          return true;
        }
      },
      reset : function() {
        var left_score = parseInt(left.number.html())
        var right_score = parseInt(right.number.html())
        var yes_please = true;
        if((left_score == 0 && right_score == 0) || confirm("Do you want to start a new game?")){
          left.number.set(0);
          right.number.set(0);
        }
      }
      
    }//end gameobject
  })();
  
  left.number.click(function() {
    left.number.increment();
    game.checkWin(left) || game.update_serves();
  })
  
  right.number.click(function() {
    right.number.increment()
    game.checkWin(right) || game.update_serves()
  })
  
  right.info.css({left:-200})
  
  updateOrientation();
});

function updateOrientation () {
  if(!game) return;
  switch(window.orientation){
    case -90: //right
      game.setServe(1);
      game.reset()
      break;
    case 90: //left
      game.setServe(0);
      game.reset()
      break;
  }
}
