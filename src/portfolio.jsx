import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronDown, Copy, ExternalLink, Github, Mail, 
  MapPin, Phone, Calendar, Award, Code, Database, Cloud, 
  Star, Download, Send, Terminal, Cpu, Server, BookOpen, FileText 
} from 'lucide-react';

// Modern color palette
const colors = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  secondary: 'bg-gradient-to-r from-cyan-500 to-blue-600',
  accent: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  dark: 'bg-gray-900',
  darker: 'bg-gray-950',
  light: 'bg-gray-100',
  card: 'bg-gray-800/50',
  border: 'border-gray-700',
  text: 'text-gray-300',
  textLight: 'text-gray-400',
  textDark: 'text-gray-900',
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500'
};

// Reusable components
const Badge = ({ children, type = 'info', className = '' }) => {
  const typeClasses = {
    success: 'bg-emerald-500/20 text-emerald-400',
    error: 'bg-rose-500/20 text-rose-400',
    warning: 'bg-amber-500/20 text-amber-400',
    info: 'bg-blue-500/20 text-blue-400',
    primary: 'bg-indigo-500/20 text-indigo-400',
    secondary: 'bg-cyan-500/20 text-cyan-400',
    accent: 'bg-emerald-500/20 text-emerald-400',
    dark: 'bg-gray-800 text-gray-300'
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeClasses[type]} ${className}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '', hoverable = true }) => {
  return (
    <div className={`rounded-xl border ${colors.border} ${colors.card} backdrop-blur-sm 
      ${hoverable ? 'hover:border-gray-600 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
};

const JSONResponse = ({ children }) => (
  <Card className="p-0 overflow-hidden">
    <pre className={`p-6 font-mono text-sm overflow-x-auto ${colors.textLight}`}>
      {children}
    </pre>
  </Card>
);

const MethodBadge = ({ method }) => {
  const methodColors = {
    GET: 'bg-emerald-500/20 text-emerald-400',
    POST: 'bg-blue-500/20 text-blue-400',
    PUT: 'bg-amber-500/20 text-amber-400',
    DELETE: 'bg-rose-500/20 text-rose-400',
    PATCH: 'bg-purple-500/20 text-purple-400'
  };
  
  return (
    <Badge type={method.toLowerCase()} className="font-mono">
      {method}
    </Badge>
  );
};

const StatusBadge = ({ status }) => {
  const statusType = status === '200' ? 'success' : 
                    status.startsWith('4') ? 'error' : 
                    status.startsWith('5') ? 'error' : 'info';
  
  return <Badge type={statusType}>{status}</Badge>;
};

const Endpoint = ({ method, path, description, children, id }) => {
  const [isActive, setIsActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyEndpoint = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://api.developer-portfolio.dev${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="p-5 cursor-pointer flex items-start justify-between"
        onClick={() => setIsActive(!isActive)}
      >
        <div className="flex items-start space-x-4">
          <MethodBadge method={method} />
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <code className={`font-mono font-medium ${colors.text}`}>{path}</code>
              <button
                onClick={copyEndpoint}
                className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                aria-label="Copy endpoint"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-emerald-400' : colors.textLight}`} />
              </button>
            </div>
            <p className={`mt-1 text-sm ${colors.textLight}`}>{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status="200" />
          {isActive ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="px-5 pb-5 border-t border-gray-700/50">
          <div className="mt-4 space-y-4">
            <h4 className="flex items-center text-sm font-medium text-emerald-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              Response (200 OK)
            </h4>
            {children}
          </div>
        </div>
      )}
    </Card>
  );
};

const TypingAnimation = ({ phrases }) => {
  const [typedText, setTypedText] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    let timeout;
    const currentText = phrases[currentPhrase];
    
    if (typedText.length < currentText.length) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length + 1));
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setTypedText('');
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      }, 2000);
    }
    
    return () => clearTimeout(timeout);
  }, [typedText, currentPhrase]);

  return (
    <div className="flex items-center">
      <span className="text-gray-500 font-mono">$ curl -X </span>
      <span className="text-emerald-400 font-mono">{typedText}</span>
      <span className="animate-pulse">|</span>
    </div>
  );
};

const APIPortfolio = () => {
  const apiEndpoints = [
    'GET /developer/info',
    'GET /developer/skills', 
    'GET /developer/experience',
    'GET /developer/projects'
  ];

  return (
    <div className={`min-h-screen ${colors.darker} text-gray-300`}>
      {/* Subtle grid background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block p-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl mb-8">
            <div className="bg-gray-950 rounded-lg px-8 py-6">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                Developer Portfolio API
              </h1>
              <p className="mt-3 text-lg text-gray-400">RESTful Interface v2.1</p>
            </div>
          </div>
          
          <div className="mb-8 flex flex-col items-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700 mb-4">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400">Base URL:</span>
              <code className="font-mono text-emerald-400">
                https://api.developer-portfolio.dev
              </code>
            </div>

            {/* Typing animation */}
            <Card className="inline-flex flex-col items-start p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <TypingAnimation phrases={apiEndpoints} />
            </Card>

            {/* Auth info */}
            <Card className="inline-block p-6 max-w-2xl text-left">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <h3 className="text-emerald-400 font-semibold">🔑 Authentication</h3>
              </div>
              <p className="text-gray-400">
                No authentication required for public endpoints. Rate limited to 1000 requests/hour.
                <span className="block mt-2 text-sm text-gray-500">
                  <Cpu className="inline mr-1 w-4 h-4" /> Powered by Cloudflare
                </span>
              </p>
            </Card>
          </div>
        </header>

        {/* Endpoints */}
        <main className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-400" />
            API Endpoints
          </h2>

          {/* Personal Info */}
          <Endpoint 
            method="GET" 
            path="/developer/info" 
            description="Retrieve basic developer information and contact details"
            id="info"
          >
            <JSONResponse>
{`{
  "name": "Sunil Poudel",
  "title": "Senior Backend Developer",
  "location": "Pokhara, Nepal",
  "email": "contact@poudelsunil.info.np",
  
  "linkedin": "https://www.linkedin.com/in/pasive/",
  "github": "https://github.com/0xpasive",
  
  "years_experience": 1,
  "availability": "Open to opportunities",
  "timezone": "GMT+5:45",
  "preferred_contact": "email",
  "response_time": "24-48 hours"
}`}
            </JSONResponse>
          </Endpoint>

          {/* Skills */}
          <Endpoint 
            method="GET" 
            path="/developer/skills" 
            description="Get comprehensive list of technical skills and proficiency levels"
            id="skills"
          >
            <JSONResponse>
{`{
  "programming_languages": [
    {
      "name": "Python",
      "proficiency": 95,
      "years_experience": 6,
      "frameworks": ["Django", "Flask", "FastAPI"]
    },
    {
      "name": "JavaScript/Node.js",
      "proficiency": 90,
      "years_experience": 5,
      "frameworks": ["Express.js", "Nest.js"]
    }
  ],
  "databases": {
    "relational": [ "MySQL"],
    "nosql": ["MongoDB"]
  },
  "cloud_platforms": {
    "aws": {
      "services": ["EC2", "S3", "Lambda", "RDS", "API Gateway"],
      "proficiency": 90
    }
  }
}`}
            </JSONResponse>
          </Endpoint>

          {/* Experience */}
          <Endpoint 
            method="GET" 
            path="/developer/experience" 
            description="Retrieve work experience and career history"
            id="experience"
          >
            <JSONResponse>
{`{
  "positions": [
    {
      "company": "TechCorp Inc.",
      "position": "Senior Backend Developer",
      "start_date": "2022-03-01",
      "end_date": null,
      "current": true,
      "location": "San Francisco, CA",
      "achievements": [
        "Led migration of monolithic system to microservices (50+ services)",
        "Improved API response time by 60% through caching and optimization"
      ],
      "technologies": ["Python", "Django", "PostgreSQL", "AWS"]
    }
  ],
  "total_years_experience": 7
}`}
            </JSONResponse>
          </Endpoint>

          {/* Projects */}
          <Endpoint 
            method="GET" 
            path="/developer/projects" 
            description="Get portfolio of notable projects and contributions"
            id="projects"
          >
            <div className="mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">Query Parameters</h4>
              <div className="space-y-2 text-sm">
                <Card className="p-3 border-l-4 border-blue-500">
                  <span className="text-blue-400 font-mono">limit</span>
                  <span className="text-gray-400 ml-2">(integer, optional) - Number of projects (default: 10)</span>
                </Card>
                <Card className="p-3 border-l-4 border-purple-500">
                  <span className="text-purple-400 font-mono">category</span>
                  <span className="text-gray-400 ml-2">(string, optional) - Filter by category</span>
                </Card>
              </div>
            </div>
            <JSONResponse>
{`{
  "projects": [
    {
      "name": "E-Commerce Microservices Platform",
      "description": "Complete microservices ecosystem for e-commerce with 25+ services",
      "technologies": ["Python", "FastAPI", "PostgreSQL", "Redis"],
      "github_url": "https://github.com/alexjohnson/ecommerce-platform"
    }
  ]
}`}
            </JSONResponse>
          </Endpoint>

          {/* Resume Download */}
          <Endpoint 
            method="GET" 
            path="/developer/resume" 
            description="Download resume in various formats with metadata"
            id="resume"
          >
            <div className="mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">Query Parameters</h4>
              <Card className="p-3 border-l-4 border-amber-500">
                <span className="text-amber-400 font-mono">format</span>
                <span className="text-gray-400 ml-2">(string) - "pdf" | "docx" | "json" | "html" (default: "pdf")</span>
              </Card>
            </div>
            <JSONResponse>
{`{
  "download_links": {
    "pdf": {
      "url": "https://api.developer-portfolio.dev/files/resume.pdf",
      "expires_at": "2024-01-16T10:30:00Z"
    }
  },
  "metadata": {
    "last_updated": "2024-01-10T00:00:00Z",
    "version": "2.1.0"
  }
}`}
            </JSONResponse>
          </Endpoint>
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Ready to Connect?</h3>
            <p className="text-gray-400 mb-6">Let's build something amazing together</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:alex.johnson@email.com" className={`flex items-center space-x-2 ${colors.primary} text-white px-6 py-3 rounded-lg transition-all hover:scale-105`}>
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
              <a href="https://github.com/alexjohnson" className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all hover:scale-105">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a href="#" className={`flex items-center space-x-2 ${colors.accent} text-white px-6 py-3 rounded-lg transition-all hover:scale-105`}>
                <FileText className="w-5 h-5" />
                <span>View Resume</span>
              </a>
            </div>
          </Card>
          <div className="mt-8 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Alex Johnson. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default APIPortfolio;