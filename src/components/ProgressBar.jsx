import { motion } from 'framer-motion';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-white/5 overflow-hidden rounded-full backdrop-blur-md">
      <motion.div
        className="h-full bg-gradient-to-r from-prep via-start to-rest"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;
