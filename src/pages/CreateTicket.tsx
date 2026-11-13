import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  AlertCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  Send,
  FolderUp,
  Tag,
  Layers,
  type LucideIcon,
  Bug,
  CreditCard,
  HelpCircle,
  Sparkles,
  Wrench
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCreateTicketMutation } from '@/api/ticket.api';
import { useCategoriesQuery } from '@/api/category.api';
import type { TicketPriority } from '@/types/ticket.type';

export type PriorityId = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityOption {
  id: PriorityId;
  label: string;
  value: TicketPriority;
}

interface TicketFormData {
  title: string;
  description: string;
  category_id: string;
  priority: TicketPriority;
  level: string;
  file: File | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  category_id?: string;
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  bug: Bug,
  billing: CreditCard,
  feature: Sparkles,
  technical: Wrench,
  other: HelpCircle,
};

const PRIORITIES: PriorityOption[] = [
  { id: 'low', label: 'Low', value: 'LOW' },
  { id: 'medium', label: 'Medium', value: 'MEDIUM' },
  { id: 'high', label: 'High', value: 'HIGH' },
  { id: 'urgent', label: 'Urgent', value: 'CRITICAL' },
];

const STEPS = [
  { id: 1, title: 'Category & Priority', subtitle: 'Select inquiry scope' },
  { id: 2, title: 'Details & Context', subtitle: 'Fill in ticket information' },
  { id: 3, title: 'Review & Submit', subtitle: 'Confirm before creating ticket' },
];

export function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicketMutation = useCreateTicketMutation();

  const { data: categoriesResponse } = useCategoriesQuery({ page: 1, limit: 100 });
  const categories = categoriesResponse?.items || [];

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    category_id: '',
    priority: 'LOW',
    level: 'L1',
    file: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryChange = (catId: string) => {
    const selectedCat = categories.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      category_id: catId,
      level: selectedCat ? selectedCat.name : prev.level,
    }));
    if (errors.category_id) {
      setErrors((prev) => ({ ...prev, category_id: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    if (step === 1 && !formData.category_id) {
      newErrors.category_id = 'Please select a category';
    } else if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Explicitly triggered only when clicking Confirm & Create Ticket on Step 3
  const handleFinalSubmit = () => {
    if (!validateStep(1) || !validateStep(2)) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category_id: formData.category_id,
    };

    createTicketMutation.mutate(payload, {
      onSuccess: () => {
        navigate('/dashboard/tickets');
      },
    });
  };

  const selectedCategoryObj = categories.find((c) => c.id === formData.category_id);
  const categoryKey = selectedCategoryObj?.name.toLowerCase() || '';
  const CategoryIcon = CATEGORY_ICON_MAP[categoryKey] || FolderUp;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Create New Ticket</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Submit an internal support ticket to the engineering team
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Step {currentStep} of {STEPS.length}</span>
          <div className="w-24 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 dark:bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl overflow-hidden transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden">

          {/* LEFT SIDEBAR: Steps & Scope */}
          <div className="lg:col-span-4 bg-slate-50/70 dark:bg-slate-950/50 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Progress</h2>
              <div className="space-y-3">
                {STEPS.map((s) => {
                  const isActive = s.id === currentStep;
                  const isDone = s.id < currentStep;
                  return (
                    <div
                      key={s.id}
                      onClick={() => isDone && setCurrentStep(s.id)}
                      className={`relative flex items-start gap-3 p-3 rounded-xl transition-all ${isDone ? 'cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-800/60' : ''
                        } ${isActive ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-indigo-600 dark:text-indigo-400' : ''}`}
                    >
                      {isActive && (
                        <span className="absolute top-2 bottom-2 left-0 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-500" />
                      )}
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 ${isDone
                            ? 'bg-emerald-600 text-white'
                            : isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                      >
                        {isDone ? '✓' : s.id}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                          {s.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{s.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentStep > 1 && selectedCategoryObj && (
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Selected Scope</p>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{selectedCategoryObj.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {selectedCategoryObj.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT: Step Container (Plain Div to avoid accidental form submits) */}
          <div className="lg:col-span-8 p-6 lg:p-8 flex flex-col justify-between">
            <div className="space-y-6 flex flex-col h-full justify-between">

              <div>
                {/* STEP 1: Category & Priority */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Select Category & Priority</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose the service category and ticket priority level</p>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-indigo-500" /> Category
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
                        >
                          <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">Select a category...</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">
                              {cat.name} ({cat.id})
                            </option>
                          ))}
                        </select>
                        {errors.category_id && (
                          <p className="text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.category_id}
                          </p>
                        )}
                      </div>

                      <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500" /> Ticket Level / Tag
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                          className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer transition-all"
                        >
                          {categories.map((cat) => (
                            <option key={`lvl-${cat.id}`} value={cat.name} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1">
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                          Priority Level
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {PRIORITIES.map((p) => {
                            const isSelected = formData.priority === p.value;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, priority: p.value }))}
                                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                              >
                                {p.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Details & Context */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ticket Information</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Provide detailed notes so our engineers can assist</p>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Subject / Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Voice Ticket 3"
                        className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                      />
                      {errors.title && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.title}</p>}
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Description</label>
                      <textarea
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="e.g. Voice Ticket 3 description"
                        className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none transition-all"
                      />
                      {errors.description && <p className="text-xs text-rose-500 dark:text-rose-400">{errors.description}</p>}
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                      {!formData.file ? (
                        <label className="flex items-center gap-3 p-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all">
                          <UploadCloud className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Attach screenshot or error log</p>
                            <p className="text-[10px] text-slate-400">PNG, JPG, PDF up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file) setFormData((prev) => ({ ...prev, file }));
                            }}
                          />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{formData.file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Review Ticket Details</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Confirm the exact payload before dispatching</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
                      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 uppercase text-[10px] block">Category Name</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCategoryObj?.name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase text-[10px] block">Category ID</span>
                          <span className="text-slate-600 dark:text-slate-400">{formData.category_id}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-slate-400 uppercase text-[10px] block">Priority</span>
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{formData.priority}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase text-[10px] block">Level / Tag</span>
                          <span className="text-slate-600 dark:text-slate-400">{formData.level}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 uppercase text-[10px] block">Title (title)</span>
                        <p className="text-slate-800 dark:text-slate-200 font-sans font-medium">{formData.title}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 uppercase text-[10px] block">Description (description)</span>
                        <p className="text-slate-600 dark:text-slate-300 font-sans text-xs bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 max-h-24 overflow-y-auto whitespace-pre-wrap">
                          {formData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between mt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="cursor-pointer h-10 px-4 text-xs font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back
                  </Button>
                ) : (
                  <span />
                )}

                {currentStep < STEPS.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-5 text-xs cursor-pointer shadow-sm ml-auto"
                  >
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={createTicketMutation.isPending}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-10 px-6 text-xs cursor-pointer shadow-sm ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {createTicketMutation.isPending ? "Creating Ticket..." : "Create Ticket"}
                  </Button>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreateTicketPage;
