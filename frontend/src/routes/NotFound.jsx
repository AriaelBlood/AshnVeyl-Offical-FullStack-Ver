import PageLayout from '../components/PageLayout.jsx'

export default function NotFound() {
  return (
    <PageLayout>
      <main className="flex min-h-screen flex-col items-center justify-center gap-stack-md text-center">
        <p className="text-label-caps uppercase text-primary-fixed-dim">Lost in the void</p>
        <h1 className="text-h1 font-serif text-primary-container">404</h1>
        <p className="text-body-lg text-on-surface-variant">
          This page has vanished into the archive.
        </p>
      </main>
    </PageLayout>
  )
}
