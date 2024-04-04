import { useState } from 'react';
import Button from '@/components/ui/button';
import { useModalAction } from '@/components/modal-views/context';
import { useOrderPayment } from '@/data/order';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useModalState } from '@/components/modal-views/context';
import toast from 'react-hot-toast';
import Image from '@/components/ui/image';
import { Table } from '@/components/ui/table';
import { useIsRTL } from '@/lib/locals';
import amex from '@/assets/cards/amex.svg';
import diners from '@/assets/cards/diners.svg';
import discover from '@/assets/cards/discover.svg';
import jcb from '@/assets/cards/jcb.svg';
import mastercard from '@/assets/cards/mastercard.svg';
import unionpay from '@/assets/cards/unionpay.svg';
import visa from '@/assets/cards/visa.svg';
import CheckIconWithBg from '@/components/icons/check-icon-with-bg';
import Fallback from '@/assets/cards/fallback-image.png';
import { useTranslation } from 'next-i18next';
import { PlusIcon } from '@/components/icons/plus-icon';
import { useSettings } from '@/data/settings';

interface CardViewProps {
  view?: 'modal' | 'normal';
  payments: any;
}

let images = {
  amex,
  visa,
  diners,
  jcb,
  mastercard,
  unionpay,
  discover,
} as any;

const StripeSavedCardsList = ({
  view = 'normal',
  payments = [],
}: CardViewProps) => {
  const defaultCard = payments?.filter((payment: any) => payment?.default_card);
  const [selected, setSelected] = useState<any>(
    Object.assign({}, defaultCard.length ? defaultCard[0] : [])
  );
  const { t } = useTranslation('common');
  const { openModal } = useModalAction();
  const { settings } = useSettings();
  const stripe = useStripe();
  const elements = useElements();
  const { createOrderPayment } = useOrderPayment();
  const { data } = useModalState();
  const { paymentIntentInfo, trackingNumber } = data;
  const { closeModal } = useModalAction();
  const [loading, setLoading] = useState<any>(false);

  const onClickRow = (record: any) => {
    setSelected(record);
  };

  const continuePayment = async (method_key: string) => {
    if (!stripe || !elements) {
      return;
    }
    if (method_key) {
      setLoading(method_key);
      const confirmCardPayment = await stripe.confirmCardPayment(
        paymentIntentInfo?.client_secret!,
        {
          payment_method: method_key,
        }
      );

      await createOrderPayment({
        tracking_number: trackingNumber,
      });

      if (confirmCardPayment?.paymentIntent?.status === 'succeeded') {
        toast.success(t('text-payment-successful'));
        setLoading(false);
        closeModal();
      } else {
        //@ts-ignore
        toast.error(confirmCardPayment?.error?.message);
        setLoading(false);
        closeModal();
      }
    }
  };

  const handleAddNewCard = () => {
    openModal('USE_NEW_PAYMENT', {
      paymentIntentInfo,
      trackingNumber,
      paymentGateway: settings?.paymentGateway,
    });
  };

  const { alignLeft, alignRight } = useIsRTL();
  const columns = [
    {
      title: '',
      dataIndex: '',
      width: 50,
      align: alignLeft,
      render: (record: any) => {
        return selected?.id === record?.id ? (
          <div className="w-9 text-brand">
            <CheckIconWithBg className="h-5 w-5" />
          </div>
        ) : (
          ''
        );
      },
    },
    {
      title: <span>{t('text-company')}</span>,
      dataIndex: 'network',
      key: 'network',
      width: 100,
      align: alignLeft,
      render: (network: string) => {
        return (
          <div className="w-10">
            {network ? (
              <Image
                src={images[network]}
                width={40}
                height={28}
                layout="responsive"
                alt={t('text-company')}
              />
            ) : (
              <Image
                src={Fallback}
                width={40}
                height={28}
                layout="responsive"
                alt={t('text-company')}
              />
            )}
          </div>
        );
      },
    },
    {
      title: <span>{t('text-card-number')}</span>,
      dataIndex: 'last4',
      key: 'last4',
      align: alignLeft,
      width: 150,
      render: (last4: number) => {
        return <p className="truncate">{`**** **** **** ${last4}`}</p>;
      },
    },
    {
      title: <span>{t('text-card-owner-name')}</span>,
      dataIndex: 'owner_name',
      key: 'owner_name',
      align: alignLeft,
      width: 150,
      render: (owner_name: string) => {
        return <p className="truncate">{owner_name}</p>;
      },
    },
    {
      title: <span>{t('text-expire-date')}</span>,
      dataIndex: 'expires',
      key: 'expires',
      align: alignLeft,
      width: 110,
      render: (expires: string) => {
        return <p>{expires}</p>;
      },
    },
  ];
  return (
    <>
      <Table
        //@ts-ignore
        columns={columns}
        data={payments}
        className="w-full shadow-none"
        scroll={{ x: 650 }}
        rowClassName={(record, i) =>
          selected?.id === record?.id ? `row-highlight` : ''
        }
        emptyText={t('text-no-card-found')}
        onRow={(record) => ({
          onClick: onClickRow.bind(null, record, columns),
        })}
      />
      <div className="mt-8 flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleAddNewCard}
          className="StripePay px-5 text-sm !text-brand shadow-none dark:hover:!text-light md:px-7"
        >
          <PlusIcon className="mr-0.5" width={14} height={14} />
          {t('profile-add-cards')}
        </Button>
        <Button
          isLoading={loading}
          disabled={!!loading}
          className="!h-9 !px-6 text-sm md:!px-8"
          onClick={() => {
            continuePayment(selected?.method_key);
          }}
        >
          {t('text-pay')}
        </Button>
      </div>
    </>
  );
};

export default StripeSavedCardsList;
