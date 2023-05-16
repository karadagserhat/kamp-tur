/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51JYmDlHz7eUSDF0l7WtjrHsVXHn7mUZEbC0vMvuLRzxwTxA1hXZAyfbpTiACdxAVJqV0LQ42JdKuK67BUXsiwk9X00R0u53OLQ'
  );
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
