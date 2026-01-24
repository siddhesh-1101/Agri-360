import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Package, 
  Clock,
  ArrowRight,
  Bell,
  CheckCircle,
  AlertCircle,
  Thermometer,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";

const incomingOrders = [
  { id: 1, farmer: "Ramesh Kumar", fruit: "Banana", quantity: "500 kg", rate: 18, location: "Azadpur", status: "Pending" },
  { id: 2, farmer: "Suresh Patel", fruit: "Mango", quantity: "300 kg", rate: 45, location: "Ghazipur", status: "Accepted" },
  { id: 3, farmer: "Vijay Singh", fruit: "Papaya", quantity: "200 kg", rate: 22, location: "Okhla", status: "Pending" },
];

const ripeningBatches = [
  { id: 1, fruit: "Banana", quantity: "400 kg", buyRate: 18, sellRate: 24, daysLeft: 2, chamber: "Chamber A", progress: 60 },
  { id: 2, fruit: "Mango", quantity: "250 kg", buyRate: 45, sellRate: 58, daysLeft: 3, chamber: "Chamber B", progress: 40 },
  { id: 3, fruit: "Banana", quantity: "600 kg", buyRate: 17, sellRate: 22, daysLeft: 1, chamber: "Chamber C", progress: 85 },
];

const retailerDemand = [
  { retailer: "Fresh Mart", fruit: "Banana", quantity: "200 kg", rate: 25, urgency: "High" },
  { retailer: "City Bazaar", fruit: "Mango", quantity: "150 kg", rate: 60, urgency: "Medium" },
  { retailer: "Green Grocer", fruit: "Papaya", quantity: "100 kg", rate: 30, urgency: "Low" },
];

const AgentDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ripening Agent Dashboard</h1>
                <p className="text-muted-foreground">Manage your ripening operations and connect with farmers & retailers.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  3 New Orders
                </Button>
                <Button size="sm">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Chamber Status
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Batches", value: "3", icon: Package, color: "bg-primary/10 text-primary" },
              { label: "Pending Orders", value: "2", icon: Clock, color: "bg-secondary/10 text-secondary" },
              { label: "Avg. Margin", value: "30%", icon: TrendingUp, color: "bg-success/10 text-success" },
              { label: "Ready to Sell", value: "600 kg", icon: CheckCircle, color: "bg-accent text-accent-foreground" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border shadow-card"
              >
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Incoming Orders from Farmers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Incoming Orders</h2>
                <p className="text-sm text-muted-foreground">Raw produce from farmers</p>
              </div>

              <div className="divide-y divide-border">
                {incomingOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-foreground">{order.farmer}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {order.location}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "Pending" ? "bg-secondary/10 text-secondary" : "bg-success/10 text-success"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{order.fruit} • {order.quantity}</span>
                      <span className="font-bold text-foreground">₹{order.rate}/kg</span>
                    </div>
                    {order.status === "Pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1">Accept</Button>
                        <Button size="sm" variant="outline" className="flex-1">Decline</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Retailer Demand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Retailer Demand</h2>
                <p className="text-sm text-muted-foreground">Orders from retailers</p>
              </div>

              <div className="divide-y divide-border">
                {retailerDemand.map((demand, index) => (
                  <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{demand.retailer}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        demand.urgency === "High" ? "bg-destructive/10 text-destructive" :
                        demand.urgency === "Medium" ? "bg-secondary/10 text-secondary" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {demand.urgency} Priority
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{demand.fruit} • {demand.quantity}</span>
                      <span className="font-bold text-success">₹{demand.rate}/kg</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Fulfill Order
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Ripening Batches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-card rounded-2xl border border-border shadow-card overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Ripening Batches</h2>
                  <p className="text-sm text-muted-foreground">Track your active ripening chambers</p>
                </div>
                <Button variant="outline" size="sm">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Adjust Settings
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm">Chamber</th>
                    <th className="text-left p-4 font-semibold text-sm">Fruit</th>
                    <th className="text-left p-4 font-semibold text-sm">Quantity</th>
                    <th className="text-left p-4 font-semibold text-sm">Buy Rate</th>
                    <th className="text-left p-4 font-semibold text-sm">Sell Rate</th>
                    <th className="text-left p-4 font-semibold text-sm">Margin</th>
                    <th className="text-left p-4 font-semibold text-sm">Progress</th>
                    <th className="text-left p-4 font-semibold text-sm">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {ripeningBatches.map((batch) => (
                    <tr key={batch.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{batch.chamber}</td>
                      <td className="p-4 text-foreground">{batch.fruit}</td>
                      <td className="p-4 text-foreground">{batch.quantity}</td>
                      <td className="p-4 text-muted-foreground">₹{batch.buyRate}/kg</td>
                      <td className="p-4 font-bold text-success">₹{batch.sellRate}/kg</td>
                      <td className="p-4">
                        <span className="text-success font-bold">
                          +{Math.round(((batch.sellRate - batch.buyRate) / batch.buyRate) * 100)}%
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all"
                            style={{ width: `${batch.progress}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          batch.daysLeft <= 1 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        }`}>
                          {batch.daysLeft} day{batch.daysLeft > 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  Chamber C batch ready for sale tomorrow
                </div>
                <Button variant="link" size="sm">
                  View All Chambers <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
