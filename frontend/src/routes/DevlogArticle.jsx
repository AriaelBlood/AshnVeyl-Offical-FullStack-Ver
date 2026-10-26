import PageLayout from '../components/PageLayout.jsx'
import { useParams } from 'react-router-dom'

export default function DevlogArticle() {
  const { slug } = useParams()
  return (
    <PageLayout>
      <main className="min-h-screen">
        <h1 className="text-h1 font-serif text-primary-container">Devlog: {slug}</h1>
        <p className="text-body-lg text-on-surface-variant">Article page — Phase 2</p>
      </main>
    </PageLayout>
  )
}
