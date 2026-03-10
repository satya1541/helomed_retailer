import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Store, User, Phone, Mail, MapPin, FileText, Upload, CheckCircle, Clock, Hash, Building2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { retailerSignup } from '@/api/auth';
import { useRetailerAuth } from '@/context/AuthContext';

// Compress image to reduce file size (max 800px width, 0.7 quality)
const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size < 200 * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

function FileUploadField({ 
  label, 
  file, 
  onChange 
}: { 
  label: string; 
  file?: File | null; 
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
          accept="image/*,.pdf"
          className="hidden"
          id={label.replace(/\s+/g, '-')}
        />
        <label
          htmlFor={label.replace(/\s+/g, '-')}
          className="flex items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg cursor-pointer hover:border-primary dark:hover:border-primary transition bg-white dark:bg-zinc-900"
        >
          <Upload className="w-5 h-5 text-zinc-400" />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {file ? file.name : 'Click to upload'}
          </span>
        </label>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useRetailerAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    shopName: '',
    fullAddress: '',
    latitude: '',
    longitude: '',
    pincode: '',
    houseNumber: '',
    landmark: '',
    openingTime: '',
    closingTime: '',
    shopType: '',
    licenseNumber: '',
    gstNumber: '',
    aadhaarNumber: '',
    panNumber: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    shopPhoto: null as File | null,
    licensePhoto: null as File | null,
    aadhaarPhoto: null as File | null,
    panPhoto: null as File | null,
    ownerPhoto: null as File | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    if (!file) return;
    updateField(field, file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = new FormData();
      
      payload.append('phone', formData.phone);
      payload.append('owner_name', formData.ownerName);
      payload.append('shop_name', formData.shopName);
      payload.append('full_address', formData.fullAddress);
      payload.append('pincode', formData.pincode);
      
      if (formData.email) payload.append('email', formData.email);
      if (formData.latitude) payload.append('latitude', formData.latitude);
      if (formData.longitude) payload.append('longitude', formData.longitude);
      if (formData.houseNumber) payload.append('house_number', formData.houseNumber);
      if (formData.landmark) payload.append('landmark', formData.landmark);
      if (formData.openingTime) payload.append('opening_time', formData.openingTime);
      if (formData.closingTime) payload.append('closing_time', formData.closingTime);
      if (formData.shopType) payload.append('shop_type', formData.shopType);
      if (formData.licenseNumber) payload.append('license_number', formData.licenseNumber);
      if (formData.gstNumber) payload.append('gst_number', formData.gstNumber);
      if (formData.aadhaarNumber) payload.append('aadhaar_number', formData.aadhaarNumber);
      if (formData.panNumber) payload.append('pan_number', formData.panNumber);
      if (formData.accountHolderName) payload.append('account_holder_name', formData.accountHolderName);
      if (formData.accountNumber) payload.append('account_number', formData.accountNumber);
      if (formData.ifscCode) payload.append('ifsc_code', formData.ifscCode);
      if (formData.branchName) payload.append('branch_name', formData.branchName);
      
      if (formData.shopPhoto) {
        const compressed = await compressImage(formData.shopPhoto);
        payload.append('shop_photo', compressed);
      }
      if (formData.licensePhoto) {
        const compressed = await compressImage(formData.licensePhoto);
        payload.append('license_photo', compressed);
      }
      if (formData.aadhaarPhoto) {
        const compressed = await compressImage(formData.aadhaarPhoto);
        payload.append('aadhaar_photo', compressed);
      }
      if (formData.panPhoto) {
        const compressed = await compressImage(formData.panPhoto);
        payload.append('pan_photo', compressed);
      }
      if (formData.ownerPhoto) {
        const compressed = await compressImage(formData.ownerPhoto);
        payload.append('owner_photo', compressed);
      }
      
      await retailerSignup(payload);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Shop Details', icon: Store },
    { number: 3, title: 'License & Bank', icon: FileText },
    { number: 4, title: 'Documents', icon: Upload },
  ];

  const inputClass = "block w-full px-3 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zink-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
  const inputWithIconClass = "block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src="/images/logo.png" alt="Helo-Med" className="w-24 h-24 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Join Helo-Med</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Complete registration to start selling</p>
          </div>

          <div className="flex justify-center items-start mb-12">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center relative" style={{width: '140px'}}>
                <div className="flex items-center justify-center relative">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all z-10 ${currentStep >= step.number ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-400'}`}>
                    {currentStep > step.number ? <CheckCircle className="w-6 h-6" /> : <step.icon className="w-6 h-6" />}
                  </div>
                  {index < steps.length - 1 && <div className={`absolute left-1/2 w-[140px] h-0.5 transition-colors ${currentStep > step.number ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-600'}`} />}
                </div>
                <p className={`text-xs mt-2 font-medium text-center whitespace-nowrap ${currentStep >= step.number ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>{step.title}</p>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 border border-zinc-200 dark:border-zinc-700">
            {error && (
              <motion.div initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Owner Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input type="text" value={formData.ownerName} onChange={(e) => updateField('ownerName', e.target.value)} placeholder="Shop owner's full name" required className={inputWithIconClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" required className={inputWithIconClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address (Optional)</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className={inputWithIconClass} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Shop Name *</label>
                      <div className="relative">
                        <Store className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <input type="text" value={formData.shopName} onChange={(e) => updateField('shopName', e.target.value)} placeholder="e.g., ABC Medical Store" required className={inputWithIconClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                        <textarea value={formData.fullAddress} onChange={(e) => updateField('fullAddress', e.target.value)} placeholder="Complete shop address" required rows={3} className="block w-full pl-10 pr-3 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"><Hash className="inline w-4 h-4 mr-1" />Pincode *</label>
                        <input type="text" value={formData.pincode} onChange={(e) => updateField('pincode', e.target.value)} placeholder="751002" required className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">House/Shop No.</label>
                        <input type="text" value={formData.houseNumber} onChange={(e) => updateField('houseNumber', e.target.value)} placeholder="Shop 12" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Landmark</label>
                      <input type="text" value={formData.landmark} onChange={(e) => updateField('landmark', e.target.value)} placeholder="Near City Hospital" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Latitude</label>
                        <input type="number" step="any" value={formData.latitude} onChange={(e) => updateField('latitude', e.target.value)} placeholder="19.0760" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Longitude</label>
                        <input type="number" step="any" value={formData.longitude} onChange={(e) => updateField('longitude', e.target.value)} placeholder="72.8777" className={inputClass} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"><Clock className="inline w-4 h-4 mr-1" />Opening</label>
                        <input type="time" value={formData.openingTime} onChange={(e) => updateField('openingTime', e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"><Clock className="inline w-4 h-4 mr-1" />Closing</label>
                        <input type="time" value={formData.closingTime} onChange={(e) => updateField('closingTime', e.target.value)} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Shop Type</label>
                      <select value={formData.shopType} onChange={(e) => updateField('shopType', e.target.value)} className={inputClass}>
                        <option value="">Select type</option>
                        <option value="1">Allopathic</option>
                        <option value="2">Ayurvedic</option>
                        <option value="3">Homeopathic</option>
                        <option value="4">Hybrid</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Drug License Number</label>
                      <input type="text" value={formData.licenseNumber} onChange={(e) => updateField('licenseNumber', e.target.value)} placeholder="DL-1420-2012" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">GST Number</label>
                      <input type="text" value={formData.gstNumber} onChange={(e) => updateField('gstNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Aadhaar Number</label>
                        <input type="text" value={formData.aadhaarNumber} onChange={(e) => updateField('aadhaarNumber', e.target.value)} placeholder="12-digit" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">PAN Number</label>
                        <input type="text" value={formData.panNumber} onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())} placeholder="ABCDE1234F" className={inputClass} />
                      </div>
                    </div>
                    <hr className="border-zinc-200 dark:border-zinc-700" />
                    <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2"><CreditCard className="w-5 h-5" />Bank Account Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Holder Name</label>
                      <input type="text" value={formData.accountHolderName} onChange={(e) => updateField('accountHolderName', e.target.value)} placeholder="Full name" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Account Number</label>
                        <input type="text" value={formData.accountNumber} onChange={(e) => updateField('accountNumber', e.target.value)} placeholder="Account number" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">IFSC Code</label>
                        <input type="text" value={formData.ifscCode} onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())} placeholder="HDFC0001234" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"><Building2 className="inline w-4 h-4 mr-1" />Branch Name</label>
                      <input type="text" value={formData.branchName} onChange={(e) => updateField('branchName', e.target.value)} placeholder="Branch name" className={inputClass} />
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -20}} className="space-y-6">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Upload photos of documents (optional but recommended)</p>
                    <FileUploadField label="Shop Photo" file={formData.shopPhoto} onChange={(file) => handleFileUpload('shopPhoto', file)} />
                    <FileUploadField label="Drug License Photo" file={formData.licensePhoto} onChange={(file) => handleFileUpload('licensePhoto', file)} />
                    <FileUploadField label="Aadhaar Card Photo" file={formData.aadhaarPhoto} onChange={(file) => handleFileUpload('aadhaarPhoto', file)} />
                    <FileUploadField label="PAN Card Photo" file={formData.panPhoto} onChange={(file) => handleFileUpload('panPhoto', file)} />
                    <FileUploadField label="Owner Photo" file={formData.ownerPhoto} onChange={(file) => handleFileUpload('ownerPhoto', file)} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="flex-1 px-4 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-2 border-zinc-300 dark:border-zinc-600 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg hover:shadow-xl">
                    Next Step
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl">
                    {loading ? (<><Loader2 className="w-5 h-5 animate-spin" />Creating Account...</>) : 'Complete Registration'}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80 transition">Sign in</Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary transition">← Back to home</Link>
          </div>
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            <a href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
