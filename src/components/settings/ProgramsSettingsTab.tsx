import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ProgramItem } from '../../types/settings';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { BookOpen, Plus, Trash2, Edit2, Check, IndianRupee, Clock, Power } from 'lucide-react';

export const ProgramsSettingsTab: React.FC = () => {
  const { settings, addProgram, updateProgram, deleteProgram, formatCurrency } = useSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formFee, setFormFee] = useState<number | string>(0);
  const [formDuration, setFormDuration] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditingProgram(null);
    setFormName('');
    setFormFee(0);
    setFormDuration('');
    setFormDesc('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setFormName(prog.name);
    setFormFee(prog.defaultFee);
    setFormDuration(prog.duration || '');
    setFormDesc(prog.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setError('Please enter a program name');
      return;
    }

    const feeNum = Number(formFee) || 0;

    if (editingProgram) {
      updateProgram(editingProgram.id, {
        name: trimmed,
        defaultFee: feeNum,
        duration: formDuration.trim() || undefined,
        description: formDesc.trim() || undefined,
      });
    } else {
      addProgram({
        name: trimmed,
        defaultFee: feeNum,
        duration: formDuration.trim() || undefined,
        description: formDesc.trim() || undefined,
        isActive: true,
      });
    }

    setModalOpen(false);
  };

  const toggleActive = (id: string, current: boolean) => {
    updateProgram(id, { isActive: !current });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Programs & Courses Catalog ({settings.programs.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Define the academic programs offered. These populate all lead capture forms, filters, and pipeline metrics.
            </p>
          </div>

          <Button
            size="sm"
            onClick={openAddModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-bold flex-shrink-0"
          >
            Add New Program
          </Button>
        </div>

        {/* Programs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Program / Course Name</th>
                <th className="py-2.5 px-3">Default Fee</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {settings.programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">
                      {prog.name}
                    </span>
                    {prog.description && (
                      <span className="text-[11px] text-slate-400 block line-clamp-1">
                        {prog.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(prog.defaultFee)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {prog.duration || 'Flexible'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(prog.id, prog.isActive)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        prog.isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Power className="w-2.5 h-2.5" />
                      {prog.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(prog)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit program"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete program "${prog.name}"?`)) {
                            deleteProgram(prog.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProgram ? 'Edit Academic Program' : 'Add New Academic Program'}
        description="Programs configured here are automatically synchronized across all admissions forms."
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Program Title / Name *"
            placeholder="e.g. Advanced Incident Response & Threat Hunting"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            required
            autoFocus
            leftIcon={<BookOpen className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={`Standard Tuition / Fee (${settings.company.currencySymbol})`}
              type="number"
              min="0"
              placeholder="15000"
              value={formFee}
              onChange={(e) => setFormFee(e.target.value)}
              leftIcon={<IndianRupee className="w-4 h-4" />}
            />

            <Input
              label="Course Duration"
              placeholder="e.g. 3 Months / 80 Hours"
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              leftIcon={<Clock className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Short Description / Syllabus Summary (Optional)"
            placeholder="e.g. Live labs, memory forensics, SIEM analysis, and threat intelligence"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" leftIcon={<Check className="w-3.5 h-3.5" />}>
              {editingProgram ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
