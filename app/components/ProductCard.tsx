import Link from "next/link";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  vendorName: string;
  emoji: string;
}

export default function ProductCard({ id, name, price, vendorName, emoji }: ProductCardProps) {
  return (
    <Link
      href={id ? `/products/${id}` : "#"}
      className="block bg-white rounded-xl p-6 shadow-md hover:-translate-y-1 transition"
    >
      <div className="text-6xl text-center mb-4">
        {emoji}
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {name}
      </h3>

      <p className="text-orange-500 font-bold text-xl mb-1">
        ৳ {price.toLocaleString()}
      </p>

      <p className="text-gray-400 text-sm mb-4">
        বিক্রেতা: {vendorName}
      </p>

      <div className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 text-center">
        🛒 বিস্তারিত দেখুন
      </div>
    </Link>
  );
}
