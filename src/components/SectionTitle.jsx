/** Título de sección con el pin 📌 y el subrayado rojo institucional */
export default function SectionTitle({ as: Tag = 'h2', children, className = '' }) {
  return (
    <Tag
      className={`font-condensed font-bold uppercase tracking-wide text-cr-ink pb-2 border-b-2 border-cr-red inline-block ${className}`}
    >
      📌 {children}
    </Tag>
  )
}
