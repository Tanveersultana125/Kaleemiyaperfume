import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light = false }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-16"
    >
      <h2 className={`text-3xl md:text-5xl font-serif font-medium tracking-tight mb-4 ${light ? 'text-white' : 'text-foreground'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`font-sans text-sm tracking-wide max-w-md mx-auto ${light ? 'text-white/80' : 'text-muted-foreground'}`}>
          {subtitle}
        </p>
      )}
      <div className="mt-6 mx-auto w-16 h-[1px] gold-gradient-bg" />
    </motion.div>
  );
};

export default SectionHeading;
