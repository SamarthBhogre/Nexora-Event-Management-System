import { ContactFormData } from '@validation/contactSchema';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'read' | 'responded';
}

// Mock messages storage
const mockMessages: ContactMessage[] = [];

export const contactService = {
  /**
   * Submit contact form
   */
  async submitContact(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contactMessage: ContactMessage = {
          id: Date.now().toString(),
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          timestamp: new Date().toISOString(),
          status: 'pending',
        };

        mockMessages.push(contactMessage);

        resolve({
          success: true,
          message: 'Thank you for contacting us! We will get back to you soon.',
        });
      }, 1200);
    });
  },

  /**
   * Get all messages (admin only in real app)
   */
  async getAllMessages(): Promise<ContactMessage[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockMessages]);
      }, 500);
    });
  },
};
