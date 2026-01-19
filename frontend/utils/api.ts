const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function createPaymentIntent(paymentData) {
  try {
    const response = await fetch(`${API_URL}/api/payment/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if using auth
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw error;
  }
}

export async function getPaymentStatus(paymentId) {
  try {
    const response = await fetch(`${API_URL}/api/payment/status/${paymentId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
}


export async function getUserPayments(userId, page = 1, limit = 10) {
  try {
    const response = await fetch(
      `${API_URL}/api/payment/user/${userId}?page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }

    return await response.json();
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
}