import React, { useState, useEffect, useRef, useCallback } from 'react';
import CreatableSelect from 'react-select/creatable';
import { X, Paperclip, Send, Save } from 'lucide-react';
import { fetchUsers, fetchUserById } from './MessageData'; // Import our mock data functions

// Removed the predefined recipientOptions array as per request.
// Students will now only message individual teachers or students.

// Helper function to debounce an API call
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

function ComposeMessage({ onClose, onSend, onSaveDraft, replyTo }) {
  const [formData, setFormData] = useState({
    subject: replyTo ? `Re: ${replyTo.subject}` : '',
    content: replyTo ? `\n\n---- Original Message ----\n${replyTo.content}` : '',
    recipients: replyTo
      ? [{ value: replyTo.sender, label: replyTo.sender }] // Assuming replyTo.sender is an ID or recognizable label
      : [],
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [individualRecipientOptions, setIndividualRecipientOptions] = useState([]); // State for dynamically loaded options
  const [isLoadingOptions, setIsLoadingOptions] = useState(false); // State for loading indicator

  // Debounced function for loading individual recipients
  const loadIndividualRecipients = useCallback(
    debounce(async (inputValue, callback) => {
      setIsLoadingOptions(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const users = fetchUsers(inputValue); // Use fetchUsers to get suggestions (already filtered by type)
      const options = users.map(user => ({
        value: user.id,
        label: `${user.name} (${user.id}) - ${user.type}`
      }));
      callback(options);
      setIsLoadingOptions(false);
    }, 500),
    []
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.content.trim()) newErrors.content = 'Message content is required';
    if (formData.recipients.length === 0) newErrors.recipients = 'At least one recipient is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRecipientsChange = (selectedOptions, actionMeta) => {
    if (actionMeta.action === 'create-option') {
      const newInputValue = actionMeta.option.value; // The value typed by the user
      const foundUser = fetchUserById(newInputValue); // Try to find by exact ID (already type-filtered)

      if (foundUser) {
        // If found, replace the raw typed option with the properly formatted user object
        const newRecipient = {
          value: foundUser.id,
          label: `${foundUser.name} (${foundUser.id}) - ${foundUser.type}`
        };
        setFormData(prev => ({
          ...prev,
          // Filter out the raw typed option and add the new formatted one
          recipients: [...selectedOptions.filter(opt => opt.value !== newInputValue), newRecipient]
        }));
      } else {
        // If not found by ID or type is not allowed for students
        console.error(`Invalid User ID or unauthorized recipient type: "${newInputValue}". Students can only message Teachers and other Students.`);
        // Remove the invalid option from the selected list
        setFormData(prev => ({
          ...prev,
          recipients: selectedOptions.filter(opt => opt.value !== newInputValue)
        }));
      }
    } else {
      // For selecting existing options or removing options
      setFormData(prev => ({ ...prev, recipients: selectedOptions }));
    }
    setErrors(prev => ({ ...prev, recipients: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files.map(file => file.name)]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (asDraft = false) => {
    if (!asDraft && !validateForm()) return;

    setIsSending(true);

    const messageData = {
      ...formData,
      recipients: formData.recipients.map(r => r.value) // Send only the value (ID) to the parent
    };

    if (asDraft) {
      onSaveDraft(messageData);
    } else {
      onSend(messageData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"> {/* Added flex flex-col here */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4"> {/* Header */}
          <h2 className="text-lg font-medium text-gray-900">New Message</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main content area - now flex-grow and scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1"> {/* Removed maxHeight, added flex-1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To *</label>
            <CreatableSelect
              isMulti
              options={[]} // No predefined group options
              value={formData.recipients}
              onChange={handleRecipientsChange}
              placeholder="Type individual Teacher or Student ID/name (e.g., T001, S101)..."
              className={`basic-select ${errors.recipients ? 'border-red-500' : ''}`}
              classNamePrefix="select"
              formatCreateLabel={(inputValue) => `Add individual: "${inputValue}"`}
              loadOptions={loadIndividualRecipients} // Still loads suggestions as user types
              isValidNewOption={(inputValue, selectValue, selectOptions) => {
                if (!inputValue) return false;
                const exists = selectOptions.some(option => option.value.toLowerCase() === inputValue.toLowerCase());
                return !exists;
              }}
              isLoading={isLoadingOptions}
            />
            {errors.recipients && <p className="mt-1 text-sm text-red-600">{errors.recipients}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Message subject"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Write your message here..."
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div className="flex items-center">
              <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                <Paperclip size={16} className="mr-2" />
                Add Files
                <input type="file" className="sr-only" onChange={handleFileChange} multiple />
              </label>
              <span className="ml-2 text-sm text-gray-500">Max 5MB per file</span>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer - now always visible at the bottom of the flex column */}
        <div className="flex justify-between items-center border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={() => handleSubmit(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save size={16} className="mr-2" />
              Save Draft
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
            >
              {isSending ? 'Sending...' : (
                <>
                  <Send size={16} className="mr-2" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComposeMessage;
