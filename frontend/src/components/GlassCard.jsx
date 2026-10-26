/**
 * Glass Veil card: 5-10% white + 20px backdrop blur + gold border.
 * Per mockups: rounded-lg.
 */
export default function GlassCard({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag
      className={`glass-veil overflow-hidden rounded-lg ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
