scrollHeaderPanel.addEventListener('icon-click', event => {
  const target = event.target
  if (target.solid) {
    target.removeAttribute('solid')
  } else {
    target.setAttribute('solid', '')
  }
})
