import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PromptList from './components/PromptList'
import PromptDetail from './pages/PromptDetail'
import PromptForm from './pages/PromptForm'
import CollectionList from './pages/CollectionList'
import CollectionForm from './pages/CollectionForm'

export default function App() {
  return (
    <Layout>
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
