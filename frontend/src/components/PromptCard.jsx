import { Link } from 'react-router-dom'

export default function PromptCard({ prompt, onSelect }) {
  const { id, title, description, tags = [] } = prompt
  const className =
    'group block w-full rounded-2xl border-l-4 border-l-primary-500 border border-stone-200/90 bg-white p-5 text-left shadow-card transition hover:border-primary-400 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'

  const content = (
    <>
      <h3 className="font-semibold text-stone-900 line-clamp-1 group-hover:text-primary-700">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-stone-600 line-clamp-2">{description}</p>
      )}
      {tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag.tag_id}
              className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </>
  )

  if (onSelect) {
    return (
      <button type="button" onClick={() => onSelect(prompt)} className={className}>
        {content}
      </button>
    )
  }

  return (
    <Link to={`/prompts/${id}`} className={className}>
      {content}
    </Link>
  )
}
