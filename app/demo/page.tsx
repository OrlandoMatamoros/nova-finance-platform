export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Nova Finance Demo</h1>
        <p className="text-xl">Dashboard de Inteligencia Financiera</p>
        <a 
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Ver Dashboard
        </a>
      </div>
    </div>
  )
}
