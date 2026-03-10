import { Link } from 'react-router-dom';
import { Mail, MapPin, Building2, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Contact Us</h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Get in touch with HeloMed</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-lg">
                <Building2 className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Company Name</h2>
                  <p className="text-zinc-700 dark:text-zinc-300 font-medium">Udi Digi Swasthyatech Private Limited</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                    Registered under Ministry of Corporate Affairs (MCA), Government of India
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-lg">
                <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Registered Office</h2>
                  <p className="text-zinc-700 dark:text-zinc-300">Bhubaneswar, Odisha, India</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-lg">
                <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Support Contact</h2>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    For customer support, please contact us through the HeloMed mobile application or website.
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">Additional Resources</h2>
              <div className="grid gap-3">
                <Link 
                  to="/privacy-policy" 
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">Privacy Policy</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-400" />
                </Link>
                <Link 
                  to="/terms" 
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">Terms & Conditions</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-400" />
                </Link>
                <Link 
                  to="/shipping-policy" 
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">Shipping & Delivery Policy</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-400" />
                </Link>
                <Link 
                  to="/cancellation-policy" 
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">Cancellation Policy</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-400" />
                </Link>
                <Link 
                  to="/refund-policy" 
                  className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  <span className="text-zinc-700 dark:text-zinc-300">Return & Refund Policy</span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-zinc-400" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
