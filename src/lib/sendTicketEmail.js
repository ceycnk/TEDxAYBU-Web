import emailjs from '@emailjs/browser';

/**
 * Katılımcıya QR Kodlu Bilet E-postası Gönderir
 * Gönderici: tedxaybu@gmail.com (EmailJS Gmail servisi üzerinden)
 */
export const sendTicketEmail = async ({ to_email, to_name, student_number, ticket_code }) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Eğer anahtarlar henüz girilmediyse hata fırlatmadan konsola bilgi ver
    if (!serviceId || !templateId || !publicKey) {
        console.info('EmailJS anahtarları henüz .env dosyasına eklenmediği için simüle ediliyor.');
        return { success: true, simulated: true };
    }

    // Her e-posta istemcisinde (Gmail, Apple Mail vb.) sorunsuz görünen doğrudan QR görseli
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket_code)}`;

    try {
        const response = await emailjs.send(
            serviceId,
            templateId,
            {
                to_email,
                to_name,
                student_number,
                ticket_code,
                qr_code_url: qrCodeUrl,
                event_name: 'TEDxAYBU 2026',
                event_venue: 'AYBÜ Kongre ve Kültür Merkezi'
            },
            publicKey
        );

        return { success: true, response };
    } catch (error) {
        console.error('Bilet e-posta gönderim hatası:', error);
        return { success: false, error };
    }
};
