import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-5 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Terms & Conditions</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">HeloMed Platform</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                By accessing or using the HeloMed mobile application or web application, users agree to comply with these Terms and Conditions.
              </p>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                These terms govern the use of services provided by <strong>Udi Digi Swasthyatech Private Limited</strong>.
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                If users do not agree to these terms, they must discontinue the use of the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">2. Nature of Platform</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                <strong>HeloMed is a technology platform only.</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>HeloMed does not manufacture, sell, or dispense medicines directly</li>
                <li>Medicines are supplied by independent licensed pharmacies registered on the platform</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 mb-2">HeloMed only facilitates:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Order placement</li>
                <li>Order routing to pharmacies</li>
                <li>Delivery logistics</li>
                <li>Payment processing</li>
                <li>Healthcare service facilitation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">3. Services Offered</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">The platform currently offers:</p>
              <ol className="list-decimal pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Medicine delivery</li>
                <li>Healthcare essentials delivery</li>
                <li>ABHA (Ayushman Bharat Health Account) registration assistance</li>
                <li>Ambulance booking facilitation</li>
                <li>Healthcare related service enablement</li>
              </ol>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 italic">Services may expand or change at any time.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">4. User Eligibility</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Users must:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Be 18 years or older</li>
                <li>Provide accurate personal details</li>
                <li>Use the platform legally</li>
                <li>Upload valid prescriptions when required</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3">
                Users are responsible for ensuring prescriptions are issued by registered medical practitioners.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">5. Prescription Medicines</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">For prescription drugs:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>A valid prescription must be uploaded</li>
                <li>Pharmacies may verify prescription authenticity</li>
                <li>Orders may be rejected if prescription is invalid</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 font-medium">
                HeloMed reserves the right to cancel suspicious or non-compliant orders.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">6. Pricing and Charges</h2>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-3">
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">Medicine prices are determined by retail pharmacy partners.</p>
                <p className="text-zinc-700 dark:text-zinc-300">HeloMed does not control medicine pricing.</p>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 mb-2">The platform charges only:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Delivery Fees</li>
                <li>Applicable taxes on delivery fees</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3">Taxes are charged in compliance with Indian tax laws.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">7. Payment</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Users may pay through:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>UPI</li>
                <li>Debit/Credit Cards</li>
                <li>Net Banking</li>
                <li>Wallets</li>
                <li>Payment Gateway providers</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3">
                Payment processing is handled by third-party payment gateways. <strong>HeloMed does not store full card details.</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">8. Delivery</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Orders are delivered by independent delivery partners.</p>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Delivery time depends on:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Pharmacy readiness</li>
                <li>Distance</li>
                <li>Traffic conditions</li>
                <li>Delivery partner availability</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 font-medium">
                Delivery timelines shown on the platform are estimates only.
              </p>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3">HeloMed is not liable for delays due to:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Natural disasters</li>
                <li>Traffic conditions</li>
                <li>System outages</li>
                <li>Pharmacy delays</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">9. Limitation of Liability</h2>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300 mb-2 font-semibold">HeloMed is a technology facilitator only.</p>
                <p className="text-zinc-700 dark:text-zinc-300 mb-2">The company is not responsible for:</p>
                <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                  <li>Medical advice</li>
                  <li>Medicine misuse</li>
                  <li>Pharmacy negligence</li>
                  <li>Ambulance service performance</li>
                </ul>
                <p className="text-zinc-700 dark:text-zinc-300 mt-3 font-semibold">
                  Users must consult registered medical professionals before consuming medicines.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">10. Governing Law</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">
                These policies are governed by the laws of India.
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">
                Any disputes shall fall under the jurisdiction of courts located in <strong>Bhubaneswar, Odisha</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
