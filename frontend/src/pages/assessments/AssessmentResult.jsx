import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import { assessmentAPI, beneficiaryAPI } from '../../services/api';
import { ArrowLeft, Award, CheckCircle2, XCircle, Scale } from 'lucide-react';

export default function AssessmentResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    beneficiaryAPI.getById(id)
      .then(detail => {
        setBeneficiary(detail);
        if (detail.latest_assessment && detail.latest_assessment.id) {
          return assessmentAPI.getResult(detail.latest_assessment.id);
        }
        return null;
      })
      .then(result => {
        setAssessment(result);
      })
      .catch(apiError => setError(apiError.message || 'Unable to load assessment.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading assessment...</div>;
  if (error || !assessment) return <div className="p-6 text-sm text-red-700">{error || 'No assessment recorded. Run an assessment from the beneficiary profile.'}</div>;
  const score = assessment.score_percentage ?? (assessment.max_score ? Math.round((assessment.total_score / assessment.max_score) * 100) : assessment.total_score);
  const factors = assessment.factors || [];
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Vulnerability Assessment Result" 
        subtitle={`Backend assessment for ${assessment.beneficiary_name || beneficiary?.name || 'beneficiary'}`} 
        actions={[
          { label: 'Back to Profile', icon: ArrowLeft, onClick: () => navigate(`/beneficiaries/${id}`), variant: 'outline' }, 
          { label: 'View Schemes', icon: Award, onClick: () => navigate(`/schemes/recommendations/${id}`), variant: 'primary' }
        ]} 
      />
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{assessment.beneficiary_name || beneficiary?.name}</h2>
            <p className="text-sm text-gray-500 mt-1">Assessed {new Date(assessment.assessed_at).toLocaleString()}</p>
          </div>
          <span className={`px-4 py-2 rounded-xl h-fit text-base font-extrabold ${assessment.vulnerability_level === 'HIGH' ? 'bg-red-100 text-red-700' : assessment.vulnerability_level === 'MODERATE' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
            {assessment.vulnerability_level} VULNERABILITY
          </span>
        </div>
        <div className="py-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Score</span>
            <span className="text-xl font-extrabold text-teal-700">{score} / 100</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div className="h-full rounded-full bg-teal-600" style={{ width: `${score}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-bold">Contributing Factors</h3>
        </div>
        <div className="space-y-3">
          {factors.map(factor => (
            <div key={factor.id} className={`p-4 rounded-xl border flex items-start gap-3 ${factor.triggered ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50'}`}>
              {factor.triggered ? <CheckCircle2 className="w-5 h-5 text-red-600" /> : <XCircle className="w-5 h-5 text-gray-400" />}
              <div>
                <div className="font-bold text-sm">
                  {factor.rule_details?.name || `Rule ${factor.rule}`} {factor.triggered && <span className="ml-2 text-xs text-red-700">+{factor.score_awarded} pts</span>}
                </div>
                <p className="text-xs text-gray-700 mt-1">{factor.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
