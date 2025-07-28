'use client'
import { useEffect } from 'react'

export default function AdBanner() {
  useEffect(() => {
    // Inject atOptions first
    const configScript = document.createElement('script')
    configScript.type = 'text/javascript'
    configScript.innerHTML = `
      atOptions = {
        'key': '931ac21b320c490b31844196e9fa26b0',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
    `
    document.body.appendChild(configScript)

    // Then inject the ad script
    const adScript = document.createElement('script')
    adScript.type = 'text/javascript'
    adScript.src = '//powderencouraged.com/931ac21b320c490b31844196e9fa26b0/invoke.js'
    adScript.async = true
    document.body.appendChild(adScript)
  }, [])

  return null
}
