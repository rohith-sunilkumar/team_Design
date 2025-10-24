import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { reportAPI } from '../utils/api';
import { Upload, MapPin, AlertCircle, CheckCircle, Sparkles, X, Building2 } from 'lucide-react';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    department: ''
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          coordinates: [position.coords.longitude, position.coords.latitude]
        });
        setGettingLocation(false);
      },
      (error) => {
        setError('Unable to get your location. Please enter address manually.');
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Add department if selected
      if (formData.department) {
        formDataToSend.append('category', formData.department);
      }
      
      if (location) {
        formDataToSend.append('location', JSON.stringify({
          coordinates: location.coordinates,
          address: formData.address
        }));
      } else if (formData.address) {
        formDataToSend.append('location', JSON.stringify({
          address: formData.address
        }));
      }

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await reportAPI.create(formDataToSend);
      
      setSuccess({
        reportId: response.data.data.report._id,
        category: response.data.data.aiClassification.category,
        priority: response.data.data.aiClassification.priority,
        confidence: response.data.data.aiClassification.confidence
      });

      // Reset form
      setFormData({ title: '', description: '', address: '' });
      setImages([]);
      setImagePreviews([]);
      setLocation(null);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/my-reports');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="card text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-900/30 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-4">Report Submitted Successfully!</h2>
            <p className="text-gray-300 mb-6">
              Your report has been received and processed by our AI system.
            </p>
            
            <div className="bg-violet-900/30 border border-violet-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-violet-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-100">AI Classification Results</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Category</p>
                  <p className="font-semibold text-violet-400 capitalize">{success.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Priority</p>
                  <p className="font-semibold text-violet-400 capitalize">{success.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Confidence</p>
                  <p className="font-semibold text-violet-400">{(success.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Report ID: <span className="font-mono font-semibold">{success.reportId}</span>
            </p>

            <p className="text-gray-300">
              Redirecting to your reports...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-3xl font-bold gradient-text mb-2">Report an Issue</h2>
          <p className="text-gray-300 mb-8">
            Help us improve the city by reporting civic issues. Our AI will automatically categorize your report.
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Large pothole on Main Street"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="5"
                placeholder="Describe the issue in detail..."
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                💡 Our AI will analyze this description to categorize and prioritize your report
              </p>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building2 className="inline h-4 w-4 mr-1" />
                Department (Optional)
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Let AI decide automatically</option>
                <option value="Road Service Department">Road Service Department</option>
                <option value="Hospital Emergency Department">Hospital Emergency Department</option>
                <option value="Water Management Department">Water Management Department</option>
                <option value="Electrical Service Department">Electrical Service Department</option>
                <option value="General Department">General Department</option>
              </select>
              <p className="text-sm text-gray-400 mt-1">
                💡 If you know which department should handle this, select it. Otherwise, our AI will automatically assign it.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={gettingLocation}
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <MapPin className="h-5 w-5" />
                  <span>{gettingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
                </button>
                
                {location && (
                  <div className="bg-green-900/30 border border-green-500/30 text-green-200 px-4 py-2 rounded-lg text-sm">
                    ✓ Location captured: {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
                  </div>
                )}

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Or enter address manually"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Photos (Optional, max 5)
              </label>
              
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-300">Click to upload images</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg"
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
