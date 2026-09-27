import React, { useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import FormInput from '../../components/forms/FormInput';
import Toast from '../../components/common/Toast';

export default function SystemSettings() {
  const [showToast, setShowToast] = useState(false);

  return (
    <div>
      <PageHeader title="System Settings" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Vulnerability Thresholds">
           <div className="space-y-4">
              <FormInput label="High Vulnerability (Min Score)" name="high" defaultValue="70" type="number" />
              <FormInput label="Moderate Vulnerability (Min Score)" name="moderate" defaultValue="40" type="number" />
           </div>
        </Card>

        <Card title="System Configuration">
           <div className="space-y-4">
              <FormInput label="Assessment Engine Timeout (ms)" name="timeout" defaultValue="5000" type="number" />
              <FormInput label="Max Recommendations per Beneficiary" name="maxRecs" defaultValue="10" type="number" />
           </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
         <button onClick={() => setShowToast(true)} className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 font-medium">
           Save Settings
         </button>
      </div>

      {showToast && <Toast message="Settings saved successfully" type="success" onClose={() => setShowToast(false)} />}
    </div>
  );
}
