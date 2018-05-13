import { h, createProjector } from 'maquette'
import * as animate from 'velocity-animate'

const ROOT_ELEMENT = 'div#root'

const projector = createProjector()
{/* <svg:svg xmlns:svg="http://www.w3.org/2000/svg"> */ }

function range(start, stop, step) {
  if (typeof stop == 'undefined') {
    // one param defined
    stop = start;
    start = 0;
  }

  if (typeof step == 'undefined') {
    step = 1;
  }

  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return [];
  }

  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
};


const app = {
  size: 200,
  n: 0,
  phi: (Math.sqrt(5) - 1) * Math.PI,
  createInput(targetProperty, min, max, step) {
    return h('div', [
      h('label', [targetProperty]),
      h('input', {
        type: 'range',
        min,
        max,
        step,
        value: this[targetProperty],
        oninput: evt => {
          this[targetProperty] = evt.target.value
        }
      })
    ])
  },
  render() {
    let polarCoords =
      range(this.n)
        .map(i => [Math.pow(i, 0.75) * 3.2, i * this.phi])
    return h(ROOT_ELEMENT, [
      this.createInput('size', 100, 1000),
      this.createInput('n', 0, 2000),
      this.createInput('phi', 0, 2 * Math.PI, 'any'),
      h('svg', {
        width: this.size,
        height: this.size,
        viewBox: `${-this.size / 2} ${-this.size / 2} ${this.size} ${this.size}`
      }, [
          h('g#guides', { 'stroke-width': 1, stroke: "hsla(0, 100%, 0%, .2)" }, [
            h('line', { x1: 0, y1: -this.size / 2, x2: 0, y2: this.size / 2 }),
            h('line', { y1: 0, x1: -this.size / 2, y2: 0, x2: this.size / 2 }),
          ]),
          h('g', { fill: 'black' },
            Array.from(polarCoords
              .map(([r, angle]) => [r * Math.cos(angle), r * Math.sin(angle)])
              .entries()
            ).map(([i, [cx, cy]]) => h('circle', {
              cx,
              cy,
              r: 3,
              key: i,
              enterAnimation: this.circleEnter,
              exitAnimation: this.circleExit
            }))
          )
        ]),
    ])
  },
  circleEnter(el, properties) {
    animate(el, 'stop')
    el.setAttribute('opacity', 0)
    animate(el, { 'opacity': 1 }, {
      duration: 500,
      easing: 'easeInQuint'
    })
  }, circleExit(el, done, properties) {
    animate(el, 'stop')
    el.setAttribute('opacity', 0.6)
    animate(el, { 'opacity': 0 }, {
      complete: done,
      duration: 500,
      easing: 'easeOutQuint'
    })
  }
}

projector.replace(document.querySelector(ROOT_ELEMENT), () => app.render())
app.n = 100
projector.scheduleRender()