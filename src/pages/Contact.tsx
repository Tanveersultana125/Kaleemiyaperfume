import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Header />
      <div className="h-20 lg:h-32"></div>
      <main className="flex-grow py-12">
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
