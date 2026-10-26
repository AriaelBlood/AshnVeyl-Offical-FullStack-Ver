/**
 * Inline SVG icon registry — no icon font dependency.
 * Usage: <Icon name="search" size={18} className="..." />
 * Icons are 24x24 viewBox stroke icons (Material Symbols-like paths).
 */
const icons = {
  search: (
    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L21 19.49l-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
  ),
  arrow_forward: (
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  ),
  code: (
    <path d="M9.4 16.6 4.8 12l4.6-4.6L8 6l-6 6 6 6zm5.2 0 4.6-4.6-4.6-4.6L16 6l6 6-6 6z" />
  ),
  timer: (
    <path d="M9 1h6v2H9zM12 6a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm1 8h-2V8h2zm4.3-8.7-1.4 1.4a7.9 7.9 0 0 0-5.8 0L8.7 5.3A9.9 9.9 0 0 1 12 4.5c1.9 0 3.7.5 5.3 1.8z" />
  ),
  volume_up: (
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 2.8v2.1a7.2 7.2 0 0 1 0 14.2v2.1a9.2 9.2 0 0 0 0-18.4z" />
  ),
  account_circle: (
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 14.2a7.2 7.2 0 0 1-5.5-2.6c.1-1.8 3.7-2.8 5.5-2.8s5.4 1 5.5 2.8a7.2 7.2 0 0 1-5.5 2.6z" />
  ),
  menu: <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />,
  close: (
    <path d="m19 6.41-1.41-1.41L12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  ),
  edit: (
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z" />
  ),
  publish: (
    <path d="M5 4v2h14V4zm0 16h14v-6H5zm3-4h8v2H8zm-3-9v6h14V7zm7 5-3-3h2V7h2v2h2z" />
  ),
  save: (
    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10z" />
  ),
  image: (
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5z" />
  ),
  text_fields: (
    <path d="M2 6H0v2h2v6h2V8h2V6zm11 0H7v2h2v6h2V8h2zm11 2v-2H16v8h2v-3h4v-2h-4V8z" />
  ),
  delete: (
    <path d="M6 21a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm2.46-12.12 1.41-1.41L12 9.59l2.12-2.12 1.42 1.41L13.41 11l2.13 2.12-1.42 1.42L12 12.41l-2.12 2.13-1.41-1.42L10.59 11zM15 2l-1-1H10L9 2H4v2h16V2z" />
  ),
  drag_handle: (
    <path d="M20 9H4v2h16zM4 15h16v-2H4z" />
  ),
  copy: (
    <path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11z" />
  ),
  check: <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />,
  open_in_new: (
    <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z" />
  ),
}

export default function Icon({ name, size = 24, className = '' }) {
  const path = icons[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {path}
    </svg>
  )
}
