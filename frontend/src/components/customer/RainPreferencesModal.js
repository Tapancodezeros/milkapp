import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { CloudRain, ShieldCheck, MapPin, Save } from 'lucide-react';
import axios from '../../api/config';
import toast from 'react-hot-toast';
import { getAuthToken } from '../../utils/auth';

const RainPreferencesModal = ({ isOpen, onClose, customerPrefs, onSaveSuccess }) => {
    const [rainproofPackaging, setRainproofPackaging] = useState(customerPrefs?.rainproofPackaging || false);
    const [rainDropoffInstructions, setRainDropoffInstructions] = useState(customerPrefs?.rainDropoffInstructions || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customerPrefs) {
            setRainproofPackaging(!!customerPrefs.rainproofPackaging);
            setRainDropoffInstructions(customerPrefs.rainDropoffInstructions || '');
        }
    }, [customerPrefs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getAuthToken();
            const res = await axios.put('/weather/customer-preferences', {
                rainproofPackaging,
                rainDropoffInstructions
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('🌧️ Rain preferences saved!');
            if (onSaveSuccess) onSaveSuccess(res.data.data);
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="🌧️ Rainy Day Setup">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-sky-50 dark:bg-sky-950/40 p-4 rounded-2xl border border-sky-100 dark:border-sky-900/50 flex items-start gap-3">
                    <CloudRain className="w-6 h-6 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-sky-900 dark:text-sky-200 leading-relaxed">
                        Customize how your vendor delivers milk during heavy downpours. Select protective packaging or leave precise drop-off spot notes.
                    </p>
                </div>

                {/* Rainproof Cover Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">Rainproof Protective Wrap</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Request double sealed rain cover for milk pouches/containers</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRainproofPackaging(!rainproofPackaging)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                            rainproofPackaging ? 'bg-sky-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                        }`}
                    >
                        <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                    </button>
                </div>

                {/* Rain Dropoff Instruction Input */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-500" />
                        Rainy Day Drop-off Note
                    </label>
                    <textarea
                        value={rainDropoffInstructions}
                        onChange={(e) => setRainDropoffInstructions(e.target.value)}
                        rows={3}
                        placeholder="e.g. Place under porch awning inside the blue plastic crate by the door."
                        className="w-full p-3.5 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-bold rounded-2xl bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default RainPreferencesModal;
