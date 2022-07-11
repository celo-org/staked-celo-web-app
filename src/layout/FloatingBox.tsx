import { PropsWithChildren } from 'react'

interface Props {
  width?: string
  maxWidth?: string
  classes?: string
}

export function FloatingBox(props: PropsWithChildren<Props>) {
  const { width, maxWidth, classes } = props
  return (
    <div
      style={{ maxHeight: '80%' }}
      className={`${width} ${maxWidth} border-blue-800 border p-3 bg-white rounded-lg m-2 ${classes}`}
    >
      {props.children}
    </div>
  )
}
