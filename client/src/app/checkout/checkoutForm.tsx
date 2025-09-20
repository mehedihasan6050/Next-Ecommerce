/* eslint-disable react-hooks/exhaustive-deps */
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import {toast} from 'sonner'
import { Button } from '@/components/ui/button'
import { API_ROUTES } from '@/utils/api';

interface CheckoutFormProps {
  closeModal: () => void;
  productInfo: any;
  clearCart: () => Promise<void>

}

const CheckoutForm = ({ closeModal, productInfo, clearCart }: CheckoutFormProps) => {

  const [clientSecret, setClientSecret] = useState('')
  const [processing, setProcessing] = useState(false)
    const router = useRouter();

  useEffect(() => {
    getPaymentIntent()
  }, [productInfo])
  console.log(clientSecret)
  const getPaymentIntent = async () => {
    try {
      const { data } = await axios.post( `${API_ROUTES.ORDER}/create-payment-intent`, {
        totalPrice: productInfo?.totalPrice,
        productIds: productInfo?.productIds,
      },{ withCredentials: true })
      setClientSecret(data.clientSecret)
    } catch (err) {
      console.log(err)
    }
  }

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent) => {
    setProcessing(true)
    // Block native form submission.
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement)

    if (card == null) {
      setProcessing(false)
      return
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    })
    if (error) {
      setProcessing(false)
      return console.log('[error]', error)
    } else {
      console.log('[PaymentMethod]', paymentMethod)
    }
    // confirm payment
    const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: productInfo?.name,
          email: productInfo?.checkoutEmail,
        },
      },
    })

    if (paymentIntent?.status === 'succeeded') {
      try {
        // Save data in db
        const orderData = {
          ...productInfo,
          paymentId: paymentIntent?.id
        }
         await axios.post(
        `${API_ROUTES.ORDER}/create-order`,
          orderData,
        { withCredentials: true }
      );
        toast.success('Order Successful!')
        router.push('/account')
        console.log(paymentIntent)
        clearCart()
      } catch (err) {
        console.log(err)
      } finally {
        setProcessing(false)
        closeModal()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
  <div className="bg-white p-6 rounded-2xl shadow-md max-w-md mx-auto">
    <div className="border p-3 rounded-lg mb-4">
      <CardElement className="w-full" />
    </div>
    <div className="flex justify-between gap-3">
      <Button
        disabled={!stripe || !clientSecret || processing}
        type="submit"
        className="flex-1"
      >
        {processing ? "processing" : `Pay $${productInfo?.totalPrice}`}
      </Button>
      <Button variant="outline" onClick={closeModal} className="flex-1">
        Cancel
      </Button>
    </div>
  </div>
</form>

  )
}
export default CheckoutForm

