import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`bg-white dark:bg-slate-900/50 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden ${noPadding ? '' : 'p-8'} ${className} transition-colors duration-500`}>
            {children}
        </div>
    );
};

export default Card;
