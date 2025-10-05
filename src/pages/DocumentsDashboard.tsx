import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";

interface Subject {
  id: number;
  name: string;
  description: string;
  documentCount: number;
  color: string;
}

interface Document {
  id: number;
  name: string;
  subjectId: number;
  uploadDate: string;
  size: string;
  type: string;
  status: "processed" | "processing" | "failed";
  content?: string;
  selected?: boolean;
}

interface QueryMessage {
  id: number;
  type: "user" | "assistant";
  content: string;
  timestamp: string;
  documents?: string[];
  relevance?: number;
}

interface QueryResult {
  id: number;
  documentName: string;
  content: string;
  relevance: number;
  timestamp: string;
}

const DocumentsDashboard: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Machine Learning", description: "AI and ML research papers", documentCount: 15, color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Web Development", description: "Frontend and backend guides", documentCount: 8, color: "from-blue-500 to-cyan-500" },
    { id: 3, name: "Data Science", description: "Analytics and statistics", documentCount: 12, color: "from-green-500 to-emerald-500" },
    { id: 4, name: "Business", description: "Reports and presentations", documentCount: 6, color: "from-orange-500 to-red-500" },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: 1, name: "Deep Learning Fundamentals.pdf", subjectId: 1, uploadDate: "2024-01-15", size: "2.4 MB", type: "PDF", status: "processed", content: "Comprehensive guide to deep learning algorithms and neural networks..." },
    { id: 2, name: "React Best Practices.docx", subjectId: 2, uploadDate: "2024-01-14", size: "1.8 MB", type: "DOCX", status: "processed", content: "Modern React development patterns and best practices for scalable applications..." },
    { id: 3, name: "Statistical Analysis.xlsx", subjectId: 3, uploadDate: "2024-01-13", size: "3.2 MB", type: "XLSX", status: "processed", content: "Advanced statistical methods and data analysis techniques..." },
    { id: 4, name: "Quarterly Report.pdf", subjectId: 4, uploadDate: "2024-01-12", size: "4.1 MB", type: "PDF", status: "processing", content: "Q4 business performance analysis and strategic recommendations..." },
    { id: 5, name: "API Documentation.md", subjectId: 2, uploadDate: "2024-01-11", size: "0.8 MB", type: "MD", status: "processed", content: "Complete API reference and integration guidelines..." },
  ]);

  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [newDocument, setNewDocument] = useState({ name: "", subjectId: 1 });
  const [newSubject, setNewSubject] = useState({ name: "", description: "", color: "from-blue-500 to-cyan-500" });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [ragQuery, setRagQuery] = useState("");
  const [conversations, setConversations] = useState<{[subjectId: string]: QueryMessage[]}>({});
  const [isQuerying, setIsQuerying] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [expandedQuery, setExpandedQuery] = useState(false);
  const [expandedReferences, setExpandedReferences] = useState<number | null>(null);
  const [queryAnimation, setQueryAnimation] = useState(false);
  const [answerAnimation, setAnswerAnimation] = useState(false);
  const [showBrainVisualization, setShowBrainVisualization] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // NEW: track expanded subjects and expanded reference items
  const [expandedSubjects, setExpandedSubjects] = useState<Set<number>>(new Set());
  const [expandedReferenceDocs, setExpandedReferenceDocs] = useState<Record<string, boolean>>({});

  const toggleSubjectExpand = (id: number) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleReferenceDoc = (key: string) => {
    setExpandedReferenceDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedSubject && conversations[selectedSubject]) {
      scrollToBottom();
    }
  }, [selectedSubject, conversations]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSubject = selectedSubject !== null && doc.subjectId === selectedSubject;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: documents.length + 1,
        name: file.name,
        subjectId: newDocument.subjectId,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        status: "processed"
      };
      setDocuments([...documents, newDoc]);
      setShowUploadModal(false);
      setNewDocument({ name: "", subjectId: 1 });
    }
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setDocuments(documents.filter(doc => doc.subjectId !== id));
    if (selectedSubject === id) setSelectedSubject(null);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setNewSubject({ name: subject.name, description: subject.description, color: subject.color });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...newSubject } : s));
    } else {
      const newId = Math.max(...subjects.map(s => s.id)) + 1;
      setSubjects([...subjects, { id: newId, documentCount: 0, ...newSubject }]);
    }
    setShowSubjectModal(false);
    setEditingSubject(null);
    setNewSubject({ name: "", description: "", color: "from-blue-500 to-cyan-500" });
  };

  const handleSelectDocument = (id: number) => {
    setSelectedDocuments(prev => 
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  // Helper: render assistant message content as structured UI (no **)
  const renderAssistantContent = (content: string) => {
    const lines = content.split(/\r?\n/);
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];

    const flushList = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul className="list-disc pl-6 space-y-1 text-gray-800" key={`ul-${elements.length}`}>
            {listBuffer.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((raw) => {
      const line = raw.replace(/\*\*/g, '').trimEnd();
      if (line.trim() === '') {
        flushList();
        return;
      }
      if (/^[-\u2022]/.test(line)) {
        // bullet
        const item = line.replace(/^[-\u2022]\s*/, '');
        listBuffer.push(item);
        return;
      }
      // heading like "Key Findings:" or any ending with :
      if (/.*:\s*$/.test(line)) {
        flushList();
        elements.push(
          <h4 className="text-sm font-semibold text-gray-900 mt-3" key={`h-${elements.length}`}>{line.replace(/:\s*$/, '')}</h4>
        );
        return;
      }
      // paragraph
      flushList();
      elements.push(
        <p className="text-sm text-gray-700 leading-relaxed" key={`p-${elements.length}`}>{line}</p>
      );
    });

    flushList();
    return <div className="space-y-2">{elements}</div>;
  };

  const handleRAGQuery = async () => {
    if (!ragQuery.trim() || !selectedSubject) return;
    
    const userMessage: QueryMessage = {
      id: Date.now(),
      type: "user",
      content: ragQuery,
      timestamp: new Date().toISOString()
    };
    
    const currentConversation = conversations[selectedSubject] || [];
    setConversations(prev => ({
      ...prev,
      [selectedSubject]: [...currentConversation, userMessage]
    }));
    
    // Start query animation
    setQueryAnimation(true);
    setIsQuerying(true);
    setShowBrainVisualization(true);
    setRagQuery("");
    
    // Animate query submission
    setTimeout(() => {
      setQueryAnimation(false);
    }, 600);
    
    // Simulate RAG query processing with brain visualization
    setTimeout(() => {
      setAnswerAnimation(true);
      
      const mockResponse: QueryMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: `Based on your query "${userMessage.content}" in ${subjects.find(s => s.id === selectedSubject)?.name || 'this subject'}, here's what I found:\n\nKey Findings:\n- Neural network architectures are fundamental to deep learning systems\n- React best practices include component optimization and state management\n- Statistical analysis provides insights into data patterns and trends\n\nRelevant Documents:\n- Deep Learning Fundamentals.pdf (95% match)\n- React Best Practices.docx (87% match)\n- Statistical Analysis.xlsx (78% match)\n\nWould you like me to elaborate on any of these topics or explore specific aspects further?`,
        timestamp: new Date().toISOString(),
        documents: ["Deep Learning Fundamentals.pdf", "React Best Practices.docx"],
        relevance: 0.92
      };
      
      setConversations(prev => ({
        ...prev,
        [selectedSubject]: [...(prev[selectedSubject] || []), mockResponse]
      }));
      
      // Stop brain visualization and expand section
      setTimeout(() => {
        setIsQuerying(false);
        setShowBrainVisualization(false);
        setAnswerAnimation(false);
        setExpandedQuery(true);
        
        // Scroll to latest answer section with smooth animation
        setTimeout(() => {
          const latestAnswerElement = document.querySelector('[data-latest-answer]');
          if (latestAnswerElement) {
            latestAnswerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }, 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mtq-heading-primary">
                Documents Dashboard
              </h1>
              <p className="text-gray-600">Manage subjects and query your documents with AI-powered search</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="mtq-nav-link flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              <Button 
                onClick={() => setShowUploadModal(true)}
                variant="primary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Upload Document</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Subject Management */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0`}>
            <div className="mtq-card sticky top-8">
              <div className="flex items-center justify-between mb-6">
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Subjects</h2>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  {!sidebarCollapsed && (
                    <button
                      onClick={() => setShowSubjectModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors duration-200"
                      title="Add Subject"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    <svg className={`w-4 h-4 text-gray-600 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {!sidebarCollapsed && (
                <div className="space-y-1">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="group">
                      <button
                        onClick={() => setSelectedSubject(subject.id)}
                        className={`w-full text-left p-3 rounded-lg smooth-transition ${
                          selectedSubject === subject.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              selectedSubject === subject.id ? 'bg-blue-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <div className="font-medium text-sm dark:text-gray-200">{subject.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{subject.documentCount} documents</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 smooth-fade">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSubject(subject);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              title="Edit"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubject(subject.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                              title="Delete"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubjectExpand(subject.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              title="Expand"
                            >
                              <svg className={`w-3 h-3 transition-transform duration-200 ${expandedSubjects.has(subject.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </button>
                      {/* Expanded subject details */}
                      {expandedSubjects.has(subject.id) && (
                        <div className="ml-3 mr-3 mt-2 mb-3 p-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 animate-fade-in-smooth">
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{subject.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded bg-gradient-to-br ${subject.color}`}></span>
                              <span className="text-xs text-gray-500">Theme color</span>
                            </div>
                            <Button
                              onClick={() => setSelectedSubject(subject.id)}
                              size="sm"
                              variant="primary"
                              className="!px-3 !py-1 text-xs"
                            >
                              View Documents
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Split View: Documents + Query */}
          <div className={`flex-1 grid gap-8 transition-all duration-300 ${expandedQuery ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Documents Panel */}
            <div className={`mtq-card transition-all duration-300 ${expandedQuery ? 'hidden' : 'block'}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedSubject ? subjects.find(s => s.id === selectedSubject)?.name : 'Select a Subject'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSubject ? `${filteredDocuments.length} documents found` : 'No subject selected'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 pl-10 border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {!selectedSubject ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900 mb-1">No Subject Selected</p>
                    <p className="text-xs text-gray-500">Select a subject from the sidebar to view its documents</p>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900 mb-1">No Documents Found</p>
                    <p className="text-xs text-gray-500">This subject doesn't have any documents yet</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => {
                  return (
                    <div key={doc.id} className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm smooth-transition">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => handleSelectDocument(doc.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 smooth-scale"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                            <span className="text-xs text-gray-500">{doc.type}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{doc.size} • {doc.uploadDate}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'processed' 
                                ? 'bg-green-100 text-green-800' 
                                : doc.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {doc.status}
                            </span>
                            {doc.status === 'processed' && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                AI Ready
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => alert(`Opening ${doc.name}...`)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </div>

            {/* Query Interface Panel */}
            <div className="mtq-card">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                 <div>
                   <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Query Interface</h2>
                   <p className="text-sm text-gray-600 dark:text-gray-400">Ask questions about your documents</p>
                 </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedQuery(!expandedQuery)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedQuery ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                    </svg>
                    <span>{expandedQuery ? 'Collapse' : 'Expand'}</span>
                  </button>
                </div>
              </div>
              
              {/* Query Input */}
              <div className="mb-6">
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                   {selectedSubject && (
                     <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                       {subjects.find(s => s.id === selectedSubject)?.name}
                     </span>
                   )}
                   <span className="text-xs text-gray-500">{selectedDocuments.length > 0 ? `${selectedDocuments.length} selected docs` : 'All documents'}</span>
                 </div>
                <div className={`flex space-x-3 ${queryAnimation ? 'animate-query-submit' : ''}`}
                >
                  <div className="flex-1 relative">
                    <textarea
                      value={ragQuery}
                      onChange={(e) => setRagQuery(e.target.value)}
                      placeholder="Type your question clearly. For example: \"Summarize Q4 performance from Business reports\""
                      className={`w-full h-28 md:h-24 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none smooth-transition bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${queryAnimation ? 'query-processing' : ''} ${isQuerying ? 'opacity-70' : ''}`}
                      disabled={isQuerying}
                    />
                    <div className="absolute -bottom-6 left-0 text-[10px] text-gray-500">{ragQuery.length} chars</div>
                    {isQuerying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl">
                        <div className="thinking-indicator">
                          <div className="thinking-dot-stagger"></div>
                          <div className="thinking-dot-stagger"></div>
                          <div className="thinking-dot-stagger"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleRAGQuery}
                      disabled={isQuerying || !ragQuery.trim()}
                      variant="primary"
                      size="sm"
                      className="h-14 md:h-24 flex items-center justify-center min-w-[80px]"
                    >
                      {isQuerying ? (
                        <div className="thinking-indicator">
                          <div className="thinking-dot-stagger"></div>
                          <div className="thinking-dot-stagger"></div>
                          <div className="thinking-dot-stagger"></div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Ask</span>
                        </div>
                      )}
                    </Button>
                    <Button
                      onClick={() => setRagQuery("")}
                      variant="neutral"
                      size="sm"
                      className="h-10"
                      disabled={isQuerying || ragQuery.length === 0}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>

              {/* Brain Visualization */}
              {showBrainVisualization && (
                <div className="mb-6 answer-loading">
                  <div className="processing-status">
                    <div className="brain-container">
                      <div className="brain-visualization">
                        <svg className="brain-svg animate-brain-pulse animate-brain-glow" viewBox="0 0 100 100">
                          {/* Brain outline */}
                          <path
                            d="M50 10 C30 15, 15 30, 15 50 C15 70, 30 85, 50 90 C70 85, 85 70, 85 50 C85 30, 70 15, 50 10 Z"
                            fill="url(#brainGradient)"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                          />
                          {/* Neural network paths */}
                          <path
                            d="M25 35 Q35 25, 45 35 Q55 25, 65 35 Q75 25, 85 35"
                            className="neural-path animate-neural-network"
                          />
                          <path
                            d="M25 50 Q35 40, 45 50 Q55 40, 65 50 Q75 40, 85 50"
                            className="neural-path animate-neural-network"
                            style={{animationDelay: '0.5s'}}
                          />
                          <path
                            d="M25 65 Q35 55, 45 65 Q55 55, 65 65 Q75 55, 85 65"
                            className="neural-path animate-neural-network"
                            style={{animationDelay: '1s'}}
                          />
                          {/* Additional neural connections */}
                          <path
                            d="M30 25 Q50 20, 70 25"
                            className="neural-path animate-neural-network"
                            style={{animationDelay: '1.5s'}}
                          />
                          <path
                            d="M30 75 Q50 80, 70 75"
                            className="neural-path animate-neural-network"
                            style={{animationDelay: '2s'}}
                          />
                          {/* Data particles */}
                          <circle cx="30" cy="40" r="3" fill="#3b82f6" className="data-particle animate-data-flow" />
                          <circle cx="50" cy="45" r="3" fill="#8b5cf6" className="data-particle animate-data-flow" style={{animationDelay: '0.4s'}} />
                          <circle cx="70" cy="50" r="3" fill="#3b82f6" className="data-particle animate-data-flow" style={{animationDelay: '0.8s'}} />
                          <circle cx="40" cy="60" r="3" fill="#8b5cf6" className="data-particle animate-data-flow" style={{animationDelay: '1.2s'}} />
                          <circle cx="60" cy="65" r="3" fill="#3b82f6" className="data-particle animate-data-flow" style={{animationDelay: '1.6s'}} />
                        </svg>
                        <defs>
                          <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </div>
                    </div>
                    <div className="processing-text">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        AI Brain Processing
                      </p>
                      <p className="text-xs text-gray-500">
                        Analyzing your query through neural networks...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Latest Answer Box */}
              {selectedSubject && conversations[selectedSubject] && conversations[selectedSubject].length > 0 && conversations[selectedSubject][conversations[selectedSubject].length - 1].type === 'assistant' && (
                <div className={`mb-6 smooth-expand ${answerAnimation ? 'animate-answer-reveal' : ''}`} data-latest-answer>
                  <div className="flex items-center space-x-2 mb-3 animate-fade-in-smooth">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-status-pulse"></div>
                    <h3 className="text-sm font-semibold text-gray-900">Latest Answer</h3>
                  </div>
                  <div className={`bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-6 smooth-transition shadow-sm ${answerAnimation ? 'animate-answer-reveal' : ''}`}>
                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {renderAssistantContent(conversations[selectedSubject][conversations[selectedSubject].length - 1].content)}
                    </div>
                    {conversations[selectedSubject][conversations[selectedSubject].length - 1].documents && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => setExpandedReferences(expandedReferences === conversations[selectedSubject].length - 1 ? null : conversations[selectedSubject].length - 1)}
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-xs font-medium">View References ({conversations[selectedSubject][conversations[selectedSubject].length - 1].documents?.length})</span>
                          <svg className={`w-4 h-4 transition-transform duration-200 ${expandedReferences === conversations[selectedSubject].length - 1 ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedReferences === conversations[selectedSubject].length - 1 && (
                          <div className="mt-3 space-y-2">
                            {conversations[selectedSubject][conversations[selectedSubject].length - 1].documents?.map((docName, index) => {
                              const doc = documents.find(d => d.name === docName);
                              const subject = doc ? subjects.find(s => s.id === doc.subjectId) : null;
                              const refKey = `${conversations[selectedSubject].length - 1}-${docName}`;
                              return (
                                <div key={index} className="bg-white p-3 rounded-md border border-gray-200">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                      <span className="text-gray-600 font-medium text-xs">{doc?.type || 'DOC'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-900 truncate">{docName}</h4>
                                        <button
                                          onClick={() => toggleReferenceDoc(refKey)}
                                          className="text-xs text-gray-600 hover:text-gray-800 transition-colors duration-200 flex items-center gap-1"
                                        >
                                          <span>{expandedReferenceDocs[refKey] ? 'Hide' : 'Expand'}</span>
                                          <svg className={`w-3 h-3 transition-transform duration-200 ${expandedReferenceDocs[refKey] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                        </button>
                                      </div>
                                      {doc && (
                                        <div className="mt-1">
                                          <p className="text-xs text-gray-600">{doc.size} • {doc.uploadDate}</p>
                                          <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-xs text-gray-500">{subject?.name}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                              doc.status === 'processed' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                              {doc.status}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                      {expandedReferenceDocs[refKey] && (
                                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded animate-fade-in-smooth">
                                          <p className="text-xs text-gray-700 whitespace-pre-wrap">{doc?.content || 'No preview available.'}</p>
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      onClick={() => alert(`Opening ${docName}...`)}
                                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
                                    >
                                      View
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-3 text-xs text-gray-500">
                      {new Date(conversations[selectedSubject][conversations[selectedSubject].length - 1].timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation History */}
              <div className="smooth-transition">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Conversation History</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto bg-gray-50 rounded-md p-4">
                  {!selectedSubject || !conversations[selectedSubject] || conversations[selectedSubject].length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">Select a subject and start a conversation</p>
                    </div>
                  ) : (
                    conversations[selectedSubject].map((message, index) => (
                      <div key={message.id} className="transition-all duration-300 animate-slide-up-smooth" style={{animationDelay: `${index * 0.2}s`}}>
                        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-md smooth-transition ${
                            message.type === 'user' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="text-sm whitespace-pre-wrap">
                              {message.type === 'assistant' ? renderAssistantContent(message.content) : message.content}
                            </div>
                            {message.documents && (
                              <div className="mt-2 pt-2 border-t border-gray-200/50">
                                <button
                                  onClick={() => setExpandedReferences(expandedReferences === index ? null : index)}
                                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-xs">References ({message.documents.length})</span>
                                  <svg className={`w-3 h-3 transition-transform duration-200 ${expandedReferences === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                
                                {expandedReferences === index && (
                                  <div className="mt-2 space-y-1">
                                    {message.documents.map((docName, docIndex) => {
                                      const doc = documents.find(d => d.name === docName);
                                      const subject = doc ? subjects.find(s => s.id === doc.subjectId) : null;
                                      return (
                                        <div key={docIndex} className="bg-gray-100/50 p-2 rounded text-xs">
                                          <div className="flex items-center space-x-2">
                                            <div className={`w-4 h-4 bg-gradient-to-br ${subject?.color || 'from-gray-500 to-gray-600'} rounded flex items-center justify-center`}>
                                              <span className="text-white font-semibold text-xs">{doc?.type?.charAt(0) || 'D'}</span>
                                            </div>
                                            <span className="truncate">{docName}</span>
                                            {doc && (
                                              <span className={`px-1 py-0.5 rounded text-xs ${
                                                doc.status === 'processed' 
                                                  ? 'bg-green-100 text-green-800' 
                                                  : 'bg-yellow-100 text-yellow-800'
                                              }`}>
                                                {doc.status}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="text-xs opacity-75 mt-2">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isQuerying && (
                    <div className="flex justify-start animate-slide-up-smooth">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-4 py-3 rounded-2xl shadow-sm smooth-transition">
                        <div className="flex items-center space-x-3">
                          <div className="thinking-indicator">
                            <div className="thinking-dot-stagger"></div>
                            <div className="thinking-dot-stagger"></div>
                            <div className="thinking-dot-stagger"></div>
                          </div>
                          <div className="flex flex-col animate-fade-in-smooth">
                            <span className="text-sm font-medium text-gray-700">AI is thinking...</span>
                            <span className="text-xs text-gray-500">Processing your query</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="mtq-card max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                  <Input
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    placeholder="Enter document name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={newDocument.subjectId}
                    onChange={(e) => setNewDocument({ ...newDocument, subjectId: parseInt(e.target.value) })}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleUpload}
                    variant="success"
                    className="flex-1"
                  >
                    Choose File
                  </Button>
                  <Button
                    onClick={() => setShowUploadModal(false)}
                    variant="neutral"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.docx,.txt,.xlsx,.md"
              />
            </div>
          </div>
        )}

        {/* Subject Modal */}
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="mtq-card max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <Input
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Enter subject name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    value={newSubject.color}
                    onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                    className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="from-blue-500 to-cyan-500">Blue</option>
                    <option value="from-purple-500 to-pink-500">Purple</option>
                    <option value="from-green-500 to-emerald-500">Green</option>
                    <option value="from-orange-500 to-red-500">Orange</option>
                    <option value="from-indigo-500 to-purple-500">Indigo</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSaveSubject}
                    variant="success"
                    className="flex-1"
                  >
                    {editingSubject ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSubjectModal(false);
                      setEditingSubject(null);
                      setNewSubject({ name: "", description: "", color: "from-blue-500 to-cyan-500" });
                    }}
                    variant="neutral"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsDashboard;