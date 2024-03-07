import React, { useEffect, useState } from 'react';
import s from './AreYouSure.module.scss';
import { useRouter } from 'next/navigation';
import { useFetching } from '@/hooks/useFetching';
import CircleSpinner from '../Loaders/CircleSpinner';
import cn from 'classnames';
import { delay } from '@/utils/delay';

interface AreYouSureProps {
  action: () => Promise<any>;
  closeModal: () => void;
  message: string;
}

const AreYouSure: React.FC<AreYouSureProps> = ({ action, closeModal, message }) => {
  const [newAction, isLoading, error] = useFetching(action);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(true);
  }, []);
  console.log(error);
  const onClickYes = async () => {
    const err = await newAction();
    if (err) {
      return;
    }
    setAnimate(false);
    await delay(400);
    closeModal();
  };
  const onClickNo: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement> = async (e) => {
    if (!isLoading) {
      setAnimate(false);
      await delay(300);
      closeModal();
    }
  };
  return (
    <div className={cn(s.blackout, { [s.blackout_shown]: animate })} onClick={onClickNo}>
      <div
        className={cn(s.confirmWindow, { [s.confirmWindow_shown]: animate })}
        onClick={(e) => e.stopPropagation()}>
        <h2 className={s.confirmWindow_title}>Подтвердите действие</h2>
        <p className={s.confirmWindow_message}>{message}</p>
        {error && error?.response?.data?.message && (
          <p className={s.confirmWindow_error}>{error?.response?.data?.message}</p>
        )}
        <div className={s.confirmWindow_btns}>
          <button disabled={isLoading} onClick={onClickYes} className={s.confirmWindow_yes}>
            {isLoading ? (
              <CircleSpinner
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-90"
                alt="loading..."
              />
            ) : (
              'Да'
            )}
          </button>
          <button disabled={isLoading} onClick={onClickNo} className={s.confirmWindow_no}>
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreYouSure;
