import Footer from './Footer.jsx'
import TopAppBar from './TopAppBar.jsx'

/**
 * Shared page shell: paper grain + fixed TopAppBar + footer.
 * Every route wraps its content in this.
 */
export default function PageLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="texture-overlay fixed inset-0 -z-10" />
      <TopAppBar />
      <div className="pt-[120px]">{children}</div>
      <Footer />
    </div>
  )
}
