
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from './checkoutForm'



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

interface PurchaseModalProps {
  closeModal: () => void;
  isOpen: boolean;
  productInfo: any;
  clearCart: () => Promise<void>
}

const PurchaseModal = ({ closeModal, isOpen, productInfo ,clearCart}: PurchaseModalProps) => {

 


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50"> 
      <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        
         {/* CheckoutForm */}
                <Elements stripe={stripePromise}>
                  {/* Form component */}
                  <CheckoutForm
                    closeModal={closeModal}
                    productInfo={productInfo}
                    clearCart={clearCart}
                  />
                </Elements>

       </div>
   </div>
  )
}

export default PurchaseModal
