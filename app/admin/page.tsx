import Navbar from "../components/Navbar";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">Admin tools will appear here.</p>
      </section>
    </main>
  );
}
