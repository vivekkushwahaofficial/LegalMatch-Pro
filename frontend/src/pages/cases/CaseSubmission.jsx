import { apiCall } from "../../api/apiConfig";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CaseSubmission = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Page 1: Case Details
    caseTitle: '',
    description: '',
    caseCategory: '',
    relatedKeywords: '',
    dateTime: '',
    caseLocation: '',
    userContactInfo: '',

    // Page 2: Other Party & Status
    otherPartyName: '',
    otherPartyLocation: '',
    otherPartyContactInfo: '',
    currentStatus: '',
    otherPartyRepresentative: '',

    // Criminal Specific
    investigatingOfficer: '',
    witnesses: '',
  });

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // File inputs (simulated)
  const [firFile, setFirFile] = useState(null);
  const [caseDocsFile, setCaseDocsFile] = useState(null);
  const firInputRef = useRef(null);
  const docsInputRef = useRef(null);

  const caseCategories = [
    'Family Law',
    'Criminal Law',
    'Civil Rights',
    'Property Dispute',
    'Consumer Complaint',
    'Labor / Employment',
    'Other',
  ];

  const currentStatuses = [
    'Not Started',
    'Investigation Ongoing',
    'FIR Filed',
    'Court Proceedings Initiated',
    'Pending Judgment',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e, setter, name) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const isCriminal = formData.caseCategory === 'Criminal Law';

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.caseTitle.trim()) newErrors.caseTitle = 'Case Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.caseCategory) newErrors.caseCategory = 'Case Category is required';
      if (!formData.relatedKeywords.trim()) newErrors.relatedKeywords = 'Keywords/Sub-categories are required';

      if (!formData.caseLocation.trim()) newErrors.caseLocation = 'Case Location is required';
      if (!formData.userContactInfo.trim()) newErrors.userContactInfo = 'User Contact Info is required';
    }

    if (step === 2) {
      if (!formData.otherPartyName.trim()) newErrors.otherPartyName = 'Other Party Name is required';
      if (!formData.otherPartyLocation.trim()) newErrors.otherPartyLocation = 'Other Party Location is required';
      if (!formData.currentStatus) newErrors.currentStatus = 'Current Status is required';

      if (isCriminal) {
        if (!formData.investigatingOfficer.trim()) newErrors.investigatingOfficer = 'Investigating Officer is required for Criminal cases';
      }
    }

    if (step === 3) {
      // Both documents are optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const [submittedCase, setSubmittedCase] = useState(null);

  const handleSubmitForm = async () => {

    if (!validateStep(currentStep)) return;

    setLoading(true);

    try {

      const data = {
        title: formData.caseTitle,
        description: formData.description,
        category: formData.caseCategory,
        location: formData.caseLocation,
        keywords: formData.relatedKeywords,
        status: formData.currentStatus,

        contactInfo: formData.userContactInfo,
        otherPartyName: formData.otherPartyName,
        otherPartyLocation: formData.otherPartyLocation,
        otherPartyContact: formData.otherPartyContactInfo,
        otherPartyRepresentative: formData.otherPartyRepresentative,
        investigatingOfficer: formData.investigatingOfficer,
        witnesses: formData.witnesses
      };

      const response = await apiCall("/cases", "POST", data);

      console.log("Case submitted:", response);

      setSubmittedCase(response);
      setSubmitted(true);

    } catch (error) {

      console.error("Error submitting case:", error);
      alert("Failed to submit case");

    } finally {

      setLoading(false);

    }
  };

  const steps = ['Case Details', 'Other Party & Status', 'Evidence', 'Review'];

  if (submitted && submittedCase) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 py-10">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Case Submitted Successfully!
          </h2>
          <p className="text-gray-500 text-sm">
            Case ID: <span className="font-bold text-indigo-600">#{submittedCase.id}</span> — Status: <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">{submittedCase.status}</span>
          </p>
        </div>

        {/* Submitted Case Details Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4 border-b pb-2">Submitted Case Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-500">Title</span>
                <span className="text-gray-900 font-medium">{submittedCase.title}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-900 font-medium">{submittedCase.category}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-500">Keywords</span>
                <span className="text-gray-900 font-medium">{submittedCase.keywords}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 font-medium">{submittedCase.location}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Contact</span>
                <span className="text-gray-900 font-medium">{submittedCase.contactInfo}</span>
              </div>
            </div>

            <div className="space-y-3">
              {submittedCase.otherPartyName && (
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-500">Other Party</span>
                  <span className="text-gray-900 font-medium">{submittedCase.otherPartyName}</span>
                </div>
              )}
              {submittedCase.otherPartyLocation && (
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-500">Other Party Location</span>
                  <span className="text-gray-900 font-medium">{submittedCase.otherPartyLocation}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-50 pb-1">
                <span className="text-gray-500">Status</span>
                <span className="text-gray-900 font-medium">{submittedCase.status}</span>
              </div>
              {submittedCase.investigatingOfficer && (
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-500">Inv. Officer</span>
                  <span className="text-gray-900 font-medium">{submittedCase.investigatingOfficer}</span>
                </div>
              )}
              {submittedCase.witnesses && (
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">Witnesses</span>
                  <span className="text-gray-900 font-medium">{submittedCase.witnesses}</span>
                </div>
              )}
            </div>
          </div>

          {submittedCase.description && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Description</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{submittedCase.description}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/citizen/matches")}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            🤝 View Matches for This Case
          </button>

          <button
            onClick={() => navigate("/citizen/cases")}
            className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            📂 View Previous Cases
          </button>

          <button
            onClick={() => navigate("/citizen")}
            className="flex-1 px-6 py-3 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    );
  }


  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Case Submission</h1>
          <p className="text-gray-500 text-sm">Fill in the necessary details to submit your case.</p>
        </div>
        <button
          onClick={() => navigate("/citizen/cases")}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap w-full sm:w-auto text-center"
        >
          📂 View Previous Cases
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {steps.map((stepLabel, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isComplete = stepNum < currentStep;
          return (
            <div key={stepLabel} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                ${isComplete || isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {isComplete ? '✓' : stepNum}
              </div>
              <span className={`ml-2 text-xs font-medium hidden sm:inline ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>{stepLabel}</span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${isComplete ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Case Details */}
      {currentStep === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Case Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Title <span className="text-red-500">*</span>
              </label>
              <input
                name="caseTitle"
                value={formData.caseTitle}
                onChange={handleChange}
                type="text"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.caseTitle ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.caseTitle && <p className="text-xs text-red-500 mt-1">{errors.caseTitle}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (What Happened) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Category <span className="text-red-500">*</span>
              </label>
              <select
                name="caseCategory"
                value={formData.caseCategory}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.caseCategory ? 'border-red-400' : 'border-gray-300'}`}
              >
                <option value="">Select category</option>
                {caseCategories.map(ct => <option key={ct} value={ct}>{ct}</option>)}
              </select>
              {errors.caseCategory && <p className="text-xs text-red-500 mt-1">{errors.caseCategory}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Keywords / Sub Categories <span className="text-red-500">*</span>
              </label>
              <input
                name="relatedKeywords"
                type="text"
                placeholder="e.g. Fraud, Property, Cyber"
                value={formData.relatedKeywords}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.relatedKeywords ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.relatedKeywords && <p className="text-xs text-red-500 mt-1">{errors.relatedKeywords}</p>}
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Case Location <span className="text-red-500">*</span>
              </label>
              <input
                name="caseLocation"
                type="text"
                placeholder="City, State"
                value={formData.caseLocation}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.caseLocation ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.caseLocation && <p className="text-xs text-red-500 mt-1">{errors.caseLocation}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Info (User) <span className="text-red-500">*</span>
              </label>
              <input
                name="userContactInfo"
                type="text"
                placeholder="Phone number or Email"
                value={formData.userContactInfo}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.userContactInfo ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.userContactInfo && <p className="text-xs text-red-500 mt-1">{errors.userContactInfo}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Other Party & Status */}
      {currentStep === 2 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Other Party & Case Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Party Name <span className="text-red-500">*</span>
              </label>
              <input
                name="otherPartyName"
                value={formData.otherPartyName}
                onChange={handleChange}
                type="text"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.otherPartyName ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.otherPartyName && <p className="text-xs text-red-500 mt-1">{errors.otherPartyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (Other Party) <span className="text-red-500">*</span>
              </label>
              <input
                name="otherPartyLocation"
                value={formData.otherPartyLocation}
                onChange={handleChange}
                type="text"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.otherPartyLocation ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.otherPartyLocation && <p className="text-xs text-red-500 mt-1">{errors.otherPartyLocation}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Info (Other Party) <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                name="otherPartyContactInfo"
                value={formData.otherPartyContactInfo}
                onChange={handleChange}
                type="text"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Party Representative <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                name="otherPartyRepresentative"
                value={formData.otherPartyRepresentative}
                onChange={handleChange}
                type="text"
                placeholder="Lawyer / representative name"
                className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Status of the Case <span className="text-red-500">*</span>
              </label>
              <select
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.currentStatus ? 'border-red-400' : 'border-gray-300'}`}
              >
                <option value="">Select current status</option>
                {currentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.currentStatus && <p className="text-xs text-red-500 mt-1">{errors.currentStatus}</p>}
            </div>

            {/* Criminal Specific Fields */}
            {isCriminal && (
              <div className="md:col-span-2 bg-red-50 p-4 rounded-md border border-red-100 mt-2 space-y-4">
                <h3 className="font-semibold text-red-800 text-sm">Criminal Case Required Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Investigating Officer <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="investigatingOfficer"
                      value={formData.investigatingOfficer}
                      onChange={handleChange}
                      type="text"
                      className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.investigatingOfficer ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {errors.investigatingOfficer && <p className="text-xs text-red-500 mt-1">{errors.investigatingOfficer}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Witnesses <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      name="witnesses"
                      value={formData.witnesses}
                      onChange={handleChange}
                      type="text"
                      placeholder="Names/Contact of witnesses"
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Evidence */}
      {currentStep === 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Evidence & Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FIR Upload */}
            <div className="border border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <h3 className="text-sm font-semibold mb-2">
                FIR Document <span className="text-gray-400 font-normal">(Optional)</span>
              </h3>
              <p className="text-gray-400 text-xs mb-4">First Information Report (PDF, JPG)</p>
              <input
                type="file"
                className="hidden"
                ref={firInputRef}
                onChange={(e) => handleFileChange(e, setFirFile, 'firFile')}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <button
                type="button"
                onClick={() => firInputRef.current.click()}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 shadow-sm rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {firFile ? 'Change FIR' : 'Upload FIR'}
              </button>
              {firFile && <p className="mt-3 text-xs text-indigo-600 font-medium truncate px-4">{firFile.name}</p>}
              {errors.firFile && <p className="mt-2 text-xs text-red-500">{errors.firFile}</p>}
            </div>

            {/* Case Documents Upload */}
            <div className="border border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <h3 className="text-sm font-semibold mb-2">
                Case Documents <span className="text-gray-400 font-normal">(Optional)</span>
              </h3>
              <p className="text-gray-400 text-xs mb-4">Charge Sheets, Legal Notices, etc. (PDF, ZIP)</p>
              <input
                type="file"
                className="hidden"
                ref={docsInputRef}
                onChange={(e) => handleFileChange(e, setCaseDocsFile, 'caseDocsFile')}
                accept=".pdf,.zip,.jpg,.jpeg,.png"
              />
              <button
                type="button"
                onClick={() => docsInputRef.current.click()}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 shadow-sm rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {caseDocsFile ? 'Change Documents' : 'Upload Documents'}
              </button>
              {caseDocsFile && <p className="mt-3 text-xs text-indigo-600 font-medium truncate px-4">{caseDocsFile.name}</p>}
              {errors.caseDocsFile && <p className="mt-2 text-xs text-red-500">{errors.caseDocsFile}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Review Your Submission</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="space-y-3">
              <h3 className="text-gray-900 font-semibold mb-2 bg-gray-50 p-2 rounded">Case Info</h3>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Title</span>
                <span className="text-gray-900 font-medium">{formData.caseTitle}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Category</span>
                <span className="text-gray-900 font-medium">{formData.caseCategory}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Keywords</span>
                <span className="text-gray-900 font-medium truncate max-w-[120px]" title={formData.relatedKeywords}>{formData.relatedKeywords}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 font-medium">{formData.caseLocation}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-500">Contact</span>
                <span className="text-gray-900 font-medium">{formData.userContactInfo}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-gray-900 font-semibold mb-2 bg-gray-50 p-2 rounded">Other Party & Status</h3>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Name</span>
                <span className="text-gray-900 font-medium">{formData.otherPartyName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-900 font-medium">{formData.otherPartyLocation}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Status</span>
                <span className="text-gray-900 font-medium">{formData.currentStatus}</span>
              </div>

              {isCriminal && (
                <>
                  <div className="flex justify-between border-b border-gray-100 pb-1 text-red-700">
                    <span className="text-gray-500">Inv. Officer</span>
                    <span className="font-medium">{formData.investigatingOfficer}</span>
                  </div>
                  <div className="flex justify-between pb-1 text-red-700">
                    <span className="text-gray-500">Witnesses</span>
                    <span className="font-medium">{formData.witnesses || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-gray-900 font-semibold mb-2 bg-gray-50 p-2 rounded">Description & Evidence</h3>
            <p className="text-gray-700 mt-2 mb-4 whitespace-pre-wrap">{formData.description}</p>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                {firFile ? firFile.name : 'FIR Missing'}
              </div>
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                {caseDocsFile ? caseDocsFile.name : 'Docs Missing'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-md text-sm font-medium border transition-colors
                        ${currentStep === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
        >
          Back
        </button>
        <div className="flex gap-3">
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitForm}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              {loading ? "Submitting..." : "Submit Case Match"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseSubmission;
