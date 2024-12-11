import React, { useState } from 'react';
import BackButton from "@/components/BackButton/BackButton";
import { useAuthGuard } from '@/hooks/useAuthGuard';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user, loading: authloading } = useAuthGuard(); //認証を強制

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);


        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, message}),
            });

            if (response.ok) {
                setSuccessMessage('お問い合わせを受け付けました。追ってご連絡いたします。');
                setErrorMessage('');
            } else {
                throw new Error('送信に失敗しました');
            }
        } catch (error) {
            setErrorMessage('送信に失敗しました。再度お試しください。');
            setSuccessMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxWidth: '700px',
            margin: '0 auto',
            overflowY: 'auto'
        }}>
            <BackButton/>
            <h2 style={{textAlign: 'center', marginBottom: '30px', fontSize: '24px'}}>お問い合わせ</h2>

            {successMessage && (
                <p style={{color: 'green', textAlign: 'center', fontSize: '18px'}}>{successMessage}</p>
            )}

            {errorMessage && (
                <p style={{color: 'red', textAlign: 'center', fontSize: '18px'}}>{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                <label htmlFor="name" style={{marginBottom: '12px', fontSize: '18px'}}>お名前</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                        padding: '14px',
                        marginBottom: '20px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '18px',
                    }}
                />

                <label htmlFor="email" style={{marginBottom: '12px', fontSize: '18px'}}>メールアドレス</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '14px',
                        marginBottom: '20px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '18px',
                    }}
                />

                <label htmlFor="message" style={{marginBottom: '12px', fontSize: '18px'}}>お問い合わせ内容</label>
                <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows="8"
                    style={{
                        padding: '14px',
                        marginBottom: '20px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '18px',
                        resize: 'vertical',
                    }}
                ></textarea>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: '14px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '18px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    }}
                >
                    {isSubmitting ? '送信中...' : '送信'}
                </button>
            </form>
        </div>
    );
}
export default ContactPage;
