import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Shipping & Delivery Policy</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">HeloMed Platform</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-700 dark:text-zinc-300 mb-8">
              HeloMed provides medicine delivery through partner pharmacies and delivery partners.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Delivery Areas</h2>
              <p className="text-zinc-700 dark:text-zinc-300">
                Delivery availability depends on operational areas supported by pharmacies and logistics partners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Delivery Time</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300 font-semibold mb-2">Typical delivery window:</p>
                <p className="text-2xl font-bold text-primary">30 minutes to 2 hours</p>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm mt-2">depending on location</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Delivery Charges</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Delivery charges may vary based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Distance</li>
                <li>Time of delivery</li>
                <li>Demand</li>
                <li>Platform promotions</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-4 font-medium">
                Taxes are applied only on delivery fees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Important Notes</h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg space-y-2">
                <p className="text-zinc-700 dark:text-zinc-300">
                  • Orders are delivered by independent delivery partners
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  • Delivery timelines are estimates and may vary
                </p>
                <p className="text-zinc-700 dark:text-zinc-300">
                  • HeloMed is not liable for delays due to unforeseen circumstances
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
