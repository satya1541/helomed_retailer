import { RefreshCw } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Return & Refund Policy</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">HeloMed Platform</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-8">
              <p className="text-zinc-700 dark:text-zinc-300 mb-3 text-lg font-semibold">
                Due to the safety-sensitive nature of pharmaceutical products, HeloMed follows a <strong>strict No-Return Policy</strong>.
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Medicines <strong>cannot be returned</strong> once delivered and accepted by the customer.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Policy Purpose</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">This policy ensures:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Patient safety</li>
                <li>Prevention of tampering</li>
                <li>Regulatory compliance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Exceptions</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                Returns may <strong>only</strong> be accepted in the following cases:
              </p>
              <div className="grid gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold">1. Damaged medicines during delivery</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold">2. Expired medicines received</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold">3. Incorrect medicines delivered</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-zinc-700 dark:text-zinc-300 font-semibold">4. Packaging seal broken before delivery</p>
                </div>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 mt-4 font-medium text-amber-600 dark:text-amber-400">
                ⚠️ Customers must report such issues within <strong>24 hours</strong> of delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Refund Processing</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                After verification, refunds may be processed via:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Original payment method</li>
                <li>Wallet credit</li>
                <li>Bank transfer</li>
              </ul>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mt-4">
                <p className="text-zinc-700 dark:text-zinc-300">
                  <strong>Refund timeline:</strong> 5-7 business days
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
