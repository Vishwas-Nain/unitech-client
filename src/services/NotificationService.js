import api from '../api/api';

class NotificationService {
  // Email notifications
  static async sendOrderConfirmation(orderId, userEmail, orderDetails) {
    try {
      const response = await api.post('/api/notifications/email/order-confirmation', {
        orderId,
        userEmail,
        orderDetails,
        type: 'order_confirmation'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendOrderStatusUpdate(orderId, userEmail, newStatus, orderDetails) {
    try {
      const response = await api.post('/api/notifications/email/status-update', {
        orderId,
        userEmail,
        newStatus,
        orderDetails,
        type: 'status_update'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send status update email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendPaymentConfirmation(orderId, userEmail, paymentDetails) {
    try {
      const response = await api.post('/api/notifications/email/payment-confirmation', {
        orderId,
        userEmail,
        paymentDetails,
        type: 'payment_confirmation'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send payment confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendCancellationNotice(orderId, userEmail, cancellationReason) {
    try {
      const response = await api.post('/api/notifications/email/cancellation', {
        orderId,
        userEmail,
        cancellationReason,
        type: 'order_cancelled'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendReturnConfirmation(orderId, userEmail, returnDetails) {
    try {
      const response = await api.post('/api/notifications/email/return-confirmation', {
        orderId,
        userEmail,
        returnDetails,
        type: 'return_confirmation'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send return confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // SMS notifications (using Twilio or similar service)
  static async sendOrderSMS(userPhone, message, type) {
    try {
      const response = await api.post('/api/notifications/sms', {
        phoneNumber: userPhone,
        message,
        type
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendOrderConfirmationSMS(orderId, userPhone) {
    const message = `Dear Customer, your order #${orderId} has been placed successfully. Thank you for shopping with Unitech Production!`;
    return this.sendOrderSMS(userPhone, message, 'order_confirmation');
  }

  static async sendOrderStatusUpdateSMS(orderId, userPhone, newStatus) {
    const statusMessages = {
      'PROCESSING': 'is being processed',
      'SHIPPED': 'has been shipped',
      'OUT_FOR_DELIVERY': 'is out for delivery',
      'DELIVERED': 'has been delivered'
    };
    
    const message = `Your order #${orderId} ${statusMessages[newStatus] || `status updated to ${newStatus}`}. Track your order on our website.`;
    return this.sendOrderSMS(userPhone, message, 'status_update');
  }

  static async sendPaymentConfirmationSMS(orderId, userPhone, amount) {
    const message = `Payment of $${amount} for order #${orderId} has been received successfully. Thank you!`;
    return this.sendOrderSMS(userPhone, message, 'payment_confirmation');
  }

  // WhatsApp notifications (using WhatsApp Business API)
  static async sendWhatsAppMessage(userPhone, templateName, templateData) {
    try {
      const response = await api.post('/api/notifications/whatsapp', {
        phoneNumber: userPhone,
        templateName,
        templateData
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendOrderConfirmationWhatsApp(orderId, userPhone, customerName) {
    return this.sendWhatsAppMessage(userPhone, 'order_confirmation', {
      customer_name: customerName,
      order_id: orderId,
      company_name: 'Unitech Production'
    });
  }

  static async sendOrderStatusUpdateWhatsApp(orderId, userPhone, newStatus, trackingLink) {
    return this.sendWhatsAppMessage(userPhone, 'order_status_update', {
      order_id: orderId,
      status: newStatus.replace('_', ' ').toLowerCase(),
      tracking_link: trackingLink
    });
  }

  // Push notifications for web/mobile
  static async sendPushNotification(userId, title, body, data = {}) {
    try {
      const response = await api.post('/api/notifications/push', {
        userId,
        title,
        body,
        data
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility method to send notifications across multiple channels
  static async sendMultiChannelNotification(orderId, user, notificationType, data = {}) {
    const notifications = [];

    try {
      switch (notificationType) {
        case 'order_confirmation':
          notifications.push(
            this.sendOrderConfirmation(orderId, user.email, data.orderDetails),
            this.sendOrderConfirmationSMS(orderId, user.phone),
            this.sendOrderConfirmationWhatsApp(orderId, user.phone, user.name),
            this.sendPushNotification(user.id, 'Order Confirmed!', `Your order #${orderId} has been placed successfully.`, { orderId })
          );
          break;

        case 'status_update':
          notifications.push(
            this.sendOrderStatusUpdate(orderId, user.email, data.newStatus, data.orderDetails),
            this.sendOrderStatusUpdateSMS(orderId, user.phone, data.newStatus),
            this.sendOrderStatusUpdateWhatsApp(orderId, user.phone, data.newStatus, data.trackingLink),
            this.sendPushNotification(user.id, 'Order Updated', `Your order #${orderId} status: ${data.newStatus}`, { orderId })
          );
          break;

        case 'payment_confirmation':
          notifications.push(
            this.sendPaymentConfirmation(orderId, user.email, data.paymentDetails),
            this.sendPaymentConfirmationSMS(orderId, user.phone, data.amount),
            this.sendPushNotification(user.id, 'Payment Confirmed', `Payment of $${data.amount} received for order #${orderId}`, { orderId })
          );
          break;

        case 'order_cancelled':
          notifications.push(
            this.sendCancellationNotice(orderId, user.email, data.reason),
            this.sendOrderSMS(user.phone, `Your order #${orderId} has been cancelled. Reason: ${data.reason}`, 'order_cancelled'),
            this.sendPushNotification(user.id, 'Order Cancelled', `Your order #${orderId} has been cancelled`, { orderId })
          );
          break;

        case 'return_confirmation':
          notifications.push(
            this.sendReturnConfirmation(orderId, user.email, data.returnDetails),
            this.sendOrderSMS(user.phone, `Return request for order #${orderId} has been received and is being processed.`, 'return_confirmation'),
            this.sendPushNotification(user.id, 'Return Requested', `Return request for order #${orderId} received`, { orderId })
          );
          break;

        default:
          console.warn('Unknown notification type:', notificationType);
      }

      const results = await Promise.allSettled(notifications);
      
      // Log any failures but don't throw
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Notification channel ${index} failed:`, result.reason);
        }
      });

      return { success: true, results };
    } catch (error) {
      console.error('Multi-channel notification failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default NotificationService;
