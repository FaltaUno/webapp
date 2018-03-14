const FontFaceObserver = require('fontfaceobserver')

const Fonts = () => {
  const linkRoboto = document.createElement('link')
  linkRoboto.href = '/static/fonts/roboto-fontface.css'
  linkRoboto.rel = 'stylesheet'
  document.head.appendChild(linkRoboto)

  const roboto = new FontFaceObserver('Roboto')
  roboto.load().then(() => {
    document.documentElement.classList.add('roboto')
  })

  const linkMaterialIcons = document.createElement('link')
  linkMaterialIcons.href = '/static/fonts/material-design-icons.css'
  linkMaterialIcons.rel = 'stylesheet'
  document.head.appendChild(linkMaterialIcons)

  const materialIcons = new FontFaceObserver('Material Icons')
  roboto.load().then(() => {
    document.documentElement.classList.add('material-icons')
  })
}

export default Fonts
