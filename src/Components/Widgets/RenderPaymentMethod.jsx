import React from 'react';
import { GoDotFill } from 'react-icons/go';
import Button from '../Controls/Button';
import { IconImages } from '../../Enums/Enums';

const RenderPaymentMethod = ({ savedCard, onChangeCard, loading }) => {
  if (!savedCard) {
    return (
      <div className="p-4 border border-border rounded-md flex justify-between my-2">
        <p className="text-secondary">No saved payment method.</p>
        <Button
          variant="secondary"
          action={onChangeCard}
          loading={loading}
          label="Add Method"
        />
      </div>
    );
  }

  const normalizePaymentMethod = (pm) => {
    switch (pm.type) {
      case 'card':
        return { type: 'card', ...pm.card };
      case 'link':
        return { type: 'link', email: pm.link?.email };
      case 'us_bank_account':
        return { type: 'bank', last4: pm.us_bank_account?.last4 };
      default:
        return { type: pm.type };
    }
  };

  const paymentMethod = normalizePaymentMethod(savedCard);

  const renderCardDetails = () => {
    switch (paymentMethod.type) {
      case 'card':
        return (
          <>
            <div className="flex items-center gap-2 font-bold text-lg text-secondary">
              <img src={IconImages.card} alt="Card" className="w-[33px]" />
              {paymentMethod.brand?.toUpperCase() ?? "UNKNOWN"}
              <div className="flex items-center !text-[8px] h-full">
                <GoDotFill /> <GoDotFill /> <GoDotFill />
              </div>
              {paymentMethod.last4}
            </div>
            <p className="text-secondary font-medium text-sm capitalize">
              Method Type: {paymentMethod.type}
            </p>
          </>
        );

      case 'link':
        return (
          <>
            <div className="flex items-center gap-2 font-bold text-2xl text-secondary">
              <img src={IconImages.link} alt="Link" className="w-[30px]" />
              Link
            </div>
            <p className="text-secondary font-medium text-sm">
              Email: {paymentMethod.email ?? "N/A"}
            </p>
          </>
        );

      case 'bank':
        return (
          <>
            <div className="flex items-center gap-2 font-bold text-lg text-secondary">
              <img src={IconImages.card} alt="Bank" className="w-[33px]" />
              Account
              <div className="flex items-center !text-[8px] h-full">
                <GoDotFill /> <GoDotFill /> <GoDotFill />
              </div>
              {paymentMethod.last4}
            </div>
            <p className="text-secondary font-medium text-sm capitalize">
              Method Type: {paymentMethod.type}
            </p>
          </>
        );

      default:
        return (
          <>
            <div className="flex items-center gap-2 font-bold text-lg text-secondary">
              <img src={IconImages.card} alt="Method" className="w-[30px]" />
              Unknown Method
            </div>
            <p className="text-secondary font-medium text-sm capitalize">
              Method Type: {paymentMethod.type}
            </p>
          </>
        );
    }
  };

  return (
    <div className="p-4 border border-border rounded-md flex justify-between my-2">
      <div className="flex flex-col items-start gap-2">
        {renderCardDetails()}
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="secondary"
          action={onChangeCard}
          loading={loading}
          label="Change Method"
        />
        {paymentMethod?.exp_month && paymentMethod?.exp_year && (
          <p className="text-secondary">
            Exp: {paymentMethod.exp_month}/{paymentMethod.exp_year}
          </p>
        )}
      </div>
    </div>
  );
};

export default RenderPaymentMethod;
