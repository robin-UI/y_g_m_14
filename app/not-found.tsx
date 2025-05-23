import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
      <main className="flex-grow">
        <div className="min-h-[70vh] flex items-center justify-center bg-grey-100">
          <div className="text-center px-4 py-16 max-w-md">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-grey-800 mb-4">Page Not Found</h2>
            <p className="text-grey-600 mb-8">
              {"Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist."}
            </p>
            <Button className="bg-primary hover:bg-primary-dark text-white shadow-primary" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
  )
}
