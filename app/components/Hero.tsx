import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-orange-400 px-6 py-24 text-center text-white">
      <h1 className="mb-4 text-4xl font-bold">Bangladesh multivendor marketplace</h1>
      <p className="mb-8 text-lg opacity-90">
        Discover trusted vendors and everyday products in one place.
      </p>
      <Link
        href="/products"
        className="inline-flex rounded-full bg-white px-8 py-3 text-lg font-bold text-orange-500 hover:bg-orange-100"
      >
        Shop now
      </Link>
    </section>
  );
}
