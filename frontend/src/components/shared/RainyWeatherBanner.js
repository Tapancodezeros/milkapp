import React, { useState } from 'react';
import { CloudRain, Umbrella, ShieldCheck, Clock, Edit3, X } from 'lucide-react';
import axios from '../../api/config';
import toast from 'react-hot-toast';
import { getAuthToken } from '../../utils/auth';

const RainyWeatherBanner = ({ advisory, userRole, onUpdateAdvisory, customerPrefs, onOpenRainModal }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isRainyMode, setIsRainyMode] = useState(advisory?.isRainyMode || false);
    const [severity, setSeverity] = useState(advisory?.severity || 'moderate');
    const [advisoryTitle, setAdvisoryTitle] = useState(advisory?.advisoryTitle || 'Rainy Weather Advisory');
    const [advisoryMessage, setAdvisoryMessage] = useState(advisory?.advisoryMessage || 'Heavy rain in delivery zone. Deliveries are dispatched with rainproof protective covers.');
    const [delayMinutes, setDelayMinutes] = useState(advisory?.estimatedDelayMinutes || 30);
    const [loading, setLoading] = useState(false);

    // Sync state if prop changes
    React.useEffect(() => {
        if (advisory) {
            setIsRainyMode(advisory.isRainyMode);
            setSeverity(advisory.severity || 'moderate');
            setAdvisoryTitle(advisory.advisoryTitle || 'Rainy Weather Advisory');
            setAdvisoryMessage(advisory.advisoryMessage || '');
            setDelayMinutes(advisory.estimatedDelayMinutes || 30);
        }
    }, [advisory]);

    const handleSaveToggle = async (newModeState) => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const res = await axios.post('/weather/toggle', {
                isRainyMode: newModeState !== undefined ? newModeState : isRainyMode,
                severity,
                advisoryTitle,
                advisoryMessage,
                estimatedDelayMinutes: parseInt(delayMinutes) || 0
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(newModeState ? '🌧️ Rainy Weather Mode Activated' : '☀️ Rainy Weather Mode Deactivated');
            setIsEditing(false);
            if (onUpdateAdvisory) onUpdateAdvisory(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update weather status');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityBadge = () => {
        switch (severity) {
            case 'light':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">Light Rain</span>;
            case 'heavy':
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200">Heavy Downpour</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200">Moderate Rain</span>;
        }
    };

    if (!advisory?.isRainyMode && userRole === 'customer') {
        return null; // Don't block screen if clear weather for customer, or show subtle clear banner
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 mb-6 border shadow-sm ${
            advisory?.isRainyMode
                ? 'bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white border-sky-500/30'
                : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 text-slate-800 border-teal-200/60'
        }`}>
            {/* Background Decorative Element */}
            {advisory?.isRainyMode && (
                <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
                    <CloudRain className="w-64 h-64 text-sky-300 animate-pulse" />
                </div>
            )}

            <div className="p-5 md:p-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Header & Status */}
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl flex items-center justify-center shrink-0 ${
                            advisory?.isRainyMode
                                ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40 shadow-inner'
                                : 'bg-teal-100 text-teal-700'
                        }`}>
                            {advisory?.isRainyMode ? <CloudRain className="w-8 h-8 animate-bounce" /> : <Umbrella className="w-7 h-7" />}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className="text-lg font-bold tracking-tight">
                                    {advisory?.isRainyMode ? advisory.advisoryTitle || '🌧️ Rainy Weather Delivery Alert' : '☀️ Rainy Weather Operations'}
                                </h3>
                                {advisory?.isRainyMode && getSeverityBadge()}
                                {advisory?.estimatedDelayMinutes > 0 && advisory?.isRainyMode && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        <Clock className="w-3.5 h-3.5" /> +{advisory.estimatedDelayMinutes}m Delay
                                    </span>
                                )}
                            </div>

                            <p className={`text-sm leading-relaxed max-w-2xl ${advisory?.isRainyMode ? 'text-sky-100/90' : 'text-teal-900/80'}`}>
                                {advisory?.isRainyMode
                                    ? advisory.advisoryMessage
                                    : 'Rainy Weather Mode is currently inactive. Toggle mode on to broadcast rain advisories and alert customers.'}
                            </p>
                        </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        {userRole === 'customer' && advisory?.isRainyMode && (
                            <>
                                <button
                                    onClick={onOpenRainModal}
                                    className="px-4 py-2 text-sm font-semibold rounded-xl bg-sky-500 hover:bg-sky-400 text-white shadow-md transition-all flex items-center gap-2"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    {customerPrefs?.rainproofPackaging ? '✓ Rainproof Packaging ON' : 'Configure Rain Setup'}
                                </button>
                            </>
                        )}

                        {(userRole === 'vendor' || userRole === 'admin') && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSaveToggle(!advisory?.isRainyMode)}
                                    disabled={loading}
                                    className={`px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
                                        advisory?.isRainyMode
                                            ? 'bg-rose-500 hover:bg-rose-600 text-white'
                                            : 'bg-teal-600 hover:bg-teal-700 text-white'
                                    }`}
                                >
                                    {advisory?.isRainyMode ? (
                                        <>
                                            <X className="w-4 h-4" /> Deactivate Rain Mode
                                        </>
                                    ) : (
                                        <>
                                            <CloudRain className="w-4 h-4" /> Activate Rain Mode
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
                                    title="Edit Advisory Message"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vendor/Admin Edit Panel */}
                {isEditing && (userRole === 'vendor' || userRole === 'admin') && (
                    <div className="mt-5 pt-4 border-t border-sky-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-sky-200 mb-1">Advisory Title</label>
                            <input
                                type="text"
                                value={advisoryTitle}
                                onChange={(e) => setAdvisoryTitle(e.target.value)}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800/80 border border-sky-500/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="e.g. Rainy Weather Advisory"
                            />
                        </div>

                        <div className="flex gap-3">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold uppercase text-sky-200 mb-1">Rain Severity</label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800/80 border border-sky-500/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                                >
                                    <option value="light">Light Rain</option>
                                    <option value="moderate">Moderate Rain</option>
                                    <option value="heavy">Heavy Downpour</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold uppercase text-sky-200 mb-1">Delay (Mins)</label>
                                <input
                                    type="number"
                                    value={delayMinutes}
                                    onChange={(e) => setDelayMinutes(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800/80 border border-sky-500/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold uppercase text-sky-200 mb-1">Broadcast Message to Customers</label>
                            <textarea
                                value={advisoryMessage}
                                onChange={(e) => setAdvisoryMessage(e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800/80 border border-sky-500/40 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="Instructions or delay notes for customers..."
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSaveToggle(isRainyMode)}
                                disabled={loading}
                                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-sky-500 text-white hover:bg-sky-400 shadow"
                            >
                                Save Broadcast
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RainyWeatherBanner;
