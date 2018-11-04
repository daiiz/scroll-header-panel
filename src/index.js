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
    // XXX: gradation optionほしい

    this.lastScrollTop = 0
    this.lastScrollDirection = ''
    this.render()
  }

  static get is () { return 'scroll-header-panel' }
  static get observedAttributes () { return ['solid'] }

  attributeChangedCallback (attr, oldVal, newVal) {
    switch (attr) {
      case 'solid': {
        this.solid = newVal === ''
        this.renderStyle()
        this.onScroll()
      }
    }
  }

  get style () {
    const t = document.createElement('template')
    t.innerHTML = `
      <style class='style'>
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
          left: 18px;
          position: absolute;
          background-size: cover;
          z-index: 20;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0);
          background-image: url(${this.iconSrcUrl});
        }
        .menu {
          position: absolute;
          right: 10px;
        }
        .header-menu {
          position: absolute;
          z-index: 20;
          height: 40px;
          margin-top: 12px;
          width: 100%;
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
          transform-origin: 0;
          padding-top: 10px;
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
    return t
  }

  get template () {
    const t = document.createElement('template')
    t.innerHTML = `
      <div class='whole'>
        <div class='header'></div>
        <div class='header-color-panel'></div>
        <div class='header-menu'>
          <div class='header-icon'></div>
          <div class='menu'>
            <slot name='header-menu'></slot>
          </div>
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

  directiveSticky ({titleBar, menu}) {
    const y = window.scrollY
    const direction = y > this.lastScrollTop ? 'down' : 'up'
    const titleHeightCorrection = this.solid ? 0 : this.titleHeight
    const titlePosition = titleBar.style.position
    const diffY = y - (+titleBar.style.top.replace('px', ''))
    const atBodyArea = y > this.headerHeight - titleHeightCorrection

    switch (direction) {
      case 'down': {
        const style = {}
        if (atBodyArea) {
          if (y > this.headerHeight + this.titleHeight && diffY < this.titleHeight) {
            // skip
          } else {
            if (titlePosition === 'fixed' && this.lastScrollDirection === 'up') {
              // || (y <= this.headerHeight + this.titleHeight)) {
              style.position = 'absolute'
              style.top = `${y}px`
            } else {
              // XXX: ジャンプする場合はここに来ている可能性大
              style.position = 'absolute'
              style.top = `${Math.min(y, this.headerHeight - titleHeightCorrection)}px`
            }
          }
        } else {
          style.position = 'fixed'
          style.top = 0
        }
        this.applyStyle(titleBar, style)
        this.applyStyle(menu, style)
        break
      }
      case 'up': {
        if (atBodyArea) {
          const style = {}
          if (this.lastScrollDirection !== 'up') {
            style.position = 'absolute'
            style.top = `${y - this.titleHeight}px`
          } else if (diffY < 0) {
            style.position = 'fixed'
            style.top = 0
          }
          this.applyStyle(menu, style)
          this.applyStyle(titleBar, style)
        } else {
          this.applyStyle(menu, {position: 'fixed', top: 0})
        }
        break
      }
    }
    this.lastScrollTop = y
    this.lastScrollDirection = direction
  }

  onScroll () {
    const titleBar = this.shadowRoot.querySelector('.title')
    const menu = this.shadowRoot.querySelector('.header-menu')
    const headerColorPanel = this.shadowRoot.querySelector('.header-color-panel')

    this.directiveSticky({titleBar, menu})
    if (!this.solid) {
      this.behaviorDefault({titleBar, headerColorPanel})
    } else {
      this.behaviorSolid({titleBar, headerColorPanel})
    }
  }

  behaviorDefault ({titleBar, headerColorPanel}) {
    const y = window.scrollY
    const headerHeight = this.headerHeight
    const title = titleBar.querySelector('.t')
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
        opacity: 1,
        backgroundColor: this.panelColor
      })
    }

    const d = Math.min(1, y / headerHeight) * 0.25
    this.applyStyle(title, {
      transform: `scale(${1 - d}) translateZ(0px)`
    })
  }

  behaviorSolid ({titleBar, headerColorPanel}) {
    const y = window.scrollY
    const headerHeight = this.headerHeight
    const title = titleBar.querySelector('.t')
    if (y < headerHeight) {
      this.applyStyle(titleBar, {
        position: 'absolute',
        backgroundColor: this.panelColor,
        top: `${headerHeight}px`,
      })
      this.applyStyle(headerColorPanel, {
        opacity: y / headerHeight // 0
      })
    }
    this.applyStyle(title, {
      transform: `scale(0.75) translateZ(0px)`
    })
  }

  renderStyle () {
    const shadowRoot = this.shadowRoot
    const oldStyle = shadowRoot.querySelector('.style')
    if (oldStyle) oldStyle.remove()
    shadowRoot.appendChild(this.style.content.cloneNode(true))
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    this.renderStyle()
    shadowRoot.appendChild(this.template.content.cloneNode(true))
    window.addEventListener('scroll', this.onScroll.bind(this), false)

    const icon = shadowRoot.querySelector('.header-icon')
    icon.addEventListener('click', () => {
      const event = new Event('icon-click')
      this.dispatchEvent(event)
    }, false)
  }
}

window.customElements.define(ScrollHeaderPanel.is, ScrollHeaderPanel)
