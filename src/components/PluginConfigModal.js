'use client'

import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';

const PluginConfigModal = ({ plugin, onSave, onClose }) => {
    
  const [formFields, setFormFields] = useState(plugin.plugin.config?.fields || [
    { type: 'text', label: 'FirstName', required: true, placeholder: 'your-name' },
    { type: 'email', label: 'Your Email', required: true, placeholder: 'your-email' },
    { type: 'text', label: 'Subject', required: false, placeholder: 'your-subject' },
    { type: 'textarea', label: 'Your Message', required: true, placeholder: 'your-message' }
  ]);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Drop-down Menu' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'file', label: 'File Upload' }
  ];

  const addField = () => {
    setFormFields([...formFields, {
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: 'placeholder'
    }]);
  };

  const removeField = (index) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateField = (index, updates) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormFields(newFields);
  };

  const handleSave = () => {
    onSave(
        {
            ...plugin,
            plugin: {
              ...plugin.plugin,
              config: {
                ...plugin.plugin?.config,
                fields: formFields
              }
            }
          }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Configure {plugin.title || 'Plugin'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Tabs */}
          <div className="border-b mb-4">
            <div className="flex space-x-4">
              <button className="px-4 py-2 border-b-2 border-blue-500 text-blue-500">Form</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Messages</button>
              <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Additional Settings</button>
            </div>
          </div>

          {/* Field Type Options */}
          <div className="mb-6 flex flex-wrap gap-2">
            {fieldTypes.map(type => (
              <button
                key={type.value}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {formFields.map((field, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <h3 className="font-medium">Field {index + 1}</h3>
                  <button
                    onClick={() => removeField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(index, { type: e.target.value })}
                      className="w-full border rounded p-2"
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Placeholder</label>
                    <input
                      type="text"
                      value={field.placeholder}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm">Required field</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addField}
            className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
          >
            <Plus size={16} className="mr-1" />
            Add Field
          </button>
        </div>

        <div className="border-t p-4 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PluginConfigModal;