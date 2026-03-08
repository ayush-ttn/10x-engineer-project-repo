import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCollections } from './api/collections'
import Layout from './components/Layout'
import PromptList from './components/PromptList'
import PromptDetail from './pages/PromptDetail'
import PromptForm from './pages/PromptForm'
import CollectionList from './pages/CollectionList'
import CollectionForm from './pages/CollectionForm'

function AppContent() {
  const [collections, setCollections] = useState([])

  useEffect(() => {
    getCollections()
      .then((data) => setCollections(data.collections || []))
      .catch(() => {})
  }, [])

  return (
    <Layout collections={collections}>
      <Routes>
        <Route path="/" element={<PromptList />} />
        <Route path="/prompts/new" element={<PromptForm />} />
        <Route path="/prompts/:id" element={<PromptDetail />} />
        <Route path="/prompts/:id/edit" element={<PromptForm />} />
        <Route path="/collections" element={<CollectionList />} />
        <Route path="/collections/new" element={<CollectionForm />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return <AppContent />
}
