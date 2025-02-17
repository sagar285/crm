import { useState } from "react";

 function PluginModal({ plugin, onClose }) {
  const [fields, setFields] = useState([]);

  const handleAddField = (type) => {
    setFields([...fields, { type, value: "" }]);
  };

  const handleChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Configure {plugin.pluginId}</h2>

        {/* Dynamic Input Fields */}
        {fields.map((field, index) => (
          <input
            key={index}
            type={field.type}
            value={field.value}
            onChange={(e) => handleChange(index, e.target.value)}
            className="block border p-2 rounded w-full mb-2"
            placeholder={`Enter ${field.type}`}
          />
        ))}

        {/* Add Field Options */}
        <button onClick={() => handleAddField("text")} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Add Text Field</button>
        <button onClick={() => handleAddField("email")} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Add Email Field</button>

        {/* Close Button */}
        <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md ml-4">Close</button>
      </div>
    </div>
  );
}


export default function PluginPage({ plugin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Plugin Configuration</h1>

      {/* Check if plugin exists */}
      {plugin ? (
        <>
          <p>Plugin ID: {plugin.pluginId}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Configure Plugin
          </button>
        </>
      ) : (
        <p className="text-red-500">No plugin installed.</p>
      )}

      {isModalOpen && <PluginModal plugin={plugin} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
