class ScrollHeaderPanel extends HTMLElement {
  constructor (...props) {
    super(...props)
    this.panelColor = `#312319`
    this.render()
  }

  get style () {
    const s = document.createElement('span')
    s.innerHTML = `
      <style>
        .whole {
          width: 100%;
          height: 100vh;
        }
        .header {
          height: 192px;
          background: #eee;
          width: 100%;
          position: fixed;
          background-image: url(https://i.gyazo.com/0c15b03645d299f47a4a408b3e6e8388.jpg);
          background-size: cover;
          background-position: center center;
        }
        .header-icon {
          width: 40px;
          height: 40px;
          background-color: rgba(0, 0, 0, 0);
          top: 12px;
          left: 18px;
          position: fixed;
          background-image: url(https://miilclient.herokuapp.com/static/assets/yummy.png);
          background-size: cover;
          z-index: 20;
          cursor: pointer;
        }
        .header-slot {
          position: fixed;
          z-index: 20;
          height: 40px;
          top: 12px;
          right: 10px;
        }
        .header-color-panel {
          position: absolute;
          width: 100%;
          height: 192px;
          top: 0;
          opacity: 0;
          z-index: 5;
          background-color: ${this.panelColor};
        }
        .title {
          background: transparent;
          position: absolute;
          padding-left: 20px;
          bottom: 0;
          font-size: 40px;
          color: rgb(234, 223, 198);
          top: 128px;
          height: 64px;
          width: 100vw;
          z-index: 10;
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
          top: 192px;
          background: rgb(233, 231, 228);
          /* height: calc(100% - 192px); */
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

  static get is () {
    return 'scroll-header-panel'
  }

  applyStyle (dom, css) {
    const keys = Object.keys(css)
    for (const key of keys) {
      console.log(dom)
      dom.style[key] = `${css[key]}`
    }
  }

  onScroll () {
    const y = window.scrollY
    const titleBar = this.shadowRoot.querySelector('.title')
    const header = this.shadowRoot.querySelector('.header')
    const headerHeight = header.offsetHeight
    const headerColorPanel = this.shadowRoot.querySelector('.header-color-panel')

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
        top: 0,
        position: 'fixed',
        opacity: 1,
        backgroundColor: this.panelColor
      })
    }
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(this.template.content.cloneNode(true))
    window.addEventListener('scroll', this.onScroll.bind(this))
  }
}

window.customElements.define(ScrollHeaderPanel.is, ScrollHeaderPanel)
