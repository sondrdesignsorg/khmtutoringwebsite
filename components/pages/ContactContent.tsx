'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Clock, CheckCircle2, AlertCircle, Phone, ChevronRight, Brain } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ContactContent() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    school: '',
    subject: '',
    message: '',
  });
  const [diagnosticLeadId, setDiagnosticLeadId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const email = params.get('email');
    const ref = params.get('ref');
    if (name || email) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || name || '',
        email: prev.email || email || '',
      }));
    }
    if (ref && ref.startsWith('diagnostic:')) {
      const id = ref.slice('diagnostic:'.length);
      if (id) setDiagnosticLeadId(id);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      subject: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
      
      if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
        throw new Error('EmailJS is not configured. Please set up your EmailJS credentials.');
      }

      const templateParams = {
        to_email: 'khmtutoring1@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        grade: formData.grade || 'Not provided',
        school: formData.school || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      if (diagnosticLeadId) {
        fetch('/api/diagnostic/booked', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadId: diagnosticLeadId }),
        }).catch((err) => console.error('diagnostic booked notify failed:', err));
      }

      setSubmittedName(formData.name);
      setSubmitStatus('success');
      setShowSuccessDialog(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        grade: '',
        school: '',
        subject: '',
        message: '',
      });
      
      if (formRef.current) {
        formRef.current.reset();
      }

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Email sending failed:', error);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-8 md:py-10 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-3 md:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
              Contact KHM Tutoring{' '}
              <span className="text-gradient font-bold">in Honolulu</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Contact KHM Tutoring in Hawaii and Honolulu. Schedule a session or ask us anything about our tutoring services.
            </p>
            <div className="mt-6">
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <a href="#faq">
                  FAQ
                  <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
              How to Get Started
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Free Consultation</h3>
                <p className="text-sm text-muted-foreground">Submit the form below or call us. We&apos;ll discuss your child&apos;s needs and goals.</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Tutor Matching</h3>
                <p className="text-sm text-muted-foreground">We match your student with the ideal tutor based on subject, learning style, and personality.</p>
              </div>
              <div className="text-center p-6 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Learning</h3>
                <p className="text-sm text-muted-foreground">Sessions begin in-home, at a library, or online via Zoom - whatever works best for your family.</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link href="/educators" className="inline-flex items-center text-primary hover:underline font-medium text-sm">
                Meet our expert tutors <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Diagnostic nudge */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl border-2 border-primary/20 bg-primary/5">
              <div className="p-3 bg-primary/10 rounded-xl shrink-0">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-semibold text-foreground">Not sure where your child stands?</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Take our free 5-minute academic diagnostic first — it pinpoints exactly which topics need attention so we can hit the ground running.
                </p>
              </div>
              <Link
                href="/diagnostic-test"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Take the Test
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Left - Contact Info */}
            <div className="space-y-6 md:space-y-8">
              <div>
                <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl">
                  Let&apos;s Start Your Learning Journey
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Whether you&apos;re looking to boost grades, prep for tests, or build confidence, our Hawaii tutors are here to help.
                </p>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border border-border bg-blue-100">
                  <div className="p-1.5 md:p-2 rounded-lg flex-shrink-0 bg-blue-100">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-0.5 text-sm md:text-base font-semibold">Email</h3>
                    <p className="text-xs md:text-sm text-muted-foreground break-all">khmtutoring1@gmail.com</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border border-border bg-blue-100">
                  <div className="p-1.5 md:p-2 rounded-lg flex-shrink-0 bg-blue-100">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-0.5 text-sm md:text-base font-semibold">Phone</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">(808) 381-7856</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl border border-border bg-blue-100">
                  <div className="p-1.5 md:p-2 rounded-lg flex-shrink-0 bg-blue-100">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-0.5 text-sm md:text-base font-semibold">Office Hours</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">8 AM – 10 PM, 7 days a week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-card rounded-2xl md:rounded-3xl shadow-xl border border-border p-6 md:p-8 space-y-5 md:space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm md:text-base">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="h-11 md:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="h-11 md:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm md:text-base">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(808) 123-4567"
                    className="h-11 md:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade" className="text-sm md:text-base">Student Grade</Label>
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="e.g., 10th Grade"
                    className="h-11 md:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-sm md:text-base">School (Optional)</Label>
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    placeholder="e.g., Punahou School, Iolani School"
                    className="h-11 md:h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm md:text-base">Subject / Area of Interest *</Label>
                  <Select required value={formData.subject} onValueChange={handleSelectChange}>
                    <SelectTrigger className="h-11 md:h-12">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k12">K-12 General</SelectItem>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="ap">AP Subjects</SelectItem>
                      <SelectItem value="sat">SAT Prep</SelectItem>
                      <SelectItem value="ssat">SSAT Prep</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm md:text-base">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your learning goals and how we can help..."
                    required
                    className="min-h-[100px] md:min-h-[120px] resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Sorry, there was an error. Please try again or email us directly.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 py-5 md:py-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </Button>

                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  We&apos;ll respond within 24 hours
                </p>

                <noscript>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    JavaScript is required for this form. You can also reach us directly at{' '}
                    <a href="mailto:khmtutoring1@gmail.com" className="text-primary underline">khmtutoring1@gmail.com</a>{' '}
                    or call <a href="tel:+18083817856" className="text-primary underline">(808) 381-7856</a>.
                  </p>
                </noscript>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-8 md:py-12 bg-muted/30 scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  What subjects does KHM Tutoring offer?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  We offer Math (arithmetic through AP Calculus), English (reading comprehension, essay writing, grammar, vocabulary), SAT prep, SSAT prep, AP subject tutoring, and college counseling & essay writing for K-12 students in Hawaii.
                </p>
              </details>
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  What areas do you serve?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  KHM Tutoring provides in-home and online tutoring across Hawaii. We serve families in Honolulu, Kailua, Kapolei, Pearl City, Mililani, and throughout Oahu. Online sessions via Zoom are available statewide.
                </p>
              </details>
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  Do you offer online tutoring?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Yes! We offer both in-home tutoring throughout Honolulu and Oahu, as well as online tutoring via Zoom for students across all of Hawaii. Sessions are available 7 days a week from 8 AM to 10 PM.
                </p>
              </details>
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  How do I get started?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Schedule a free consultation through the form above or call us at <a href="tel:+18083817856" className="text-primary hover:underline">(808) 381-7856</a>. We&apos;ll discuss your child&apos;s needs, match them with the ideal tutor, and create a personalized learning plan.
                </p>
              </details>
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  What makes KHM different from other tutoring services?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  KHM Tutoring is locally owned in Honolulu — not a franchise. We have 10+ expert tutors from institutions like Harvard, Princeton, and Phillips Exeter Academy. We use a proprietary tutor-matching process and have helped 300+ students with a 5.0 parent rating. <Link href="/about" className="text-primary hover:underline">Learn more about our approach</Link>.
                </p>
              </details>
              <details className="bg-card rounded-xl border border-border p-5 group">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                  What are your tutors&apos; qualifications?
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Our team includes graduates from Harvard University (Magna Cum Laude), Princeton University, Phillips Exeter Academy, and Penn State. We have a Fulbright Scholar, a medical student with a top 0.5% MCAT score (525/528), and a 35-year Iolani School teaching veteran. <Link href="/educators" className="text-primary hover:underline">Meet our tutors</Link>.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Success Confirmation Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              Message Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Thank you for contacting us{submittedName ? `, ${submittedName}` : ''}! We&apos;ll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-center">
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
