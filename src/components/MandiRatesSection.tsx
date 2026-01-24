import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MapPin, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

const mandiRates = [
  {
    name: "Azadpur Mandi",
    location: "Delhi",
    banana: { rate: 18, change: 2.5, trend: "up" },
    mango: { rate: 45, change: -1.2, trend: "down" },
    papaya: { rate: 22, change: 0.8, trend: "up" },
  },
  {
    name: "Vashi APMC",
    location: "Mumbai",
    banana: { rate: 17, change: 1.8, trend: "up" },
    mango: { rate: 48, change: 3.2, trend: "up" },
    papaya: { rate: 24, change: -0.5, trend: "down" },
  },
  {
    name: "Koyambedu Market",
    location: "Chennai",
    banana: { rate: 16, change: -1.0, trend: "down" },
    mango: { rate: 42, change: 2.1, trend: "up" },
    papaya: { rate: 20, change: 1.5, trend: "up" },
  },
  {
    name: "Binny Mill",
    location: "Bangalore",
    banana: { rate: 19, change: 0.5, trend: "up" },
    mango: { rate: 50, change: -0.8, trend: "down" },
    papaya: { rate: 23, change: 2.0, trend: "up" },
  },
];

const fruits = ["banana", "mango", "papaya"] as const;
const fruitEmojis = { banana: "🍌", mango: "🥭", papaya: "🍈" };

export const MandiRatesSection = () => {
  return (
    <section id="mandi-rates" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <RefreshCw className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">
              Updated 5 min ago
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Live <span className="text-gradient-primary">Mandi Rates</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare prices across major mandis and make informed decisions about
            where to sell your produce.
          </p>
        </motion.div>

        {/* Rates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card overflow-hidden border border-border"
        >
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-6 bg-muted/50 border-b border-border font-semibold text-sm">
            <div className="col-span-2">Mandi</div>
            {fruits.map((fruit) => (
              <div key={fruit} className="text-center">
                <span className="mr-2">{fruitEmojis[fruit]}</span>
                <span className="capitalize">{fruit}</span>
              </div>
            ))}
          </div>

          {/* Table Body */}
          {mandiRates.map((mandi, index) => (
            <motion.div
              key={mandi.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="grid grid-cols-5 gap-4 p-6 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <div className="col-span-2">
                <p className="font-semibold text-foreground">{mandi.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {mandi.location}
                </div>
              </div>
              
              {fruits.map((fruit) => {
                const data = mandi[fruit];
                return (
                  <div key={fruit} className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      ₹{data.rate}/kg
                    </p>
                    <div
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        data.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {data.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {data.change > 0 ? "+" : ""}
                      {data.change}%
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <Button variant="outline">
            View All Mandis
          </Button>
        </div>
      </div>
    </section>
  );
};
