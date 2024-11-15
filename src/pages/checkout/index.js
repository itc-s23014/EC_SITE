import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function PaymentMethodDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/payment_intents/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) setError(data.error);
                    else setPaymentMethod(data);
                })
                .catch(err => setError(err.message));
        }
    }, [id]);

    if (error) return <p>Error: {error}</p>;
    if (!paymentMethod) return <p>Loading...</p>;

    return (
        <div>
            <h1>Payment Method Details</h1>
            <pre>{JSON.stringify(paymentMethod, null, 2)}</pre>
        </div>
    );
}

export default PaymentMethodDetails;
