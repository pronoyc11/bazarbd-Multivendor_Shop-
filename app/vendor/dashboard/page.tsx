import { auth } from "@/auth";
import Navbar from "../../components/Navbar";

export default async function VendorDashboard() {

  // Server Component-এ এভাবে Session পড়া যায়
  const session = await auth();
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="max-w-4xl mx-auto px-6 py-12">

        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            🏪 Vendor Dashboard
          </h1>

          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-600">স্বাগতম,{" "}
              <span className="font-bold text-orange-600">
                {session?.user?.name}
              </span>!
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Role: {session?.user?.role}
            </p>
          </div>

          <p className="text-gray-500 mt-6">
            এখানে Vendor-এর সব features আসবে — Product Add/Edit,
            Orders দেখা ইত্যাদি।
          </p>
        </div>

      </section>
    </main>
  );
}
