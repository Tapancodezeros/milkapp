import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, ShieldCheck, Check, Sparkles, AlertCircle, Wifi, Eye, EyeOff, Plus, Trash2, Wallet, X } from 'lucide-react';

export const DEFAULT_PRESET_CARDS = [
    {
        id: 'visa-pass',
        name: 'Visa Signature Infinite',
        brand: 'Visa',
        number: '4242 4242 4242 4242',
        holder: 'DEMO CUSTOMER',
        expiry: '12/28',
        cvv: '424',
        balance: 25000,
        initialBalance: 25000,
        isDeclined: false,
        isCustom: false,
        badgeText: 'Instant Approval',
        gradient: 'from-slate-900 via-blue-900 to-indigo-950 border-blue-500/30',
        textGradient: 'from-blue-200 to-indigo-100',
        accentColor: 'blue'
    },
    {
        id: 'mc-pass',
        name: 'Mastercard World Black',
        brand: 'Mastercard',
        number: '5555 5555 5555 4444',
        holder: 'ALEX MORGAN',
        expiry: '09/27',
        cvv: '888',
        balance: 50000,
        initialBalance: 50000,
        isDeclined: false,
        isCustom: false,
        badgeText: 'Fast Track Pay',
        gradient: 'from-zinc-950 via-stone-900 to-amber-950 border-amber-500/30',
        textGradient: 'from-amber-200 to-yellow-100',
        accentColor: 'amber'
    },
    {
        id: 'rupay-pass',
        name: 'RuPay Select Direct',
        brand: 'RuPay',
        number: '6080 1234 5678 8888',
        holder: 'SAMARTH PATEL',
        expiry: '06/29',
        cvv: '123',
        balance: 15000,
        initialBalance: 15000,
        isDeclined: false,
        isCustom: false,
        badgeText: 'Zero Gateway Fee',
        gradient: 'from-emerald-950 via-teal-900 to-slate-950 border-emerald-500/30',
        textGradient: 'from-emerald-200 to-teal-100',
        accentColor: 'emerald'
    },
    {
        id: 'amex-pass',
        name: 'Amex Centurion Black',
        brand: 'Amex',
        number: '3782 8224 6310 005',
        holder: 'JORDAN LEE',
        expiry: '10/30',
        cvv: '1005',
        balance: 100000,
        initialBalance: 100000,
        isDeclined: false,
        isCustom: false,
        badgeText: 'Express Clearance',
        gradient: 'from-black via-slate-900 to-zinc-950 border-slate-700/50',
        textGradient: 'from-slate-100 to-slate-300',
        accentColor: 'slate'
    },
    {
        id: 'visa-decline',
        name: 'Test Decline Card',
        brand: 'Visa',
        number: '4000 0000 0000 0002',
        holder: 'DECLINE TEST',
        expiry: '01/26',
        cvv: '000',
        balance: 0,
        initialBalance: 0,
        isDeclined: true,
        isCustom: false,
        badgeText: 'Simulates Decline',
        gradient: 'from-rose-950 via-red-950 to-slate-950 border-rose-500/40',
        textGradient: 'from-rose-200 to-red-200',
        accentColor: 'rose'
    }
];

export const PRESET_DEMO_CARDS = DEFAULT_PRESET_CARDS;

export const CARD_THEMES = [
    { id: 'blue', label: 'Sapphire Blue', gradient: 'from-slate-900 via-blue-900 to-indigo-950 border-blue-500/30' },
    { id: 'amber', label: 'Obsidian Gold', gradient: 'from-zinc-950 via-stone-900 to-amber-950 border-amber-500/30' },
    { id: 'emerald', label: 'Emerald Jade', gradient: 'from-emerald-950 via-teal-900 to-slate-950 border-emerald-500/30' },
    { id: 'purple', label: 'Royal Velvet', gradient: 'from-slate-950 via-purple-950 to-indigo-950 border-purple-500/30' },
    { id: 'rose', label: 'Crimson Rose', gradient: 'from-rose-950 via-red-950 to-slate-950 border-rose-500/40' },
    { id: 'dark', label: 'Midnight Metal', gradient: 'from-black via-slate-900 to-zinc-950 border-slate-700/50' }
];

const detectBrand = (number) => {
    const cleaned = (number || '').replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('6')) return 'RuPay';
    if (cleaned.startsWith('3')) return 'Amex';
    return 'Card';
};

const formatCardNumber = (val) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 16);
    return digitsOnly.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (val) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 4);
    if (digitsOnly.length >= 3) {
        return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
    }
    return digitsOnly;
};

const formatCurrency = (val) => {
    return `₹${(parseFloat(val) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
};

const DemoCardSelector = ({ onSelectCard, selectedCard, userId }) => {
    const storageKey = userId ? `milkapp_demo_cards_${userId}` : 'milkapp_demo_cards_guest';

    const [userCards, setUserCards] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {
            console.error("Failed loading saved cards", e);
        }
        return DEFAULT_PRESET_CARDS;
    });

    const [activeCardId, setActiveCardId] = useState(() => {
        return selectedCard?.id || userCards[0]?.id || DEFAULT_PRESET_CARDS[0].id;
    });

    const [showFullNumber, setShowFullNumber] = useState(false);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardForm, setNewCardForm] = useState({
        name: '',
        number: '',
        holder: '',
        expiry: '',
        cvv: '',
        balance: '25000',
        theme: 'blue'
    });

    // Save cards to localStorage per user ID
    useEffect(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(userCards));
        } catch (e) {
            console.error("Failed storing user cards", e);
        }
    }, [userCards, storageKey]);

    const onSelectCardRef = useRef(onSelectCard);
    useEffect(() => {
        onSelectCardRef.current = onSelectCard;
    }, [onSelectCard]);

    const activeCard = userCards.find(c => c.id === activeCardId) || userCards[0] || DEFAULT_PRESET_CARDS[0];

    // Sync selected card state to parent component
    useEffect(() => {
        if (activeCard) {
            const cardObj = {
                ...activeCard,
                last4: (activeCard.number || '').replace(/\s/g, '').slice(-4)
            };
            if (onSelectCardRef.current) {
                onSelectCardRef.current(cardObj);
            }
        }
    }, [activeCardId, userCards, activeCard]);

    const handleSelectCard = (card) => {
        setActiveCardId(card.id);
        const cardObj = {
            ...card,
            last4: (card.number || '').replace(/\s/g, '').slice(-4)
        };
        if (onSelectCardRef.current) {
            onSelectCardRef.current(cardObj);
        }
    };

    const handleCreateCard = (e) => {
        e.preventDefault();
        const brand = detectBrand(newCardForm.number);
        const formattedNum = formatCardNumber(newCardForm.number || '4242 4242 4242 4242');
        const themeObj = CARD_THEMES.find(t => t.id === newCardForm.theme) || CARD_THEMES[0];
        const numBal = parseFloat(newCardForm.balance) || 10000;

        const newCard = {
            id: `card_${Date.now()}`,
            name: newCardForm.name.trim() || `${brand} Custom Card`,
            brand,
            number: formattedNum,
            holder: (newCardForm.holder || 'DEMO USER').toUpperCase(),
            expiry: formatExpiry(newCardForm.expiry) || '12/28',
            cvv: newCardForm.cvv || '123',
            balance: numBal,
            initialBalance: numBal,
            isDeclined: false,
            isCustom: true,
            badgeText: 'User Saved Card',
            gradient: themeObj.gradient,
            accentColor: newCardForm.theme
        };

        const updated = [newCard, ...userCards];
        setUserCards(updated);
        setActiveCardId(newCard.id);
        setShowAddCardModal(false);
        setNewCardForm({
            name: '',
            number: '',
            holder: '',
            expiry: '',
            cvv: '',
            balance: '25000',
            theme: 'blue'
        });
    };

    const handleDeleteCard = (cardId, e) => {
        e.stopPropagation();
        const updated = userCards.filter(c => c.id !== cardId);
        setUserCards(updated);
        if (activeCardId === cardId && updated.length > 0) {
            setActiveCardId(updated[0].id);
        }
    };

    return (
        <div className="space-y-4">
            {/* Visual 3D Interactive Card Display with Live Card Balance */}
            <div className="relative group perspective-1000">
                <div className={`w-full p-5 sm:p-6 rounded-[2rem] bg-gradient-to-br ${activeCard.gradient || DEFAULT_PRESET_CARDS[0].gradient} text-white border shadow-xl relative overflow-hidden transition-all duration-500 transform group-hover:scale-[1.01]`}>
                    
                    {/* Background Decorative Mesh */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12),_transparent_50%)] pointer-events-none"></div>

                    {/* Top Row: Chip, Contactless Icon, Brand & Badge */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-2.5">
                            {/* Golden Metallic EMV Chip */}
                            <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 p-[1px] shadow-inner flex items-center justify-center relative overflow-hidden border border-amber-200/80">
                                <div className="w-full h-[1px] bg-amber-700/40 absolute top-1.5"></div>
                                <div className="w-full h-[1px] bg-amber-700/40 absolute bottom-1.5"></div>
                                <div className="h-full w-[1px] bg-amber-700/40 absolute left-2.5"></div>
                                <div className="h-full w-[1px] bg-amber-700/40 absolute right-2.5"></div>
                                <div className="w-3 h-3 rounded border border-amber-600/30"></div>
                            </div>
                            <Wifi size={18} className="text-white/70 rotate-90" />
                        </div>

                        <div className="flex flex-col items-end gap-0.5">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                                activeCard.isDeclined 
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                                    : 'bg-white/15 text-white border-white/20'
                            }`}>
                                {activeCard.isDeclined ? (
                                    <span className="flex items-center gap-1"><AlertCircle size={9} /> {activeCard.badgeText || 'Declined'}</span>
                                ) : (
                                    <span className="flex items-center gap-1"><ShieldCheck size={9} /> {activeCard.badgeText || 'Passing Card'}</span>
                                )}
                            </span>
                            <span className="text-lg font-black italic tracking-wider text-white drop-shadow-sm">
                                {activeCard.brand || 'Card'}
                            </span>
                        </div>
                    </div>

                    {/* Card Number Row */}
                    <div className="mb-3 relative z-10">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.25em]">Card Number</span>
                            <button
                                type="button"
                                onClick={() => setShowFullNumber(!showFullNumber)}
                                className="text-white/60 hover:text-white transition-colors text-[9px] flex items-center gap-1 focus:outline-none"
                            >
                                {showFullNumber ? <EyeOff size={11} /> : <Eye size={11} />}
                                <span>{showFullNumber ? 'Hide' : 'Reveal'}</span>
                            </button>
                        </div>
                        <p className="font-mono text-lg sm:text-xl font-black tracking-[0.16em] text-white drop-shadow">
                            {showFullNumber 
                                ? (activeCard.number || '•••• •••• •••• ••••') 
                                : `•••• •••• •••• ${activeCard.number?.slice(-4) || '••••'}`}
                        </p>
                    </div>

                    {/* Balance Banner Row */}
                    <div className="mb-3 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-1.5">
                            <Wallet size={13} className="text-amber-300" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/70">Card Demo Balance</span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-300 tabular-nums">
                            {formatCurrency(activeCard.balance)}
                        </span>
                    </div>

                    {/* Bottom Row: Holder Name & Expiry / CVV */}
                    <div className="flex justify-between items-end relative z-10 pt-1.5 border-t border-white/10">
                        <div>
                            <span className="block text-[7px] font-black text-white/50 uppercase tracking-[0.25em]">Cardholder</span>
                            <span className="text-xs font-black tracking-widest text-white uppercase truncate max-w-[160px] block">
                                {activeCard.holder || 'DEMO CUSTOMER'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <span className="block text-[7px] font-black text-white/50 uppercase tracking-[0.25em]">Expires</span>
                                <span className="text-xs font-mono font-bold tracking-wider text-white">
                                    {activeCard.expiry || '12/28'}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[7px] font-black text-white/50 uppercase tracking-[0.25em]">CVV</span>
                                <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
                                    {activeCard.cvv || '•••'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Saved Cards Header & Add Card Action */}
            <div className="flex justify-between items-center pt-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
                    <Sparkles size={12} className="text-amber-500" /> Select Demo Card ({userCards.length})
                </label>
                <button
                    type="button"
                    onClick={() => setShowAddCardModal(true)}
                    className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 uppercase tracking-wider flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900 transition-all active:scale-95"
                >
                    <Plus size={12} strokeWidth={3} /> Add Custom Card
                </button>
            </div>

            {/* User-Wise Saved Demo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar p-0.5">
                {userCards.map((card) => {
                    const isSelected = activeCardId === card.id;
                    return (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => handleSelectCard(card)}
                            className={`p-2.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                                isSelected 
                                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 shadow-sm ring-2 ring-blue-500/20' 
                                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[11px] transition-colors ${
                                    card.isDeclined 
                                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' 
                                        : isSelected
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-slate-600'
                                }`}>
                                    {card.brand?.[0] || 'C'}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-slate-900 dark:text-white leading-tight flex items-center gap-1 truncate max-w-[110px]">
                                        {card.name}
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                        •••• {card.number.slice(-4)} • <span className="text-amber-600 dark:text-amber-400">₹{(card.balance || 0).toLocaleString('en-IN')}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                {card.isCustom && (
                                    <span 
                                        onClick={(e) => handleDeleteCard(card.id, e)}
                                        className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                        title="Delete Card"
                                    >
                                        <Trash2 size={12} />
                                    </span>
                                )}
                                {isSelected && <Check size={14} className="text-blue-600 dark:text-blue-400 stroke-[3]" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Modal for Adding New User Custom Card */}
            {showAddCardModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddCardModal(false)}></div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md relative z-10 shadow-2xl space-y-4 animate-fadeIn">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard size={18} className="text-blue-600 dark:text-blue-400" /> Add Custom Demo Card
                            </h3>
                            <button onClick={() => setShowAddCardModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCard} className="space-y-3.5">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Card Nickname</label>
                                <input
                                    type="text"
                                    value={newCardForm.name}
                                    onChange={(e) => setNewCardForm({ ...newCardForm, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-bold text-xs text-slate-900 dark:text-white"
                                    placeholder="e.g. My HDFC Card"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Card Number (16-digits)</label>
                                <input
                                    type="text"
                                    value={newCardForm.number}
                                    onChange={(e) => setNewCardForm({ ...newCardForm, number: formatCardNumber(e.target.value) })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono font-bold text-xs text-slate-900 dark:text-white"
                                    placeholder="4242 4242 4242 4242"
                                    maxLength={19}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={newCardForm.holder}
                                        onChange={(e) => setNewCardForm({ ...newCardForm, holder: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-bold text-xs text-slate-900 dark:text-white uppercase"
                                        placeholder="JOHN DOE"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Initial Demo Balance (₹)</label>
                                    <input
                                        type="number"
                                        value={newCardForm.balance}
                                        onChange={(e) => setNewCardForm({ ...newCardForm, balance: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-bold text-xs text-slate-900 dark:text-white"
                                        placeholder="25000"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Expiry (MM/YY)</label>
                                    <input
                                        type="text"
                                        value={newCardForm.expiry}
                                        onChange={(e) => setNewCardForm({ ...newCardForm, expiry: formatExpiry(e.target.value) })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono font-bold text-xs text-slate-900 dark:text-white text-center"
                                        placeholder="12/28"
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">CVV</label>
                                    <input
                                        type="text"
                                        value={newCardForm.cvv}
                                        onChange={(e) => setNewCardForm({ ...newCardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl outline-none focus:border-blue-500 font-mono font-bold text-xs text-slate-900 dark:text-white text-center"
                                        placeholder="123"
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Card Theme</label>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {CARD_THEMES.map(theme => (
                                        <button
                                            key={theme.id}
                                            type="button"
                                            onClick={() => setNewCardForm({ ...newCardForm, theme: theme.id })}
                                            className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${theme.gradient} border flex items-center justify-center transition-all ${
                                                newCardForm.theme === theme.id ? 'ring-2 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'
                                            }`}
                                            title={theme.label}
                                        >
                                            {newCardForm.theme === theme.id && <Check size={12} className="text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus size={14} strokeWidth={3} /> Save Custom Card
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoCardSelector;
