'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

export function MonthCountdown() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = endOfMonth.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return (
      <div className="mb-6 glass-panel rounded-xl p-3 sm:p-4 flex items-center gap-3 border border-neon-purple/20">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-purple/15 border border-neon-purple/40 flex items-center justify-center">
          <Clock className="h-5 w-5 text-neon-purple" />
        </div>
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-body text-muted-foreground">
            Cargando contador...
          </p>
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft.days <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={`mb-6 glass-panel rounded-xl p-3 sm:p-4 flex items-center gap-3 border ${isUrgent ? 'border-destructive/30' : 'border-neon-purple/20'}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${isUrgent ? 'bg-destructive/15 border-destructive/40' : 'bg-neon-purple/15 border-neon-purple/40'} flex items-center justify-center`}>
        <Clock className={`h-5 w-5 ${isUrgent ? 'text-destructive' : 'text-neon-purple'}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-body text-muted-foreground leading-relaxed">
          <span className={`${isUrgent ? 'text-destructive' : 'text-neon-purple'} font-semibold`}>
            {isUrgent && <AlertCircle className="h-3 w-3 inline mr-1" />}
            El ranking de este mes cierra en
          </span>{' '}
          <span className="font-display font-bold text-foreground">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </p>
      </div>
    </motion.div>
  );
}
