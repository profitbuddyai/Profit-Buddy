import { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoWarningOutline } from 'react-icons/io5';
import Modal from '../Components/UI/Modal';
import Button from '../Components/Controls/Button';

export default function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [resolver, setResolver] = useState(null);

  const confirm = (label = 'Please Confirm', text = 'Are you sure?', button1 = 'No, keep it', button2 = 'Yes, delete it', variant = 'danger') => {
    setMessage({
      label,
      text,
      button1,
      button2,
      variant,
    });
    setIsOpen(true);
    return new Promise((resolve) => setResolver(() => resolve));
  };

  const handleConfirm = () => {
    resolver(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolver(false);
    setIsOpen(false);
  };

  const ConfirmationModal = createPortal(
    <>
      <Modal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        extraFuntion={() => resolver(false)}
        className={'max-'}
        label={message?.label}
        // subText={message?.text}
        actions={
          <>
            <Button label={message?.button1} size='medium' variant="outline" action={handleCancel} />
            <Button label={message?.button2} size='medium' variant={message?.variant || 'danger'} action={handleConfirm} />
          </>
        }
      >
        <div className=" flex  items-center flex-col w-full">
          <p className='text-lText'>{message?.text}</p>
        </div>
      </Modal>
    </>,
    document.body
  );

  return { confirm, ConfirmationModal };
}
