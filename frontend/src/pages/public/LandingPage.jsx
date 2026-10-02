import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  GraduationCap, 
  Users, 
  Award, 
  CheckCircle2, 
  FileCheck, 
  Scale, 
  HandHelping, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Lock, 
  AlertTriangle,
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function LandingPage() {
  const steps = [
    { num: '01', title: 'Register Org', desc: 'Schools and NGOs create verified accounts' },
    { num: '02', title: 'Add Child', desc: 'Enter family, educational and income metrics' },
    { num: '03', title: 'Verify Info', desc: 'Review supporting certificates and ration cards' },
    { num: '04', title: 'Assess Risk', desc: 'Transparent rule engine computes vulnerability' },
    { num: '05', title: 'Match Schemes', desc: 'Compare profile against government criteria' },
    { num: '06', title: 'Get Guidance', desc: 'Review benefits, prerequisites and portal URLs' },
    { num: '07', title: 'Track Support', desc: 'Follow application progress until aid is delivered' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">InvisibleAid</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Research Project
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#how-it-works" className="hover:text-teal-600 transition-colors">How It Works</a>
            <a href="#why-it-matters" className="hover:text-teal-600 transition-colors">Why It Matters</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Key Features</a>
            <a href="#stakeholders" className="hover:text-teal-600 transition-colors">For Schools & NGOs</a>
            <a href="#transparency" className="hover:text-teal-600 transition-colors">Rule Engine</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-gray-700 hover:text-teal-600 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow"
            >
              School / NGO Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>MCA 3rd Semester Research Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Identify Vulnerability. <br />
                <span className="text-teal-600">Discover Support.</span> <br />
                Enable Education.
              </h1>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                InvisibleAid empowers schools, grassroots NGOs, and social workers to identify economically vulnerable children through transparent rule-based metrics and connect them with eligible government welfare and scholarship programs.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:shadow-lg text-base"
                >
                  <span>Explore Live Demo</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3.5 rounded-xl border border-gray-200 shadow-sm transition-colors text-base"
                >
                  <span>View Methodology</span>
                </a>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> 100% Rule-Based & Explainable
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Role-Based Access (School/NGO/Admin)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Government Scheme Matcher
                </span>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
                      AS
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Aarav Sharma</div>
                      <div className="text-[11px] text-gray-400">BEN-2024-001 • Age 8 • Grade 3</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">
                    HIGH VULNERABILITY
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Vulnerability Score</span>
                    <span className="font-bold text-teal-700">78 / 100</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3.5 space-y-2 text-xs border border-gray-100">
                  <div className="font-semibold text-gray-700 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-teal-600" />
                    Key Triggered Factors:
                  </div>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500">✓</span> Monthly Income ₹3,500 &lt; ₹5,000 threshold
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500">✓</span> Large household (7 members, 1 earner)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-red-500">✓</span> BPL Ration Card verified
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    Matched Government Schemes:
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded-lg bg-teal-50/70 border border-teal-100 flex justify-between items-center">
                      <span className="font-medium text-teal-900 truncate">National Scholarship for EWS</span>
                      <span className="text-[10px] font-bold text-teal-700 uppercase">100% Match</span>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex justify-between items-center">
                      <span className="font-medium text-blue-900 truncate">Free Textbook & Uniform Scheme</span>
                      <span className="text-[10px] font-bold text-blue-700 uppercase">Eligible</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology / Workflow Visual */}
      <section id="how-it-works" className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">
              Operational Workflow
            </h2>
            <p className="text-3xl font-extrabold text-gray-900">
              From Child Registration to Aid Delivery
            </p>
            <p className="text-sm text-gray-600 mt-2">
              A 7-stage verifiable methodology designed for schools, NGOs, and project viva demonstration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-black text-teal-600 font-mono mb-2">
                    {s.num}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section id="why-it-matters" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                The Problem & Motivation
              </h2>
              <p className="text-3xl font-extrabold text-gray-900 leading-tight">
                Millions of Eligible Children Miss Out on Government Support
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                India offers numerous central and state scholarships, mid-day meal provisions, uniform assistance, and girl-child educational stipends. However, vulnerable families often lack awareness of eligibility criteria, required documentation, and deadlines.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                InvisibleAid bridges this critical information gap. By evaluating verifiable indicators such as parental employment stability, monthly household income, ration card categories, and school attendance, the system flags children at risk of educational dropout and provides immediate, targeted scheme pathways.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="text-3xl font-extrabold text-teal-700">₹0</div>
                <div className="text-xs font-bold text-gray-800 mt-1">Cost to Institutions</div>
                <p className="text-xs text-gray-500 mt-1">Free open decision-support software for schools and NGOs.</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-3xl font-extrabold text-blue-700">100%</div>
                <div className="text-xs font-bold text-gray-800 mt-1">Explainable Rules</div>
                <p className="text-xs text-gray-500 mt-1">No black-box ML. Every score is mathematically auditable.</p>
              </div>
              <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="text-3xl font-extrabold text-amber-700">15+</div>
                <div className="text-xs font-bold text-gray-800 mt-1">Configurable Rules</div>
                <p className="text-xs text-gray-500 mt-1">Covering income, family size, housing, and attendance.</p>
              </div>
              <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-3xl font-extrabold text-purple-700">3 Roles</div>
                <div className="text-xs font-bold text-gray-800 mt-1">Strict Access Control</div>
                <p className="text-xs text-gray-500 mt-1">School, NGO, and Admin data boundaries strictly enforced.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section id="features" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">
              System Capabilities
            </h2>
            <p className="text-3xl font-extrabold text-gray-900">
              Core Technical Features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Rule-Based Vulnerability Engine</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Applies multi-attribute scoring across income brackets, guardian employment, housing conditions, and ration card status to compute HIGH, MODERATE, or LOW risk.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Government Scheme Matching</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Automated filtering comparing age, education grade, gender, income limits, and accepted ration card categories against official scheme prerequisites.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Document Verification Workflow</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upload and inspect income certificates, bonafide letters, and ration cards with mandatory verification auditing and rejection reasoning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold">
                <HandHelping className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Application Support Tracking</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Follows child applications through Recommended, Guidance Provided, Application Submitted, and Support Delivered stages with timestamped history.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Multi-Step Beneficiary Wizard</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                7-step validated registration preventing cognitive overload: Basic Info, Education, Family, Ration Card, Socio-Economic, Documents, and Review.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-red-100 text-red-700 rounded-lg flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900">Role-Based Data Privacy</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Schools and NGOs can only access their managed children. System Administrators oversee scheme criteria, rule parameters, and comprehensive audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section: For Schools & For NGOs */}
      <section id="stakeholders" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Schools & Headmasters</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  Prevent school dropouts before students disenroll due to fees or lack of supplies.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  Quickly connect underprivileged students with free textbook and uniform grants.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  Generate institution-level compliance and vulnerability demographic reports.
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/login" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1">
                  School Login &rarr;
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">For NGOs & Field Social Workers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  Systematically profile slum and rural communities with structured data collection.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  Track scheme applications from certificate gathering to sanctioning.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  Verify documentation authenticity before forwarding to government departments.
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/login" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                  NGO Portal &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Disclaimer Box */}
      <section id="transparency" className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Research Ethics & Legal Non-Declaration Notice</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              InvisibleAid is an academic decision-support framework designed to assist educators and social workers in identifying students needing welfare interventions. It does not replace statutory government verification, issue legal poverty certificates, or disburse public funds directly. All eligibility recommendations are preliminary and subject to official departmental review per current government gazettes.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-lg">InvisibleAid</span>
          </div>
          <div className="text-xs text-slate-400 text-center md:text-right space-y-1">
            <p>MCA 3rd Semester Research Project: Poverty Identification & Education Scheme Recommendation</p>
            <p className="text-slate-500">Built with React, Django REST Framework, and MySQL / SQLite.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}