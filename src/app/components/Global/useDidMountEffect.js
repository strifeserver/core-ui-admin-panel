/* eslint-disable */
import React, { useEffect, useRef } from 'react'

const useDidMountEffect = (func, arrDependency) => {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) func()
    else didMount.current = true
  }, arrDependency)
}

export default useDidMountEffect
