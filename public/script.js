var game = undefined;
$(function() {
  var boxxer = function(box, player) {
    box = {box:box,name:box.find(".name"),number:box.find(".number"),info:box.find(".info"),player:player}
    
    jQuery.extend(box.number, {
      set : function(n) {
        var number = this;
        var new_number = number.clone();
        number.html(n).before(new_number)
        box.box.find(".number").animate({top:-0}, 0, function() {
          number.css("top", 0)
          new_number.remove();
        })
      },
      get : function() {
        return parseInt(this.html())
      },
      increment : function() {
        box.number.set(box.number.get() + 1) 
      },
      setClick : function(handler) {
        this.click(handler);
      }
    })
    
    jQuery.extend(box.info, {
      slideIn : function() {
        this.animate({left: 0});
        return this;
      },
      slideRight : function() {
        this.animate({left: 200});
        return this;
      },
      slideLeft : function() {
        this.animate({left:-200});
        return this;
      },
      dance : function() {
        var up = function() { box.info.animate({'font-size': '2em', 'top': -15}, down) }
        var down = function() { box.info.animate({'font-size': '1em', 'top': 0}, up) }
        this.css("left", 0).addClass("winner").html("Winner!")
        up();
        return this;
      },
      reset : function() {
        this.stop().css({'font-size': '1em', 'top': 0}).html("&nbsp;").removeClass("winner")
        return this;
      }
    });
    
    return box;
  };
  
  
  game = (function() {
    //Private
    
    //Public
    game = {
      num_serves : 2,
      serves_left: 2,
      current_serving: 0,
      left: boxxer($(".left"), 0),
      right: boxxer($(".right"), 1),
      win : false,
      setServe : function(player) {
        if(player == 1){
          $(".serve").removeClass("left").addClass("right")
        } else {
          $(".serve").removeClass("right").addClass("left")
        }
        this.current_serving = player;
      },
      switchServe : function() {
        if(this.current_serving == 0){
          this.current_serving = 1;
        } else {
          this.current_serving = 0;
        }
        this.setServe(this.current_serving)
      },
      update_serves : function() {
        if(--this.serves_left == 0){
          this.switchServe();
          var left_score = this.left.number.get();
          var right_score = this.right.number.get();
          if(left_score >= 10 && right_score >= 10)
            this.serves_left = 1;
          else
            this.serves_left = this.num_serves;
        }
      },
      victoryDance : function(box) {
        box.info.dance();
        this.setServe(box.player)
      },
      checkWin : function() {
        var left_score = this.left.number.get();
        var right_score = this.right.number.get();
        if((left_score > 10 || right_score > 10) && Math.abs(left_score-right_score) >= 2){
          game.win = true;
          this.victoryDance(left_score > right_score ? this.left : this.right);
          return true;
        }
      },
      bind_numbers : function() {
        console.log("this is? " + this)
      },
      reset : function() {
        var left_score = this.left.number.get()
        var right_score = this.right.number.get()
        if(this.win || (left_score == 0 && right_score == 0) || confirm("Do you want to start a new game?")){
          this.left.number.set(0);
          this.right.number.set(0);
          this.win = false;
          this.serves_left = this.num_serves;
          this.left.info.reset()
          this.right.info.reset()
          this.setServe(this.current_serving)
        }
      }
    }//end gameobject
    
    game.left.number.click(function() {
      if(game.win) return;
      game.left.number.increment()
      game.checkWin() || game.update_serves();
    })
    game.right.number.click(function() {
      if(game.win) return;
      game.right.number.increment()
      game.checkWin() || game.update_serves();
    })
    
    return game;
  })();
  
  updateOrientation();
  game.reset();
});

function scroll () {
  window.scrollTo(0, 1);
}

function updateOrientation(orientation) {
  if(!orientation) orientation = window.orientation;
  if(!game) return;
  switch(orientation){
    case -90: //right
      game.setServe(1);
      game.reset()
      $(".page").removeClass("hidden")
      $("#help").addClass("hidden")
      break;
    case 90: //left
      game.setServe(0);
      game.reset();
      $(".page").removeClass("hidden")
      $("#help").addClass("hidden")

      break;
    case 0:
      $(".page").addClass("hidden")
      $("#help").removeClass("hidden")
      
      break;
  }
  window.scrollTo(0, 1);
}

$.fn.animate2 = function(css, speed, fn) {
  if(speed === 0) { // differentiate 0 from null
    this.css(css)
    window.setTimeout(fn, 0)
  } else {
    if($.browser.safari) {
      var s = []
      for(var i in css) 
          s.push(i)
    
      this.css({ webkitTransitionProperty: s.join(", "),
                webkitTransitionDuration: speed+ "ms" });
    
      window.setTimeout(function(x,y) {
        x.css(y)
      },0, this, css) // have to wait for the above CSS to get applied
      window.setTimeout(fn, speed)
    } else {
      this.animate(css, speed, fn)
    }
  }
}
