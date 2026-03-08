import { useParams } from 'react-router-dom'
import PromptDetailView from '../components/PromptDetailView'

export default function PromptDetail() {
  const { id } = useParams()
  return <PromptDetailView promptId={id} />
}
