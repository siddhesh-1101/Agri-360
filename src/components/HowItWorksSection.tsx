import { motion } from "framer-motion";
import { Upload, Clock, TrendingUp, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "List Your Produce",
    description:
      "Enter your fruit type, quantity, and harvesting date. Our system connects you with the best buyers.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Compare Mandi Rates",
    description:
      "View real-time prices from nearby mandis. Make informed decisions on when and where to sell.",
    color: "secondary",
  },
  {
    icon: Clock,
    title: "Choose Your Path",
    description:
      "Sell raw produce today at market rate, or opt for ripening to earn ~30% more in 3-4 days.",
    color: "primary",
  },
  {
    icon: Truck,
    title: "Easy Pickup & Payment",
    description:
      "Ripening agents collect your produce. Get paid securely through our platform.",
    color: "secondary",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient-primary">Agri-360</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A simple 4-step process to maximize your earnings from farm produce.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-secondary/30" />
              )}

              <div className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow border border-border group">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    step.color === "primary"
                      ? "bg-primary/10"
                      : "bg-secondary/10"
                  }`}
                >
                  <step.icon
                    className={`w-7 h-7 ${
                      step.color === "primary"
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  />
                </div>

                <h3 className="text-lg font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Comparison Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-primary/5 via-accent to-secondary/5 rounded-3xl p-8 md:p-12 border border-primary/10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                See the Difference
              </h3>
              <p className="text-muted-foreground mb-6">
                Compare what you could earn by selling directly vs. through our
                ripening network.
              </p>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm text-foreground">
                  No upfront costs for farmers
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Raw Sale Card */}
              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Sell Raw Today
                </p>
                <p className="text-3xl font-bold text-foreground">₹18</p>
                <p className="text-xs text-muted-foreground">/kg (₹16-20 range)</p>
              </div>

              {/* Ripened Sale Card */}
              <div className="bg-gradient-primary rounded-xl p-6 text-center shadow-glow">
                <p className="text-sm text-primary-foreground/80 mb-2">
                  After Ripening
                </p>
                <p className="text-3xl font-bold text-primary-foreground">₹24</p>
                <p className="text-xs text-primary-foreground/80">/kg (+30% hike)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
