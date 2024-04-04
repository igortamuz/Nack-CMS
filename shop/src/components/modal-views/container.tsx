import { useEffect, Fragment } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  MODAL_VIEWS,
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { Dialog } from '@/components/ui/dialog';
import { Transition } from '@/components/ui/transition';
import { CloseIcon } from '@/components/icons/close-icon';
import { getDirection } from '@/lib/constants';

const LoginUserForm = dynamic(() => import('@/components/auth/login-form'));
const ProductPopupDetails = dynamic(
  () => import('@/components/product/product-popup')
);
const RegisterUserForm = dynamic(
  () => import('@/components/auth/register-form')
);
const ForgotUserPassword = dynamic(
  () => import('@/components/auth/forgot-password')
);
const ReviewImageModal = dynamic(
  () => import('@/components/review/review-image-modal')
);
const ReviewRating = dynamic(() => import('@/components/review/review-form'));
const AbuseReportForm = dynamic(
  () => import('@/components/review/abuse-report-form')
);
const QuestionForm = dynamic(
  () => import('@/components/questions/question-form')
);

const PaymentModal = dynamic(
  () => import('@/components/payment/payment-modal'),
  { ssr: false }
);
const AddNewPaymentModal = dynamic(
  () => import('@/components/payment/add-new-payment-modal'),
  { ssr: false }
);

const AddNewCardModal = dynamic(
  () => import('@/components/card/add-new-card-modal'),
  { ssr: false }
);

const DeleteCardModal = dynamic(() => import('@/components/card/delete-view'));

function renderModalContent(view: MODAL_VIEWS) {
  switch (view) {
    case 'REGISTER':
      return <RegisterUserForm />;
    case 'LOGIN_VIEW':
      return <LoginUserForm />;
    case 'FORGOT_PASSWORD_VIEW':
      return <ForgotUserPassword />;
    case 'PRODUCT_DETAILS':
      return <ProductPopupDetails />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'REVIEW_RATING':
      return <ReviewRating />;
    case 'ABUSE_REPORT':
      return <AbuseReportForm />;
    case 'QUESTION_FORM':
      return <QuestionForm />;
    case 'PAYMENT_MODAL':
      return <PaymentModal />;
    case 'USE_NEW_PAYMENT':
      return <AddNewPaymentModal />;
    case 'ADD_NEW_CARD':
      return <AddNewCardModal />;
    case 'DELETE_CARD_MODAL':
      return <DeleteCardModal />;
    default:
      return null;
  }
}

export default function ModalsContainer() {
  const router = useRouter();
  const { view, isOpen } = useModalState();
  const { closeModal } = useModalAction();
  useEffect(() => {
    // close search modal when route change
    router.events.on('routeChangeStart', closeModal);
    return () => {
      router.events.off('routeChangeStart', closeModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { locale } = router;
  const dir = getDirection(locale);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden xs:p-4"
        onClose={closeModal}
        dir={dir}
      >
        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 z-40 cursor-pointer bg-dark bg-opacity-60 backdrop-blur dark:bg-opacity-80" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-110"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-110"
          >
            <div className="relative z-50 inline-block min-h-screen w-full transform overflow-hidden text-start align-middle transition-all xs:min-h-[auto] xs:w-auto">
              <div className="relative flex min-h-screen items-center overflow-hidden xs:block xs:min-h-[auto] xs:rounded-md">
                <button
                  onClick={closeModal}
                  aria-label="Close panel"
                  className="absolute top-5 z-10 text-dark-900 outline-none transition-all hover:text-dark focus-visible:outline-none ltr:right-4 rtl:left-4 dark:text-dark-800 hover:dark:text-light-200 md:top-6 ltr:md:right-5 rtl:md:left-5 lg:top-7 ltr:lg:right-7 rtl:lg:left-7"
                >
                  <CloseIcon className="h-4 w-4 focus-visible:outline-none lg:h-[18px] lg:w-[18px] 3xl:h-5 3xl:w-5" />
                </button>
                <div className="h-full w-full">
                  {view && renderModalContent(view)}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
