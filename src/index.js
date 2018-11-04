class ScrollHeaderPanel extends HTMLElement {
  constructor (...props) {
    super(...props)
    this.render()
  }

  get template () {
    const t = document.createElement('template')
    t.innerHTML = `
      <div>
        <slot></slot>
      </div>
    `
    return t
  }

  static get is () {
    return 'scroll-header-panel'
  }

  render () {
    const shadowRoot = this.attachShadow({mode: 'open'})
    const h1 = document.createElement('h1')
    h1.innerText = 'hello'
    shadowRoot.appendChild(h1)
    shadowRoot.appendChild(this.template.content.cloneNode(true))
  }
}

window.customElements.define(ScrollHeaderPanel.is, ScrollHeaderPanel)
