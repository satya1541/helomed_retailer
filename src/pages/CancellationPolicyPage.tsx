import { XCircle } from 'lucide-react';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-5 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Cancellation Policy</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">HeloMed Platform</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-700 dark:text-zinc-300 mb-8">
              Customers may cancel orders under the following conditions:
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Before Pharmacy Acceptance</h2>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300">
                  ✓ Orders may be cancelled <strong>without penalty</strong> if the pharmacy has not yet accepted the order.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">After Pharmacy Acceptance</h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300">
                  Once a pharmacy has accepted the order and started preparing the package, <strong>cancellation may not be allowed</strong>.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">After Dispatch</h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                  If the order has already been picked up by the delivery partner, <strong>cancellation is not permitted</strong>.
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                  This is due to the sensitive nature of medicines.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Platform Cancellation</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">HeloMed may cancel orders if:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Medicine is unavailable</li>
                <li>Prescription is invalid</li>
                <li>Payment failure occurs</li>
                <li>System errors occur</li>
                <li>Regulatory compliance issues arise</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-4 font-medium">
                Refunds will be initiated where applicable.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
