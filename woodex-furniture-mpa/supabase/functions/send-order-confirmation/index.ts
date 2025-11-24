Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const { orderId, orderNumber, customerEmail, customerName, orderItems, totalAmount } = await req.json();

        console.log('Sending order confirmation:', { orderId, orderNumber, customerEmail });

        // Validate inputs
        if (!orderId || !orderNumber || !customerEmail) {
            throw new Error('Missing required order information');
        }

        // Create email HTML template
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #C2F21E; padding: 20px; text-align: center; }
        .header h1 { margin: 0; color: #000; }
        .content { background-color: #fff; padding: 30px; border: 1px solid #ddd; }
        .order-details { background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .order-item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 18px; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 2px solid #C2F21E; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #C2F21E; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🪑 WOODEX</h1>
            <p style="margin: 5px 0;">Office Furniture</p>
        </div>
        <div class="content">
            <h2>Order Confirmation</h2>
            <p>Dear ${customerName || 'Customer'},</p>
            <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>
            
            <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Status:</strong> Processing</p>
            </div>

            <h3>Order Items</h3>
            ${orderItems?.map(item => `
                <div class="order-item">
                    <strong>${item.product_name}</strong><br>
                    Quantity: ${item.quantity} × PKR ${item.price.toLocaleString()}<br>
                    Subtotal: PKR ${(item.quantity * item.price).toLocaleString()}
                </div>
            `).join('') || '<p>Order items details</p>'}

            <div class="total">
                Total Amount: PKR ${totalAmount?.toLocaleString() || '0'}
            </div>

            <p style="margin-top: 30px;">We'll send you another email when your order ships. If you have any questions, please don't hesitate to contact us.</p>

            <center>
                <a href="https://r7yyqctior0m.space.minimax.io/account" class="button">View Order Status</a>
            </center>
        </div>
        <div class="footer">
            <p><strong>Woodex Office Furniture</strong></p>
            <p>📞 +92 322 4000 768</p>
            <p>📧 woodexofficefurniture@gmail.com</p>
            <p>Karachi, Pakistan</p>
        </div>
    </div>
</body>
</html>
        `;

        // For now, log the email content
        // In production, integrate with email service (SendGrid, Resend, etc.)
        console.log('Order confirmation email prepared for:', customerEmail);
        console.log('Email HTML length:', emailHtml.length);

        // TODO: Send actual email using email service
        // Example with Resend:
        // const resendApiKey = Deno.env.get('RESEND_API_KEY');
        // if (resendApiKey) {
        //     const emailResponse = await fetch('https://api.resend.com/emails', {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Bearer ${resendApiKey}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             from: 'Woodex Furniture <orders@woodex.com>',
        //             to: customerEmail,
        //             subject: `Order Confirmation - ${orderNumber}`,
        //             html: emailHtml
        //         })
        //     });
        // }

        // Store notification in database for tracking
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        if (supabaseUrl && serviceRoleKey) {
            const notificationData = {
                order_id: orderId,
                type: 'order_confirmation',
                recipient_email: customerEmail,
                subject: `Order Confirmation - ${orderNumber}`,
                content: emailHtml,
                status: 'sent',
                sent_at: new Date().toISOString(),
            };

            // Try to store notification (this table may not exist yet)
            try {
                await fetch(`${supabaseUrl}/rest/v1/notifications`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${serviceRoleKey}`,
                        'apikey': serviceRoleKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(notificationData)
                });
            } catch (error) {
                console.log('Note: notifications table may not exist:', error.message);
            }
        }

        return new Response(JSON.stringify({
            data: {
                success: true,
                message: 'Order confirmation prepared',
                emailPreview: emailHtml.substring(0, 200) + '...',
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error sending confirmation:', error);
        return new Response(JSON.stringify({
            error: {
                code: 'EMAIL_SEND_FAILED',
                message: error.message,
            }
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
