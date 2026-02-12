import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthForm from '../components/AuthForm'

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-16">
          <AuthForm />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
