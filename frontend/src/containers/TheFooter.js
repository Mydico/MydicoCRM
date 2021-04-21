import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://dzung.dev" target="_blank" rel="noopener noreferrer">CRM Profesional</a>
        <span >&copy; 2021</span>
      </div>
      <div className="mfs-auto">
        <span>Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">dungnd8594@gmail.com</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
