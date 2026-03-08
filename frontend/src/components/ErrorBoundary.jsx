import { Component } from 'react'
import Button from './Button'

/**
 * Catches uncaught React errors and shows a fallback UI so the app doesn't show a blank screen.
 * Use once at the app root (e.g. in main.jsx).
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 p-6 text-center">
          <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-card">
            <div className="mb-4 text-4xl" aria-hidden>
              ⚠️
            </div>
            <h1 className="text-xl font-semibold text-stone-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-stone-600">
              An unexpected error occurred. Please reload the page to continue.
            </p>
            <Button onClick={this.handleReload} className="mt-6">
              Reload page
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
