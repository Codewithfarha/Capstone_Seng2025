import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, Package, ArrowLeft, BookOpen, Search, Code } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // Password strength validation function
  const validatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    
    return {
      requirements,
      score,
      isStrong: score >= 4 && requirements.length
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = validatePasswordStrength(formData.password);
      if (formData.password.length < 12) {
        newErrors.password = 'Password must be at least 12 characters';
      } else if (!strength.isStrong) {
        newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignup = async () => {
    setSignupError('');
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL || null,
          preferences: {
            notifications: true,
            theme: 'light'
          }
        });
      }

      // Store user data in localStorage
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'User',
        photoURL: user.photoURL || null,
        role: 'user'
      };
      localStorage.setItem('user', JSON.stringify(userData));

      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (error) {
      console.error('Google signup error:', error);
      
      let errorMessage = 'Failed to sign up with Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-up cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked. Please allow popups for this site';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Account already exists with different sign-in method';
          break;
        default:
          errorMessage = 'Failed to sign up with Google';
      }
      
      setSignupError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.name
      });

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        emailVerified: false,
        preferences: {
          notifications: true,
          theme: 'light'
        }
      });

      setSignupSuccess(true);
      setShowVerificationMessage(true);

      await auth.signOut();

      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Something went wrong';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = 'Failed to create account';
      }
      
      setSignupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl border border-orange-200 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-4 rounded-full shadow-lg">
                <Mail className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Check Your Email!
            </h2>
            
            <p className="text-gray-600 mb-6 text-lg">
              We've sent a verification link to:
            </p>
            
            <p className="text-orange-600 font-semibold text-lg mb-6">
              {formData.email}
            </p>
            
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-800 text-sm">
                Please click the link in your email to verify your account before logging in.
              </p>
            </div>

            <p className="text-gray-500 text-sm mb-6">
              Didn't receive the email? Check your spam folder.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 rounded-lg text-white font-semibold transition-all shadow-lg"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200">
          
          {/* Left Side - Info Section */}
          <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-12 flex flex-col justify-center text-white">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Package className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold">LibraryFinder</h1>
              </div>
              
              <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                Join Us Today!
              </h2>
              <p className="text-2xl text-rose-50 leading-relaxed">
                Create your free account and start discovering amazing libraries.
              </p>
            </div>

            {/* Decorative Feature Icons */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm inline-block mb-3">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-rose-50">Browse Libraries</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm inline-block mb-3">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-rose-50">Smart Search</p>
              </div>

              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm inline-block mb-3">
                  <Code className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium text-rose-50">Code Examples</p>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Fill in your details to get started
                </p>
              </div>

              {/* Alerts */}
              {signupError && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-700 text-sm">{signupError}</span>
                </div>
              )}

              {signupSuccess && (
                <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-700 text-sm">Account created! Redirecting...</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border-2 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium`}
                      placeholder="Enter your name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-orange-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-4 py-3 border-2 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-orange-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border-2 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const strength = validatePasswordStrength(formData.password);
                          return (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all ${
                                strength.score >= level
                                  ? strength.score <= 2
                                    ? 'bg-red-500'
                                    : strength.score === 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className={`flex items-center gap-2 ${
                          validatePasswordStrength(formData.password).requirements.length ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                            validatePasswordStrength(formData.password).requirements.length ? 'border-green-600 bg-green-50' : 'border-gray-300'
                          }`}>
                            {validatePasswordStrength(formData.password).requirements.length && '✓'}
                          </div>
                          At least 12 characters
                        </div>
                        <div className={`flex items-center gap-2 ${
                          validatePasswordStrength(formData.password).requirements.uppercase ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                            validatePasswordStrength(formData.password).requirements.uppercase ? 'border-green-600 bg-green-50' : 'border-gray-300'
                          }`}>
                            {validatePasswordStrength(formData.password).requirements.uppercase && '✓'}
                          </div>
                          One uppercase letter
                        </div>
                        <div className={`flex items-center gap-2 ${
                          validatePasswordStrength(formData.password).requirements.lowercase ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                            validatePasswordStrength(formData.password).requirements.lowercase ? 'border-green-600 bg-green-50' : 'border-gray-300'
                          }`}>
                            {validatePasswordStrength(formData.password).requirements.lowercase && '✓'}
                          </div>
                          One lowercase letter
                        </div>
                        <div className={`flex items-center gap-2 ${
                          validatePasswordStrength(formData.password).requirements.number ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                            validatePasswordStrength(formData.password).requirements.number ? 'border-green-600 bg-green-50' : 'border-gray-300'
                          }`}>
                            {validatePasswordStrength(formData.password).requirements.number && '✓'}
                          </div>
                          One number
                        </div>
                        <div className={`flex items-center gap-2 ${
                          validatePasswordStrength(formData.password).requirements.special ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center text-xs ${
                            validatePasswordStrength(formData.password).requirements.special ? 'border-green-600 bg-green-50' : 'border-gray-300'
                          }`}>
                            {validatePasswordStrength(formData.password).requirements.special && '✓'}
                          </div>
                          One special character (!@#$%^&*)
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-orange-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-12 py-3 border-2 ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || signupSuccess}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600 rounded-lg text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || signupSuccess}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                {isGoogleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                    Signing up with Google...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;