import React, { useEffect, useState } from 'react';
import s from './SelfClosedInformCard.module.scss';
import cn from 'classnames';
import { delay } from '@/utils/delay';

interface SelfClosedInformCardProps {
  message: string;
  title: string;
}

const SelfClosedInformCard: React.FC<SelfClosedInformCardProps> = ({ message, title }) => {
  const [animate, setAnimate] = useState(false);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
    setAnimate(true);

    (async () => {
      await delay(3000);
      setAnimate(false);
      await delay(500);
      setOpen(false);
    })();
  }, [message]);
  if (!open) return null;
  return (
    <div className={cn(s.blackout, { [s.blackout_shown]: animate })}>
      <div className={cn(s.confirmWindow, { [s.confirmWindow_shown]: animate })}>
        <h2 className={s.confirmWindow_title}>{title}</h2>
        <p className={s.confirmWindow_message}>{message}</p>
      </div>
    </div>
  );
};

export default SelfClosedInformCard;
