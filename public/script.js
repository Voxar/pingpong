$(function() {
  var boxxer = function(box) {
    box = {box:box,name:box.find(".name"),number:box.find(".number"),info:box.find(".info")}
    
    var switchServe = function(doneFunc) {
      box.info.animate({left: -200}, doneFunc)
    };
    
    box.setNumber = function(n, doneFunc) {
      var number = box.number;
      var new_number = number.clone().html(n);
      number.after(new_number)
      box.box.find(".number").animate({top:-100}, function() {
        number.html(new_number.html()).css("top", 0)
        new_number.remove();
        if(doneFunc) doneFunc();
      })
    }
    
    jQuery.extend(box.number, {
      increment : function(doneFunc) {
        box.setNumber(parseInt(box.number.html()) + 1, doneFunc) 
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
  
  var game = (function() {
    var setServe = function(player) {
      if(player){
        left.info.slideRight()
        right.info.slideIn()
      } else {
        left.info.slideIn()
        right.info.slideLeft()
      }
    }
    
    var current_serving = 0;
    var serves_left = 3;
    var switchServe = function() {
      if(current_serving == 0){
        current_serving = 1;
      } else {
        current_serving = 0;
      }
      setServe(current_serving)
    }
    
    return {
      update_serves : function() {
        if(--serves_left == 0){
          switchServe()
          serves_left = 3;
        }
      }
    }
  })();
  
  left.number.click(function() {
    left.number.increment()
    game.update_serves()
  })
  
  right.number.click(function() {
    right.number.increment()
    game.update_serves()
  })
  
  right.info.css({left:-200})
});
