import { motion } from "framer-motion";
import { Sprout, Thermometer, Store, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const roles = [
  {
    id: "farmers",
    icon: Sprout,
    title: "For Farmers",
    subtitle: "Maximize Your Harvest Value",
    description:
      "List your raw fruits with harvesting dates, compare nearby mandi rates in real-time, and choose to sell immediately or through our ripening network for better prices.",
    features: [
      "Real-time mandi price comparison",
      "Harvest date tracking",
      "Direct or ripening sale options",
      "Secure payment guarantee",
    ],
    cta: "Start as Farmer",
    link: "/signup?role=farmer",
    gradient: "from-primary/10 to-accent",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: "agents",
    icon: Thermometer,
    title: "For Ripening Agents",
    subtitle: "Scale Your Ripening Business",
    description:
      "Access a steady supply of raw fruits from verified farmers. Manage your inventory, set your margins, and connect with large retailers seamlessly.",
    features: [
      "Verified farmer network",
      "Bulk purchase options",
      "Inventory management tools",
      "Retailer connections",
    ],
    cta: "Join as Agent",
    link: "/signup?role=agent",
    gradient: "from-secondary/10 to-warning/10",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    id: "retailers",
    icon: Store,
    title: "For Retailers",
    subtitle: "Quality Produce, Every Time",
    description:
      "Buy ripened fruits in bulk at competitive prices. Get quality-assured produce from trusted ripening agents with reliable delivery schedules.",
    features: [
      "Quality-assured produce",
      "Bulk pricing benefits",
      "Reliable supply chain",
      "Flexible ordering",
    ],
    cta: "Register as Retailer",
    link: "/signup?role=retailer",
    gradient: "from-accent to-primary/10",
    iconBg: "bg-accent",
    iconColor: "text-accent-foreground",
  },
];

export const RolesSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-gradient-secondary">Everyone</span>{" "}
            in the Chain
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you grow, ripen, or sell – Agri-360 has the tools you
            need to succeed.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              id={role.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${role.gradient} rounded-3xl p-8 border border-border hover:shadow-card-hover transition-all duration-300 group`}
            >
              <div className="bg-card rounded-2xl p-6 shadow-card h-full flex flex-col">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl ${role.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  <role.icon className={`w-7 h-7 ${role.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {role.title}
                </h3>
                <p className="text-sm font-medium text-primary mb-4">
                  {role.subtitle}
                </p>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {role.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to={role.link}>
                  <Button className="w-full group/btn">
                    {role.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
