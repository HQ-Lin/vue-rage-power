<script>
import throttle from 'lodash.throttle';
import getCaretCoordinates from 'textarea-caret';

const MAX_PARTICLES = 500;

const PARTICLE_NUM_RANGE = () => 5 + Math.round(Math.random() * 5);

const PARTICLE_GRAVITY = 0.075;

const PARTICLE_ALPHA_FADEOUT = 0.96;

const PARTICLE_VELOCITY_RANGE = {
  x: [-1, 1],
  y: [-3.5, -1.5]
};

const COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#bcbd22',
  '#17becf'
];

export default {
    props: {
        colors: {
            type: Array,
            default: () => (COLORS)
        },
    },

    data() {
        return {
            particles: [],
        };
    },

    methods: {
        _drawFrame() {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach((particle) => {
                particle.velocity.y += PARTICLE_GRAVITY;
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.alpha *= PARTICLE_ALPHA_FADEOUT;

                this.canvasContext.fillStyle = `rgba(${particle.color.join(',')}, ${particle.alpha})`;
                this.canvasContext.fillRect(Math.round(particle.x - 1), Math.round(particle.y - 1), 3, 3);
            });
            this.particles = this.particles
                .slice(Math.max(this.particles.length - MAX_PARTICLES, 0))
                .filter((particle) => particle.alpha > 0.1);
            window.requestAnimationFrame(this._drawFrame);
        },
        _onInput(...args) {
            this._shake();
            const target = args[0].target;
            const origin = target.getBoundingClientRect();
            const { top, left } = getCaretCoordinates(target, target.selectionEnd);
            const charHeight = parseInt(getComputedStyle(target)['font-size']);
            setTimeout(() => this._spawnParticles(left + origin.left, top + origin.top + charHeight), 0);
        },
        _shake() {
            const intencity = 1 + 2 * Math.random();
            const x = intencity * (Math.random() > 0.5 ? -1 : 1);
            const y = intencity * (Math.random() > 0.5 ? -1 : 1);

            this.$refs.node.style.transform = `translate3d(${x}px, ${y}px, 0)`;

            setTimeout(() => this.$refs.node.style.transform = '', 75);
        },
        _spawnParticles: throttle(function(x, y) {
            const { colors } = this;
            const numParticles = PARTICLE_NUM_RANGE();
            for (let i = 0;i < numParticles; i++) {
                const colorCode = colors[i % colors.length];
                const r = parseInt(colorCode.slice(1, 3), 16);
                const g = parseInt(colorCode.slice(3, 5), 16);
                const b = parseInt(colorCode.slice(5, 7), 16);
                const color = [r, g, b];
                this.particles.push(this._createParticle(x, y, color));
            }
        }, 25, { trailing: false }),
        _createParticle(x, y, color) {
            return {
                x,
                y: y,
                alpha: 1,
                color,
                velocity: {
                    x: PARTICLE_VELOCITY_RANGE.x[0] + Math.random() *
                        (PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]),
                    y: PARTICLE_VELOCITY_RANGE.y[0] + Math.random() *
                        (PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0])
                }
            };
        },
    },


    mounted() {
        this.reference = this.$slots.default[0].elm;

        if (this.reference) {
            this.reference.addEventListener('input', this._onInput, false)
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = 0;
        this.canvas.style.pointerEvents = 'none';
        this.canvasContext = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        window.requestAnimationFrame(this._drawFrame);
    },

    beforeDestroy() {
        document.body.removeChild(this.canvas);
    },

    render(h) {
        const { style = {} } = this;
        if (!this.$slots.default || this.$slots.default.length !== 1 || this.$slots.default[0].tag !== 'textarea') {
            console.error(`Please make sure include a tag like: textarea \n<vue-rage-power>\n\t<textarea></textarea>\n</vue-rage-power>`);
        }
        return (
            <div
                style={{ position:'relative', ...style }}
                ref='node'
            >
                {this.$slots.default}
            </div>
        )
    }
}
</script>
