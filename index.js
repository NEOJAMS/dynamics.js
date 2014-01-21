// Generated by CoffeeScript 1.4.0
(function() {
  var Animation, Graph, TweenLinear, TweenSpring, UISlider,
    _this = this,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TweenLinear = {
    init: function() {
      return _this.t = 0;
    },
    next: function(step) {
      var t, v;
      if (_this.t > 1) {
        _this.t = 1;
      }
      t = _this.t;
      v = _this.t;
      _this.t += step;
      return [t, v];
    }
  };

  TweenSpring = (function() {

    function TweenSpring(frequency, friction, anticipationStrength, anticipationSize) {
      this.frequency = frequency;
      this.friction = friction;
      this.anticipationStrength = anticipationStrength;
      this.anticipationSize = anticipationSize;
      this.next = __bind(this.next, this);

      this.init = __bind(this.init, this);

    }

    TweenSpring.prototype.init = function() {
      this.t = 0;
      this.speed = 0;
      return this.v = 0;
    };

    TweenSpring.prototype.next = function(step) {
      var A, At, a, angle, b, decal, frictionT, s, t, v, y0, yS,
        _this = this;
      if (this.t > 1) {
        this.t = 1;
      }
      t = this.t;
      this.t += step;
      s = this.anticipationSize / 100;
      decal = Math.max(0, s);
      frictionT = (t / (1 - s)) - (s / (1 - s));
      A = function(t) {
        var M, a, b, x0, x1;
        M = 0.8;
        x0 = s / (1 - s);
        x1 = 0;
        b = (x0 - (M * x1)) / (x0 - x1);
        a = (M - b) / x0;
        return (a * t * _this.anticipationStrength / 100) + b;
      };
      if (t < s) {
        yS = (s / (1 - s)) - (s / (1 - s));
        y0 = (0 / (1 - s)) - (s / (1 - s));
        b = Math.acos(1 / A(yS));
        a = (Math.acos(1 / A(y0)) - b) / ((this.frequency || 1) * (-s));
      } else {
        A = function(t) {
          return Math.pow(_this.friction / 10, -t) * (1 - t);
        };
        b = 0;
        a = 1;
      }
      At = A(frictionT);
      angle = this.frequency * (t - s) * a + b;
      v = 1 - (At * Math.cos(angle));
      return [t, v, At, frictionT];
    };

    return TweenSpring;

  })();

  Animation = (function() {

    Animation.index = 0;

    function Animation(el, frames, options) {
      var _base, _base1;
      this.el = el;
      this.frames = frames != null ? frames : {};
      this.options = options != null ? options : {};
      this._keyframes = __bind(this._keyframes, this);

      this.start = __bind(this.start, this);

      (_base = this.options).tween || (_base.tween = TweenLinear);
      (_base1 = this.options).duration || (_base1.duration = 1000);
    }

    Animation.prototype.start = function() {
      var keyframes, name, style;
      name = "anim_" + Animation.index;
      Animation.index += 1;
      keyframes = this._keyframes(name);
      style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      this.el.style.webkitAnimationName = name;
      this.el.style.webkitAnimationDuration = this.options.duration + 'ms';
      this.el.style.webkitAnimationTimingFunction = 'linear';
      return this.el.style.webkitAnimationFillMode = 'forwards';
    };

    Animation.prototype._keyframes = function(name) {
      var args, css, dValue, frame0, frame1, k, oldValue, step, t, transform, v, value;
      this.options.tween.init();
      step = 0.01;
      frame0 = this.frames[0];
      frame1 = this.frames[100];
      css = "@-webkit-keyframes " + name + " {\n";
      while (args = this.options.tween.next(step)) {
        t = args[0], v = args[1];
        transform = '';
        for (k in frame1) {
          value = frame1[k];
          if (k === 'translateX') {
            value = parseInt(value);
            oldValue = frame0.translateX || 0;
            dValue = value - oldValue;
            transform += "translateX(" + (oldValue + (dValue * v)) + "px) ";
          }
        }
        css += "" + (t * 100) + "% { ";
        if (transform) {
          css += "-webkit-transform: " + transform + ";";
        }
        css += " }";
        if (t >= 1) {
          break;
        }
      }
      css += "}";
      return css;
    };

    return Animation;

  })();

  Graph = (function() {

    function Graph(canvas) {
      this._drawCurve = __bind(this._drawCurve, this);

      this.draw = __bind(this.draw, this);
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.r = window.devicePixelRatio || 1;
      if (this.r) {
        canvas.width = canvas.width * this.r;
        canvas.height = canvas.height * this.r;
        canvas.style.webkitTransformOrigin = "0 0";
        canvas.style.webkitTransform = 'scale(' + (1 / this.r) + ')';
      }
    }

    Graph.prototype.draw = function() {
      var args, h, points, points2, points3, r, step, t, v, v2, v3, w;
      r = window.devicePixelRatio;
      w = this.canvas.width;
      h = this.canvas.height;
      step = 0.001;
      this.ctx.clearRect(0, 0, w, h);
      this.ctx.setStrokeColor('gray');
      this.ctx.setLineWidth(1);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0.67 * h);
      this.ctx.lineTo(w, 0.67 * h);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0.34 * h);
      this.ctx.lineTo(w, 0.34 * h);
      this.ctx.stroke();
      this.tween.init();
      points = [];
      points2 = [];
      points3 = [];
      while (args = this.tween.next(step)) {
        t = args[0], v = args[1], v2 = args[2], v3 = args[3];
        points.push([t, v]);
        points2.push([t, v2]);
        points3.push([t, v3]);
        if (t >= 1) {
          break;
        }
      }
      this.ctx.beginPath();
      this.ctx.setStrokeColor('red');
      this._drawCurve(points);
      this.ctx.setLineWidth(2 * r);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.setStrokeColor('rgba(0, 0, 255, .3)');
      this._drawCurve(points2);
      this.ctx.setLineWidth(1 * r);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.setStrokeColor('rgba(0, 255, 0, .3)');
      this._drawCurve(points3);
      this.ctx.setLineWidth(1 * r);
      return this.ctx.stroke();
    };

    Graph.prototype._drawCurve = function(points) {
      var h, point, r, t, v, w, _i, _len, _results;
      r = window.devicePixelRatio;
      w = this.canvas.width;
      h = this.canvas.height;
      _results = [];
      for (_i = 0, _len = points.length; _i < _len; _i++) {
        point = points[_i];
        t = point[0], v = point[1];
        if (t === 0) {
          _results.push(this.ctx.moveTo(t * w, h - ((0.33 + (v * 0.33)) * h)));
        } else {
          _results.push(this.ctx.lineTo(t * w, h - ((0.33 + (v * 0.33)) * h)));
        }
      }
      return _results;
    };

    return Graph;

  })();

  UISlider = (function() {

    function UISlider(el, valueEl, options) {
      var _base, _base1;
      this.el = el;
      this.valueEl = valueEl;
      this.options = options != null ? options : {};
      this._windowMouseUp = __bind(this._windowMouseUp, this);

      this._windowMouseMove = __bind(this._windowMouseMove, this);

      this._controlMouseDown = __bind(this._controlMouseDown, this);

      this._updateLeftFromValue = __bind(this._updateLeftFromValue, this);

      this.value = __bind(this.value, this);

      (_base = this.options).start || (_base.start = 0);
      (_base1 = this.options).end || (_base1.end = 1000);
      if (this.options.value === void 0) {
        this.options.value = 10;
      }
      this.width = 200 - 10;
      this.bar = document.createElement('div');
      this.bar.classList.add('bar');
      this.control = document.createElement('div');
      this.control.classList.add('control');
      this.el.appendChild(this.bar);
      this.el.appendChild(this.control);
      this.valueEl.innerHTML = this.options.value;
      this._updateLeftFromValue();
      this.control.addEventListener('mousedown', this._controlMouseDown);
    }

    UISlider.prototype.value = function() {
      return this.options.value;
    };

    UISlider.prototype._updateLeftFromValue = function() {
      return this.control.style.left = (this.options.value - this.options.start) / (this.options.end - this.options.start) * this.width + "px";
    };

    UISlider.prototype._controlMouseDown = function(e) {
      this.dragging = true;
      this.startPoint = [e.pageX, e.pageY];
      this.startLeft = parseInt(this.control.style.left || 0);
      window.addEventListener('mousemove', this._windowMouseMove);
      return window.addEventListener('mouseup', this._windowMouseUp);
    };

    UISlider.prototype._windowMouseMove = function(e) {
      var dX, newLeft;
      if (!this.dragging) {
        return;
      }
      dX = e.pageX - this.startPoint[0];
      newLeft = this.startLeft + dX;
      if (newLeft > this.width) {
        newLeft = this.width;
      } else if (newLeft < 0) {
        newLeft = 0;
      }
      this.options.value = Math.round(newLeft / this.width * (this.options.end - this.options.start) + this.options.start);
      this.valueEl.innerHTML = this.options.value;
      if (typeof this.onUpdate === "function") {
        this.onUpdate();
      }
      return this.control.style.left = newLeft + "px";
    };

    UISlider.prototype._windowMouseUp = function(e) {
      this.dragging = false;
      window.removeEventListener('mousemove', this._windowMouseMove);
      return window.removeEventListener('mouseup', this._windowMouseUp);
    };

    return UISlider;

  })();

  document.addEventListener("DOMContentLoaded", function() {
    var animate, animateToRight, animationTimeout, graph, tween, update,
      _this = this;
    graph = new Graph(document.querySelector('canvas'));
    this.frequency = new UISlider(document.querySelector('.slider.frequency'), document.querySelector('.value.frequency'), {
      end: 100,
      value: 17
    });
    this.friction = new UISlider(document.querySelector('.slider.friction'), document.querySelector('.value.friction'), {
      start: 1,
      end: 3000,
      value: 400
    });
    this.anticipationStrength = new UISlider(document.querySelector('.slider.anticipationStrength'), document.querySelector('.value.anticipationStrength'), {
      start: 0,
      end: 1000,
      value: 115
    });
    this.anticipationSize = new UISlider(document.querySelector('.slider.anticipationSize'), document.querySelector('.value.anticipationSize'), {
      start: 0,
      end: 100,
      value: 10
    });
    this.duration = new UISlider(document.querySelector('.slider.duration'), document.querySelector('.value.duration'), {
      start: 100,
      end: 4000,
      value: 1000
    });
    animationTimeout = null;
    tween = function() {
      return new TweenSpring(_this.frequency.value(), _this.friction.value(), _this.anticipationStrength.value(), _this.anticipationSize.value());
    };
    animateToRight = true;
    animate = function() {
      var anim;
      anim = new Animation(document.querySelector('div.circle'), {
        0: {
          translateX: animateToRight ? 0 : 350
        },
        100: {
          translateX: animateToRight ? 350 : 0
        }
      }, {
        tween: tween(),
        duration: _this.duration.value()
      });
      animateToRight = !animateToRight;
      return anim.start();
    };
    update = function() {
      graph.tween = tween();
      graph.draw();
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
      return animationTimeout = setTimeout(animate, 200);
    };
    update();
    this.frequency.onUpdate = update;
    this.friction.onUpdate = update;
    this.anticipationStrength.onUpdate = update;
    this.anticipationSize.onUpdate = update;
    this.duration.onUpdate = update;
    return document.querySelector('div.circle').addEventListener('click', animate);
  }, false);

}).call(this);
