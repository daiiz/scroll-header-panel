class ScrollHeaderPanel extends HTMLElement {
  constructor (...props) {
    super(...props)
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
          position: absolute;
        }
        .title {
          background: transparent;
          position: absolute;
          bottom: 0;
        }
        .body {
          position: absolute;
          width: 100%;
          top: 192px;
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
        <div class='header'>
          <slot name='header'></slot>
          <div class='title'>
            <div class='t'>ScrollHeaderPanel</div>
          </div>
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

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(this.template.content.cloneNode(true))
  }
}

window.customElements.define(ScrollHeaderPanel.is, ScrollHeaderPanel)
