import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import MainLayout from '@components/layout/MainLayout';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { contactSchema, ContactFormData } from '@validation/contactSchema';
import { contactService } from '@services/contactService';

const Contact: FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema) as any,
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await contactService.submitContact(data);
      if (response.success) {
        setSubmitSuccess(true);
        reset();
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setSubmitError(response.message);
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again later.');
      console.error('Contact form error:', error);
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="py-12 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Get In Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Mail className="text-primary-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Email
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <a
                  href="mailto:contact@nexora.com"
                  className="hover:text-primary-500 transition-colors"
                >
                  contact@nexora.com
                </a>
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Phone className="text-primary-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Phone
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                <a
                  href="tel:+1-800-123-4567"
                  className="hover:text-primary-500 transition-colors"
                >
                  +1 (800) 123-4567
                </a>
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <MapPin className="text-primary-500" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Location
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                San Francisco, CA, USA
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Send us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                We'll get back to you as soon as possible.
              </p>

              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-700 dark:text-green-300">
                    ✓ Message sent successfully! We'll be in touch soon.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300">
                    {submitError}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Name"
                      type="text"
                      placeholder="Your name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                  </div>
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="What is this about?"
                    error={errors.subject?.message}
                    {...register('subject')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us more..."
                    rows={6}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                      transition-colors duration-200 resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={isSubmitting}
                  className="flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                q: 'How can I create an event?',
                a: 'Sign up as an organizer and use our event creation tools to set up your event with all the details.',
              },
              {
                q: 'Is there a fee to attend events?',
                a: 'It depends on the event organizer. Some events are free while others may have a registration fee.',
              },
              {
                q: 'How do I get refunded if I can\'t attend?',
                a: 'Please contact the event organizer directly. Refund policies vary by event.',
              },
              {
                q: 'Can I promote my event?',
                a: 'Yes! Our platform provides tools and features to help you promote your event effectively.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-sm"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Contact;
