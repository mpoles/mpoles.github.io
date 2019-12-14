(function() {
  var canvas, ctx, solarSystem;
  
  var epsilon = 100;
  var gravity = Math.pow(6.67384*10, (-11));
  var ttick = 1;
  
  var backgroundColor;
  
  var init = function() {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    backgroundColor = canvas.style.backgroundColor;
    
    solarSystem = new SolarSystem();
    
    var sun = new Planet(400, 400, 150000000, 1000, [0.01, 0], ['#fea', '#fb1'],'Солнце');
    var earth = new Planet(400, 250, 300000, 100, [0.3, 0], ['#77f', '#aaf'],'Земля');
    var merkur = new Planet(400, 350, 30000, 100, [0.1, 0], ['#666', '#ccc'],'Меркурий');
	var venus = new Planet(400, 300, 300000, 100, [0.2, 0], ['#aaa', '#fff'],'Венера');
    var mars = new Planet(400, 200, 30000, 100, [0.4, 0], ['#f77', '#faa'],'Марс');
	var jupiter = new Planet(400, 100, 300000, 10, [0.6, 0], ['#f70', '#faa'],'Юпитер');
	var saturn = new Planet(400, 0, 300000, 10, [0.7, 0], ['#770', '#fa0'],'Сатурн');
    
   
    solarSystem.addPlanet(sun);
    solarSystem.addPlanet(earth);
    solarSystem.addPlanet(mars);
    solarSystem.addPlanet(merkur);
	solarSystem.addPlanet(venus);
	solarSystem.addPlanet(jupiter);
	solarSystem.addPlanet(saturn);
    
    solarSystem.createPlanetPairs();
 
  };
  
  var Planet = function(x, y, mass, density, speed, color, name) {
    return {
      x: x,
      y: y,
      lastX: 0,
      lastY: 0,
      mass: mass,
      density: density,
      color: color,
	  name: name,
      speed: speed, 
      acc: [0, 0],
      _radius: Math.pow((mass/density) * 3/(4*Math.PI), (1/3)),
      _draw: function() {
          this._cleanLastPos();
          this.lastX = this.x;
          this.lastY = this.y;
        var grd = ctx.createRadialGradient(this.x, this.y, this._radius/2.5, this.x, this.y, this._radius);
        grd.addColorStop(0,this.color[0]);
        grd.addColorStop(1,this.color[1]);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this._radius, 0, Math.PI * 2, false);
        ctx.fillStyle = grd;
        ctx.fill();
		ctx.font = "14px Arial";
        ctx.fillText(name, this.x + this._radius+9, this.y - 3);
        ctx.fill();
       
      },
      _cleanLastPos: function() {
        ctx.beginPath();
        ctx.arc(this.lastX, this.lastY, this._radius+1, 0, Math.PI * 2, false);
        ctx.fillStyle = backgroundColor;
        ctx.fill();
		ctx.rect(this.lastX+this._radius+8, this.lastY-16,69,21)
        ctx.fill();
      }
    };
  }
  
  var PlanetPair = function(p1, p2, parent) {

    if(p1.mass > p2.mass) {
      var pTemp = p1;
      p1 = p2;
      p2 = pTemp;
    }
    
    return {
      parent: parent,
      p1: p1,
      p2: p2,
      acc12: [0, 0],
      acc21: [0, 0],
      jerk12: [0, 0],
      jerk21: [0, 0],
      distance: 0,
      distanceVector: [0, 0],
      plummerRadius: {},
      skalar: 0,
      diffv: [0, 0],

      calcAcc: function(mass, distanceVector, plummerRadius) {
        var accVector = [];
        
        for(var i = 0; i < 2; i++) {
          accVector[i] = gravity * mass * distanceVector[i] * plummerRadius.three;
        }
        
        return accVector;
        
      },

      calcJerk: function(mass, distanceVector, plummerRadius, skalar, diffv) {
        var jerkVector = [];
        
        for(var i = 0; i < 2; i++) {
          jerkVector[i] = gravity  * mass * (diffv[i] / plummerRadius.three - 3 * skalar * distanceVector[i] / plummerRadius.five);
        }
        
        return jerkVector;
        
      },

      calcDistance: function() {
        return Math.sqrt((Math.pow((this.p2.x - this.p1.x), 2)) + (Math.pow((this.p2.y - this.p1.y), 2)));
      },

      calcDistanceVector: function() {
         return [
           p2.x - p1.x,
           p2.y - p1.y
         ];
      },
      
      calcPlummerRadius: function(pow) {
        return Math.pow((Math.pow(this.distance, 2) + Math.pow(epsilon, 2)), (pow/2));
      },

      calcSpeedDiff: function() {
        var speedDiff = [];
        
        for(var i = 0; i < 2; i++) {
          speedDiff[i] = this.p2.speed[i] - this.p1.speed[i];
        }
        
        return speedDiff
      },

      calcSkalar: function() {
        return this.distanceVector[0] * this.diffv[1] - this.diffv[0] * this.distanceVector[1];
      },

      _calcVariables: function() {
        
        this.distance = this.calcDistance();
        this.distanceVector = this.calcDistanceVector();
        
        this.plummerRadius.three = this.calcPlummerRadius(3);
        this.plummerRadius.five = this.calcPlummerRadius(5);
        
        this.diffv = this.calcSpeedDiff();
        
        this.skalar = this.calcSkalar();
        
        this.acc12 = this.calcAcc(this.p2.mass, this.distanceVector, this.plummerRadius);
        this.jerk12 = this.calcJerk(this.p2.mass, this.distanceVector, this.plummerRadius, this.skalar, this.diffv);
        
        this.acc21 = this.calcAcc(this.p1.mass, this.distanceVector, this.plummerRadius);
        this.jerk21 = this.calcJerk(this.p1.mass, this.distanceVector, this.plummerRadius, this.skalar, this.diffv);
        
        this.setNewParameters();
        
      },

      setNewParameters: function() {
        
        this.p1.x = this.p1.x + this.p1.speed[0] * ttick + this.acc12[0] * Math.pow(ttick, 2)/2 + this.jerk12[0] * Math.pow(ttick, 3)/6;
        this.p1.y = this.p1.y + this.p1.speed[1] * ttick + this.acc12[1] * Math.pow(ttick, 2)/2 + this.jerk12[1] * Math.pow(ttick, 3)/6;
        
        
        this.p2.x = this.p2.x + this.p2.speed[0] * ttick + this.acc21[0] * Math.pow(ttick, 2)/2 + this.jerk21[0] * Math.pow(ttick, 3)/6;
        this.p2.y = this.p2.y + this.p2.speed[1] * ttick + this.acc21[1] * Math.pow(ttick, 2)/2 + this.jerk21[1] * Math.pow(ttick, 3)/6;
        
        for(var i = 0; i < 2; i++) {
          
          this.p1.speed[i] = this.p1.speed[i] + this.acc12[i] * ttick + this.jerk12[i] * (Math.pow(ttick, 2)/2);
          
          this.p2.speed[i] = this.p2.speed[i] + this.acc21[i] * ttick + this.jerk21[i] * (Math.pow(ttick, 2)/2);
          
        }
        
      }
    };
  };
   
  var SolarSystem = function() {
    return {
      planets: [],
      _planetPairs: [],

      _draw: function() {
        for(var i = 0; i < this.planets.length; i++) {
          this.planets[i]._draw();
        }
      },

      addPlanet: function(planet) {
        this.planets.push(planet);
      },

      createPlanetPairs: function() {
        for(var i = 0; i < this.planets.length; i++) {
          for(var j = i+1; j < this.planets.length; j++) {
            var planetPair = new PlanetPair(this.planets[i], this.planets[j], this);
            this._planetPairs.push(planetPair);
          } 
        }
      },

      calcPlanetPairPos: function() {
        for(var i = 0; i < this._planetPairs.length; i++) {
          this._planetPairs[i]._calcVariables();
        }
      }
    }
  }

  var update = function() {
    solarSystem.calcPlanetPairPos();
  };
  
  var render = function() {
    solarSystem._draw();
  };
  
  function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  };
  
  var now, dt,
    last = timestamp();

  function frame() {
    now   = timestamp();
    dt    = (now - last) / 1000;
    update(dt);
    render(dt);
    last = now;
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
  
  init();
  
})();



























