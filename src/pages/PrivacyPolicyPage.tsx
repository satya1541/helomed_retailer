import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Privacy Policy</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">HeloMed Platform</p>
            </div>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Information Collected</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">HeloMed may collect:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Name</li>
                <li>Contact number</li>
                <li>Email address</li>
                <li>Delivery address</li>
                <li>Prescription images</li>
                <li>Health data (if voluntarily provided)</li>
                <li>ABHA registration information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Purpose of Data Use</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Information is used for:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Order processing</li>
                <li>Delivery coordination</li>
                <li>Healthcare service facilitation</li>
                <li>ABHA registration</li>
                <li>Ambulance booking</li>
                <li>Customer support</li>
                <li>Fraud prevention</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Data Protection</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">HeloMed uses industry-standard security measures including:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Secure servers</li>
                <li>Encryption protocols</li>
                <li>Access control</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3">to protect user information.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Data Sharing</h2>
              <p className="text-zinc-700 dark:text-zinc-300 mb-3">Information may be shared with:</p>
              <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
                <li>Partner pharmacies</li>
                <li>Delivery partners</li>
                <li>Payment gateways</li>
                <li>Government systems (for ABHA)</li>
              </ul>
              <p className="text-zinc-700 dark:text-zinc-300 mt-3 font-medium">User data is not sold to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Contact Information</h2>
              <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300 font-semibold mb-2">Udi Digi Swasthyatech Private Limited</p>
                <p className="text-zinc-700 dark:text-zinc-300">Registered Office: Bhubaneswar, Odisha, India</p>
                <p className="text-zinc-700 dark:text-zinc-300 mt-2">Support Contact: Through HeloMed mobile application or website</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
