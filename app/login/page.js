import AuthForm from '../components/AuthForm'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-16">
          <AuthForm />
        </div>
      </main>
      
    </div>
  )
}
