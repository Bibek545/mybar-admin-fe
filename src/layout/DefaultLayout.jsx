import React, { Children } from 'react'

const DefaultLayout = ({children}) => {
  return (
<div>
  {/* will put header here */}

  <main>
    {children}
  </main>

  {/* maybe footer as well */}
</div>
  )
}

export default DefaultLayout;