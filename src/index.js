class ScrollHeaderPanel extends HTMLElement {
  constructor (...props) {
    super(...props)
    this.panelColor = `#312319`
    this.titleColor = `rgb(234, 223, 198)`
    this.bodyColor = `#e9e7e4`
    this.headerHeight = 192
    this.titleHeight = 64
    this.iconSrcUrl = `./miilclient.png`
    this.panelSrcUrl = `./miilclient.bg.jpg`
    this.solid = false
    this.render()
  }

  static get is () { return 'scroll-header-panel' }
  static get observedAttributes () { return ['solid'] }

  attributeChangedCallback () {
    this.solid = this.getAttribute('solid') !== null
    this.render()
  }

  get style () {
    const s = document.createElement('span')
    s.innerHTML = `
      <style>
        .whole {
          width: 100%;
          height: 100vh;
          overflow-y: hidden;
        }
        .header {
          background: #eee;
          width: 100%;
          position: fixed;
          background-size: cover;
          background-position: center center;
          background-image: url(${this.panelSrcUrl});
          height: ${this.headerHeight}px;
        }
        .header-icon {
          width: 40px;
          height: 40px;
          top: 12px;
          left: 18px;
          position: fixed;
          background-size: cover;
          z-index: 20;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0);
          background-image: url(${this.iconSrcUrl});
        }
        .header-slot {
          position: fixed;
          z-index: 20;
          height: 40px;
          top: 12px;
          right: 10px;
          user-select: none;
          -webkit-user-select: none;
        }
        .header-color-panel {
          position: absolute;
          width: 100%;
          top: 0;
          opacity: 0;
          z-index: 5;
          height: ${this.headerHeight}px;
          background-color: ${this.panelColor};
        }
        .title {
          position: absolute;
          box-sizing: border-box;
          padding-left: 20px;
          bottom: 0;
          font-size: 40px;
          width: 100%;
          z-index: 10;
          user-select: none;
          -webkit-user-select: none;
          background: ${this.solid ? this.panelColor : 'transparent'};
          color: ${this.titleColor};
          top: ${this.solid ? this.headerHeight : this.headerHeight - this.titleHeight}px;
          height: ${this.titleHeight}px;
        }
        .t {
          transform: scale(0.75) translateZ(0px);
          transform-origin: 0;
          margin-top: 8px;
          margin-left: 50px;
          font-family: 'roboto';
        }
        .body {
          position: absolute;
          width: 100%;
          top: ${this.solid ? this.headerHeight + this.titleHeight : this.headerHeight}px;
          background: ${this.bodyColor};
        }
      </style>
    `
    return s.innerText
  }

  get template () {
    const t = document.createElement('template')
    t.innerHTML = `
      <style>
        ${this.style}
      </style>
      <div class='whole'>
        <div class='header'></div>
        <div class='header-color-panel'></div>
        <div class='header-icon'></div>
        <div class='header-slot'>
          <slot name='header'></slot>
        </div>
        <div class='title'>
          <div class='t'>ScrollHeaderPanel</div>
        </div>
        <div class='body'>
          <slot name='body'></slot>
        </div>
      </div>
    `
    return t
  }

  applyStyle (dom, css) {
    const keys = Object.keys(css)
    for (const key of keys) dom.style[key] = `${css[key]}`
  }

  onScroll () {
    const titleBar = this.shadowRoot.querySelector('.title')
    const header = this.shadowRoot.querySelector('.header')
    const headerColorPanel = this.shadowRoot.querySelector('.header-color-panel')

    if (!this.solid) {
      this.behaviorDefault({titleBar, header, headerColorPanel})
    } else {
      this.behaviorSolid({titleBar, header})
    }
  }

  behaviorDefault ({titleBar, header, headerColorPanel}) {
    const y = window.scrollY
    const headerHeight = header.offsetHeight
    if (y < headerHeight - titleBar.offsetHeight) {
      this.applyStyle(titleBar, {
        position: 'absolute',
        top: `${headerHeight - titleBar.offsetHeight}px`,
        backgroundColor: 'transparent'
      })
      this.applyStyle(headerColorPanel, {
        opacity: y / headerHeight
      })
    } else {
      this.applyStyle(titleBar, {
        position: 'fixed',
        top: 0,
        opacity: 1,
        backgroundColor: this.panelColor
      })
    }
  }

  behaviorSolid ({titleBar, header}) {
    const y = window.scrollY
    const headerHeight = header.offsetHeight
    if (y < headerHeight) {
      this.applyStyle(titleBar, {
        position: 'absolute',
        top: `${headerHeight}px`,
      })
    } else {
      this.applyStyle(titleBar, {
        position: 'fixed',
        top: 0
      })
    }
  }

  render () {
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' })
    shadowRoot.textContent = null
    shadowRoot.appendChild(this.template.content.cloneNode(true))
    window.addEventListener('scroll', this.onScroll.bind(this))
  }
}

window.customElements.define(ScrollHeaderPanel.is, ScrollHeaderPanel)
